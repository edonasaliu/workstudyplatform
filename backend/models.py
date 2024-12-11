from . import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import backref


class User(db.Model, UserMixin):
    """
    Represents a user in the system.

    Attributes:
        id (int): The unique identifier of the user.
        username (str): The username of the user.
        password (str): The password of the user.
        first_name (str): The first name of the user.
        last_name (str): The last name of the user.
        email (str): The email address of the user.
        role (str): The role of the user (Student or Employer).
        education_level (str): The education level of the user (only applicable for students).
        resume (str): The resume of the user (only applicable for students).
        jobs (list): The list of jobs posted by the user (only applicable for employers).
        applications (list): The list of applications submitted by the user (only applicable for students).
    """

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    role = db.Column(db.String(50))  # Role (Student or Employer)
    education_level = db.Column(db.String(100), nullable=True)
    resume = db.Column(db.Text, nullable=True)

    # Relationships
    jobs = db.relationship(
        "Job",
        backref=backref("employer", uselist=False),
        primaryjoin=lambda: User.id == db.foreign(Job.employer_id),
        foreign_keys="Job.employer_id",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    
    applications = db.relationship(
        "Application",
        backref=backref("student", uselist=False),
        primaryjoin=lambda: User.id == db.foreign(Application.student_id),
        foreign_keys="Application.student_id",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        user_dict = {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "role": self.role,
        }

        # Add student or employer-specific fields
        if self.role == "Student":
            user_dict.update({
                "education_level": self.education_level,
                "resume": self.resume,
                "applications": [app.to_dict() for app in self.applications],
            })
        elif self.role == "Employer":
            user_dict.update({
                "jobs": [job.to_dict() for job in self.jobs]
            })

        return user_dict


class Job(db.Model):
    """
    Represents a job in the system.
    """
    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    manager_name = db.Column(db.String(100), nullable=False)
    manager_email = db.Column(db.String(100), nullable=False)
    hiring_semesters = db.Column(db.String(100), nullable=False)
    min_students = db.Column(db.Integer, nullable=False)
    max_students = db.Column(db.Integer, nullable=False)
    role_location = db.Column(db.String(100), nullable=False)
    type_of_work = db.Column(db.String(100), nullable=False)
    prerequisites = db.Column(db.String(200))
    brief_description = db.Column(db.Text, nullable=False)
    more_details = db.Column(db.Text)
    application_deadline = db.Column(db.String(100), nullable=False)
    applications = db.relationship("Application", backref="job", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "employer_id": self.employer_id,
            "title": self.title,
            "department": self.department,
            "manager_name": self.manager_name,
            "manager_email": self.manager_email,
            "hiring_semesters": self.hiring_semesters,
            "min_students": self.min_students,
            "max_students": self.max_students,
            "role_location": self.role_location,
            "type_of_work": self.type_of_work,
            "prerequisites": self.prerequisites,
            "brief_description": self.brief_description,
            "more_details": self.more_details,
            "application_deadline": self.application_deadline,
        }


class Application(db.Model):
    """
    Represents a job application made by a student.
    """
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey("job.id"))
    status = db.Column(db.String(100), default="pending")
    email_address = db.Column(db.String(100), nullable=False)
    year_of_graduation = db.Column(db.Integer, nullable=False)
    resume = db.Column(db.LargeBinary, nullable=True)
    candidate_statement = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "job_id": self.job_id,
            "status": self.status,
            "email_address": self.email_address,
            "year_of_graduation": self.year_of_graduation,
            "candidate_statement": self.candidate_statement,
        }


class Team(db.Model):
    """
    Represents a team in the system.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    manager = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    max_students = db.Column(db.Integer, nullable=False)
    contact = db.Column(db.String(100), nullable=True)
    priority = db.Column(db.String(50), nullable=False)
    recruiting_for = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "manager": self.manager,
            "email": self.email,
            "maxStudents": self.max_students,
            "contact": self.contact,
            "priority": self.priority,
            "recruitingFor": self.recruiting_for,
        }


class WSTracker(db.Model):
    """
    Represents a work-study tracker in the system.
    """
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(100), nullable=False)
    minerva_email = db.Column(db.String(100), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    expected_grad_year = db.Column(db.Integer, nullable=False)
    ws_eligible = db.Column(db.Boolean, nullable=False, default=False)
    role = db.Column(db.String(100), nullable=True)
    manager_name = db.Column(db.String(100), nullable=True)
    paycom_manager = db.Column(db.String(100), nullable=True)
    manager_email = db.Column(db.String(100), nullable=True)
    department_name = db.Column(db.String(100), nullable=True)
    paycom_id = db.Column(db.String(100), nullable=True)
    contractor_status = db.Column(db.String(50), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    merge_status = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "minerva_email": self.minerva_email,
            "full_name": self.full_name,
            "expected_grad_year": self.expected_grad_year,
            "ws_eligible": self.ws_eligible,
            "role": self.role,
            "manager_name": self.manager_name,
            "paycom_manager": self.paycom_manager,
            "manager_email": self.manager_email,
            "department_name": self.department_name,
            "paycom_id": self.paycom_id,
            "contractor_status": self.contractor_status,
            "notes": self.notes,
            "merge_status": self.merge_status,
        }


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
