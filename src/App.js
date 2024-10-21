import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import MainPage from './components/MainPage';  // Import MainPage component
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const AppContent = styled.main`
  flex: 1;
  padding: 20px;
`;

/**
 * App Component
 * 
 * This is the main component of the application. It handles routing, authentication,
 * and manages the state for the selected deal. If a token is stored in local storage, 
 * the user is considered authenticated and can access the main content.
 * 
 * State:
 * - token (String): The JWT token used for authentication, retrieved from local storage.
 * - selectedDeal (Object|null): The currently selected deal object. Managed by the Header component.
 * 
 * Components:
 * - Header: Displays navigation and allows the user to select a deal.
 * - Login: Displays the login form if the user is not authenticated.
 * - MainPage: Displays the main content, including messages, tasks, stakeholders, etc., based on the selected deal.
 * 
 * Routes:
 * - `/`: Main page displaying details of the selected deal.
 * - `/pipeline`: Placeholder route for pipeline-related content.
 * - `/library`: Placeholder route for library-related content.
 * - `/insights`: Placeholder route for insights-related content.
 * - `/reports`: Placeholder route for reports-related content.
 * 
 * Example Usage:
 * <App />
 */

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [selectedDeal, setSelectedDeal] = useState(null);  // State to track selected deal

  // Check for token in local storage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // If no token is found, display the Login component
  if (!token) {
    return <Login setToken={setToken} />;
  }

  console.log(token);  // Debugging output to verify the token

  return (
    <Router>
      <AppContainer>
        {/* Pass selectedDeal and setSelectedDeal to the Header to manage deal selection */}
        <Header selectedDeal={selectedDeal} setSelectedDeal={setSelectedDeal} />
        <AppContent>
          <Routes>
            {/* MainPage should receive the selectedDeal to load content accordingly */}
            <Route path="/" element={<MainPage selectedDeal={selectedDeal} />} />
            <Route path="/pipeline" element={<div>Pipeline Page</div>} />
            <Route path="/library" element={<div>Library Page</div>} />
            <Route path="/insights" element={<div>Insights Page</div>} />
            <Route path="/reports" element={<div>Reports Page</div>} />
          </Routes>
        </AppContent>
      </AppContainer>
    </Router>
  );
};

export default App;
