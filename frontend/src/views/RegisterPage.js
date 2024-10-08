import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * RegisterPage component for user registration.
 *
 * @returns {JSX.Element} The RegisterPage component.
 */
const RegisterPage = () => {
    const [userDetails, setUserDetails] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        userType: 'student',
        studentId: '',
        employmentId: '',
        adminId: ''
    });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordCriteria, setPasswordCriteria] = useState({
        minLength: false,
        uppercase: false,
        number: false
    });
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const validateEmail = () => {
        if (userDetails.userType === 'student' && !userDetails.email.endsWith('@uni.minerva.edu')) {
            setEmailError('Students must use a uni.minerva.edu email');
            return false;
        } else if (userDetails.userType === 'manager' && !userDetails.email.endsWith('@minerva.edu')) {
            setEmailError('Managers must use a minerva.edu email');
            return false;
        } else if (userDetails.userType === 'admin' && !userDetails.email.endsWith('@minerva.edu')) {
            setEmailError('Admins must use a minerva.edu email and be work-study administrators');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePasswords = () => {
        if (!passwordCriteria.minLength || !passwordCriteria.uppercase || !passwordCriteria.number) {
            setPasswordError('Password does not meet all criteria');
            return false;
        } else if (userDetails.password !== userDetails.confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }
        setPasswordError('');
        return true;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        if (validateEmail() && validatePasswords()) {
            try {
                const response = await fetch('http://localhost:8080/auth/register', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userDetails)
                });

                if (response.ok) {
                    setIsLoading(false);
                    navigate('/login');
                    toast.success('Registered successfully!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        draggable: true,
                        theme: "colored",
                    });
                } else {
                    setIsLoading(false);
                    const data = await response.json();
                    toast.error(data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        draggable: true,
                        theme: "colored",
                    });
                }
            } catch (error) {
                setIsLoading(false);
                console.error('An error occurred:', error);
            }
        } else {
            console.log("Validation failed.");
        }
    };

    const handlePasswordChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
        checkPasswordCriteria(e.target.value);
    };

    const checkPasswordCriteria = (password) => {
        const minLength = password.length >= 12;
        const uppercase = /[A-Z]/.test(password);
        const number = /\d/.test(password);

        setPasswordCriteria({
            minLength,
            uppercase,
            number
        });
    };

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mt-5 mb-5">
            <h1 className="mb-4 text-center">Register</h1>
            <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
                <div className="mb-3">
                    <select
                        name="userType"
                        value={userDetails.userType}
                        onChange={handleChange}
                        className="form-select">
                        <option value="student">Student</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin (Work-Study)</option>
                    </select>
                </div>
                {userDetails.userType === 'student' && (
                    <div className="mb-3">
                        <input
                            type="text"
                            name="studentId"
                            placeholder="Student ID"
                            value={userDetails.studentId}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                )}
                {userDetails.userType === 'manager' && (
                    <div className="mb-3">
                        <input
                            type="text"
                            name="employmentId"
                            placeholder="Employment ID"
                            value={userDetails.employmentId}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                )}
                {userDetails.userType === 'admin' && (
                    <div className="mb-3">
                        <input
                            type="text"
                            name="adminId"
                            placeholder="Admin ID"
                            value={userDetails.adminId}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                )}
                <div className="mb-3">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={userDetails.firstName}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={userDetails.lastName}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={userDetails.email}
                        onChange={handleChange}
                        className="form-control"
                    />
                    {emailError && <div className="text-danger">{emailError}</div>}
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={userDetails.password}
                        onChange={handlePasswordChange}
                        className="form-control"
                    />
                    {passwordError && <div className="text-danger">{passwordError}</div>}
                    <div className="password-criteria">
                        <span style={{ color: passwordCriteria.minLength ? 'green' : 'red' }}>12 characters minimum</span><br />
                        <span style={{ color: passwordCriteria.uppercase ? 'green' : 'red' }}>Contains uppercase letter</span><br />
                        <span style={{ color: passwordCriteria.number ? 'green' : 'red' }}>Contains a number</span>
                    </div>
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={userDetails.confirmPassword}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="d-grid gap-2 mb-5">
                    <button type="submit" className="btn" style={{ backgroundColor: '#f45d26', borderColor: '#f45d26', color: 'white' }}>
                        {isLoading ? 'Submitting...' : 'Register'}</button>
                </div>
                <div className="text-center">
                    Already have an account? <Link to="/login" style={{ color: '#f45d26' }}>Login</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
