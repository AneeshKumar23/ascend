import React from 'react';
import { Star, Award, Shield, DollarSign, Unlock, Lock, X } from 'lucide-react';

const PremiumPage = ({ onClose }) => {
  const plans = [
    {
      title: 'Free Plan',
      price: 'Free',
      features: [
        'Basic Task Management',
        'Limited to 5 Projects',
        'Community Support',
        'Standard Analytics',
      ],
      icon: <Lock size={40} className="text-gray-500" />,
      buttonLabel: 'Continue Free',
      buttonClass: 'bg-gray-700 hover:bg-gray-600 text-white',
    },
    {
      title: 'Premium Plan',
      price: '₹99/month',
      features: [
        'Unlimited Projects',
        'Advanced Task Management',
        'Priority Support',
        'Custom Themes',
        'Enhanced Analytics',
        'Exclusive Content',
      ],
      icon: <Unlock size={40} className="text-purple-500" />,
      buttonLabel: 'Go Premium',
      buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
  ];

  return (
    <div className="relative bg-gray-800 rounded-2xl max-w-4xl w-full mx-auto overflow-hidden shadow-xl max-h-[90vh] overflow-y-auto">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
      >
        <X size={28} />
      </button>

      <div className="p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            Upgrade Your Experience
            <Star className="inline-block ml-2 text-yellow-400" size={32} />
          </h1>
          <p className="text-gray-400 text-lg">
            Unlock premium features and supercharge your productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gray-700 rounded-xl p-6 ${
                plan.title === 'Premium Plan' 
                  ? 'ring-2 ring-purple-500 scale-[1.02]' 
                  : 'opacity-90 hover:opacity-100'
              } transition-all`}
            >
              <div className="flex justify-center mb-4">{plan.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{plan.title}</h2>
              <p className="text-3xl font-bold text-white mb-4">{plan.price}</p>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-gray-300">
                    <Star size={18} className="flex-shrink-0 mt-1 mr-2 text-yellow-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.buttonClass}`}
              >
                {plan.buttonLabel}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-750 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Why Go Premium?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Award size={48} className="text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Premium Features
              </h3>
              <p className="text-gray-400">
                Access exclusive tools and customization options
              </p>
            </div>
            <div className="text-center">
              <Shield size={48} className="text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Priority Support
              </h3>
              <p className="text-gray-400">
                24/7 support with guaranteed response time
              </p>
            </div>
            <div className="text-center">
              <DollarSign size={48} className="text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Amazing Value
              </h3>
              <p className="text-gray-400">
                Just ₹3.30/day - less than a cup of chai!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white underline text-lg"
          >
            Continue with Free Version
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;