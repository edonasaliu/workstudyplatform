import unittest
from backend import create_app, db  # Assuming create_app is your factory function
from backend.models import Job

class EmployersBPTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')  # Create app instance using the factory function
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        self.client = self.app.test_client()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_post_job(self):
        data = {
            'employer_id': 1,
            'title': 'Software Engineer',
            'department': 'Engineering',
            'managerName': 'John Doe',
            'managerEmail': 'john.doe@example.com',
            'hiringSemesters': 'Fall, Spring',
            'minStudents': 1,
            'maxStudents': 5,
            'roleLocation': 'Remote',
            'typeOfWork': 'Full-time',
            'prerequisites': 'Python programming',
            'briefDescription': 'Job description',
            'moreDetails': 'Additional details',
            'applicationDeadline': '2022-12-31'
        }

        # Send a POST request to the endpoint
        response = self.client.post('/post-job', json=data)

        # Check the response status code
        self.assertEqual(response.status_code, 201)

        # Check if the job is added to the database
        job = Job.query.first()
        self.assertIsNotNone(job)
        self.assertEqual(job.employer_id, 1)
        self.assertEqual(job.title, 'Software Engineer')
        self.assertEqual(job.department, 'Engineering')
        self.assertEqual(job.manager_name, 'John Doe')
        self.assertEqual(job.manager_email, 'john.doe@example.com')
        self.assertEqual(job.hiring_semesters, 'Fall, Spring')
        self.assertEqual(job.min_students, 1)
        self.assertEqual(job.max_students, 5)
        self.assertEqual(job.role_location, 'Remote')
        self.assertEqual(job.type_of_work, 'Full-time')
        self.assertEqual(job.prerequisites, 'Python programming')
        self.assertEqual(job.brief_description, 'Job description')
        self.assertEqual(job.more_details, 'Additional details')
        self.assertEqual(job.application_deadline, '2022-12-31')
