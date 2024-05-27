import React, { useState } from 'react';
import './Auth.css';
import { registerUser, loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Auth = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    standard: '',
    batchCode: [],
    dateOfRegistration: new Date().toISOString().split('T')[0],
  });
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleBatchCodeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setRegisterData({ ...registerData, batchCode: [...registerData.batchCode, value] });
    } else {
      setRegisterData({
        ...registerData,
        batchCode: registerData.batchCode.filter((code) => code !== value),
      });
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const resetRegisterForm = () => {
    setRegisterData({
      username: '',
      email: '',
      phone: '',
      password: '',
      standard: '',
      batchCode: [],
      dateOfRegistration: new Date().toISOString().split('T')[0],
    });
  };

  const resetLoginForm = () => {
    setLoginData({
      username: '',
      password: '',
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const { username, email, phone, password, standard, batchCode, dateOfRegistration } = registerData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    if (!username || !email || !phone || !password || !standard || !batchCode.length) {
      alert('All fields are required');
      return;
    }

    if (!emailRegex.test(email)) {
      alert('Invalid email format');
      return;
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      alert('Phone number must be exactly 10 digits');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters long, contain a number and a special character');
      return;
    }

    try {
      const response = await registerUser({ username, email, phone, password, standard, batchCode, dateOfRegistration, type: 'Student' });
      console.log('Registration successful');
      Cookies.set('username', response.data.username);
      Cookies.set('type', 'Student');
      Cookies.set('standard', response.data.standard);
      Cookies.set('batchCode', response.data.batchCode);
      resetRegisterForm(); // Reset form after successful registration
      navigate('/home'); // Redirect to home page
    } catch (error) {
      console.error('Error registering user:', error.response ? error.response.data : error.message);
      alert('Error registering user: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(loginData);
      console.log('Login successful');
      Cookies.set('username', response.data.username);
      Cookies.set('type', response.data.type);
      Cookies.set('standard', response.data.standard);
      Cookies.set('batchCode', response.data.batchCode);
      resetLoginForm(); // Reset form after successful login
      navigate('/home'); // Redirect to home page
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
      alert('Error logging in: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="auth-container">
      <div className={`card ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-front">
          <h2>Register</h2>
          <form onSubmit={handleRegisterSubmit}>
            <input type="text" name="username" placeholder="Username" value={registerData.username} onChange={handleRegisterChange} />
            <input type="email" name="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} />
            <input type="text" name="phone" placeholder="Phone" value={registerData.phone} onChange={handleRegisterChange} />
            <input type="password" name="password" placeholder="Password" value={registerData.password} onChange={handleRegisterChange} />
            <select name="standard" value={registerData.standard} onChange={handleRegisterChange}>
              <option value="">Select Standard</option>
              <option value="VIII">VIII</option>
              <option value="IX">IX</option>
              <option value="X">X</option>
            </select>
            <div className="batch-code">
              <label>
                <input type="checkbox" value="Science-maths" checked={registerData.batchCode.includes('Science-maths')} onChange={handleBatchCodeChange} />
                Science-maths
              </label>
              <label>
                <input type="checkbox" value="Hindi" checked={registerData.batchCode.includes('Hindi')} onChange={handleBatchCodeChange} />
                Hindi
              </label>
              <label>
                <input type="checkbox" value="English" checked={registerData.batchCode.includes('English')} onChange={handleBatchCodeChange} />
                English
              </label>
              <label>
                <input type="checkbox" value="Social Studies" checked={registerData.batchCode.includes('Social Studies')} onChange={handleBatchCodeChange} />
                Social Studies
              </label>
            </div>
            <button type="submit">Register</button>
          </form>
          <button onClick={handleFlip}>Switch to Login</button>
        </div>
        <div className="card-back">
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <input type="text" name="username" placeholder="Username" value={loginData.username} onChange={handleLoginChange} />
            <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} />
            <button type="submit">Login</button>
          </form>
          <button onClick={handleFlip}>Switch to Register</button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
