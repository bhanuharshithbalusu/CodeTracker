import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';

const ProgressChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progress Over Time</h3>
          <TrendingUp className="h-6 w-6 text-gray-400" />
        </div>
        <div className="h-80 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <Info className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-2">No Progress Data Yet</p>
            <p className="text-sm text-gray-500 max-w-sm">
              Progress tracking starts when you refresh your statistics. 
              Come back after solving more problems to see your growth over time!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Transform data for chart
  const chartData = [];
  const platforms = Object.keys(data);
  
  // Get all unique dates
  const allDates = new Set();
  platforms.forEach(platform => {
    data[platform].forEach(entry => {
      allDates.add(new Date(entry.date).toISOString().split('T')[0]);
    });
  });

  const sortedDates = Array.from(allDates).sort();

  // Create chart data points
  sortedDates.forEach(date => {
    const dataPoint = { date };
    
    platforms.forEach(platform => {
      const entry = data[platform].find(e => 
        new Date(e.date).toISOString().split('T')[0] === date
      );
      dataPoint[platform] = entry ? entry.totalSolved : 0;
    });
    
    chartData.push(dataPoint);
  });

  const colors = {
    leetcode: '#FFA116',
    codeforces: '#1F8ACB',
    codechef: '#5B4638',
    w3schools: '#04AA6D'
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Progress Over Time</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{sortedDates.length} data points</span>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            <Legend />
            {platforms.map(platform => (
              <Line
                key={platform}
                type="monotone"
                dataKey={platform}
                stroke={colors[platform] || '#8884d8'}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;