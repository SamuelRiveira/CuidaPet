from models.user import User
from utils.security import Security


class AuthService:
    @staticmethod
    def login(username, password):
        user = User.get_by_name(username)

        if not user:
            return None, "Usuario no encontrado"

        if not Security.check_password(user['contraseña'], password):
            return None, "Contraseña incorrecta"

        token = Security.generate_token(user)

        return {
            "id": user['idUsuario'],
            "nombre": user['nombre'],
            "rol": user['rol'],
            "token": token
        }, "Login exitoso"

    @staticmethod
    def register(username, password, role):
        try:
            user_id = User.create(username, password, role)

            if not user_id:
                return None, "Error al crear usuario"

            print(f"Usuario creado con ID: {user_id}, tipo: {type(user_id)}")

            user = User.get_by_id(user_id)

            if not user:
                print(f"No se pudo encontrar usuario con ID: {user_id}")
                return {
                    "id": user_id,
                    "nombre": username,
                    "rol": role
                }, "Usuario registrado con éxito, pero no se pudo recuperar toda la información"

            return {
                "id": user_id,
                "nombre": username,
                "rol": role
            }, "Usuario registrado con éxito"

        except ValueError as e:
            return None, str(e)
        except Exception as e:
            return None, f"Error en el registro: {str(e)}"

    @staticmethod
    def change_password(user_id, current_password, new_password):
        if not User.verify_password(user_id, current_password):
            return False, "Contraseña actual incorrecta"

        success = User.update_password(user_id, new_password)

        if not success:
            return False, "Error al actualizar contraseña"

        return True, "Contraseña actualizada con éxito"