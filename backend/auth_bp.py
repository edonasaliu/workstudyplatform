from flask import Blueprint, request, jsonify
from flask_login import login_user, current_user, logout_user, login_required
from werkzeug.security import check_password_hash
from .models import db, User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    """
    Handle the login functionality.

    If the request method is POST, it retrieves the user login data from the form,
    finds the user by username, and checks if the provided password matches the
    hashed password stored in the database. If the login is successful, it
    authenticates the user, sets the session, and redirects to the dashboard.
    Otherwise, it displays an error message.

    Returns:
        If the request method is POST and the login is successful, it redirects
        to the dashboard. Otherwise, it renders the login.html template.

    """
    data = request.json
    email = data["email"]
    password = data["password"]

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid username or password"}), 401

    login_user(user)
    return (
        jsonify(
            {
                "id": user.id,
                "username": user.username,
                "role": user.role,
            }
        ),
        200,
    )

@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    """
    Logs out the currently authenticated user.

    Returns:
        A tuple containing a success message and a status code.
    """
    logout_user()
    return "Successfully logged out!", 200


@auth_bp.route("/all-users", methods=["GET"])
def allUsers():
    """
    Retrieve all users from the database and return them as a JSON response.

    Returns:
        A JSON response containing a list of dictionaries, where each dictionary represents a user.
    """
    return jsonify([user.to_dict() for user in User.query.all()]), 200


@auth_bp.route("/get-current-user", methods=["GET"])
@login_required
def get_current_user():
    """
    Get the current user's information.

    Returns:
        A JSON response containing the current user's id, email, and role.
    """
    return jsonify(
        {
            "user": {
                "id": current_user.id,
                "email": current_user.email,
                "role": current_user.role,
            }
        }
    )


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new user.

    This function handles the registration of a new user by receiving the user's information
    in a JSON format and creating a new user in the database.

    Returns:
        A JSON response with a success message if the user is created successfully,
        or an error message if the email is already taken.
    """
    data = request.json
    email = data["email"]
    first_name = data["firstName"]
    last_name = data["lastName"]
    password = data["password"]
    user_role = data["userType"]
    student_id = data["studentId"]

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"message": "Email already taken"}), 409

    new_user = User(
        username=email,
        email=email,
        role=user_role,
        first_name=first_name,
        last_name=last_name,
    )
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201
