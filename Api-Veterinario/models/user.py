from db.database import Database
from utils.security import Security

class User:

    @staticmethod
    def get_by_id(user_id):
        users = Database.select(
            "Usuario",
            condition="idUsuario = %s",
            condition_params=(user_id,)
        )
        return users[0] if users else None

    @staticmethod
    def get_by_name(username):
        users = Database.select(
            "Usuario",
            condition="nombre = %s",
            condition_params=(username,)
        )
        return users[0] if users else None

    @staticmethod
    def create(username, password, role):
        valid_roles = ['programador', 'empleado', 'cliente']
        if role not in valid_roles:
            raise ValueError(f"Rol no válido. Debe ser uno de: {', '.join(valid_roles)}")

        if User.get_by_name(username):
            raise ValueError("El nombre de usuario ya existe")

        hashed_password = Security.hash_password(password)

        user_data = {
            'nombre': username,
            'contraseña': hashed_password,
            'rol': role
        }

        result = Database.insert("Usuario", user_data, "idUsuario")
        return result[0] if result else None

    @staticmethod
    def update_password(user_id, new_password):
        hashed_password = Security.hash_password(new_password)
        Database.update(
            "Usuario",
            {"contraseña": hashed_password},
            "idUsuario = %s",
            (user_id,)
        )
        return True

    @staticmethod
    def get_all():
        return Database.select("Usuario", "idUsuario, nombre, rol", order_by="idUsuario ASC")

    @staticmethod
    def verify_password(user_id, password):
        users = Database.select(
            "Usuario",
            "contraseña",
            condition="idUsuario = %s",
            condition_params=(user_id,)
        )

        if not users:
            return False

        return Security.check_password(users[0]['contraseña'], password)


class Client(User):

    @staticmethod
    def create(user_id, address, phone):
        user = User.get_by_id(user_id)
        if not user:
            raise ValueError("Usuario no encontrado")

        if user['rol'] != 'cliente':
            raise ValueError("El usuario no tiene rol de cliente")

        clients = Database.select(
            "Cliente",
            "idCliente",
            condition="Usuario_idUsuario = %s",
            condition_params=(user_id,)
        )

        if clients:
            raise ValueError("Este usuario ya tiene un registro de cliente")

        client_data = {
            'Usuario_idUsuario': user_id,
            'direccion': address,
            'telefono': phone
        }

        result = Database.insert("Cliente", client_data, "idCliente")
        return result[0] if result else None


class Employee(User):

    @staticmethod
    def create(user_id, specialty, full_name, dni, phone, address, hire_date=None):
        user = User.get_by_id(user_id)
        if not user:
            raise ValueError("Usuario no encontrado")

        if user['rol'] != 'empleado':
            raise ValueError("El usuario no tiene rol de empleado")

        employees = Database.select(
            "Empleado",
            "idEmpleado",
            condition="Usuario_idUsuario = %s",
            condition_params=(user_id,)
        )

        if employees:
            raise ValueError("Este usuario ya tiene un registro de empleado")

        employee_data = {
            'Usuario_idUsuario': user_id,
            'especialidad': specialty,
            'nombre_completo': full_name,
            'dni': dni,
            'telefono': phone,
            'direccion': address
        }

        if hire_date:
            employee_data['fecha_contratacion'] = hire_date

        result = Database.insert("Empleado", employee_data, "idEmpleado")
        return result[0] if result else None


class Programmer(User):

    @staticmethod
    def create(user_id, dni, phone, address, hire_date=None):
        user = User.get_by_id(user_id)
        if not user:
            raise ValueError("Usuario no encontrado")

        if user['rol'] != 'programador':
            raise ValueError("El usuario no tiene rol de programador")

        programmers = Database.select(
            "Programador",
            "idProgramador",
            condition="Usuario_idUsuario = %s",
            condition_params=(user_id,)
        )

        if programmers:
            raise ValueError("Este usuario ya tiene un registro de programador")

        programmer_data = {
            'Usuario_idUsuario': user_id,
            'dni': dni,
            'telefono': phone,
            'direccion': address
        }

        if hire_date:
            programmer_data['fecha_contratacion'] = hire_date

        result = Database.insert("Programador", programmer_data, "idProgramador")
        return result[0] if result else None