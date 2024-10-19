import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Login from './components/Login';
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
        <Header />
        <AppContent>
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
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
