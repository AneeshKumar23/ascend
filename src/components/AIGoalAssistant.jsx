import React, { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';

function AIGoalAssistant({ onSelectGoal, onClose }) {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "hello! I'm your Goal Assistant. I can help you set meaningful goals. What area would you like to focus on? (e.g., Health, Career, Learning, Personal)",
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleGoalSelect = (suggestion) => {
    setSelectedGoal(suggestion);
    onSelectGoal(suggestion);
  };

  const simulateAIResponse = async (userMessage) => {
    setIsThinking(true);
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let response;
    if (userMessage.toLowerCase().includes('health')) {
      response = {
        type: 'bot',
        content: "Here's a suggested health goal:\n\nRun 5K in Under 30 Minutes\n\nMilestones:\n1. Run 1K without stopping\n2. Run 2K under 15 minutes\n3. Run 3K under 20 minutes\n4. Run 4K under 25 minutes\n5. Achieve 5K under 30 minutes\n\nWould you like to use this goal?",
        suggestion: {
          title: "Run 5K in Under 30 Minutes",
          deadline: "2024-06-01",
          milestones: [
            "Run 1K without stopping",
            "Run 2K under 15 minutes",
            "Run 3K under 20 minutes",
            "Run 4K under 25 minutes",
            "Achieve 5K under 30 minutes"
          ]
        }
      };
    } else if (userMessage.toLowerCase().includes('career')) {
      response = {
        type: 'bot',
        content: "Here's a suggested career goal:\n\nMaster a New Programming Language\n\nMilestones:\n1. Complete basic syntax course\n2. Build a small project\n3. Complete advanced concepts\n4. Build a complex application\n5. Contribute to an open source project\n\nWould you like to use this goal?",
        suggestion: {
          title: "Master a New Programming Language",
          deadline: "2024-08-01",
          milestones: [
            "Complete basic syntax course",
            "Build a small project",
            "Complete advanced concepts",
            "Build a complex application",
            "Contribute to an open source project"
          ]
        }
      };
    } else {
      response = {
        type: 'bot',
        content: "Could you tell me more specifically what kind of goal you're interested in? For example: health, career, learning, or personal development?"
      };
    }
    
    setMessages(prev => [...prev, { type: 'user', content: userMessage }, response]);
    setIsThinking(false);
    return response;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userInput = input;
    setInput('');
    
    const response = await simulateAIResponse(userInput);
    if (response.suggestion) {
      onSelectGoal(response.suggestion);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            <Bot className="text-purple-500 mr-2" size={24} />
            <h2 className="text-xl font-bold text-white">Goal Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                {message.suggestion && !selectedGoal && (
                  <button
                    onClick={() => handleGoalSelect(message.suggestion)}
                    className="mt-3 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors w-full"
                  >
                    Use This Goal
                  </button>
                )}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 rounded-lg p-3">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSend}
              className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIGoalAssistant;