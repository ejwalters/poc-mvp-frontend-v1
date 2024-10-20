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

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [selectedDeal, setSelectedDeal] = useState(null);  // State to track selected deal

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  console.log(token);

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
