import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Settings from './pages/Settings';
import SubjectPage from './pages/Subject';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Cookies from 'js-cookie';

const App = () => {
  const isAuthenticated = !!Cookies.get('username');

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Auth />} />
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Auth />} />
        <Route path="/subject/:subjectId" element={isAuthenticated ? <SubjectPage /> : <Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
