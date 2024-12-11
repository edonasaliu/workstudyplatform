from flask import Blueprint, request, jsonify
from .models import db, Job, Application, User, Team, WSTracker
from flask_login import current_user, login_required
from werkzeug.utils import secure_filename
import os

main = Blueprint("main", __name__)


# Jobs Endpoints
@main.route("/employers", methods=["GET", "POST"])
@login_required
def manage_jobs():
    """
    Endpoint for managing jobs.

    If the request method is POST, it creates a new job based on the provided data
    and returns the newly created job as JSON with a status code of 201.

    If the request method is GET, it retrieves all jobs from the database
    and returns them as JSON with a status code of 200.

    Returns:
        JSON response containing the job(s) and the corresponding status code.
    """
    if request.method == "POST":
        data = request.json
        new_job = Job(
            employer_id=current_user.id,
            title=data["positionTitle"],
            department=data["department"],
            manager_name=data["managerName"],
            manager_email=data["managerEmail"],
            hiring_semesters=','.join(data["hiringSemester"]),
            min_students=int(data["minStudents"]),
            max_students=int(data["maxStudents"]),
            role_location=data["roleLocation"],
            type_of_work=data["typeOfWork"],
            prerequisites=data.get("prerequisites", ""),
            brief_description=data["briefDescription"],
            more_details=data.get("moreDetails", ""),
            application_deadline=data["applicationDeadline"]
        )

        db.session.add(new_job)
        db.session.commit()
        return jsonify(new_job.to_dict()), 201

    jobs = Job.query.all()
    return jsonify([job.to_dict() for job in jobs]), 200

#Endpoints for getting jobs posted by a specific employer
@main.route("/jobs/<int:job_id>", methods=["GET", "PUT", "DELETE"])
@login_required
def handle_job(job_id):
    """
    Handle GET, PUT, and DELETE requests for a specific job.

    Args:
        job_id (int): The ID of the job.

    Returns:
        JSON response: The job details in JSON format.

    Raises:
        404: If the job with the specified ID does not exist.
    """
    job = Job.query.get_or_404(job_id)

    if request.method == "GET":
        # Simply return the job details in JSON format
        return jsonify(job.to_dict()), 200

    if request.method == "PUT":
        data = request.json
        job.title = data.get("positionTitle", job.title)
        job.department = data.get("department", job.department)
        job.manager_name = data.get("managerName", job.manager_name)
        job.manager_email = data.get("managerEmail", job.manager_email)
        job.hiring_semesters = ','.join(data.get("hiringSemester", job.hiring_semesters))
        job.min_students = data.get("minStudents", job.min_students)
        job.max_students = data.get("maxStudents", job.max_students)
        job.role_location = data.get("roleLocation", job.role_location)
        job.type_of_work = data.get("typeOfWork", job.type_of_work)
        job.prerequisites = data.get("prerequisites", job.prerequisites)
        job.brief_description = data.get("briefDescription", job.brief_description)
        job.more_details = data.get("moreDetails", job.more_details)
        job.application_deadline = data.get("applicationDeadline", job.application_deadline)
        db.session.commit()
        return jsonify(job.to_dict()), 200

    elif request.method == "DELETE":
        db.session.delete(job)
        db.session.commit()
        return jsonify({"message": "Job deleted successfully"}), 200

    return jsonify(job.to_dict()), 200


# Applications Endpoints
@main.route('/apply', methods=['POST'])
@login_required
def apply_for_job():
    """
    Endpoint for submitting a job application.

    This endpoint allows users to apply for a job by submitting their application details,
    including the job ID, email address, year of graduation, candidate statement, and resume.

    Returns:
        A JSON response containing the newly created application details and a status code of 201.
    """
    if 'resume' in request.files:
        resume_file = request.files['resume']
        if resume_file.filename != '':
            filename = secure_filename(resume_file.filename)
            resume_file.save(os.path.join('path/to/save', filename))

    data = request.form
    new_application = Application(
        # Assume student_id is handled appropriately (e.g., from session)
        job_id=data.get('jobId'),
        email_address=data.get('emailAddress'),
        year_of_graduation=data.get('yearOfGraduation'),
        candidate_statement=data.get('candidateStatement'),
        student_id=current_user.id,
        # Handle resume data as needed
    )

    db.session.add(new_application)
    db.session.commit()

    return jsonify(new_application.to_dict()), 201



#Endpoints for getting applications for a specific user
@main.route('/user-applications', methods=['GET'])
@login_required
def get_user_applications():
    """
    Retrieves the applications of the current user.

    Returns:
        A JSON response containing the applications data and a status code.
    """
    # Assume user_id is obtained from the session or authentication system
    user_id = current_user.id

    # Fetch applications from the database where the student_id matches the user_id
    applications = Application.query.filter_by(student_id=user_id).all()

    # Convert applications to a dictionary format to be JSON serializable
    applications_data = []

    for application in applications:
        application_data = application.to_dict()
        job_id = application_data['job_id']
        job = Job.query.get_or_404(job_id)
        application_data['job'] = job.to_dict()
        applications_data.append(application_data)
    

    return jsonify(applications_data), 200


def get_job_posting(job_id):
    job = Job.query.get_or_404(job_id)
    return jsonify(job.to_dict()), 200


# Endpoints for withdrawing an application
@main.route('/user-applications/<int:application_id>', methods=['DELETE'])
@login_required
def withdraw_application(application_id):
    """
    Withdraws an application by deleting it from the database.

    Args:
        application_id (int): The ID of the application to be withdrawn.

    Returns:
        tuple: A tuple containing the JSON response and the HTTP status code.
            The JSON response contains a message indicating the success of the operation.
    """
    application = Application.query.get_or_404(application_id)
    db.session.delete(application)
    db.session.commit()
    return jsonify({"message": "Application deleted successfully"}), 200

@main.route("/applications/<int:application_id>", methods=["GET", "PUT", "DELETE"])
@login_required
def handle_application(application_id):
    """
    Handle GET, PUT, and DELETE requests for a specific application.

    Args:
        application_id (int): The ID of the application.

    Returns:
        JSON response: The application details or a success message.

    Raises:
        404: If the application with the given ID does not exist.
    """
    application = Application.query.get_or_404(application_id)

    if request.method == "PUT":
        data = request.json
        application.status = data.get("status", application.status)
        db.session.commit()
        return jsonify(application.to_dict()), 200

    elif request.method == "DELETE":
        db.session.delete(application)
        db.session.commit()
        return jsonify({"message": "Application deleted successfully"}), 200

    return jsonify(application.to_dict()), 200

#endpoint for getting all applications
@main.route("/applications", methods=["GET"])
@login_required
def get_applications():
    """
    Endpoint for retrieving all applications.

    Returns:
        JSON response containing a list of applications.
    """
    employer_id = current_user.id
    # jobs the employer posted
    jobs = Job.query.filter_by(employer_id=employer_id).all()

    # applications for the jobs the employer posted
    applications = []
    for job in jobs:
        for application in job.applications:
            student = get_student_from_application(application)
            application_data = {
                "application": application.to_dict(),
                "student_name": f"{student['first_name']} {student['last_name']}",
            }
            applications.append(application_data)

    return jsonify(applications), 200

def get_student_from_application(application):
    student_id = application.student_id
    student = User.query.get_or_404(student_id)
    return student.to_dict()

# Students Endpoints
@main.route("/students", methods=["GET", "POST"])
@login_required
def manage_students():
    """
    Endpoint for managing students.

    GET: Retrieves a list of all students.
    POST: Creates a new student.

    Returns:
        - For GET: A JSON response containing a list of student objects.
        - For POST: A JSON response containing the newly created student object.
    """
    if request.method == "POST":
        data = request.json
        new_student = User(
            username=data["username"],
            password=data["password"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"],
            education_level=data.get("education_level", ""),
            resume=data.get("resume", ""),
        )
        db.session.add(new_student)
        db.session.commit()
        return jsonify(new_student.to_dict()), 201

    students = User.query.all()
    return jsonify([student.to_dict() for student in students]), 200


# Employers Endpoints
@main.route("/employers", methods=["GET", "POST"])
@login_required
def manage_employers():
    """
    Endpoint for managing employers.

    If the request method is POST, a new employer is created based on the provided data
    and added to the database. Returns the newly created employer as JSON with a status code of 201.

    If the request method is GET, retrieves all employers from the database and returns them as JSON
    with a status code of 200.

    Returns:
        JSON response containing employers data and status code.
    """
    if request.method == "POST":
        data = request.json
        new_employer = User(
            username=data["username"],
            password=data["password"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            role=data["role"],
            email=data["email"],
        )
        db.session.add(new_employer)
        db.session.commit()
        return jsonify(new_employer.to_dict()), 201

    employers = User.query.all()
    return jsonify([employer.to_dict() for employer in employers]), 200


@main.route('/jobs', methods=['GET'])
@login_required
def get_jobs():
    """
    Retrieve jobs based on filter parameters from the query string.

    Returns:
        A JSON response containing a list of job objects matching the filter criteria.
    """
    jobs = Job.query.all()
    # Retrieve filter parameters from query string
    keyword = request.args.get('keyword')
    location = request.args.get('location')
    department = request.args.get('department')

    # Start with a base query
    query = Job.query

    # Apply filters if they exist
    if keyword:
        query = query.filter(Job.title.ilike(f'%{keyword}%'))  # Adjust the filter field and method as needed
    if location:
        query = query.filter_by(role_location=location)  # Adjust the filter field as needed
    if department and department != 'Other':  # Assuming 'Other' means no department filter
        query = query.filter_by(department=department)  # Adjust the filter field as needed

    # Execute the query and return results
    jobs = query.all()
    return jsonify([job.to_dict() for job in jobs]), 200

@main.route('/job-search', methods=['POST'])
def search_jobs():
    """
    Search for jobs based on the provided filters.

    Args:
        None

    Returns:
        A JSON array containing the matching job records.

    Raises:
        None
    """
    data = request.json

    # Start with a query that will get all Job records
    query = Job.query

    # If a department is specified and it's not 'Other', filter jobs by that department
    if data['department'] and data['department'] != 'Other':
        query = query.filter_by(department=data['department'])

    # If a keyword is provided, filter jobs where the title contains the keyword (case-insensitive)
    if data['keyword']:
        query = query.filter(Job.title.ilike(f'%{data["keyword"]}%'))

    # If a location is provided, filter jobs by the provided location
    if data['location']:
        query = query.filter_by(role_location=data['location'])

    # Execute the query and retrieve all matching records    
    jobs = query.all()

    # Convert the job objects to dictionaries and return them as a JSON array
    return jsonify([job.to_dict() for job in jobs])



@main.route("/")
def home():
    return jsonify({"message": "Welcome to the Work Study Platform API"}), 200

@main.route('/admin/jobs', methods=['GET'])
@login_required
def admin_view_all_jobs():
    if current_user.role != 'admin':
        return jsonify({"message": "Unauthorized"}), 403

    jobs = Job.query.all()
    jobs_data = []
    for job in jobs:
        job_data = job.to_dict()
        job_data['manager'] = {
            "id": job.employer.id,
            "name": f"{job.employer.first_name} {job.employer.last_name}",
            "email": job.employer.email,
        }
        applications = Application.query.filter_by(job_id=job.id).all()
        job_data['applications'] = [
            {
                "id": application.id,
                "student_name": f"{application.student.first_name} {application.student.last_name}",
                "email_address": application.email_address,
                "year_of_graduation": application.year_of_graduation,
                "candidate_statement": application.candidate_statement,
                "status": application.status,
            }
            for application in applications
        ]
        jobs_data.append(job_data)

    return jsonify(jobs_data), 200


@main.route('/teams', methods=['GET', 'POST'])
def manage_teams():
    if request.method == 'POST':
        data = request.json
        new_team = Team(
            name=data['name'],
            manager=data['manager'],
            email=data['email'],
            max_students=data['maxStudents'],
            contact=data['contact'],
            priority=data['priority'],
            recruiting_for=data['recruitingFor'],
        )
        db.session.add(new_team)
        db.session.commit()
        return jsonify(new_team.to_dict()), 201

    teams = Team.query.all()
    return jsonify([team.to_dict() for team in teams]), 200


@main.route('/teams/<int:team_id>', methods=['PUT', 'DELETE'])
@login_required
def handle_team(team_id):
    team = Team.query.get_or_404(team_id)

    if request.method == 'PUT':
        data = request.json
        team.name = data.get('name', team.name)
        team.manager = data.get('manager', team.manager)
        team.email = data.get('email', team.email)
        team.max_students = data.get('maxStudents', team.max_students)
        team.contact = data.get('contact', team.contact)
        team.priority = data.get('priority', team.priority)
        team.recruiting_for = data.get('recruitingFor', team.recruiting_for)
        db.session.commit()
        return jsonify(team.to_dict()), 200

    elif request.method == 'DELETE':
        db.session.delete(team)
        db.session.commit()
        return jsonify({"message": "Team deleted successfully"}), 200

@main.route('/ws-position-tracker', methods=['GET', 'POST'])
def manage_ws_positions():
    if request.method == 'POST':
        try:
            data = request.json
            print("Received data:", data)  # Debug incoming data
            new_position = WSTracker(
                student_id=data['student_id'],
                minerva_email=data['minerva_email'],
                full_name=data['full_name'],
                expected_grad_year=data['expected_grad_year'],
                ws_eligible=data['ws_eligible'],
                role=data['role'],
                manager_name=data['manager_name'],
                paycom_manager=data['paycom_manager'],
                manager_email=data['manager_email'],
                department_name=data['department_name'],
                paycom_id=data['paycom_id'],
                contractor_status=data['contractor_status'],
                notes=data['notes'],
                merge_status=data['merge_status'],
            )
            db.session.add(new_position)
            db.session.commit()
            return jsonify(new_position.to_dict()), 201
        except Exception as e:
            print("Error processing POST request:", e)  # Log error
            return jsonify({"error": str(e)}), 400

    positions = WSTracker.query.all()
    return jsonify([position.to_dict() for position in positions]), 200


@main.route('/ws-position-tracker/<int:position_id>', methods=['PUT', 'DELETE'])
def handle_ws_position(position_id):
    position = WSTracker.query.get_or_404(position_id)

    if request.method == 'PUT':
        data = request.json
        position.student_id = data.get('student_id', position.student_id)
        position.minerva_email = data.get('minerva_email', position.minerva_email)
        position.full_name = data.get('full_name', position.full_name)
        position.expected_grad_year = data.get('expected_grad_year', position.expected_grad_year)
        position.ws_eligible = data.get('ws_eligible', position.ws_eligible)
        position.role = data.get('role', position.role)
        position.manager_name = data.get('manager_name', position.manager_name)
        position.paycom_manager = data.get('paycom_manager', position.paycom_manager)
        position.manager_email = data.get('manager_email', position.manager_email)
        position.department_name = data.get('department_name', position.department_name)
        position.paycom_id = data.get('paycom_id', position.paycom_id)
        position.contractor_status = data.get('contractor_status', position.contractor_status)
        position.notes = data.get('notes', position.notes)
        position.merge_status = data.get('merge_status', position.merge_status)
        db.session.commit()
        return jsonify(position.to_dict()), 200

    elif request.method == 'DELETE':
        db.session.delete(position)
        db.session.commit()
        return jsonify({"message": "WS Position deleted successfully"}), 200

@main.route('/teams/<int:team_id>', methods=['PUT'])
@login_required
def update_team(team_id):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not validate_token(auth_header.split(" ")[1]):
        return jsonify({"error": "Unauthorized"}), 401

    team = Team.query.get_or_404(team_id)
    data = request.json

    # Update team fields
    team.name = data.get('name', team.name)
    team.manager = data.get('manager', team.manager)
    team.email = data.get('email', team.email)
    team.max_students = data.get('maxStudents', team.max_students)
    team.contact = data.get('contact', team.contact)
    team.priority = data.get('priority', team.priority)
    team.recruiting_for = data.get('recruitingFor', team.recruiting_for)

    db.session.commit()
    return jsonify(team.to_dict()), 200