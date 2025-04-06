import React from 'react';
import { ShoppingBag, X, Coins } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

function Shop({ onClose }) {
  const { progress, addItem } = useProgress();

  const items = [
    {
      id: 'doubleXP',
      name: 'Double XP Boost',
      description: 'Double all XP earned for 24 hours',
      price: 100,
      icon: '⚡'
    },
    {
      id: 'streakProtection',
      name: 'Streak Shield',
      description: 'Protect your streak for one missed day',
      price: 150,
      icon: '🛡️'
    },
    {
      id: 'focusBoost',
      name: 'Focus Boost',
      description: 'Earn 50% more XP during focus sessions',
      price: 200,
      icon: '🎯'
    }
  ];

  const handlePurchase = (item) => {
    if (progress.coins >= item.price) {
      addItem(item.id);
      // Update coins in progress context
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingBag className="text-purple-500 mr-2" size={24} />
              <h2 className="text-xl font-bold text-white">Power-Up Shop</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-yellow-400">
                <Coins size={20} className="mr-1" />
                <span>{progress.coins}</span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={progress.coins < item.price}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    progress.coins >= item.price
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Coins size={16} className="text-yellow-400" />
                  <span>{item.price}</span>
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Owned: {progress.inventory[item.id] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;