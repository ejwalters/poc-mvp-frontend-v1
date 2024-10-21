import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { ClipLoader } from 'react-spinners';  // Import the spinner

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
`;

const Card = styled.div`
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 24px;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 0.75rem;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

/**
 * Login Component
 *
 * This component is responsible for displaying the login form and handling user authentication.
 * The component collects the user's email and password, sends a login request to the server,
 * and retrieves a JWT token if the login is successful.
 * 
 * State:
 * - email (String): Stores the entered email.
 * - password (String): Stores the entered password.
 * - loading (Boolean): Tracks whether the login request is in progress, disables the form during the request.
 * 
 * Props:
 * - setToken (Function): A function passed from the parent component (App.js) to store the JWT token.
 * 
 * Example Usage:
 * <Login setToken={setToken} />
 * 
 * Key Features:
 * - Displays a spinner while the login request is processing.
 * - Disables the form inputs and the login button while the request is in progress.
 * - Sends the JWT token back to the parent component and saves it in local storage for future use.
 */

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);  // Track loading state

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);  // Start loading animation when the request starts

        // Make the login request to the backend
        axios.post('http://localhost:5001/login', { email, password })
            .then(response => {
                const token = response.data.token;
                // Store the token in localStorage
                localStorage.setItem('token', token);
                // Set token in parent component
                setToken(token);
            })
            .catch(error => {
                console.error('Login failed', error);
            })
            .finally(() => {
                setLoading(false);  // Stop loading animation after the request is done
            });
    };

    return (
        <Container>
            <Card>
                <Title>Login</Title>
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}  // Disable inputs while loading
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}  // Disable inputs while loading
                    />
                    <Button type="submit" disabled={loading}> {/* Disable button while loading */}
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </Form>

                {/* Show loading spinner */}
                {loading && (
                    <LoaderContainer>
                        <ClipLoader color="#007bff" loading={loading} size={35} />
                    </LoaderContainer>
                )}
            </Card>
        </Container>
    );
};

export default Login;
