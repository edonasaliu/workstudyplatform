from flask import Blueprint, request, jsonify
from .models import db, User, Job

jobs_bp = Blueprint("jobs", __name__)

@jobs_bp.route("/edit/<int:employer_id>", methods=["PUT"])
def edit_employer_profile(employer_id):
    """
    Edit the profile of an employer.

    Args:
        employer_id (int): The ID of the employer to edit.

    Returns:
        dict: A JSON response containing the updated employer's information.

    Raises:
        404: If the employer with the given ID is not found.
    """
    employer = db.session.get(User, employer_id)
    if not employer:
        return jsonify({"message": "Employer not found"}), 404

    data = request.json

    employer.first_name = data.get("first_name", employer.first_name)
    employer.last_name = data.get("last_name", employer.last_name)
    employer.email = data.get("email", employer.email)
    db.session.commit()
    return jsonify(employer.to_dict()), 200

@jobs_bp.route("/post-job", methods=["POST"])
def post_job():
    """
    Post a new job.

    Returns:
        dict: A JSON response containing the created job's information.
    """
    data = request.json

    new_job = Job(
        employer_id=data['employer_id'],  # Assuming you have the employer_id available
        title=data['title'],
        department=data['department'],
        manager_name=data['managerName'],
        manager_email=data['managerEmail'],
        hiring_semesters=data['hiringSemesters'],
        min_students=data['minStudents'],
        max_students=data['maxStudents'],
        role_location=data['roleLocation'],
        type_of_work=data['typeOfWork'],
        prerequisites=data.get('prerequisites', ''),  # Optional field
        brief_description=data['briefDescription'],
        more_details=data.get('moreDetails', ''),  # Optional field
        application_deadline=data['applicationDeadline']
    )

    db.session.add(new_job)
    db.session.commit()

    return jsonify(new_job.to_dict()), 201
