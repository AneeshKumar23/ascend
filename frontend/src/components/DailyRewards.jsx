import React, { useState, useEffect } from 'react';
import { Gift, X, Star } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import confetti from 'canvas-confetti';

function DailyRewards({ onClose }) {
  const { progress, claimDailyReward, showNotification } = useProgress();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [reward, setReward] = useState(null);

  const rewards = [
    { type: 'coins', amount: 50, icon: '🪙', label: '50 Coins' },
    { type: 'doubleXP', amount: 1, icon: '⚡', label: 'Double XP' },
    { type: 'streakProtection', amount: 1, icon: '🛡️', label: 'Streak Shield' },
    { type: 'focusBoost', amount: 1, icon: '🎯', label: 'Focus Boost' },
    { type: 'coins', amount: 100, icon: '🪙', label: '100 Coins' },
    { type: 'xp', amount: 500, icon: '✨', label: '500 XP' },
  ];

  const canClaim = () => {
    if (!progress.lastSpinTime) return true;
    const lastSpin = new Date(progress.lastSpinTime);
    const now = new Date();
    return now.getDate() !== lastSpin.getDate();
  };

  const handleSpin = () => {
    if (!canClaim()) return;

    setIsSpinning(true);
    const spins = 5 + Math.random() * 5;
    const newRotation = rotation + (spins * 360);
    setRotation(newRotation);

    setTimeout(() => {
      const reward = claimDailyReward();
      setReward(reward);
      setIsSpinning(false);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      showNotification(
        `You won ${reward.amount} ${reward.type}!`,
        'reward',
        reward.type === 'xp' ? reward.amount : 0,
        reward.type === 'coins' ? reward.amount : 0
      );
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Gift className="mr-2 text-purple-500" />
            Daily Rewards
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="relative aspect-square mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500 overflow-hidden">
            <div
              className="w-full h-full transition-transform duration-3000 ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
                backgroundImage: 'conic-gradient(from 0deg, #4c1d95, #7c3aed, #8b5cf6, #4c1d95)'
              }}
            >
              {rewards.map((reward, index) => (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `rotate(${index * 60}deg) translateY(-45%)`
                  }}
                >
                  <div className="text-2xl transform -rotate-90">{reward.icon}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <button
              onClick={handleSpin}
              disabled={isSpinning || !canClaim()}
              className={`w-full h-full rounded-full flex items-center justify-center font-bold text-white
                ${(isSpinning || !canClaim()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'}`}
            >
              {isSpinning ? (
                <Star className="animate-spin" size={24} />
              ) : (
                canClaim() ? 'SPIN!' : 'Tomorrow'
              )}
            </button>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-2">Possible Rewards</h3>
          <div className="grid grid-cols-2 gap-4">
            {rewards.map((reward, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3 flex items-center space-x-2">
                <div className="text-2xl">{reward.icon}</div>
                <span className="text-sm text-gray-300">{reward.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyRewards;