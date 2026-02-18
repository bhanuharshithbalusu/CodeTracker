import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/AppLayout';
import {
    ArrowRight, BarChart3, Link2, Activity, Trophy,
    Flame, CheckCircle2, Clock
} from 'lucide-react';

const quickActions = [
    {
        icon: BarChart3,
        title: 'View Dashboard',
        desc: 'See your unified coding analytics and stats.',
        path: '/dashboard',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        icon: Link2,
        title: 'Connect Platforms',
        desc: 'Link your Codeforces, LeetCode, or CodeChef account.',
        path: '/dashboard',
        color: 'bg-emerald-50 text-emerald-600',
    },
    {
        icon: Activity,
        title: 'Track Progress',
        desc: 'View streaks, heatmaps, and submission history.',
        path: '/dashboard',
        color: 'bg-amber-50 text-amber-600',
    },
];

const platformInfo = [
    { name: 'Codeforces', badge: 'CF', color: 'bg-red-500', status: 'Live API', statusColor: 'text-emerald-600' },
    { name: 'LeetCode', badge: 'LC', color: 'bg-amber-500', status: 'Live API', statusColor: 'text-emerald-600' },
    { name: 'CodeChef', badge: 'CC', color: 'bg-emerald-500', status: 'Demo', statusColor: 'text-slate-400' },
];

export default function Home() {
    const { user } = useAuth();

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const connectedCount = ['codeforces', 'leetcode', 'codechef']
        .filter(p => user?.platforms?.[p]?.handle).length;

    return (
        <AppLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Welcome Header */}
                <div className="card p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="relative">
                        <p className="text-slate-400 text-sm font-medium">{greeting},</p>
                        <h1 className="text-3xl font-bold mt-1">{user?.name || 'Coder'} 👋</h1>
                        <p className="text-slate-400 mt-2 text-sm max-w-lg">
                            Welcome to CodeTracker — your unified coding progress tracker.
                            Connect your competitive programming accounts and track everything in one place.
                        </p>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 mt-5 bg-white text-slate-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors"
                        >
                            Go to Dashboard <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="card p-5 flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-blue-50">
                            <Trophy className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Platforms Connected</p>
                            <p className="text-xl font-bold text-slate-900">{connectedCount} / 3</p>
                        </div>
                    </div>
                    <div className="card p-5 flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-emerald-50">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Total Solved</p>
                            <p className="text-xl font-bold text-slate-900">{user?.totalSolved || 0}</p>
                        </div>
                    </div>
                    <div className="card p-5 flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-amber-50">
                            <Flame className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Current Streak</p>
                            <p className="text-xl font-bold text-slate-900">{user?.currentStreak || 0} days</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {quickActions.map((action, i) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={i}
                                    to={action.path}
                                    className="card p-5 hover:shadow-md transition-shadow duration-200 group"
                                >
                                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-slate-700">{action.title}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                                    <div className="flex items-center gap-1 mt-3 text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                                        Open <ArrowRight className="w-3 h-3" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Supported Platforms */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Supported Platforms</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {platformInfo.map((p) => {
                            const isConnected = user?.platforms?.[p.name.toLowerCase()]?.handle;
                            return (
                                <div key={p.name} className="card p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-lg ${p.color} flex items-center justify-center text-white font-bold text-xs`}>
                                                {p.badge}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900">{p.name}</h4>
                                                <p className={`text-xs font-medium ${p.statusColor}`}>{p.status}</p>
                                            </div>
                                        </div>
                                        {isConnected ? (
                                            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">Connected</span>
                                        ) : (
                                            <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-medium">Not linked</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {p.name === 'Codeforces' && 'Rating, rank, solved problems, contest history, and submissions.'}
                                        {p.name === 'LeetCode' && 'Total solved, easy/medium/hard counts, ranking, and calendar.'}
                                        {p.name === 'CodeChef' && 'Star rating, problems solved, and contest count (demo data).'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Getting Started Tip */}
                {connectedCount === 0 && (
                    <div className="card p-6 border-2 border-dashed border-slate-200 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Link2 className="w-7 h-7 text-slate-400" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-800 mb-2">Get started by connecting a platform</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
                            Head to the Dashboard and click "Connect" to link your Codeforces, LeetCode, or CodeChef handle.
                            We'll pull your real stats instantly.
                        </p>
                        <Link
                            to="/dashboard"
                            className="btn-primary text-sm inline-flex items-center gap-2"
                        >
                            Go to Dashboard <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}

                {/* Recent Activity Teaser */}
                <div className="card p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <h3 className="text-sm font-semibold text-slate-700">Account Info</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-slate-400 text-xs">Name</p>
                            <p className="font-medium text-slate-800">{user?.name || '—'}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs">Email</p>
                            <p className="font-medium text-slate-800">{user?.email || '—'}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs">Member since</p>
                            <p className="font-medium text-slate-800">
                                {user?.joinedAt
                                    ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
