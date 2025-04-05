import React, { createContext, useState, useContext } from 'react';

export const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({
    level: 1,
    xp: 0,
    achievements: 0,
    streak: 0,
    coins: 0,
    totalTasksCompleted: 0,
    totalHabitsCompleted: 0,
    totalGoalsCompleted: 0,
    inventory: {
      doubleXP: 0,
      streakProtection: 0,
      focusBoost: 0
    },
    activeTheme: 'default',
    unlockedThemes: ['default'],
    dailyRewardClaimed: false,
    lastSpinTime: null
  });

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
    xp: 0,
    coins: 0
  });

  const calculateLevel = (xp) => {
    return Math.floor(xp / 1000) + 1;
  };

  const updateProgress = (type, xp = 0, coins = 0) => {
    setProgress(prev => {
      const newXP = prev.xp + xp;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > prev.level;
      const newCoins = prev.coins + coins;

      if (leveledUp) {
        setNotification({
          show: true,
          message: `Level Up! You're now level ${newLevel}!`,
          type: 'level',
          xp: 0,
          coins: 100 // Bonus coins for leveling up
        });
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        coins: newCoins,
        [`total${type}Completed`]: prev[`total${type}Completed`] + 1
      };
    });
  };

  const useItem = (itemType) => {
    setProgress(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [itemType]: Math.max(0, prev.inventory[itemType] - 1)
      }
    }));
  };

  const addItem = (itemType, quantity = 1) => {
    setProgress(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [itemType]: (prev.inventory[itemType] || 0) + quantity
      }
    }));
  };

  const unlockTheme = (themeName) => {
    setProgress(prev => ({
      ...prev,
      unlockedThemes: [...prev.unlockedThemes, themeName]
    }));
  };

  const setActiveTheme = (themeName) => {
    setProgress(prev => ({
      ...prev,
      activeTheme: themeName
    }));
  };

  const claimDailyReward = () => {
    const rewards = [
      { type: 'coins', amount: 50 },
      { type: 'doubleXP', amount: 1 },
      { type: 'streakProtection', amount: 1 },
      { type: 'focusBoost', amount: 1 },
      { type: 'coins', amount: 100 },
      { type: 'xp', amount: 500 }
    ];

    const randomIndex = Math.floor(Math.random() * rewards.length);
    const reward = rewards[randomIndex];

    setProgress(prev => {
      const newState = { ...prev, dailyRewardClaimed: true, lastSpinTime: new Date().toISOString() };

      if (reward.type === 'coins') {
        newState.coins += reward.amount;
      } else if (reward.type === 'xp') {
        newState.xp += reward.amount;
      } else {
        newState.inventory[reward.type] = (prev.inventory[reward.type] || 0) + reward.amount;
      }

      return newState;
    });

    return reward;
  };

  const showNotification = (message, type, xp = 0, coins = 0) => {
    setNotification({
      show: true,
      message,
      type,
      xp,
      coins
    });
  };

  const hideNotification = () => {
    setNotification({
      show: false,
      message: '',
      type: '',
      xp: 0,
      coins: 0
    });
  };

  return (
    <ProgressContext.Provider 
      value={{ 
        progress, 
        updateProgress, 
        notification,
        showNotification,
        hideNotification,
        useItem,
        addItem,
        unlockTheme,
        setActiveTheme,
        claimDailyReward
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);