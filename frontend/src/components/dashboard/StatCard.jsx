import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue', 
  change, 
  changeType 
}) => {
  const colorClasses = {
    blue: {
      card: 'from-blue-500 to-blue-600',
      icon: 'bg-blue-100 text-blue-700',
      accent: 'bg-blue-50'
    },
    green: {
      card: 'from-green-500 to-green-600', 
      icon: 'bg-green-100 text-green-700',
      accent: 'bg-green-50'
    },
    yellow: {
      card: 'from-yellow-500 to-orange-500',
      icon: 'bg-yellow-100 text-yellow-700', 
      accent: 'bg-yellow-50'
    },
    red: {
      card: 'from-red-500 to-red-600',
      icon: 'bg-red-100 text-red-700',
      accent: 'bg-red-50'
    },
    purple: {
      card: 'from-purple-500 to-purple-600',
      icon: 'bg-purple-100 text-purple-700',
      accent: 'bg-purple-50'
    },
  };

  const changeClasses = {
    increase: 'text-emerald-600 bg-emerald-50',
    decrease: 'text-red-600 bg-red-50', 
    neutral: 'text-gray-600 bg-gray-50',
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color].card} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        </div>
        <div className={`flex-shrink-0 p-3 rounded-xl ${colorClasses[color].icon} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Value */}
      <div className="mb-4">
        <p className="text-4xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
          {value?.toLocaleString() || '0'}
        </p>
      </div>

      {/* Change Indicator */}
      {change && (
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${changeClasses[changeType]}`}>
            {changeType === 'increase' ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : changeType === 'decrease' ? (
              <TrendingDown className="h-4 w-4 mr-1" />
            ) : (
              <span className="w-4 h-4 mr-1 flex items-center justify-center">→</span>
            )}
            <span>{change}</span>
          </div>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      )}

      {/* Decorative Element */}
      <div className={`absolute -bottom-1 -right-1 w-20 h-20 ${colorClasses[color].accent} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
    </div>
  );
};

export default StatCard;