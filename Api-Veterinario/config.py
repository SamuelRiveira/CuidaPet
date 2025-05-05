import os

SECRET_KEY = os.environ.get('SECRET_KEY', 'clave_secreta_por_defecto')
DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
HOST = os.environ.get('HOST', '0.0.0.0')
PORT = int(os.environ.get('PORT', 5000))

DB_CONFIG = {
    'host': os.environ.get('DB_HOST', '192.168.0.115'),
    'port': os.environ.get('DB_PORT', '8000'),
    'dbname': os.environ.get('DB_NAME', 'prueba'),
    'user': os.environ.get('DB_USER', 'postgres'),
    'password': os.environ.get('DB_PASSWORD', 'postgres'),
    'options': os.environ.get('DB_OPTIONS', '-c search_path=public')
}