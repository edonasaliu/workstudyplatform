import unittest
from backend.models import User

class UserTestCase(unittest.TestCase):
    def setUp(self):
        # Create a test user
        self.user = User(
            username="testuser",
            password="testpassword",
            first_name="John",
            last_name="Doe",
            email="testuser@example.com",
            role="Student",
            education_level="Bachelor's Degree",
            resume="Test resume",
        )

    def test_set_password(self):
        # Test if the password is set correctly
        self.user.set_password("newpassword")
        self.assertNotEqual(self.user.password, "newpassword")

    def test_check_password(self):
        # Test if the check_password method returns True for correct password
        self.user.set_password("testpassword")
        self.assertTrue(self.user.check_password("testpassword"))

        # Test if the check_password method returns False for incorrect password
        self.assertFalse(self.user.check_password("wrongpassword"))

    def test_to_dict(self):
        # Test if the to_dict method returns the correct dictionary representation
        user_dict = self.user.to_dict()
        self.assertEqual(user_dict["username"], "testuser")
        self.assertEqual(user_dict["first_name"], "John")
        self.assertEqual(user_dict["last_name"], "Doe")
        self.assertEqual(user_dict["email"], "testuser@example.com")
        self.assertEqual(user_dict["role"], "Student")
        self.assertEqual(user_dict["education_level"], "Bachelor's Degree")
        self.assertEqual(user_dict["resume"], "Test resume")
