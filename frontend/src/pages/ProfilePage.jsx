import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { dedupedToast } from '../utils/toast';
import { User, Save, Key, Trash2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // Profile form
  const profileForm = useForm({
    defaultValues: {
      name:  user?.name || '',
      email: user?.email || ''
    }
  });

  // Password form
  const passwordForm = useForm();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfileData(response);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const onUpdateProfile = async (data) => {
    setLoading(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        dedupedToast.success('Profile updated successfully!');
      }
    } catch (error) {
      dedupedToast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onUpdatePassword = async (data) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/updatepassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        dedupedToast.success('Password updated successfully!');
        passwordForm.reset();
      } else {
        const error = await response.json();
        dedupedToast.error(error.message || 'Failed to update password');
      }
    } catch (error) {
      dedupedToast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'password', name: 'Password', icon: Key },
    { id: 'danger', name: 'Danger Zone', icon: Trash2 },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors
                      ${activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
                <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
                  <div>
                    <label className="form-label">Full Name : </label>
                    <input
                      type="text"
                      className="input-field"
                      {...profileForm.register('name', { required: 'Name is required' })}
                    />
                    {profileForm.formState.errors.name && (
                      <p className="form-error">{profileForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label"> Email Address : </label>
                    <input
                      type="email"
                      className="input-field"
                      {...profileForm.register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="form-error">{profileForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {loading ? <LoadingSpinner size="small" /> : <Save className="h-4 w-4" />}
                    <span>Save Changes</span>
                  </button>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
                <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-6">
                  <div>
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="input-field"
                      {...passwordForm.register('currentPassword', { 
                        required: 'Current password is required' 
                      })}
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="form-error">{passwordForm.formState.errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="input-field"
                      {...passwordForm.register('newPassword', { 
                        required: 'New password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="form-error">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {loading ? <LoadingSpinner size="small" /> : <Key className="h-4 w-4" />}
                    <span>Update Password</span>
                  </button>
                </form>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <div className="card border-red-200">
                <h2 className="text-lg font-semibold text-red-900 mb-6">Danger Zone</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-base font-medium text-red-900 mb-2">Delete Account</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        {profileData?.stats && (
          <div className="mt-8 card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{profileData.stats.totalProblems}</p>
                <p className="text-sm text-gray-600">Total Problems</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{profileData.stats.totalEasy}</p>
                <p className="text-sm text-gray-600">Easy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{profileData.stats.totalMedium}</p>
                <p className="text-sm text-gray-600">Medium</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{profileData.stats.totalHard}</p>
                <p className="text-sm text-gray-600">Hard</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;