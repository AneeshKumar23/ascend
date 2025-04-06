import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles } from 'lucide-react';

function ProgressPopup({ show, message, type, xp, onClose }) {
  useEffect(() => {
    if (show) {
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const icons = {
    task: <Star className="text-yellow-500" size={24} />,
    habit: <Sparkles className="text-purple-500" size={24} />,
    achievement: <Trophy className="text-yellow-500" size={24} />,
    goal: <Star className="text-blue-500" size={24} />
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-gray-800 border border-purple-500 rounded-lg p-6 shadow-lg animate-bounce-in">
        <div className="flex items-center space-x-3 mb-3">
          {icons[type]}
          <h3 className="text-xl font-bold text-white">Amazing!</h3>
        </div>
        <p className="text-gray-300 mb-2">{message}</p>
        {xp && (
          <p className="text-purple-400 font-semibold">
            +{xp} XP Earned!
          </p>
        )}
      </div>
    </div>
  );
}

export default ProgressPopup