from werkzeug.security import check_password_hash, generate_password_hash
import jwt
import datetime
from functools import wraps
from flask import request, jsonify
import config


class Security:
    @staticmethod
    def hash_password(password):
        return generate_password_hash(password)

    @staticmethod
    def check_password(hashed_password, password):
        return check_password_hash(hashed_password, password)

    @staticmethod
    def generate_token(user_data):
        token_payload = {
            'usuario': {
                'id': user_data['idUsuario'],
                'nombre': user_data['nombre'],
                'rol': user_data['rol']
            },
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        return jwt.encode(token_payload, config.SECRET_KEY)

    @staticmethod
    def decode_token(token):
        if token.startswith('Bearer '):
            token = token.split('Bearer ')[1]
        return jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])

    @staticmethod
    def token_required(f):

        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization')

            if not token:
                return jsonify({'mensaje': 'Token faltante!'}), 401

            try:
                data = Security.decode_token(token)
                usuario_actual = data['usuario']
            except:
                return jsonify({'mensaje': 'Token inválido!'}), 401

            return f(usuario_actual, *args, **kwargs)

        return decorated

    @staticmethod
    def role_required(role):

        def decorator(f):
            @wraps(f)
            def decorated_function(usuario_actual, *args, **kwargs):
                if usuario_actual['rol'] != role:
                    return jsonify({"error": f"Requiere permisos de {role}"}), 403
                return f(usuario_actual, *args, **kwargs)

            return decorated_function

        return decorator