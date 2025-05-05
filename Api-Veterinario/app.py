from flask import Flask
import config
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = config.SECRET_KEY

    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)

    @app.route("/")
    def home():
        return "¡API de la Veterinaria en funcionamiento!"
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host=config.HOST,
        port=config.PORT,
        debug=config.DEBUG
    )