import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { updateUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Settings.css'; // Add appropriate CSS for the modal and other styling

const Settings = () => {
  const navigate = useNavigate();
  const username = Cookies.get('username'); // Ensure this is correctly retrieving the username
  const [userData, setUserData] = useState({
    email: '',
    phone: '',
    standard: '',
    batchCode: [],
  });
  const [modifiedFields, setModifiedFields] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Fetch the user data and populate the state (optional, if needed)
    // This step assumes you have an endpoint to fetch user data based on the username
    // fetchUserData(username).then(data => setUserData(data));
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setModifiedFields({ ...modifiedFields, [name]: true });
  };

  const handleBatchCodeChange = (e) => {
    const { value, checked } = e.target;
    let updatedBatchCode;
    if (checked) {
      updatedBatchCode = [...userData.batchCode, value];
    } else {
      updatedBatchCode = userData.batchCode.filter((code) => code !== value);
    }
    setUserData({ ...userData, batchCode: updatedBatchCode });
    setModifiedFields({ ...modifiedFields, batchCode: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    const updatedData = {};
    for (const field in modifiedFields) {
      if (modifiedFields[field]) {
        updatedData[field] = userData[field];
      }
    }
    console.log('Updating user with data:', { username, ...updatedData, oldPassword: password });
    try {
      const response = await updateUser(username, { ...updatedData, oldPassword: password });
      console.log('User info updated successfully', response.data);
      if (response.data.standard) {
        Cookies.set('standard', response.data.standard);
      }
      if (response.data.batchCode) {
        Cookies.set('batchCode', response.data.batchCode.join(',')); // Assuming response.data.batchCode is an array
      }
      setShowPasswordModal(false);
      navigate('/home');
    } catch (error) {
      console.error('Error updating user info:', error.response ? error.response.data : error.message);
      alert('Error updating user info: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div>
      <div className="settings-container">
        <h2>Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
            />
            {modifiedFields.email && <span className="tick-mark">✔</span>}
          </div>
          <div className="form-group">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={userData.phone}
              onChange={handleChange}
            />
            {modifiedFields.phone && <span className="tick-mark">✔</span>}
          </div>
          <div className="form-group">
            <select name="standard" value={userData.standard} onChange={handleChange}>
              <option value="">Select Standard</option>
              <option value="VIII">VIII</option>
              <option value="IX">IX</option>
              <option value="X">X</option>
            </select>
            {modifiedFields.standard && <span className="tick-mark">✔</span>}
          </div>
          <div className="form-group batch-code">
            <label>
              <input
                type="checkbox"
                value="Science-maths"
                checked={userData.batchCode.includes('Science-maths')}
                onChange={handleBatchCodeChange}
              />
              Science-maths
            </label>
            <label>
              <input
                type="checkbox"
                value="Hindi"
                checked={userData.batchCode.includes('Hindi')}
                onChange={handleBatchCodeChange}
              />
              Hindi
            </label>
            <label>
              <input
                type="checkbox"
                value="English"
                checked={userData.batchCode.includes('English')}
                onChange={handleBatchCodeChange}
              />
              English
            </label>
            <label>
              <input
                type="checkbox"
                value="Social Studies"
                checked={userData.batchCode.includes('Social Studies')}
                onChange={handleBatchCodeChange}
              />
              Social Studies
            </label>
            {modifiedFields.batchCode && <span className="tick-mark">✔</span>}
          </div>
          <button type="submit">Update</button>
        </form>
        {showPasswordModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Enter Password</h3>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button onClick={handlePasswordSubmit}>Submit</button>
              <button onClick={() => setShowPasswordModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
