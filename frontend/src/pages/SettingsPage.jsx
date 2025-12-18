import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { dedupedToast } from '../utils/toast';
import { 
  Settings,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Download,
  Trash2,
  Save,
  RefreshCw
} from 'lucide-react';

const SettingsPage = () => {
  const { user, loading } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      daily: true,
      weekly: true,
      achievements: true
    },
    privacy: {
      profilePublic: false,
      statsPublic: true,
      showProgress: true
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY'
    },
    data: {
      autoSync: true,
      syncFrequency: 'daily',
      backupEnabled: true
    }
  });
  
  const [saving, setSaving] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // In a real app, this would save to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      dedupedToast.success('Settings saved successfully');
    } catch (err) {
      console.error('Save settings error:', err);
      dedupedToast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    // Mock data export
    const data = {
      user: user,
      settings: settings,
      exported: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codetracker-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    dedupedToast.success('Data exported successfully');
  };

  const handleResetSettings = () => {
    setSettings({
      notifications: {
        email: true,
        push: false,
        daily: true,
        weekly: true,
        achievements: true
      },
      privacy: {
        profilePublic: false,
        statsPublic: true,
        showProgress: true
      },
      preferences: {
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY'
      },
      data: {
        autoSync: true,
        syncFrequency: 'daily',
        backupEnabled: true
      }
    });
    dedupedToast.success('Settings reset to defaults');
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

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Settings
            </h1>
            <p className="text-gray-600">
              Customize your CodeTracker experience
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button 
              onClick={handleResetSettings}
              className="btn-outline"
            >
              <RefreshCw className="h-4 w-4" />
              Reset to Defaults
            </button>
            <button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? (
                <LoadingSpinner />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Settings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                <a href="#notifications" className="flex items-center space-x-3 p-2 text-blue-600 bg-blue-50 rounded-lg">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </a>
                <a href="#privacy" className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5" />
                  <span>Privacy</span>
                </a>
                <a href="#preferences" className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Palette className="h-5 w-5" />
                  <span>Preferences</span>
                </a>
                <a href="#data" className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Database className="h-5 w-5" />
                  <span>Data & Sync</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notifications */}
            <div id="notifications" className="card">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.email}
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Daily Progress</h4>
                    <p className="text-sm text-gray-600">Daily summary of your progress</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.daily}
                      onChange={(e) => handleSettingChange('notifications', 'daily', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Weekly Report</h4>
                    <p className="text-sm text-gray-600">Weekly performance summary</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.weekly}
                      onChange={(e) => handleSettingChange('notifications', 'weekly', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Achievements</h4>
                    <p className="text-sm text-gray-600">Notifications for new achievements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.achievements}
                      onChange={(e) => handleSettingChange('notifications', 'achievements', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div id="privacy" className="card">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Privacy</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Public Profile</h4>
                    <p className="text-sm text-gray-600">Make your profile visible to others</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.privacy.profilePublic}
                      onChange={(e) => handleSettingChange('privacy', 'profilePublic', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Public Statistics</h4>
                    <p className="text-sm text-gray-600">Allow others to see your stats</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.privacy.statsPublic}
                      onChange={(e) => handleSettingChange('privacy', 'statsPublic', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div id="preferences" className="card">
              <div className="flex items-center space-x-3 mb-6">
                <Palette className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">Theme</label>
                  <select 
                    value={settings.preferences.theme}
                    onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                    className="input-field"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Language</label>
                  <select 
                    value={settings.preferences.language}
                    onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                    className="input-field"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Timezone</label>
                  <select 
                    value={settings.preferences.timezone}
                    onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                    className="input-field"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="GMT">GMT</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Data & Sync */}
            <div id="data" className="card">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">Data & Sync</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto Sync</h4>
                    <p className="text-sm text-gray-600">Automatically sync with platforms</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.data.autoSync}
                      onChange={(e) => handleSettingChange('data', 'autoSync', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="form-label">Sync Frequency</label>
                  <select 
                    value={settings.data.syncFrequency}
                    onChange={(e) => handleSettingChange('data', 'syncFrequency', e.target.value)}
                    className="input-field"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Data Management</h4>
                  <div className="space-y-3">
                    <button 
                      onClick={handleExportData}
                      className="btn-outline w-full justify-center"
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </button>
                    
                    <button 
                      onClick={() => dedupedToast.error('Account deletion not implemented')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-red-300 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
