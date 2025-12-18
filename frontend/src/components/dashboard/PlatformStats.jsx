import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon, Info } from 'lucide-react';

const PlatformStats = ({ platforms }) => {
  if (!platforms || platforms.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Platform Distribution</h3>
          <PieChartIcon className="h-6 w-6 text-gray-400" />
        </div>
        <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <Info className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-2">No Platform Data</p>
            <p className="text-sm text-gray-500">
              Configure your platform accounts to see distribution
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for pie chart
  const pieData = platforms.map(platform => ({
    name: platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1),
    value: platform.stats.totalSolved,
    color: getPlatformColor(platform.platform)
  }));

  // Filter out platforms with 0 problems solved
  const filteredData = pieData.filter(item => item.value > 0);

  if (filteredData.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Platform Distribution</h3>
          <PieChartIcon className="h-6 w-6 text-gray-400" />
        </div>
        <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center">
            <Info className="h-8 w-8 text-yellow-500" />
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-2">No Problems Solved Yet</p>
            <p className="text-sm text-gray-500">
              Start solving problems to see your progress distribution
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Platform Distribution</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredData.length} platforms</span>
          <PieChartIcon className="h-5 w-5 text-blue-500" />
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} problems`, 'Solved']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Platform summary */}
      <div className="mt-4 space-y-2">
        {platforms.map(platform => (
          <div key={platform.platform} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getPlatformColor(platform.platform) }}
              ></div>
              <span className="capitalize">{platform.platform}</span>
            </div>
            <span className="font-medium">{platform.stats.totalSolved}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const getPlatformColor = (platform) => {
  const colors = {
    leetcode: '#FFA116',
    codeforces: '#1F8ACB', 
    codechef: '#5B4638',
    w3schools: '#04AA6D'
  };
  return colors[platform] || '#8884d8';
};

export default PlatformStats;