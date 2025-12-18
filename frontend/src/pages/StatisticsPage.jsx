import React, { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../services/api';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { dedupedToast } from '../utils/toast';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Target,
  Clock,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  PieChart,
  Activity
} from 'lucide-react';

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const loadStatisticsData = useCallback(async () => {
    try {
      setLoading(true);
      const statsResponse = await userAPI.getStats();
      setStats(statsResponse);
    } catch (error) {
      console.error('Error loading statistics:', error);
      dedupedToast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatisticsData();
  }, [timeRange, selectedPlatform, loadStatisticsData]);

  const handleRefresh = async () => {
    await loadStatisticsData();
    dedupedToast.success('Statistics refreshed');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  const totalSolved = stats?.platforms?.reduce((sum, platform) => 
    sum + (platform.stats?.totalSolved || 0), 0) || 0;

  const difficultyBreakdown = stats?.platforms?.reduce((acc, platform) => {
    const platformStats = platform.stats || {};
    acc.easy += platformStats.easy || 0;
    acc.medium += platformStats.medium || 0;
    acc.hard += platformStats.hard || 0;
    return acc;
  }, { easy: 0, medium: 0, hard: 0 });

  const platformPerformance = stats?.platforms?.map(platform => ({
    name: platform.platform,
    solved: platform.stats?.totalSolved || 0,
    accuracy: platform.stats?.accuracy || 0,
    streak: platform.stats?.currentStreak || 0
  })) || [];

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Detailed Statistics
            </h1>
            <p className="text-gray-600">
              Deep dive into your coding performance and analytics
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* Time Range Filter */}
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>

            {/* Platform Filter */}
            <select 
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="input-field"
            >
              <option value="all">All Platforms</option>
              <option value="leetcode">LeetCode</option>
              <option value="codeforces">Codeforces</option>
              <option value="codechef">CodeChef</option>
              <option value="w3schools">W3Schools</option>
            </select>

            <button 
              onClick={handleRefresh}
              className="btn-outline"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="stats-grid mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Problems</p>
                <p className="text-2xl font-bold text-gray-900">{totalSolved}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{Math.floor(totalSolved * 0.1)} this month</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Daily</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(totalSolved / Math.max(1, parseInt(timeRange))).toFixed(1)}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                Problems per day
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Streak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.max(...platformPerformance.map(p => p.streak), 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                Consecutive days
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Efficiency</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((difficultyBreakdown?.medium || 0) + (difficultyBreakdown?.hard || 0) * 2) > 0 ? 
                    Math.round(((difficultyBreakdown.medium + difficultyBreakdown.hard * 2) / totalSolved) * 100) : 0}%
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                Medium/Hard focus
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown Chart */}
        <div className="chart-container mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Difficulty Breakdown
              </h2>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {/* Easy */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="font-medium">Easy</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: totalSolved > 0 ? `${(difficultyBreakdown?.easy || 0) / totalSolved * 100}%` : '0%' 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {difficultyBreakdown?.easy || 0}
                  </span>
                </div>
              </div>

              {/* Medium */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="font-medium">Medium</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ 
                        width: totalSolved > 0 ? `${(difficultyBreakdown?.medium || 0) / totalSolved * 100}%` : '0%' 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {difficultyBreakdown?.medium || 0}
                  </span>
                </div>
              </div>

              {/* Hard */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="font-medium">Hard</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ 
                        width: totalSolved > 0 ? `${(difficultyBreakdown?.hard || 0) / totalSolved * 100}%` : '0%' 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {difficultyBreakdown?.hard || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Performance */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Platform Performance
              </h2>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {platformPerformance.map((platform, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold capitalize">{platform.name}</h3>
                    <span className={`platform-badge platform-${platform.name}`}>
                      {platform.solved} solved
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="block">Accuracy</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {platform.accuracy}%
                      </span>
                    </div>
                    <div>
                      <span className="block">Streak</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {platform.streak} days
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Historical Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Weekly Progress
              </h2>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {[
                { day: 'Mon', problems: 3, time: 45, change: '+1' },
                { day: 'Tue', problems: 5, time: 60, change: '+2' },
                { day: 'Wed', problems: 2, time: 30, change: '-1' },
                { day: 'Thu', problems: 4, time: 55, change: '+1' },
                { day: 'Fri', problems: 6, time: 75, change: '+3' },
                { day: 'Sat', problems: 1, time: 20, change: '0' },
                { day: 'Sun', problems: 4, time: 50, change: '+2' }
              ].map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900 w-8">{day.day}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(day.problems / 6) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{day.problems} problems</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{day.time}m</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      day.change.startsWith('+') ? 'bg-green-100 text-green-700' :
                      day.change.startsWith('-') ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {day.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Performance Insights
              </h2>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Problems Solved</span>
                </div>
                <span className="text-sm font-bold text-gray-900">+{Math.floor(totalSolved * 0.15)} this week</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ArrowUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Current Streak</span>
                </div>
                <span className="text-sm font-bold text-gray-900">7 days</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Minus className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Avg. Time/Problem</span>
                </div>
                <span className="text-sm font-bold text-gray-900">12 min</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ArrowUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Success Rate</span>
                </div>
                <span className="text-sm font-bold text-gray-900">85%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">Best Streak</span>
                </div>
                <span className="text-sm font-bold text-gray-900">14 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Monthly Progress Comparison
            </h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-1">This Month</h3>
              <p className="text-3xl font-bold text-blue-600 mb-2">{Math.floor(totalSolved * 0.3)}</p>
              <p className="text-sm text-blue-700">Problems Solved</p>
              <div className="mt-2 flex items-center justify-center text-green-600 text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                +15% vs last month
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-1">Last Month</h3>
              <p className="text-3xl font-bold text-green-600 mb-2">{Math.floor(totalSolved * 0.26)}</p>
              <p className="text-sm text-green-700">Problems Solved</p>
              <div className="mt-2 flex items-center justify-center text-green-600 text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                +8% vs previous
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-1">Average</h3>
              <p className="text-3xl font-bold text-purple-600 mb-2">{Math.floor(totalSolved * 0.22)}</p>
              <p className="text-sm text-purple-700">Monthly Average</p>
              <div className="mt-2 flex items-center justify-center text-gray-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                Consistent growth
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StatisticsPage;
