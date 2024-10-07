import unittest
from werkzeug.security import generate_password_hash
from backend.models import User, db
from backend import create_app  # Assuming you have a function to create your Flask app

class AuthBpTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')  # Create a test Flask app with a testing config
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()  # Create database schema
        self.client = self.app.test_client()

        # Create and add a test user
        self.user = User(
            username="testuser",
            password=generate_password_hash("testpassword"),
            first_name="Test",
            last_name="User",
            email="testuser@example.com",
            role="Student",
            # Add other fields if necessary, set to default or mock values
        )
        db.session.add(self.user)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_login_success(self):
        # Test successful login
        response = self.client.post(
            "auth/login",
            json={"email": "testuser@example.com", "password": "testpassword"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.get_json(),
            {"id": self.user.id, "username": "testuser", "role": "Student"},
        )

    def test_login_invalid_credentials(self):
        # Test login with invalid credentials
        response = self.client.post(
            "auth/login",
            json={"email": "testuser@example.com", "password": "wrongpassword"},
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.get_json(),
            {"message": "Invalid username or password"},
        )