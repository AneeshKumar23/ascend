import React, { useState, useContext, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Plus,
  Bot,
  ChevronDown,
  ChevronRight,
  Edit2,
} from "lucide-react";
import { ProgressContext } from "../context/ProgressContext";
import AIGoalAssistant from "../components/AIGoalAssistant";

function Goals() {
  const { updateProgress, showNotification } = useContext(ProgressContext);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetch("/goals.json")
      .then((response) => response.json())
      .then((data) => setGoals(data))
      .catch((error) => console.error("Error fetching goals:", error));
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [expandedMilestones, setExpandedMilestones] = useState({});
  const [newGoal, setNewGoal] = useState({
    title: "",
    deadline: "",
    priority: "medium",
    milestones: [
      {
        title: "",
        subtasks: [""],
      },
    ],
  });

  const toggleMilestoneExpand = (goalId, milestoneId) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [`${goalId}-${milestoneId}`]: !prev[`${goalId}-${milestoneId}`],
    }));
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      deadline: goal.deadline,
      priority: goal.priority,
      milestones: goal.milestones.map((m) => ({
        title: m.title,
        subtasks: m.subtasks.map((st) => st.title),
      })),
    });
    setShowAddModal(true);
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (
      newGoal.title &&
      newGoal.deadline &&
      newGoal.milestones.every((m) => m.title)
    ) {
      const goalObj = {
        id: editingGoal ? editingGoal.id : Date.now(),
        title: newGoal.title,
        deadline: newGoal.deadline,
        priority: newGoal.priority || "medium",
        progress: editingGoal ? editingGoal.progress : 0,
        xp: 1000,
        milestones: newGoal.milestones.map((milestone, index) => ({
          id: index + 1,
          title: milestone.title,
          completed: editingGoal
            ? editingGoal.milestones[index]?.completed || false
            : false,
          xp: Math.floor(1000 / newGoal.milestones.length),
          subtasks: milestone.subtasks.map((subtask, stIndex) => ({
            id: stIndex + 1,
            title: subtask,
            completed: editingGoal
              ? editingGoal.milestones[index]?.subtasks[stIndex]?.completed ||
                false
              : false,
          })),
        })),
      };

      setGoals((prev) => {
        if (editingGoal) {
          return prev.map((g) => (g.id === goalObj.id ? goalObj : g));
        }
        return [...prev, goalObj];
      });

      setNewGoal({
        title: "",
        deadline: "",
        priority: "medium",
        milestones: [{ title: "", subtasks: [""] }],
      });
      setEditingGoal(null);
      setShowAddModal(false);
    }
  };

  const toggleSubtask = (goalId, milestoneId, subtaskId) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map((milestone) => {
            if (milestone.id === milestoneId) {
              const updatedSubtasks = milestone.subtasks.map((subtask) => {
                if (subtask.id === subtaskId) {
                  return { ...subtask, completed: !subtask.completed };
                }
                return subtask;
              });

              // Check if all subtasks are completed
              const allSubtasksCompleted = updatedSubtasks.every(
                (st) => st.completed
              );
              if (allSubtasksCompleted && !milestone.completed) {
                updateProgress("Goals", milestone.xp);
                showNotification(
                  `Milestone completed: ${milestone.title}`,
                  "goal",
                  milestone.xp
                );
              }

              return {
                ...milestone,
                completed: allSubtasksCompleted,
                subtasks: updatedSubtasks,
              };
            }
            return milestone;
          });

          const completedMilestones = updatedMilestones.filter(
            (m) => m.completed
          ).length;
          const progress = Math.round(
            (completedMilestones / updatedMilestones.length) * 100
          );

          if (progress === 100) {
            updateProgress("Goals", goal.xp);
            showNotification(`Goal completed: ${goal.title}`, "goal", goal.xp);
          }

          return {
            ...goal,
            milestones: updatedMilestones,
            progress,
          };
        }
        return goal;
      })
    );
  };

  const addMilestone = () => {
    setNewGoal((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { title: "", subtasks: [""] }],
    }));
  };

  const addSubtask = (milestoneIndex) => {
    setNewGoal((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m, idx) => {
        if (idx === milestoneIndex) {
          return {
            ...m,
            subtasks: [...m.subtasks, ""],
          };
        }
        return m;
      }),
    }));
  };

  useEffect(() => {
    fetch("/goals.json")
      .then((response) => response.json())
      .then((data) => setGoals(data))
      .catch((error) => console.error("Error fetching habits:", error));
  }, []);

  const handleAIGoalSelect = (suggestion) => {
    const newGoalObj = {
      id: Date.now(),
      title: suggestion.title,
      deadline: suggestion.deadline,
      progress: 0,
      xp: 1000,
      priority: "medium",
      milestones: suggestion.milestones.map((title, index) => ({
        id: index + 1,
        title,
        completed: false,
        xp: Math.floor(1000 / suggestion.milestones.length),
        subtasks: [
          { id: 1, title: "Plan approach", completed: false },
          { id: 2, title: "Execute plan", completed: false },
        ],
      })),
    };

    setShowAIAssistant(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-32 p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Goals</h1>

      <div className="space-y-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-white">{goal.title}</h3>
                <div className="flex items-center text-gray-400 text-sm mt-1">
                  <CalendarIcon size={16} className="mr-1" />
                  <span>{goal.deadline}</span>
                  <span
                    className={`ml-3 px-2 py-0.5 rounded-full text-xs ${
                      goal.priority === "high"
                        ? "bg-red-500/20 text-red-400"
                        : goal.priority === "medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {goal.priority.charAt(0).toUpperCase() +
                      goal.priority.slice(1)}{" "}
                    Priority
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleEditGoal(goal)}
                className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
              >
                <Edit2 size={20} />
              </button>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-purple-600 rounded-full h-2 transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
              />
            </div>

            <div className="space-y-2">
              {goal.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="bg-gray-700/50 rounded-lg p-2"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleMilestoneExpand(goal.id, milestone.id)}
                  >
                    <div className="flex items-center flex-1">
                      {milestone.completed ? (
                        <CheckCircle2
                          size={16}
                          className="text-purple-500 mr-2 flex-shrink-0"
                        />
                      ) : (
                        <Circle
                          size={16}
                          className="text-gray-500 mr-2 flex-shrink-0"
                        />
                      )}
                      <span
                        className={
                          milestone.completed ? "text-gray-400" : "text-white"
                        }
                      >
                        {milestone.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-purple-400 text-sm">
                        +{milestone.xp} XP
                      </span>
                      {expandedMilestones[`${goal.id}-${milestone.id}`] ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {expandedMilestones[`${goal.id}-${milestone.id}`] && (
                    <div className="mt-2 ml-6 space-y-1">
                      {milestone.subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-center text-sm cursor-pointer hover:bg-gray-700 p-1 rounded"
                          onClick={() =>
                            toggleSubtask(goal.id, milestone.id, subtask.id)
                          }
                        >
                          {subtask.completed ? (
                            <CheckCircle2
                              size={14}
                              className="text-purple-500 mr-2"
                            />
                          ) : (
                            <Circle size={14} className="text-gray-500 mr-2" />
                          )}
                          <span
                            className={
                              subtask.completed
                                ? "text-gray-400"
                                : "text-gray-300"
                            }
                          >
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <span className="text-purple-400 text-sm">
                Goal completion: +{goal.xp} XP
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 right-4 space-y-4">
        <button
          onClick={() => setShowAIAssistant(true)}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <Bot size={24} />
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <Plus size={24} />
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingGoal ? "Edit Goal" : "Add New Goal"}
            </h2>
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowAIAssistant(true);
                }}
                className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
              >
                <Bot size={20} />
                <span>Ask AI Assistant</span>
              </button>
            </div>
            <form onSubmit={handleSaveGoal}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, title: e.target.value })
                    }
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 mt-1 text-white"
                    placeholder="Enter goal title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Priority
                  </label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, priority: e.target.value })
                    }
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 mt-1 text-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, deadline: e.target.value })
                    }
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 mt-1 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Milestones
                  </label>
                  {newGoal.milestones.map((milestone, mIndex) => (
                    <div
                      key={mIndex}
                      className="mt-2 p-3 bg-gray-700 rounded-lg"
                    >
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => {
                          const updatedMilestones = [...newGoal.milestones];
                          updatedMilestones[mIndex].title = e.target.value;
                          setNewGoal({
                            ...newGoal,
                            milestones: updatedMilestones,
                          });
                        }}
                        className="w-full bg-gray-600 rounded-lg px-4 py-2 text-white"
                        placeholder={`Milestone ${mIndex + 1}`}
                      />
                      <div className="mt-2 ml-4">
                        <label className="text-sm font-medium text-gray-300">
                          Subtasks
                        </label>
                        {milestone.subtasks.map((subtask, stIndex) => (
                          <input
                            key={stIndex}
                            type="text"
                            value={subtask}
                            onChange={(e) => {
                              const updatedMilestones = [...newGoal.milestones];
                              updatedMilestones[mIndex].subtasks[stIndex] =
                                e.target.value;
                              setNewGoal({
                                ...newGoal,
                                milestones: updatedMilestones,
                              });
                            }}
                            className="w-full bg-gray-600 rounded-lg px-4 py-2 mt-2 text-white"
                            placeholder={`Subtask ${stIndex + 1}`}
                          />
                        ))}
                        <button
                          type="button"
                          onClick={() => addSubtask(mIndex)}
                          className="mt-2 text-purple-500 text-sm hover:text-purple-400"
                        >
                          + Add Subtask
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="mt-2 text-purple-500 text-sm hover:text-purple-400"
                  >
                    + Add Another Milestone
                  </button>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingGoal(null);
                    setNewGoal({
                      title: "",
                      deadline: "",
                      priority: "medium",
                      milestones: [{ title: "", subtasks: [""] }],
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingGoal ? "Save Changes" : "Add Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAIAssistant && (
        <AIGoalAssistant
          onSelectGoal={handleAIGoalSelect}
          onClose={() => setShowAIAssistant(false)}
        />
      )}
    </div>
  );
}

export default Goals;
