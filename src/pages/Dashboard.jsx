import React, { useContext, useState } from "react";
import {
  Target,
  Trophy,
  Flame,
  Users,
  Timer,
  Gift,
  ShoppingBag,
  Sword,
  Shield,
  Coins,
  MoreHorizontal,
  MessageCircle, // Add this line
} from "lucide-react";

import { UserContext } from "../App";
import { useProgress } from "../context/ProgressContext";
import Leaderboard from "../components/Leaderboard";
import Friends from "../components/Friends";
import FocusTimer from "../components/FocusTimer";
import DailyRewards from "../components/DailyRewards";
import Shop from "../components/Shop";
import CongratulationsPopup from "../components/CongratulationsPopup";

function Dashboard() {
  const { user } = useContext(UserContext);
  const { progress, updateProgress } = useProgress();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [congratsPopup, setCongratsPopup] = useState({
    show: false,
    message: "",
    type: "",
    xp: 0,
  });
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Morning Meditation",
      completed: false,
      xp: 50,
      priority: "high",
    },
    {
      id: 2,
      title: "Read 30 minutes",
      completed: false,
      xp: 30,
      priority: "medium",
    },
    { id: 3, title: "Workout", completed: false, xp: 40, priority: "high" },
  ]);

  const level = Math.floor(progress.xp / 1000) + 1;
  const currentLevelXP = progress.xp % 1000;
  const nextLevelXP = 1000;
  const levelProgress = (currentLevelXP / nextLevelXP) * 100;

  const handleTaskToggle = (taskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId && !task.completed) {
          const multiplier = progress.inventory.doubleXP > 0 ? 2 : 1;
          const earnedXP = task.xp * multiplier;
          const earnedCoins = Math.floor(task.xp / 2);
          updateProgress("Tasks", earnedXP, earnedCoins);

          setCongratsPopup({
            show: true,
            message: `You've completed "${task.title}"!`,
            type: "task",
            xp: earnedXP,
          });

          return { ...task, completed: true };
        }
        return task;
      })
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 pb-32">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>

      <div className="relative">
        {/* Character Stats Card */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-lg m-0">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar}
              alt="Character"
              className="w-16 h-16 rounded-full border-4 border-purple-500"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {user?.username}
                </h2>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-yellow-400">
                    <Coins size={16} className="mr-1" />
                    <span>{progress.coins}</span>
                  </div>
                  <button
                    onClick={() => setShowShop(true)}
                    className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700"
                  >
                    <ShoppingBag size={16} className="text-white" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Sword size={16} />
                <span>Level {level}</span>
                <Shield size={16} className="ml-2" />
                <span>{progress.xp} XP</span>
              </div>
              {/* Level Progress Bar */}
              <div className="mt-2">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>Level {level}</span>
                  <span>
                    {currentLevelXP}/{nextLevelXP} XP
                  </span>
                  <span>Level {level + 1}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
            <div className="p-3 bg-purple-500 bg-opacity-20 rounded-lg">
              <Trophy className="text-purple-500" size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-400">Achievements</div>
              <div className="text-lg font-bold text-white">
                {progress.achievements}
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
            <div className="p-3 bg-yellow-500 bg-opacity-20 rounded-lg">
              <Flame className="text-yellow-500" size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-400">Day Streak</div>
              <div className="text-lg font-bold text-white">
                {progress.streak}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="px-4 pb-32">
          <h2 className="text-xl font-bold text-white mb-4">Today's Quests</h2>
          <div className="space-y-3">
            {tasks
              .sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map((task) => (
                <div
                  key={task.id}
                  className={`bg-gray-800 rounded-lg p-4 flex items-center justify-between transition-all duration-200 ${
                    task.completed ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskToggle(task.id)}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="ml-3 flex-1">
                      <span
                        className={`${
                          task.completed
                            ? "text-gray-400 line-through"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="flex items-center mt-1">
                        <span
                          className={`text-sm ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}{" "}
                          Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-purple-400 text-sm">
                      +{task.xp} XP
                    </span>
                    {progress.inventory.doubleXP > 0 && (
                      <span className="text-yellow-400 text-sm">2x</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* More Menu Button */}
        <div className="fixed bottom-24 right-4">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <MoreHorizontal size={24} />
          </button>
          {/* Floating Action Menu */}
          {showMoreMenu && (
            <div className="absolute bottom-16 right-0 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
              <div className="space-y-3">
                {/* Daily Rewards Button */}
                <button
                  onClick={() => {
                    setShowDailyRewards(true);
                    setShowMoreMenu(false);
                  }}
                  className="w-12 h-12 bg-yellow-600 text-white rounded-xl shadow-lg hover:bg-yellow-700 transition-colors duration-200 flex items-center justify-center group relative"
                >
                  <Gift size={24} />
                  <span className="absolute right-full mr-2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Daily Rewards
                  </span>
                </button>
                {/* Focus Timer Button */}
                <button
                  onClick={() => {
                    setShowFocusTimer(true);
                    setShowMoreMenu(false);
                  }}
                  className="w-12 h-12 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center group relative"
                >
                  <Timer size={24} />
                  <span className="absolute right-full mr-2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Focus Timer
                  </span>
                </button>
                {/* Leaderboard Button */}
                <button
                  onClick={() => {
                    setShowLeaderboard(true);
                    setShowMoreMenu(false);
                  }}
                  className="w-12 h-12 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center group relative"
                >
                  <Trophy size={24} />
                  <span className="absolute right-full mr-2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Leaderboard
                  </span>
                </button>
                {/* Friends Button */}
                <button
                  onClick={() => {
                    setShowFriends(true);
                    setShowMoreMenu(false);
                  }}
                  className="w-12 h-12 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center group relative"
                >
                  <Users size={24} />
                  <span className="absolute right-full mr-2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Friends
                  </span>
                </button>
                {/* Discord Button */}
                <button
                  onClick={() =>
                    window.open("https://discord.gg/WSbJErZa3Z", "_blank")
                  }
                  className="w-12 h-12 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center group relative"
                >
                  <MessageCircle size={24} /> {/* Use the valid icon */}
                  <span className="absolute right-full mr-2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Join Discord
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {showLeaderboard && (
          <Leaderboard onClose={() => setShowLeaderboard(false)} />
        )}
        {showFriends && <Friends onClose={() => setShowFriends(false)} />}
        {showFocusTimer && (
          <FocusTimer onClose={() => setShowFocusTimer(false)} />
        )}
        {showDailyRewards && (
          <DailyRewards onClose={() => setShowDailyRewards(false)} />
        )}
        {showShop && <Shop onClose={() => setShowShop(false)} />}

        {/* Congratulations Popup */}
        <CongratulationsPopup
          show={congratsPopup.show}
          message={congratsPopup.message}
          type={congratsPopup.type}
          xp={congratsPopup.xp}
          onClose={() => setCongratsPopup({ ...congratsPopup, show: false })}
        />
      </div>
    </div>
  );
}

export default Dashboard;
