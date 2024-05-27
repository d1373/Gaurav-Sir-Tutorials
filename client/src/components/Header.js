import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Header.css';
import SubjectDropdown from './SubjectDropdown';

const Header = () => {
  const navigate = useNavigate();
  const username = Cookies.get('username');
  const userType = Cookies.get('type');
  const standard = Cookies.get('standard');
  const batchCode = Cookies.get('batchCode');

  const handleLogout = () => {
    Cookies.remove('username');
    Cookies.remove('type');
    Cookies.remove('standard');
    Cookies.remove('batchCode');
    navigate('/');
  };

  const initials = username ? username.charAt(0).toUpperCase() : '';
  const profileBgColor = userType === 'Teacher' ? 'red' : 'green';

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogoClick = () => {
    if (username) {
      navigate('/home');
    }
  };

  return (
    <header className="header">
      <div className="header-left" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <h1>Gaurav Sir's Tutorials</h1>
      </div>
      <div className="header-right">
        <div className="profile" onClick={toggleDropdown}>
          <div className="profile-icon" style={{ backgroundColor: profileBgColor }}>
            {initials}
          </div>
          {dropdownOpen && (
            <div className="dropdown">
              <div className="dropdown-content">
                <SubjectDropdown />
                <Link to="/settings">Settings</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
