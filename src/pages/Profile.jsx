import React, { useContext, useState } from 'react';
import { Settings, LogOut, Award, Star, Activity, Bell, Moon, User, Mail, Camera } from 'lucide-react';
import { UserContext } from '../App';
import { ProgressContext } from '../context/ProgressContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const { progress } = useContext(ProgressContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    notifications: user?.preferences?.notifications || true,
    theme: user?.preferences?.theme || 'dark'
  });

  const stats = [
    { icon: <Award size={20} />, label: 'Level', value: progress.level },
    { icon: <Star size={20} />, label: 'Total XP', value: progress.xp },
    { icon: <Activity size={20} />, label: 'Tasks Done', value: progress.totalTasksCompleted || 0 },
  ];

  const achievements = [
    { title: 'Early Bird', progress: 70 },
    { title: 'Consistency King', progress: 45 },
    { title: 'Goal Crusher', progress: 90 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      username: editData.username,
      email: editData.email,
      preferences: {
        ...user.preferences,
        notifications: editData.notifications,
        theme: editData.theme
      }
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-20 p-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <img
              src={user?.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-purple-500"
            />
            <button className="absolute bottom-0 right-0 bg-purple-500 rounded-full p-2">
              <Camera size={16} className="text-white" />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">{user?.username}</h1>
          <p className="text-gray-400">Member since {new Date(user?.dateJoined).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-purple-500 flex justify-center mb-2">
                {stat.icon}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {isEditing ? (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Username</label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({...editData, username: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white mt-1"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gray-800 text-white p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="flex items-center">
                <User size={20} className="mr-3" />
                Edit Profile
              </span>
              <Settings size={20} />
            </button>

            <button className="w-full bg-gray-800 text-white p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors duration-200">
              <span className="flex items-center">
                <Bell size={20} className="mr-3" />
                Notifications
              </span>
              <span className="text-purple-500">On</span>
            </button>

            <button className="w-full bg-gray-800 text-white p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors duration-200">
              <span className="flex items-center">
                <Moon size={20} className="mr-3" />
                Theme
              </span>
              <span className="text-purple-500">Dark</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-gray-800 text-red-500 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="flex items-center">
                <LogOut size={20} className="mr-3" />
                Log Out
              </span>
            </button>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Recent Achievements</h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">{achievement.title}</span>
                  <span className="text-purple-500">{achievement.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile