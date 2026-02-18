import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import AppLayout from '../components/AppLayout';
import { Loader2, CheckCircle, AlertCircle, User, Lock } from 'lucide-react';

export default function Settings() {
    const { user, refreshUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
    const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMsg({ type: '', text: '' });
        try {
            await api.put('/user/profile', { name });
            await refreshUser();
            setProfileMsg({ type: 'success', text: 'Profile updated successfully' });
        } catch (err) {
            setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters' });
            return;
        }
        setPasswordLoading(true);
        setPasswordMsg({ type: '', text: '' });
        try {
            await api.put('/user/password', { currentPassword, newPassword });
            setCurrentPassword('');
            setNewPassword('');
            setPasswordMsg({ type: 'success', text: 'Password changed successfully' });
        } catch (err) {
            setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Password change failed' });
        } finally {
            setPasswordLoading(false);
        }
    };

    const MessageBox = ({ msg }) => {
        if (!msg.text) return null;
        const isError = msg.type === 'error';
        return (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${isError ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                }`}>
                {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                {msg.text}
            </div>
        );
    };

    return (
        <AppLayout>
            <div className="max-w-2xl space-y-8 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your account and preferences.</p>
                </div>

                {/* Profile Section */}
                <div className="card p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <User className="w-4 h-4 text-slate-600" />
                        </div>
                        <h2 className="text-base font-semibold text-slate-800">Profile</h2>
                    </div>
                    <MessageBox msg={profileMsg} />
                    <form onSubmit={handleProfileUpdate} className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                            <input
                                type="text"
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                className="input-field bg-slate-50 cursor-not-allowed"
                                value={user?.email || ''}
                                disabled
                            />
                            <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={profileLoading} className="btn-primary text-sm flex items-center gap-2">
                                {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Section */}
                <div className="card p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Lock className="w-4 h-4 text-slate-600" />
                        </div>
                        <h2 className="text-base font-semibold text-slate-800">Change Password</h2>
                    </div>
                    <MessageBox msg={passwordMsg} />
                    <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="At least 6 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={passwordLoading} className="btn-primary text-sm flex items-center gap-2">
                                {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>

                {/* Account Info */}
                <div className="card p-6">
                    <h2 className="text-base font-semibold text-slate-800 mb-3">Account Info</h2>
                    <div className="text-sm text-slate-500 space-y-1">
                        <p>Member since: {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
                        <p>Connected platforms: {user?.connectedPlatforms || 0}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
