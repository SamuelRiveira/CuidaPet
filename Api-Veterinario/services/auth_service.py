from models.user import User
from utils.security import Security


class AuthService:
    @staticmethod
    def login(username, password):
        user = User.get_by_name(username)

        if not user:
            return None, "Usuario o contraseña incorrectos"

        if not Security.check_password(user['contraseña'], password):
            return None, "Usuario o contraseña incorrectos"

        token = Security.generate_token(user)

        user_info = {
            "id": user['idUsuario'],
            "nombre": user['nombre'],
            "rol": user['rol']
        }

        return {"token": token, "usuario": user_info}, "Inicio de sesión exitoso"

    @staticmethod
    def register(username, password, role):
        try:
            user_id = User.create(username, password, role)
            return {"id": user_id['idUsuario']}, "Usuario registrado exitosamente"
        except ValueError as e:
            return None, str(e)

    @staticmethod
    def change_password(user_id, current_password, new_password):
        if not User.verify_password(user_id, current_password):
            return False, "Contraseña actual incorrecta"

        User.update_password(user_id, new_password)
        return True, "Contraseña actualizada exitosamente"