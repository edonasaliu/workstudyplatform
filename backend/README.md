# Minerva Workstudy Platform Backend

## Our Backend Structure

We've organized the backend of the Minerva Workstudy Platform to ensure smooth operation and ease of maintenance. Here's how it's laid out:


- `backend/`
    - `__pycache__/` - Compiled Python files for faster loading
    - `__init__.py` - Initializes the routes package
    - `auth_bp.py` - Authentication routes for login/logout
    - `employers_bp.py` - Routes for employer-related actions
    - `main.py` - Main application routes for jobs and applications
    - `students_bp.py` - Routes for student-related actions
  - `__init__.py` - Initializes the backend package and Flask app
  - `config.py` - Configuration settings for the Flask app
  - `minerva.db` - SQLite database file
  - `models.py` - ORM models representing database schema
  - `README.md` - Documentation for the backend
- `requirements.txt` - Dependencies required for the backend

## Technologies Used

The Minerva Workstudy Platform's backend is built using a variety of technologies that ensure a robust and scalable service. Here's the main technologies our team has implemented:

- **Flask**: A lightweight WSGI web application framework. It is designed to make getting started quick and easy, with the ability to scale up to complex applications.
- **Flask-Login**: A Flask extension for managing user sessions.
- **Flask-CORS**: A Flask extension for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible.
- **Flask-SQLAlchemy**: An extension for Flask that adds support for SQLAlchemy. It is an ORM and a toolkit that allows for the easy and quick configuration of an application's database.
- **SQLite**: A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. It is the most used database engine in the world.
- **SQLAlchemy**: A Python SQL toolkit and ORM that gives application developers the full power and flexibility of SQL.
- **Werkzeug**: A comprehensive WSGI web application library. It began as a simple collection of various utilities for WSGI applications and has become one of the most advanced WSGI utility libraries.

These technologies were chosen for their simplicity, reliability, and wide adoption in the industry, making them ideal for both rapid prototyping and production-grade services.


## Project Overview

Our backend structure is crafted to ensure robustness and scalability. Key components include:

- **Blueprints for Modular Architecture**: Organized into distinct blueprints for managing authentication (`auth_bp.py`), employer profiles (`employers_bp.py`), student interactions (`students_bp.py`), and main routes (`main.py`).
- **Models with Integrity**: Our ORM models (`models.py`) define the database schema, ensuring data integrity and ease of query.
## Comprehensive API Endpoints

### Job Management
- `GET /employers`: Retrieves all jobs posted by the currently authenticated employer.
- `POST /employers`: Creates a new job posting with the provided job details.
- `GET /jobs/<int:job_id>`: Fetches the details of a specific job posting.
- `PUT /jobs/<int:job_id>`: Updates the details of a specific job posting.
- `DELETE /jobs/<int:job_id>`: Deletes a specific job posting.

### Job Application
- `POST /apply`: Submits a new application for a job along with the applicant's details.
- `GET /user-applications`: Retrieves all job applications made by the currently authenticated student.
- `DELETE /user-applications/<int:application_id>`: Withdraws a specific job application.
- `GET /applications/<int:application_id>`: Retrieves details of a specific application.
- `PUT /applications/<int:application_id>`: Updates the status of a specific application.
- `DELETE /applications/<int:application_id>`: Deletes a specific application.

### General User Endpoints
- `GET /students`: Retrieves a list of all student users.
- `POST /students`: Creates a new student user with the provided details.
- `GET /employers`: Retrieves a list of all employer users.
- `POST /employers`: Creates a new employer user with the provided details.

### Job Search
- `GET /jobs`: Fetches the complete list of available job postings, with optional filtering based on keyword, location, and department.
- `POST /job-search`: Searches for jobs based on department, keyword, and location criteria.

Please ensure to authenticate as required by the endpoints that use `@login_required`.

## Features 

- **Authentication**: Manage user login and registration, along with session management.
- **Employer Profiles**: Facilitate employer actions like editing profiles and posting jobs.
- **Student Interactions**: Handle student-specific functionalities, including job applications.
- **Jobs Management**: Create, read, update, and delete job postings efficiently.
- **Applications Handling**: Process job applications, including status updates.


