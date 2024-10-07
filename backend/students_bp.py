from flask import Blueprint, request, jsonify
from .models import db, User, Application

students_bp = Blueprint("students", __name__)

# Edit Student Profile Endpoint
@students_bp.route("/edit/<int:student_id>", methods=["PUT"])
def edit_student_profile(student_id):
    """
    Edit the profile of a student.

    Args:
        student_id (int): The ID of the student to be edited.

    Returns:
        dict: A JSON response containing the updated student profile.

    Raises:
        404: If the student with the given ID is not found.
    """
    student = db.session.get(User, student_id)
    if not student:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    student.first_name = data.get("first_name", student.first_name)
    student.last_name = data.get("last_name", student.last_name)
    student.education_level = data.get("education_level", student.education_level)
    student.resume = data.get("resume", student.resume)
    db.session.commit()
    return jsonify(student.to_dict()), 200

# Apply for a Job Endpoint
@students_bp.route("/apply/<int:student_id>/<int:job_id>", methods=["POST"])
def apply_for_job(student_id, job_id):
    """
    Apply for a job by creating a new application.

    Args:
        student_id (int): The ID of the student applying for the job.
        job_id (int): The ID of the job being applied for.

    Returns:
        dict: A dictionary representing the newly created application.
    """
    new_application = Application(student_id=student_id, job_id=job_id)
    db.session.add(new_application)
    db.session.commit()
    return jsonify(new_application.to_dict()), 201

# Withdraw Application Endpoint
@students_bp.route("/withdraw/<int:application_id>", methods=["DELETE"])
def withdraw_application(application_id):
        """
        Withdraws an application by its ID.

        Parameters:
        - application_id (int): The ID of the application to be withdrawn.

        Returns:
        - JSON response: A JSON response indicating the result of the withdrawal operation.
            - If the application is found and successfully withdrawn, returns {"message": "Application withdrawn successfully"} with status code 200.
            - If the application is not found, returns {"message": "Application not found"} with status code 404.
        """
        application = db.session.get(Application, application_id)
        if not application:
                return jsonify({"message": "Application not found"}), 404

        db.session.delete(application)
        db.session.commit()
        return jsonify({"message": "Application withdrawn successfully"}), 200