import React, { useEffect } from 'react';
import { Trophy, Star, Quote } from 'lucide-react';
import confetti from 'canvas-confetti';

const motivationalQuotes = [
  "Success is not final, failure is not fatal: it's the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "It does not matter how slowly you go as long as you do not stop.",
  "The future depends on what you do today.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success is walking from failure to failure with no loss of enthusiasm.",
  "The only limit to our realization of tomorrow will be our doubts of today.",
];

function CongratulationsPopup({ show, message, type, xp, onClose }) {
  useEffect(() => {
    if (show) {
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const icons = {
    task: <Star className="text-yellow-500" size={32} />,
    habit: <Star className="text-purple-500" size={32} />,
    achievement: <Trophy className="text-yellow-500" size={32} />,
    goal: <Trophy className="text-blue-500" size={32} />
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="bg-gray-800 border-2 border-purple-500 rounded-lg p-8 shadow-xl max-w-md mx-4 relative animate-bounce-in">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-purple-600 rounded-full p-4">
          {icons[type]}
        </div>
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Amazing Work! 🎉</h3>
          <p className="text-gray-300 mb-4">{message}</p>
          {xp && (
            <p className="text-purple-400 font-semibold text-lg mb-4">
              +{xp} XP Earned!
            </p>
          )}
          <div className="bg-gray-700 rounded-lg p-4 mt-4">
            <Quote className="text-purple-400 mx-auto mb-2" size={24} />
            <p className="text-gray-300 italic">"{randomQuote}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CongratulationsPopup;