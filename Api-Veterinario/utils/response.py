from flask import jsonify

class APIResponse:
    @staticmethod
    def success(data=None, message=None, status_code=200):
        response = {}
        if message:
            response['mensaje'] = message
        if data:
            if isinstance(data, dict):
                response.update(data)
            else:
                response['data'] = data
        return jsonify(response), status_code

    @staticmethod
    def error(message, status_code=400):
        return jsonify({"error": message}), status_code

    @staticmethod
    def missing_fields(fields):
        return APIResponse.error(f"Campos obligatorios faltantes: {', '.join(fields)}", 400)

    @staticmethod
    def not_found(entity_type="Recurso"):
        return APIResponse.error(f"{entity_type} no encontrado", 404)

    @staticmethod
    def unauthorized(message="No autorizado"):
        return APIResponse.error(message, 401)

    @staticmethod
    def forbidden(message="No tienes permisos para esta acción"):
        return APIResponse.error(message, 403)

    @staticmethod
    def conflict(message):
        return APIResponse.error(message, 409)