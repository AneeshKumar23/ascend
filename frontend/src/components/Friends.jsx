import React, { useState } from 'react';
import { UserPlus, Star, UserMinus, Search, X } from 'lucide-react';

function Friends({ onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState([
    {
      id: '1',
      name: 'Alex Kim',
      level: 25,
      xp: 12500,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150',
      starred: true,
      progress: {
        tasks: 150,
        habits: 45,
        goals: 12
      }
    },
    {
      id: '2',
      name: 'Emma Wilson',
      level: 18,
      xp: 8900,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150',
      starred: false,
      progress: {
        tasks: 89,
        habits: 30,
        goals: 8
      }
    },
    {
      id: '3',
      name: 'Tom Chen',
      level: 15,
      xp: 7200,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150',
      starred: false,
      progress: {
        tasks: 65,
        habits: 25,
        goals: 5
      }
    },
  ]);

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const toggleStar = (id) => {
    setFriends(friends.map(friend =>
      friend.id === id ? { ...friend, starred: !friend.starred } : friend
    ));
  };

  const removeFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id));
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Friends</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="text-white font-medium">{friend.name}</h3>
                      <p className="text-gray-400 text-sm">
                        Level {friend.level} • {friend.xp.toLocaleString()} XP
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleStar(friend.id)}
                      className={`p-2 rounded-lg ${
                        friend.starred ? 'text-yellow-400' : 'text-gray-400'
                      } hover:bg-gray-600`}
                    >
                      <Star size={20} />
                    </button>
                    <button
                      onClick={() => removeFriend(friend.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-600"
                    >
                      <UserMinus size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="bg-gray-800 p-2 rounded-lg text-center">
                    <p className="text-purple-400 font-bold">{friend.progress.tasks}</p>
                    <p className="text-gray-400 text-sm">Tasks</p>
                  </div>
                  <div className="bg-gray-800 p-2 rounded-lg text-center">
                    <p className="text-purple-400 font-bold">{friend.progress.habits}</p>
                    <p className="text-gray-400 text-sm">Habits</p>
                  </div>
                  <div className="bg-gray-800 p-2 rounded-lg text-center">
                    <p className="text-purple-400 font-bold">{friend.progress.goals}</p>
                    <p className="text-gray-400 text-sm">Goals</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowAddFriend(true)}
            className="mt-4 w-full bg-purple-600 text-white p-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors"
          >
            <UserPlus size={20} />
            <span>Add New Friend</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Friends;