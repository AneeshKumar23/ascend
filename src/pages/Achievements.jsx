import React, { useContext, useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { ProgressContext } from "../context/ProgressContext";

const LOCAL_STORAGE_KEY = "achievementsProgress";

function Achievements() {
  const { progress, updateProgress, showNotification } =
    useContext(ProgressContext);
  const [achievements, setAchievements] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);

  useEffect(() => {
    fetch("/achievements.json")
      .then((response) => response.json())
      .then((data) => {
        setAllAchievements(data);
        loadAchievements(data);
      })
      .catch((error) => console.error("Error loading achievements:", error));
  }, []);

  const loadAchievements = (data) => {
    const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedProgress) {
      setAchievements(JSON.parse(savedProgress));
    } else {
      setAchievements(data.slice(0, 7));
    }
  };

  const saveAchievements = (updatedAchievements) => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(updatedAchievements)
    );
  };

  const updateAchievementProgress = (achievementId, newProgress) => {
    setAchievements((prev) => {
      const updatedAchievements = prev.map((achievement) => {
        if (achievement.id === achievementId) {
          const updatedProgress = Math.min(
            newProgress,
            achievement.requirement
          );
          const completed = updatedProgress >= achievement.requirement;

          if (completed && !achievement.completed) {
            updateProgress("Achievements", achievement.xpReward);
            showNotification(
              `Achievement Unlocked: ${achievement.title}!`,
              "achievement",
              achievement.xpReward
            );
          }

          return { ...achievement, progress: updatedProgress, completed };
        }
        return achievement;
      });

      saveAchievements(updatedAchievements);
      return updatedAchievements;
    });

    checkAndReplaceAchievement(achievementId);
  };

  const checkAndReplaceAchievement = (achievementId) => {
    setAchievements((prev) => {
      const completedAchievement = prev.find((a) => a.id === achievementId);
      if (!completedAchievement || !completedAchievement.completed) return prev;

      const newAchievement = allAchievements.find(
        (a) =>
          a.category === completedAchievement.category &&
          !prev.some((p) => p.id === a.id)
      );

      let updatedAchievements;
      if (newAchievement) {
        updatedAchievements = prev.map((a) =>
          a.id === achievementId ? newAchievement : a
        );
      } else {
        updatedAchievements = prev.filter((a) => a.id !== achievementId);
      }

      saveAchievements(updatedAchievements);
      return updatedAchievements;
    });
  };

  const simulateProgress = (achievementId) => {
    const achievement = achievements.find((a) => a.id === achievementId);
    if (achievement && !achievement.completed) {
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
            {achievements.filter((a) => a.completed).length}/
            {achievements.length}
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-gray-800 rounded-lg p-4 ${
              achievement.completed ? "opacity-50" : ""
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
                  {achievement.completed ? (
                    <span className="text-purple-500 text-sm">
                      +{achievement.xpReward} XP
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {achievement.description}
                </p>
                {!achievement.completed && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 rounded-full h-2 transition-all duration-300"
                        style={{
                          width: `${
                            (achievement.progress / achievement.requirement) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-sm text-gray-400">
                      <span>
                        {achievement.progress} / {achievement.requirement}
                      </span>
                      <span>
                        {Math.round(
                          (achievement.progress / achievement.requirement) * 100
                        )}
                        %
                      </span>
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
