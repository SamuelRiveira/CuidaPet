from flask import Blueprint, request
from models.user import User, Client, Employee, Programmer
from utils.response import APIResponse
from utils.security import Security

user_bp = Blueprint('user', __name__)


@user_bp.route('/obtener_usuarios', methods=['GET'])
@Security.token_required
@Security.role_required('programador')
def get_users(usuario_actual):
    try:
        users = User.get_all()
        return APIResponse.success(users)
    except Exception as e:
        return APIResponse.error(str(e), 500)


@user_bp.route('/registrar_cliente', methods=['POST'])
@Security.token_required
def register_client(usuario_actual):
    try:
        body_request = request.json
        if not body_request:
            return APIResponse.error("Datos no proporcionados")

        user_id = body_request.get("usuario_id") or usuario_actual['id']
        address = body_request.get("direccion")
        phone = body_request.get("telefono")

        if not address or not phone:
            missing = []
            if not address: missing.append("direccion")
            if not phone: missing.append("telefono")
            return APIResponse.missing_fields(missing)

        try:
            client = Client.create(user_id, address, phone)
            return APIResponse.success({
                "id_cliente": client['idCliente'],
                "id_usuario": user_id
            }, "Cliente registrado exitosamente", 201)
        except ValueError as e:
            return APIResponse.error(str(e))

    except Exception as e:
        return APIResponse.error(str(e), 500)


@user_bp.route('/registrar_empleado', methods=['POST'])
@Security.token_required
@Security.role_required('programador')
def register_employee(usuario_actual):
    try:
        body_request = request.json
        if not body_request:
            return APIResponse.error("Datos no proporcionados")

        user_id = body_request.get("usuario_id")
        specialty = body_request.get("especialidad")
        full_name = body_request.get("nombre_completo")
        dni = body_request.get("dni")
        phone = body_request.get("telefono")
        address = body_request.get("direccion")
        hire_date = body_request.get("fecha_contratacion")

        required_fields = {
            "usuario_id": user_id,
            "especialidad": specialty,
            "nombre_completo": full_name,
            "dni": dni,
            "telefono": phone,
            "direccion": address
        }

        missing = [field for field, value in required_fields.items() if not value]
        if missing:
            return APIResponse.missing_fields(missing)

        try:
            employee = Employee.create(
                user_id, specialty, full_name, dni, phone, address, hire_date
            )
            return APIResponse.success({
                "id_empleado": employee['idEmpleado'],
                "id_usuario": user_id
            }, "Empleado registrado exitosamente", 201)
        except ValueError as e:
            return APIResponse.error(str(e))

    except Exception as e:
        return APIResponse.error(str(e), 500)


@user_bp.route('/registrar_programador', methods=['POST'])
@Security.token_required
@Security.role_required('programador')
def register_programmer(usuario_actual):
    try:
        body_request = request.json
        if not body_request:
            return APIResponse.error("Datos no proporcionados")

        user_id = body_request.get("usuario_id")
        dni = body_request.get("dni")
        phone = body_request.get("telefono")
        address = body_request.get("direccion")
        hire_date = body_request.get("fecha_contratacion")

        required_fields = {
            "usuario_id": user_id,
            "dni": dni,
            "telefono": phone,
            "direccion": address
        }

        missing = [field for field, value in required_fields.items() if not value]
        if missing:
            return APIResponse.missing_fields(missing)

        try:
            programmer = Programmer.create(user_id, dni, phone, address, hire_date)
            return APIResponse.success({
                "id_programador": programmer['idProgramador'],
                "id_usuario": user_id
            }, "Programador registrado exitosamente", 201)
        except ValueError as e:
            return APIResponse.error(str(e))

    except Exception as e:
        return APIResponse.error(str(e), 500)