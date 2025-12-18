import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import StatCard from '../components/dashboard/StatCard';
import PlatformStats from '../components/dashboard/PlatformStats';
import { dedupedToast } from '../utils/toast';
import { 
  RefreshCw, 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  Settings,
  CheckCircle,
  Flame
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Loading dashboard data...');
      
      const statsResponse = await userAPI.getStats();
      console.log('Stats response:', statsResponse);
      
      setStats(statsResponse);
      console.log('Stats set in state');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      dedupedToast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };



  const handleRefreshStats = async () => {
    try {
      setRefreshing(true);
      console.log('Starting stats refresh...');
      
      const refreshResult = await userAPI.refreshStats();
      console.log('Refresh result:', refreshResult);
      
      await loadDashboardData();
      console.log('Dashboard data reloaded');
      
      dedupedToast.success('Statistics refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing stats:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      const message = error.response?.data?.message || 'Failed to refresh statistics';
      dedupedToast.error(message);
    } finally {
      setRefreshing(false);
    }
  };

  const hasConfiguredPlatforms = user?.platforms && Object.values(user.platforms).some(username => username && username.trim());

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  if (!hasConfiguredPlatforms) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Platforms Configured
          </h3>
          <p className="text-gray-600 mb-6">
            Add your platform usernames to start tracking your coding progress.
          </p>
          <a
            href="/profile"
            className="btn-primary"
          >
            Configure Platforms
          </a>
        </div>
      </Layout>
    );
  }

  const { aggregated, platforms } = stats || {};

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
            
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-200 text-sm font-medium">Live Stats</span>
                </div>
                <h1 className="text-4xl font-bold">
                  Welcome back, {user?.name?.split(' ')[0] || 'Developer'}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Here's your coding journey across all platforms
                </p>
              </div>
              
              <div className="flex flex-col sm:items-end space-y-3">
                <button
                  onClick={handleRefreshStats}
                  disabled={refreshing}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
                >
                  <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{refreshing ? 'Refreshing...' : 'Refresh Stats'}</span>
                </button>
                
                {stats?.lastUpdated && (
                  <span className="text-blue-200 text-sm">
                    Last updated: {new Date(stats.lastUpdated).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          {aggregated && (
            <div className="space-y-6">
              {/* Section Header */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Progress Overview</h2>
                <p className="text-gray-600">Track your coding achievements across all platforms</p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Problems"
                  value={aggregated.totalProblems}
                  icon={Target}
                  color="blue"
                />
                <StatCard
                  title="Easy Problems"
                  value={aggregated.totalEasy}
                  icon={CheckCircle}
                  color="green"
                />
                <StatCard
                  title="Medium Problems"
                  value={aggregated.totalMedium}
                  icon={Award}
                  color="yellow"
                />
                <StatCard
                  title="Hard Problems"
                  value={aggregated.totalHard}
                  icon={Flame}
                  color="red"
                />
              </div>
              
              {/* Real Data Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-600 font-medium text-sm">Easy to Total Ratio</p>
                      <p className="text-2xl font-bold text-emerald-900">
                        {aggregated.totalProblems > 0 ? Math.round((aggregated.totalEasy / aggregated.totalProblems) * 100) : 0}%
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 font-medium text-sm">Hard Problems</p>
                      <p className="text-2xl font-bold text-orange-900">{aggregated.totalHard}</p>
                      <p className="text-xs text-orange-600">
                        {aggregated.totalProblems > 0 ? Math.round((aggregated.totalHard / aggregated.totalProblems) * 100) : 0}% of total
                      </p>
                    </div>
                    <Flame className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 font-medium text-sm">Active Platforms</p>
                      <p className="text-2xl font-bold text-blue-900">{platforms?.length || 0}</p>
                      <p className="text-xs text-blue-600">
                        {platforms?.map(p => p.platform).join(', ') || 'None'}
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Platform Stats */}
          {platforms && platforms.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <PlatformStats platforms={platforms} />
            </div>
          )}

          {/* Platform Details */}
          {platforms && platforms.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Platform Details</h2>
              <div className="platform-grid">
                {platforms.map((platform) => (
                  <div key={platform.platform} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {platform.platform}
                      </h3>
                      <span className={`platform-badge platform-${platform.platform}`}>
                        @{platform.username}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Total Solved</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {platform.stats.totalSolved}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Rating</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {platform.stats.rating || 'N/A'}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700 mb-1">Easy</p>
                        <p className="text-lg font-semibold text-green-600">
                          {platform.stats.easySolved}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-700 mb-1">Medium</p>
                        <p className="text-lg font-semibold text-yellow-600">
                          {platform.stats.mediumSolved}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700 mb-1">Hard</p>
                        <p className="text-lg font-semibold text-red-600">
                          {platform.stats.hardSolved}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-700 mb-1">Contests</p>
                        <p className="text-lg font-semibold text-purple-600">
                          {platform.stats.contestsParticipated || 0}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Last updated: {new Date(platform.lastFetched).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity placeholder */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Recent activity tracking coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;