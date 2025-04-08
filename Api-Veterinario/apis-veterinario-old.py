import psycopg2
from flask import Flask, jsonify, request, Response

app = Flask(__name__)

# Configuración de conexión a la base de datos
DB_CONFIG = {
    'host': '192.168.0.115',
    'port': '8000',
    'dbname': 'prueba',
    'user': 'postgres',
    'password': 'postgres',
    'options': '-c search_path=public'
}

def get_connection():
    return psycopg2.connect(**DB_CONFIG)

@app.route("/")
def home():
    return "¡Servidor en funcionamiento!"

@app.route('/obtener_usuario', methods=['GET'])
def obtener_usuario():
    try:
        query = 'SELECT * FROM public."usuario" ORDER BY idusuario ASC'
        resultado = ejecutar_sql(query)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    body_request = request.json
    print(body_request)
    nombre = body_request["nombre"]
    contraseña = body_request["password"]

    is_logged: Response = ejecutar_sql(
        f"SELECT * FROM public.\"usuario\" WHERE nombre = '{nombre}' AND contraseña = '{contraseña}';"
    )

    if len(is_logged.json) == 0:
        return jsonify({"msg": "Usuario o contraseña incorrectos"})
    return jsonify({"msg": "Inicio de sesión exitoso"})

def ejecutar_sql(query = ""):

    host = "192.168.0.115"
    port = "8000"
    dbname = "prueba"
    user = "postgres"
    password = "postgres"

    try:
        # Establecer la conexión
        connection = psycopg2.connect(
            host = host,
            port = port,
            dbname = dbname,
            user = user,
            password = password,
            options = "-c search_path=public",
            client_encoding='UTF8'
        )

        cursor = connection.cursor()
        cursor.execute(query)

        # Obtener columnas para construir claves JSON
        columnas = [desc[0] for desc in cursor.description]

        # Convertir resultados a JSON
        resultados = cursor.fetchall()
        empleados = [dict(zip(columnas, fila)) for fila in resultados]

        # Cerrar el cursor y la conexión
        cursor.close()
        connection.close()

        return jsonify(empleados)

    except psycopg2.Error as e:
        print("Error: ", e)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)