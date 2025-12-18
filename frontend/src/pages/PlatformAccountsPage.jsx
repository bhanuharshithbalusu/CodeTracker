import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { dedupedToast } from '../utils/toast';
import { 
  Plus,
  Edit3,
  Check,
  X,
  Loader,
  ExternalLink,
  Users,
  Globe,
  Award,
  Code
} from 'lucide-react';

const PlatformAccountsPage = () => {
  const { user, updateUser } = useAuth();
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [platformValues, setPlatformValues] = useState({});
  const [saving, setSaving] = useState(false);

  const platforms = [
    { 
      key: 'leetcode', 
      name: 'LeetCode', 
      color: 'bg-orange-500',
      description: 'Practice coding problems and improve algorithmic thinking',
      url: 'https://leetcode.com/',
      icon: Code
    },
    { 
      key: 'codeforces', 
      name: 'Codeforces', 
      color: 'bg-blue-500',
      description: 'Competitive programming contests and problem solving',
      url: 'https://codeforces.com/',
      icon: Award
    },
    { 
      key: 'codechef', 
      name: 'CodeChef', 
      color: 'bg-yellow-500',
      description: 'Competitive programming platform with contests',
      url: 'https://www.codechef.com/',
      icon: Users
    },
    { 
      key: 'w3schools', 
      name: 'W3Schools', 
      color: 'bg-green-500',
      description: 'Learn web technologies and programming basics',
      url: 'https://www.w3schools.com/',
      icon: Globe
    },
  ];

  const handleEditPlatform = (platform) => {
    setEditingPlatform(platform);
    setPlatformValues({
      ...platformValues,
      [platform]: user?.platforms?.[platform] || ''
    });
  };

  const handleSavePlatform = async (platform) => {
    try {
      setSaving(true);
      const newPlatforms = {
        ...user.platforms,
        [platform]: platformValues[platform] || ''
      };

      await userAPI.updatePlatforms({ platforms: newPlatforms });
      updateUser({ ...user, platforms: newPlatforms });
      setEditingPlatform(null);
      dedupedToast.success(`${platforms.find(p => p.key === platform)?.name} username updated!`);
    } catch (error) {
      console.error('Error updating platform:', error);
      dedupedToast.error('Failed to update platform');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (platform, value) => {
    setPlatformValues({
      ...platformValues,
      [platform]: value
    });
  };

  const handleCancelEdit = () => {
    setEditingPlatform(null);
    setPlatformValues({});
  };

  const handleKeyPress = (e, platform) => {
    if (e.key === 'Enter') {
      handleSavePlatform(platform);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const connectedPlatforms = platforms.filter(platform => 
    user?.platforms?.[platform.key]?.trim()
  ).length;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Platform Accounts
              </h1>
              <p className="text-gray-600">
                Connect your coding platform accounts to track your progress across all platforms
              </p>
            </div>
            
            <div className="flex items-center mt-4 lg:mt-0">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-blue-700">
                  {connectedPlatforms} of {platforms.length} platforms connected
                </span>
              </div>
            </div>
          </div>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((platform) => {
              const isEditing = editingPlatform === platform.key;
              const currentValue = user?.platforms?.[platform.key] || '';
              const hasValue = currentValue.trim() !== '';
              const Icon = platform.icon;

              return (
                <div key={platform.key} className="card relative overflow-hidden">
                  {/* Platform Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`h-12 w-12 rounded-lg ${platform.color} flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 ${hasValue ? platform.color : 'bg-gray-300'} rounded-full`}></div>
                          <span className="text-sm text-gray-600">
                            {hasValue ? 'Connected' : 'Not connected'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title={`Visit ${platform.name}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Platform Description */}
                  <p className="text-sm text-gray-600 mb-4">{platform.description}</p>

                  {/* Username Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Username</label>
                    
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={platformValues[platform.key] || ''}
                          onChange={(e) => handleInputChange(platform.key, e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, platform.key)}
                          placeholder="Enter your username"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSavePlatform(platform.key)}
                          disabled={saving}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Save"
                        >
                          {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          {hasValue ? (
                            <>
                              <span className="text-gray-900 font-medium">@{currentValue}</span>
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                Active
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-500 italic">No username set</span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleEditPlatform(platform.key)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title={hasValue ? 'Edit username' : 'Add username'}
                        >
                          {hasValue ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </button>
                      </div>
                    )}

                    {hasValue && !isEditing && (
                      <div className="text-xs text-gray-500">
                        Last updated: {new Date().toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Help Section */}
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">?</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">How to find your username</h3>
                <p className="text-sm text-blue-700">
                  Your username is typically found in your profile URL on each platform. For example, 
                  on LeetCode it's <code className="bg-blue-100 px-1 rounded">leetcode.com/u/your-username</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlatformAccountsPage;
