import axios from 'axios';

export const registerUser = async (userData) => {
  const response = await axios.post('/api/auth/register', userData);
  return response;
};

export const loginUser = async (userData) => {
  const response = await axios.post('/api/auth/login', userData);
  return response;
};

export const updateUser = async (username, userData) => {
  const response = await axios.post('/api/auth/update', { username, ...userData });
  return response;
};
