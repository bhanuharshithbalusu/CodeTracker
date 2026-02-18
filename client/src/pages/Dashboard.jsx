import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import PlatformCard from '../components/PlatformCard';
import ActivityHeatmap from '../components/ActivityHeatmap';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell
} from 'recharts';
import {
    Trophy, Flame, Target, PlusCircle, Loader2, RefreshCw,
    CheckCircle, XCircle, Clock
} from 'lucide-react';

const PLATFORMS = ['codeforces', 'leetcode', 'codechef'];
const PLATFORM_LABELS = { codeforces: 'Codeforces', leetcode: 'LeetCode', codechef: 'CodeChef' };
const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
    const { user, refreshUser } = useAuth();
    const [showConnect, setShowConnect] = useState(false);
    const [platform, setPlatform] = useState('codeforces');
    const [handle, setHandle] = useState('');
    const [connecting, setConnecting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const handleConnect = async (e) => {
        e.preventDefault();
        setError('');
        setConnecting(true);
        try {
            await api.post('/platform/connect', { platform, handle });
            await refreshUser();
            setHandle('');
            setShowConnect(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to connect');
        } finally {
            setConnecting(false);
        }
    };

    const handleDisconnect = async (plat) => {
        if (!confirm(`Disconnect ${PLATFORM_LABELS[plat]}?`)) return;
        try {
            await api.delete('/platform/disconnect', { data: { platform: plat } });
            await refreshUser();
        } catch (err) {
            alert('Failed to disconnect');
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await api.get('/platform/refresh');
            await refreshUser();
        } catch {
            // silent
        } finally {
            setRefreshing(false);
        }
    };

    if (!user) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
    );

    // Compute chart data
    const connectedPlatforms = PLATFORMS.filter(p => user.platforms[p]?.handle);
    const solvedByPlatform = connectedPlatforms.map(p => ({
        name: PLATFORM_LABELS[p],
        solved: user.platforms[p]?.stats?.solved || 0
    }));

    // Difficulty pie data (aggregate)
    const totalEasy = connectedPlatforms.reduce((s, p) => s + (user.platforms[p]?.stats?.easy || 0), 0);
    const totalMedium = connectedPlatforms.reduce((s, p) => s + (user.platforms[p]?.stats?.medium || 0), 0);
    const totalHard = connectedPlatforms.reduce((s, p) => s + (user.platforms[p]?.stats?.hard || 0), 0);
    const difficultyData = [
        { name: 'Easy', value: totalEasy },
        { name: 'Medium', value: totalMedium },
        { name: 'Hard', value: totalHard },
    ].filter(d => d.value > 0);

    // Merged heatmap
    const heatmapMap = {};
    connectedPlatforms.forEach(p => {
        (user.platforms[p]?.heatmap || []).forEach(h => {
            heatmapMap[h.date] = (heatmapMap[h.date] || 0) + h.count;
        });
    });
    const mergedHeatmap = Object.entries(heatmapMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count }));

    // Recent submissions (merge + sort)
    const allSubmissions = connectedPlatforms
        .flatMap(p => (user.platforms[p]?.recentSubmissions || []).map(s => ({ ...s, platform: p })))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 10);

    return (
        <AppLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Welcome back, {user.name}. Here's your coding overview.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {connectedPlatforms.length > 0 && (
                            <button onClick={handleRefresh} disabled={refreshing} className="btn-secondary text-sm flex items-center gap-2">
                                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        )}
                        <button onClick={() => setShowConnect(!showConnect)} className="btn-primary text-sm flex items-center gap-2">
                            <PlusCircle className="w-3.5 h-3.5" />
                            Connect
                        </button>
                    </div>
                </div>

                {/* Connect Form */}
                {showConnect && (
                    <div className="card p-5 border-2 border-slate-200 animate-slide-up">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4">Connect a Platform</h3>
                        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
                        <form onSubmit={handleConnect} className="flex flex-col sm:flex-row gap-3">
                            <select
                                className="input-field sm:w-44"
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                            >
                                {PLATFORMS.map(p => (
                                    <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                className="input-field flex-1"
                                placeholder="Enter your handle / username"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value)}
                                required
                            />
                            <button type="submit" disabled={connecting} className="btn-primary text-sm flex items-center justify-center gap-2 whitespace-nowrap">
                                {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {connecting ? 'Fetching...' : 'Connect'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Trophy} label="Total Solved" value={user.totalSolved || 0} color="blue" />
                    <StatCard icon={Flame} label="Current Streak" value={`${user.currentStreak || 0}d`} subtitle="Consecutive days" color="amber" />
                    <StatCard icon={Target} label="Longest Streak" value={`${user.longestStreak || 0}d`} color="emerald" />
                    <StatCard
                        icon={Target}
                        label="Platforms"
                        value={`${connectedPlatforms.length} / 3`}
                        subtitle="Connected"
                        color="slate"
                    />
                </div>

                {/* Charts Row */}
                {connectedPlatforms.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Bar chart */}
                        <div className="card p-5 lg:col-span-2">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4">Problems Solved by Platform</h3>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={solvedByPlatform} barSize={36}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                                            cursor={{ fill: '#f1f5f9' }}
                                        />
                                        <Bar dataKey="solved" fill="#334155" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie chart */}
                        <div className="card p-5">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4">Difficulty Breakdown</h3>
                            <div className="h-56 flex items-center justify-center">
                                {difficultyData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={difficultyData}
                                                cx="50%" cy="50%"
                                                innerRadius={50} outerRadius={80}
                                                paddingAngle={3}
                                                dataKey="value"
                                            >
                                                {difficultyData.map((_, i) => (
                                                    <Cell key={i} fill={PIE_COLORS[i]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-sm text-slate-400">No data yet</p>
                                )}
                            </div>
                            <div className="flex justify-center gap-4 mt-2">
                                {difficultyData.map((d, i) => (
                                    <span key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                                        <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                                        {d.name}: {d.value}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Activity Heatmap */}
                {mergedHeatmap.length > 0 && <ActivityHeatmap data={mergedHeatmap} />}

                {/* Platform Cards */}
                {connectedPlatforms.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-4">Connected Platforms</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {connectedPlatforms.map(p => (
                                <PlatformCard
                                    key={p}
                                    platform={p}
                                    data={user.platforms[p]}
                                    onDisconnect={handleDisconnect}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Submissions */}
                {allSubmissions.length > 0 && (
                    <div className="card overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-700">Recent Submissions</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {allSubmissions.map((s, i) => (
                                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        {s.verdict === 'Accepted' ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-800 truncate">{s.problem}</p>
                                            <p className="text-xs text-slate-400 capitalize">{s.platform}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-shrink-0">
                                        <span className={`px-2 py-0.5 rounded-full font-medium ${s.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                                                s.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-red-50 text-red-600'
                                            }`}>{s.difficulty}</span>
                                        <span className="flex items-center gap-1 hidden sm:flex">
                                            <Clock className="w-3 h-3" />
                                            {s.date}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {connectedPlatforms.length === 0 && (
                    <div className="card p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">No platforms connected</h3>
                        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                            Connect your Codeforces, LeetCode, or CodeChef handle to start tracking your progress.
                        </p>
                        <button onClick={() => setShowConnect(true)} className="btn-primary text-sm inline-flex items-center gap-2">
                            <PlusCircle className="w-4 h-4" />
                            Connect Your First Platform
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
