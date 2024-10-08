import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, FormGroup, FormControl } from 'react-bootstrap';

// LoginPage component for user login
const LoginPage = () => {
    const { user, login } = useContext(UserContext); // Using UserContext for login logic
    const [email, setEmail] = useState(''); // State for email
    const [password, setPassword] = useState(''); // State for password
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === 'student') {
            navigate('/Dashboard');
        } else if (user && user.role === 'manager') {
            navigate('/employer-dashboard');
        } else if (user && user.role === 'admin') {
            navigate('/admin-dashboard'); // Redirect to admin dashboard for work-study admins
        }
    }, [user, navigate]);

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior
        setIsLoading(true);
        await login({email, password}); // Calls login function from UserContext with email and password
        setIsLoading(false);
    };

    return (
        <Container className="mt-5 mb-5">
            <h1 className="mb-2 text-center">Login</h1>
            <p className="text-center fst-italic mb-3">Please note that your login information for this platform is unique.</p>
            <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
                <FormGroup className="mb-3">
                    <FormControl 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </FormGroup>
                <FormGroup className="mb-3">
                    <FormControl 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </FormGroup>
                <Button type="submit" style={{ backgroundColor: '#f45d26', borderColor: '#f45d26' }} className="mb-3 w-100">
                    {isLoading ? 'Submitting...' : 'Sign In'}
                </Button>
                <div className="text-center">
                    Don't have an account? <Link to="/register" style={{ color: '#f45d26' }}>Register</Link>
                </div>
            </Form>
        </Container>
    );
};

export default LoginPage;
