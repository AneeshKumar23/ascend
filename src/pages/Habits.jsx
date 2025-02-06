import React, { useState } from 'react';
import { Clock, Bell, Trash2, Plus, Edit2 } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

function Habits() {
  const { updateProgress, showNotification } = useProgress();
  const [habits, setHabits] = useState([
    { id: 1, title: 'Morning Meditation', time: '07:00', streak: 7, reminder: true, priority: 'high' },
    { id: 2, title: 'Read', time: '20:00', streak: 15, reminder: false, priority: 'medium' },
    { id: 3, title: 'Exercise', time: '18:00', streak: 3, reminder: true, priority: 'low' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [newHabit, setNewHabit] = useState({ title: '', time: '', priority: 'medium' });

  const handleDelete = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleReminder = (id) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, reminder: !habit.reminder } : habit
    ));
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setNewHabit({
      title: habit.title,
      time: habit.time,
      priority: habit.priority
    });
    setShowAddModal(true);
  };

  const handleSaveHabit = (e) => {
    e.preventDefault();
    if (newHabit.title && newHabit.time) {
      if (editingHabit) {
        setHabits(habits.map(habit =>
          habit.id === editingHabit.id
            ? { ...habit, ...newHabit }
            : habit
        ));
      } else {
        setHabits([
          ...habits,
          {
            id: Date.now(),
            ...newHabit,
            streak: 0,
            reminder: false
          }
        ]);
      }
      setNewHabit({ title: '', time: '', priority: 'medium' });
      setEditingHabit(null);
      setShowAddModal(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const sortedHabits = [...habits].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="min-h-screen bg-gray-900 pb-32 p-4">
      <h1 className="text-2xl font-bold text-white mb-6">My Habits</h1>
      
      <div className="space-y-4">
        {sortedHabits.map((habit) => (
          <div key={habit.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-medium text-white">{habit.title}</h3>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock size={16} className="mr-1" />
                    <span>{habit.time}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    habit.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    habit.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {habit.priority.charAt(0).toUpperCase() + habit.priority.slice(1)} Priority
                  </span>
                  <span className="text-purple-400">🔥 {habit.streak} day streak</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  className={`p-2 ${habit.reminder ? 'text-purple-500' : 'text-gray-400'} hover:text-purple-500`}
                  onClick={() => toggleReminder(habit.id)}
                >
                  <Bell size={20} />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-purple-500"
                  onClick={() => handleEditHabit(habit)}
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  className="p-2 text-gray-400 hover:text-red-500"
                  onClick={() => handleDelete(habit.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setEditingHabit(null);
          setNewHabit({ title: '', time: '', priority: 'medium' });
          setShowAddModal(true);
        }}
        className="fixed bottom-20 right-4 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-200"
      >
        <Plus size={24} />
      </button>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingHabit ? 'Edit Habit' : 'Add New Habit'}
            </h2>
            <form onSubmit={handleSaveHabit}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Habit Name</label>
                  <input
                    type="text"
                    value={newHabit.title}
                    onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 mt-1 text-white"
                    placeholder="Enter habit name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Priority</label>
                  <select
                    value={newHabit.priority}
                    onChange={(e) => setNewHabit({ ...newHabit, priority: e.target.value })}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 mt-1 text-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Time</label>
                  <input
                    type="time"
                    value={newHabit.time}
                    onChange={(e) => setNewHabit({ ...newHabit, time: e.target.value })}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 mt-1 text-white"
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingHabit(null);
                    setNewHabit({ title: '', time: '', priority: 'medium' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingHabit ? 'Save Changes' : 'Add Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Habits;