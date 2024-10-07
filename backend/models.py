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

    Methods:
        set_password(password): Sets the password for the user.
        check_password(password): Checks if the provided password matches the user's password.
        to_dict(): Converts the user object to a dictionary representation.
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
        """
        Sets the password for the user.

        Args:
            password (str): The password to set.
        """
        self.password = generate_password_hash(password)

    def check_password(self, password):
        """
        Checks if the provided password matches the user's password.

        Args:
            password (str): The password to check.

        Returns:
            bool: True if the password matches, False otherwise.
        """
        return check_password_hash(self.password, password)

    def to_dict(self):
        """
        Converts the user object to a dictionary representation.

        Returns:
            dict: A dictionary representation of the user object.
        """
        user_dict = {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "role": self.role,
        }

        # Add student or employer specific fields
        if self.role == "Student":
            user_dict.update(
                {
                    "education_level": self.education_level,
                    "resume": self.resume,
                    "applications": [app.to_dict() for app in self.applications],
                }
            )
        elif self.role == "Employer":
            user_dict.update({"jobs": [job.to_dict() for job in self.jobs]})

        return user_dict


class Job(db.Model):
    """
    Represents a job in the system.

    Attributes:
        id (int): The unique identifier for the job.
        employer_id (int): The ID of the employer who posted the job.
        title (str): The title of the job.
        department (str): The department associated with the job.
        manager_name (str): The name of the manager for the position.
        manager_email (str): The email address of the manager.
        hiring_semesters (str): Semesters during which hiring is active.
        min_students (int): Minimum number of students required.
        max_students (int): Maximum number of students that can be hired.
        role_location (str): The location of the job role.
        type_of_work (str): The type of work involved in the job.
        prerequisites (str): Prerequisites for the job.
        brief_description (str): A brief description of the job.
        more_details (str): More details about the job.
        application_deadline (str): The deadline for job applications.
        applications (list): The list of applications associated with the job.
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
    applications = db.relationship('Application', backref='job', lazy=True)
    description = db.Column(db.Text, nullable=True)


    def to_dict(self):
        """
        Converts the Job object to a dictionary.

        Returns:
            dict: A dictionary representation of the Job object.
        """
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
            "description": self.description
        }
        
        

class Application(db.Model):
    """
    Represents a job application made by a student.

    Attributes:
        id (int): The unique identifier for the application.
        student_id (int): The ID of the student who made the application.
        job_id (int): The ID of the job the application is for.
        status (str): The status of the application (e.g., "pending", "accepted", "rejected").

    Methods:
        to_dict(): Converts the Application object to a dictionary.

    """

    id = db.Column(db.Integer, primary_key=True)
    
    student_id = db.Column(db.Integer, db.ForeignKey("user.id")) #needs to be modified @edona we need to connect it to the student id from the user authentication , I made it nullable for now
    job_id = db.Column(db.Integer, db.ForeignKey("job.id"))
    status = db.Column(db.String(100), default="pending")
    email_address = db.Column(db.String(100), nullable=False)
    year_of_graduation = db.Column(db.Integer, nullable=False)
    resume = db.Column(db.LargeBinary, nullable=True)  # Storing file data; adjust as needed
    candidate_statement = db.Column(db.Text, nullable=False)

    def to_dict(self):
        """
        Converts the Application object to a dictionary.

        Returns:
            dict: A dictionary representation of the Application object.

        """
        return {
            "id": self.id,
            "student_id": self.student_id,
            "job_id": self.job_id,
            "status": self.status,
            "email_address": self.email_address,
            "year_of_graduation": self.year_of_graduation,
            "candidate_statement": self.candidate_statement,
        }


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))