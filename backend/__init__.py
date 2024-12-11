from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

# Import configuration classes from config module
from .config import DevelopmentConfig, ProductionConfig, TestingConfig

# Initialize the database and login manager
db = SQLAlchemy()
login_manager = LoginManager()

def create_app(config_name=None):
    """
    Create and configure the Flask application.

    Args:
        config_name (str, optional): The name of the configuration to use. Defaults to None.

    Returns:
        Flask: The configured Flask application.
    """
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)


    # Set configuration based on the provided argument
    if config_name == 'development':
        app.config.from_object(DevelopmentConfig)
    elif config_name == 'production':
        app.config.from_object(ProductionConfig)
    elif config_name == 'testing':
        app.config.from_object(TestingConfig)
    else:
        # Default configuration, can be set to development or any other default
        app.config.from_object(DevelopmentConfig)

    # Initialize SQLAlchemy and LoginManager
    db.init_app(app)
    login_manager.init_app(app)

    # Import and register the different routes
    from backend.main import main
    from backend.auth_bp import auth_bp
    from backend.students_bp import students_bp
    from backend.jobs_bp import jobs_bp

    # Register your main and auth Blueprints
    app.register_blueprint(main)
    app.register_blueprint(students_bp)
    app.register_blueprint(jobs_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")

    with app.app_context():
        db.create_all()

    return app
