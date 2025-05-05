import psycopg2
from flask import Flask, jsonify, request, Response
import os
from werkzeug.security import check_password_hash, generate_password_hash
from functools import wraps
import jwt
import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'clave_secreta_por_defecto')

# Configuración parametrizada de la base de datos
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', '192.168.0.115'),
    'port': os.environ.get('DB_PORT', '8000'),
    'dbname': os.environ.get('DB_NAME', 'prueba'),
    'user': os.environ.get('DB_USER', 'postgres'),
    'password': os.environ.get('DB_PASSWORD', 'postgres'),
    'options': os.environ.get('DB_OPTIONS', '-c search_path=public')
}


def get_connection():
    return psycopg2.connect(**DB_CONFIG)


def ejecutar_consulta(query, params=None, fetch=True):
    """
    Ejecuta una consulta SQL parametrizada y devuelve los resultados como una lista de diccionarios.

    Args:
        query (str): Consulta SQL con posibles placeholder %s para parámetros
        params (tuple): Parámetros para la consulta
        fetch (bool): Indica si se debe obtener resultados (True) o solo ejecutar (False)

    Returns:
        list: Lista de diccionarios con los resultados, o None si fetch=False
    """
    try:
        connection = get_connection()
        cursor = connection.cursor()

        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)

        result = None
        if fetch and cursor.description:
            # Obtener nombres de columnas
            columnas = [desc[0] for desc in cursor.description]
            # Convertir resultados a una lista de diccionarios
            resultados = cursor.fetchall()
            result = [dict(zip(columnas, fila)) for fila in resultados]

        if not fetch:
            connection.commit()

        cursor.close()
        connection.close()
        return result
    except psycopg2.Error as e:
        print(f"Error en la base de datos: {e}")
        raise


def token_requerido(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'mensaje': 'Token faltante!'}), 401

        try:
            if token.startswith('Bearer '):
                token = token.split('Bearer ')[1]

            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            usuario_actual = data['usuario']
        except:
            return jsonify({'mensaje': 'Token inválido!'}), 401

        return f(usuario_actual, *args, **kwargs)

    return decorated


@app.route("/")
def home():
    return "¡API de la Veterinaria en funcionamiento!"


@app.route('/obtener_usuarios', methods=['GET'])
@token_requerido
def obtener_usuarios(usuario_actual):
    # Verificar si el usuario tiene permisos (programador)
    if usuario_actual['rol'] != 'programador':
        return jsonify({"error": "No tienes permisos para esta acción"}), 403

    try:
        query = 'SELECT idUsuario, nombre, rol FROM Usuario ORDER BY idUsuario ASC'
        resultado = ejecutar_consulta(query)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        body_request = request.json
        if not body_request:
            return jsonify({"error": "Datos no proporcionados"}), 400

        nombre = body_request.get("nombre")
        contraseña = body_request.get("contraseña")

        if not nombre or not contraseña:
            return jsonify({"error": "Nombre de usuario y contraseña requeridos"}), 400

        # Consulta parametrizada para evitar inyección SQL
        query = 'SELECT idUsuario, nombre, contraseña, rol FROM Usuario WHERE nombre = %s'
        usuario = ejecutar_consulta(query, (nombre,))

        if not usuario or len(usuario) == 0:
            return jsonify({"mensaje": "Usuario o contraseña incorrectos"}), 401

        usuario = usuario[0]

        # Verificación de contraseña hasheada
        if not check_password_hash(usuario['contraseña'], contraseña):
            return jsonify({"mensaje": "Usuario o contraseña incorrectos"}), 401

        # Generar token JWT
        token = jwt.encode({
            'usuario': {
                'id': usuario['idUsuario'],
                'nombre': usuario['nombre'],
                'rol': usuario['rol']
            },
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'])

        return jsonify({
            "mensaje": "Inicio de sesión exitoso",
            "token": token,
            "usuario": {
                "id": usuario['idUsuario'],
                "nombre": usuario['nombre'],
                "rol": usuario['rol']
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/registrar', methods=['POST'])
def registrar():
    try:
        body_request = request.json
        if not body_request:
            return jsonify({"error": "Datos no proporcionados"}), 400

        nombre = body_request.get("nombre")
        contraseña = body_request.get("contraseña")
        rol = body_request.get("rol")

        # Validar rol según la enumeración en la BD
        roles_validos = ['programador', 'empleado', 'cliente']
        if rol not in roles_validos:
            return jsonify({"error": f"Rol no válido. Debe ser uno de: {', '.join(roles_validos)}"}), 400

        if not nombre or not contraseña:
            return jsonify({"error": "Nombre y contraseña son obligatorios"}), 400

        # Verificar si el usuario ya existe
        query = 'SELECT nombre FROM Usuario WHERE nombre = %s'
        usuario_existente = ejecutar_consulta(query, (nombre,))

        if usuario_existente and len(usuario_existente) > 0:
            return jsonify({"error": "El nombre de usuario ya existe"}), 409

        # Hashear la contraseña antes de almacenarla
        password_hash = generate_password_hash(contraseña)

        # Insertar nuevo usuario
        insert_query = 'INSERT INTO Usuario (nombre, contraseña, rol) VALUES (%s, %s, %s) RETURNING idUsuario'
        new_user = ejecutar_consulta(insert_query, (nombre, password_hash, rol))

        return jsonify({
            "mensaje": "Usuario registrado exitosamente",
            "id": new_user[0]['idUsuario'],
            "siguiente_paso": f"Complete el registro específico según el rol: {rol}"
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/registrar_cliente', methods=['POST'])
@token_requerido
def registrar_cliente(usuario_actual):
    try:
        body_request = request.json
        if not body_request:
            return jsonify({"error": "Datos no proporcionados"}), 400

        usuario_id = body_request.get("usuario_id") or usuario_actual['id']
        direccion = body_request.get("direccion")
        telefono = body_request.get("telefono")

        if not direccion or not telefono:
            return jsonify({"error": "Dirección y teléfono son obligatorios"}), 400

        # Verificar que el usuario exista y sea de tipo cliente
        query = 'SELECT idUsuario, rol FROM Usuario WHERE idUsuario = %s'
        usuario = ejecutar_consulta(query, (usuario_id,))

        if not usuario or len(usuario) == 0:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if usuario[0]['rol'] != 'cliente':
            return jsonify({"error": "El usuario no tiene rol de cliente"}), 400

        # Verificar si ya existe un registro de cliente para este usuario
        check_query = 'SELECT idCliente FROM Cliente WHERE Usuario_idUsuario = %s'
        cliente_existente = ejecutar_consulta(check_query, (usuario_id,))

        if cliente_existente and len(cliente_existente) > 0:
            return jsonify({"error": "Este usuario ya tiene un registro de cliente"}), 409

        # Insertar cliente
        insert_query = 'INSERT INTO Cliente (Usuario_idUsuario, direccion, telefono) VALUES (%s, %s, %s) RETURNING idCliente'
        nuevo_cliente = ejecutar_consulta(insert_query, (usuario_id, direccion, telefono))

        return jsonify({
            "mensaje": "Cliente registrado exitosamente",
            "id_cliente": nuevo_cliente[0]['idCliente'],
            "id_usuario": usuario_id
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/registrar_empleado', methods=['POST'])
@token_requerido
def registrar_empleado(usuario_actual):
    # Solo un programador puede registrar empleados
    if usuario_actual['rol'] != 'programador':
        return jsonify({"error": "No tienes permisos para esta acción"}), 403

    try:
        body_request = request.json
        if not body_request:
            return jsonify({"error": "Datos no proporcionados"}), 400

        usuario_id = body_request.get("usuario_id")
        especialidad = body_request.get("especialidad")
        nombre_completo = body_request.get("nombre_completo")
        dni = body_request.get("dni")
        telefono = body_request.get("telefono")
        direccion = body_request.get("direccion")
        fecha_contratacion = body_request.get("fecha_contratacion")

        # Validar campos obligatorios
        campos_obligatorios = {
            "usuario_id": usuario_id,
            "especialidad": especialidad,
            "nombre_completo": nombre_completo,
            "dni": dni,
            "telefono": telefono,
            "direccion": direccion
        }

        campos_faltantes = [campo for campo, valor in campos_obligatorios.items() if not valor]
        if campos_faltantes:
            return jsonify({"error": f"Campos obligatorios faltantes: {', '.join(campos_faltantes)}"}), 400

        # Verificar que el usuario exista y sea de tipo empleado
        query = 'SELECT idUsuario, rol FROM Usuario WHERE idUsuario = %s'
        usuario = ejecutar_consulta(query, (usuario_id,))

        if not usuario or len(usuario) == 0:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if usuario[0]['rol'] != 'empleado':
            return jsonify({"error": "El usuario no tiene rol de empleado"}), 400

        # Verificar si ya existe un registro de empleado para este usuario
        check_query = 'SELECT idEmpleado FROM Empleado WHERE Usuario_idUsuario = %s'
        empleado_existente = ejecutar_consulta(check_query, (usuario_id,))

        if empleado_existente and len(empleado_existente) > 0:
            return jsonify({"error": "Este usuario ya tiene un registro de empleado"}), 409

        # Insertar empleado
        insert_query = '''
        INSERT INTO Empleado (
            Usuario_idUsuario, especialidad, nombre_completo, dni, 
            telefono, direccion, fecha_contratacion
        ) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING idEmpleado
        '''

        nuevo_empleado = ejecutar_consulta(
            insert_query,
            (usuario_id, especialidad, nombre_completo, dni, telefono, direccion, fecha_contratacion)
        )

        return jsonify({
            "mensaje": "Empleado registrado exitosamente",
            "id_empleado": nuevo_empleado[0]['idEmpleado'],
            "id_usuario": usuario_id
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/registrar_programador', methods=['POST'])
@token_requerido
def registrar_programador(usuario_actual):
    # Solo un programador puede registrar otros programadores
    if usuario_actual['rol'] != 'programador':
        return jsonify({"error": "No tienes permisos para esta acción"}), 403

    try:
        body_request = request.json
        if not body_request:
            return jsonify({"error": "Datos no proporcionados"}), 400

        usuario_id = body_request.get("usuario_id")
        dni = body_request.get("dni")
        telefono = body_request.get("telefono")
        direccion = body_request.get("direccion")
        fecha_contratacion = body_request.get("fecha_contratacion")

        # Validar campos obligatorios
        campos_obligatorios = {
            "usuario_id": usuario_id,
            "dni": dni,
            "telefono": telefono,
            "direccion": direccion
        }

        campos_faltantes = [campo for campo, valor in campos_obligatorios.items() if not valor]
        if campos_faltantes:
            return jsonify({"error": f"Campos obligatorios faltantes: {', '.join(campos_faltantes)}"}), 400

        # Verificar que el usuario exista y sea de tipo programador
        query = 'SELECT idUsuario, rol FROM Usuario WHERE idUsuario = %s'
        usuario = ejecutar_consulta(query, (usuario_id,))

        if not usuario or len(usuario) == 0:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if usuario[0]['rol'] != 'programador':
            return jsonify({"error": "El usuario no tiene rol de programador"}), 400

        # Verificar si ya existe un registro de programador para este usuario
        check_query = 'SELECT idProgramador FROM Programador WHERE Usuario_idUsuario = %s'
        programador_existente = ejecutar_consulta(check_query, (usuario_id,))

        if programador_existente and len(programador_existente) > 0:
            return jsonify({"error": "Este usuario ya tiene un registro de programador"}), 409

        # Insertar programador
        insert_query = '''
        INSERT INTO Programador (
            Usuario_idUsuario, dni, telefono, direccion, fecha_contratacion
        ) VALUES (%s, %s, %s, %s, %s) RETURNING idProgramador
        '''

        nuevo_programador = ejecutar_consulta(
            insert_query,
            (usuario_id, dni, telefono, direccion, fecha_contratacion)
        )

        return jsonify({
            "mensaje": "Programador registrado exitosamente",
            "id_programador": nuevo_programador[0]['idProgramador'],
            "id_usuario": usuario_id
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/cambiar_contraseña', methods=['PUT'])
@token_requerido
def cambiar_contraseña(usuario_actual):
    try:
        body_request = request.json
        if not body_request:
            return jsonify({"error": "Datos no proporcionados"}), 400

        contraseña_actual = body_request.get("contraseña_actual")
        contraseña_nueva = body_request.get("contraseña_nueva")

        if not contraseña_actual or not contraseña_nueva:
            return jsonify({"error": "Se requiere contraseña actual y nueva"}), 400

        # Verificar contraseña actual
        query = 'SELECT contraseña FROM Usuario WHERE idUsuario = %s'
        resultado = ejecutar_consulta(query, (usuario_actual['id'],))

        if not resultado or len(resultado) == 0:
            return jsonify({"error": "Usuario no encontrado"}), 404

        password_hash_actual = resultado[0]['contraseña']

        if not check_password_hash(password_hash_actual, contraseña_actual):
            return jsonify({"error": "Contraseña actual incorrecta"}), 401

        # Hashear y actualizar la nueva contraseña
        nuevo_password_hash = generate_password_hash(contraseña_nueva)

        update_query = 'UPDATE Usuario SET contraseña = %s WHERE idUsuario = %s'
        ejecutar_consulta(update_query, (nuevo_password_hash, usuario_actual['id']), fetch=False)

        return jsonify({"mensaje": "Contraseña actualizada exitosamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    debug = os.environ.get('DEBUG', 'True').lower() == 'true'
    app.run(host=host, port=port, debug=debug)