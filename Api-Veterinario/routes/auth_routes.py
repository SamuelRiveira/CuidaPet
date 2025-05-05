from flask import Blueprint, request
from services.auth_service import AuthService
from utils.response import APIResponse
from utils.security import Security

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        body_request = request.json
        if not body_request:
            return APIResponse.error("Datos no proporcionados")

        username = body_request.get("nombre")
        password = body_request.get("contraseña")

        if not username or not password:
            return APIResponse.error("Nombre de usuario y contraseña requeridos")

        result, message = AuthService.login(username, password)

        if not result:
            return APIResponse.unauthorized(message)

        return APIResponse.success(result, message)

    except Exception as e:
        return APIResponse.error(str(e), 500)


@auth_bp.route('/registrar', methods=['POST'])
def register():
    try:
        body_request = request.json
        if not body_request:
            return APIResponse.error("Datos no proporcionados")

        username = body_request.get("nombre")
        password = body_request.get("contraseña")
        role = body_request.get("rol")

        if not username or not password or not role:
            missing = []
            if not username: missing.append("nombre")
            if not password: missing.append("contraseña")
            if not role: missing.append("rol")
            return APIResponse.missing_fields(missing)

        result, message = AuthService.register(username, password, role)

        if not result:
            return APIResponse.error(message)

        result["siguiente_paso"] = f"Complete el registro específico según el rol: {role}"
        return APIResponse.success(result, message, 201)

    except Exception as e:
        return APIResponse.error(str(e), 500)


@auth_bp.route('/cambiar_contraseña', methods=['PUT'])
@Security.token_required
def change_password(usuario_actual):
    try:
        body_request = request.json
        if not body_request:
            return APIResponse.error("Datos no proporcionados")

        current_password = body_request.get("contraseña_actual")
        new_password = body_request.get("contraseña_nueva")

        if not current_password or not new_password:
            return APIResponse.error("Se requiere contraseña actual y nueva")

        success, message = AuthService.change_password(
            usuario_actual['id'],
            current_password,
            new_password
        )

        if not success:
            return APIResponse.unauthorized(message)

        return APIResponse.success(message=message)

    except Exception as e:
        return APIResponse.error(str(e), 500)