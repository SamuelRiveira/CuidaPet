from flask import jsonify


class APIResponse:
    @staticmethod
    def success(data=None, message=None, status_code=200):
        """Create a standardized success response."""
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
        """Create a standardized error response."""
        return jsonify({"error": message}), status_code

    @staticmethod
    def missing_fields(fields):
        """Create a response for missing fields."""
        return APIResponse.error(f"Campos obligatorios faltantes: {', '.join(fields)}", 400)

    @staticmethod
    def not_found(entity_type="Recurso"):
        """Create a not found response."""
        return APIResponse.error(f"{entity_type} no encontrado", 404)

    @staticmethod
    def unauthorized(message="No autorizado"):
        """Create an unauthorized response."""
        return APIResponse.error(message, 401)

    @staticmethod
    def forbidden(message="No tienes permisos para esta acción"):
        """Create a forbidden response."""
        return APIResponse.error(message, 403)

    @staticmethod
    def conflict(message):
        """Create a conflict response."""
        return APIResponse.error(message, 409)