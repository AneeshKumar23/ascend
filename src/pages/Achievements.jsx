import React, { useContext, useState, useEffect } from 'react';
import { Trophy, Lock } from 'lucide-react';
import { ProgressContext } from '../context/ProgressContext';

function Achievements() {
  const { progress, updateProgress, showNotification } = useContext(ProgressContext);
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'Early Bird',
      description: 'Complete morning routine for 7 days straight',
      progress: 0,
      completed: false,
      icon: '🌅',
      xpReward: 100,
      requirement: 7,
    },
    {
      id: 2,
      title: 'Bookworm',
      description: 'Read for 30 minutes every day for 14 days',
      progress: 0,
      completed: false,
      icon: '📚',
      xpReward: 200,
      requirement: 14,
    },
    {
      id: 3,
      title: 'Fitness Fanatic',
      description: 'Exercise 20 times in a month',
      progress: 0,
      completed: false,
      icon: '💪',
      xpReward: 300,
      requirement: 20,
    },
    {
      id: 4,
      title: 'Zen Master',
      description: 'Meditate for 100 days',
      progress: 0,
      locked: true,
      icon: '🧘',
      xpReward: 1000,
      requirement: 100,
      requiredLevel: 5,
    },
  ]);

  useEffect(() => {
    // Check if achievements should be unlocked based on level
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.locked && achievement.requiredLevel && progress.level >= achievement.requiredLevel) {
        return { ...achievement, locked: false };
      }
      return achievement;
    });
    setAchievements(updatedAchievements);
  }, [progress.level]);

  const updateAchievementProgress = (achievementId, newProgress) => {
    setAchievements(achievements.map(achievement => {
      if (achievement.id === achievementId) {
        const updatedProgress = Math.min(newProgress, achievement.requirement);
        const completed = updatedProgress >= achievement.requirement;
        
        // Award XP if newly completed
        if (completed && !achievement.completed) {
          updateProgress('Achievements', achievement.xpReward);
          showNotification(`Achievement Unlocked: ${achievement.title}!`, 'achievement', achievement.xpReward);
        }
        
        return {
          ...achievement,
          progress: updatedProgress,
          completed
        };
      }
      return achievement;
    }));
  };

  // Demo function to simulate progress (remove in production)
  const simulateProgress = (achievementId) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.locked && !achievement.completed) {
      updateAchievementProgress(achievementId, achievement.progress + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-16 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Achievements</h1>
        <div className="flex items-center">
          <Trophy className="text-purple-500 mr-2" />
          <span className="text-white font-bold">
            {achievements.filter(a => a.completed).length}/{achievements.length}
          </span>
        </div>
      </div>
      
      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-gray-800 rounded-lg p-4 ${
              achievement.locked ? 'opacity-50' : ''
            }`}
            onClick={() => simulateProgress(achievement.id)}
          >
            <div className="flex items-start">
              <div className="text-3xl mr-4">{achievement.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">
                    {achievement.title}
                  </h3>
                  {achievement.locked ? (
                    <div className="flex items-center text-gray-500">
                      <Lock size={16} className="mr-1" />
                      <span className="text-sm">Level {achievement.requiredLevel}</span>
                    </div>
                  ) : achievement.completed ? (
                    <span className="text-purple-500 text-sm">+{achievement.xpReward} XP</span>
                  ) : null}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {achievement.description}
                </p>
                {!achievement.locked && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-sm text-gray-400">
                      <span>{achievement.progress} / {achievement.requirement}</span>
                      <span>{Math.round((achievement.progress / achievement.requirement) * 100)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;