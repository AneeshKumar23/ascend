import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Camera, User, Mail, Lock } from 'lucide-react';
import { UserContext } from '../App';

function Signup() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: 'https://images.unsplash.com/photo-1570303345338-e1f0eddf4946?auto=format&fit=crop&w=150&h=150'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        avatar: formData.avatar,
        dateJoined: new Date().toISOString(),
        preferences: {
          notifications: true,
          theme: 'dark'
        }
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <Gamepad2 className="mx-auto h-12 w-12 text-purple-500" />
          <h2 className="mt-6 text-3xl font-bold text-white">Join Ascend</h2>
          <p className="mt-2 text-sm text-gray-400">Begin your journey to greatness</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-purple-500"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-purple-500 rounded-full p-2"
                  onClick={() => {/* Add avatar selection logic */}}
                >
                  <Camera size={16} className="text-white" />
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                <User size={16} className="mr-2" />
                Username
              </label>
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                <Mail size={16} className="mr-2" />
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                <Lock size={16} className="mr-2" />
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                <Lock size={16} className="mr-2" />
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Create Account
          </button>

          <div className="text-center">
            <a
              href="/"
              className="text-purple-500 hover:text-purple-400 transition-colors duration-200"
            >
              Already have an account? Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup