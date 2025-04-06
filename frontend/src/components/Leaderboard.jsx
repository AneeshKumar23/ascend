import React, { useState } from 'react';
import { Trophy, Users, Medal, Star } from 'lucide-react';

function Leaderboard({ onClose }) {
  const [view, setView] = useState('global'); // 'global' or 'friends'
  
  const globalLeaders = [
    { id: '1', name: 'Sarah Chen', xp: 15000, rank: 1, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150' },
    { id: '2', name: 'Alex Kim', xp: 12500, rank: 2, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150' },
    { id: '3', name: 'Maria Garcia', xp: 10800, rank: 3, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150' },
    { id: '4', name: 'David Park', xp: 9500, rank: 4, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150' },
    { id: '5', name: 'Emma Wilson', xp: 8900, rank: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150' },
  ];

  const friendLeaders = [
    { id: '2', name: 'Alex Kim', xp: 12500, rank: 1, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150' },
    { id: '5', name: 'Emma Wilson', xp: 8900, rank: 2, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150' },
    { id: '7', name: 'Tom Chen', xp: 7200, rank: 3, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150' },
  ];

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-500';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-gray-500 font-bold">{rank}</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setView('global')}
              className={`flex-1 py-2 px-4 rounded-lg ${
                view === 'global'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              <Trophy className="inline-block w-4 h-4 mr-2" />
              Global
            </button>
            <button
              onClick={() => setView('friends')}
              className={`flex-1 py-2 px-4 rounded-lg ${
                view === 'friends'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              <Users className="inline-block w-4 h-4 mr-2" />
              Friends
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {(view === 'global' ? globalLeaders : friendLeaders).map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-4 bg-gray-700 p-3 rounded-lg"
              >
                <div className="flex-shrink-0 w-12 flex items-center justify-center">
                  {getRankIcon(user.rank)}
                </div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-white font-medium">{user.name}</h3>
                  <p className="text-gray-400 text-sm">ID: {user.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-400 font-bold">{user.xp.toLocaleString()} XP</p>
                  <p className={`text-sm ${getRankColor(user.rank)}`}>
                    Rank #{user.rank}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;