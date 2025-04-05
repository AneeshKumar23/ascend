import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, X, RotateCcw } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

function FocusTimer({ onClose }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(25);
  const { progress, updateProgress, useItem } = useProgress();
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            handleComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleComplete = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRunning(false);
    
    const baseXP = selectedTime * 2;
    const multiplier = progress.inventory.focusBoost > 0 ? 1.5 : 1;
    const earnedXP = Math.floor(baseXP * multiplier);
    
    if (progress.inventory.focusBoost > 0) {
      useItem('focusBoost');
    }
    
    updateProgress('Focus', earnedXP, Math.floor(earnedXP / 2));
    
    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification('Focus Session Complete!', {
        body: `Great job! You earned ${earnedXP} XP!`,
        icon: '/favicon.ico'
      });
    }
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(selectedTime * 60);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setTimer = (minutes) => {
    setSelectedTime(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Timer className="text-purple-500 mr-2" size={24} />
              <h2 className="text-xl font-bold text-white">Focus Timer</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <div className="text-7xl font-bold text-white mb-4 font-mono">
              {formatTime(timeLeft)}
            </div>
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setTimer(25)}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  selectedTime === 25 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                25min
              </button>
              <button
                onClick={() => setTimer(45)}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  selectedTime === 45 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                45min
              </button>
              <button
                onClick={() => setTimer(60)}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  selectedTime === 60 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                60min
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex-1 bg-purple-600 text-white py-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors"
            >
              {isRunning ? (
                <>
                  <Pause size={20} />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={20} />
                  <span>Start Focus</span>
                </>
              )}
            </button>
            <button
              onClick={resetTimer}
              className="w-14 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          {progress.inventory.focusBoost > 0 && (
            <div className="mt-4 text-center text-sm bg-purple-600 bg-opacity-20 text-purple-400 p-2 rounded-lg">
              🎯 Focus Boost Active: 50% more XP!
            </div>
          )}

          <div className="mt-4 text-center text-sm text-gray-400">
            Complete this session to earn {selectedTime * 2} XP
            {progress.inventory.focusBoost > 0 && ' (75% with Focus Boost)'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusTimer;