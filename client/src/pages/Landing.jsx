import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Shield, Layers, Code2, CheckCircle2, BookOpen } from 'lucide-react';

const features = [
    {
        icon: Layers,
        title: 'Unified Dashboard',
        desc: 'Aggregate stats from Codeforces, LeetCode, and CodeChef into a single view.',
    },
    {
        icon: BarChart3,
        title: 'Visual Analytics',
        desc: 'Beautiful charts, heatmaps, and streaks to track your consistency over time.',
    },
    {
        icon: Shield,
        title: 'Private & Secure',
        desc: 'Your data stays safe. We only access publicly available information.',
    },
];

const steps = [
    { num: '01', title: 'Create Account', desc: 'Sign up in seconds with your email and a secure password.' },
    { num: '02', title: 'Connect Platforms', desc: 'Link your Codeforces, LeetCode, and CodeChef handles from the dashboard.' },
    { num: '03', title: 'Track Progress', desc: 'View unified analytics — problems solved, ratings, streaks, and heatmaps.' },
];

export default function Landing() {
    const { user, loading } = useAuth();

    // Redirect logged-in users to dashboard
    if (!loading && user) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <Code2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg text-slate-900 tracking-tight">CodeTracker</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors">
                            Log in
                        </Link>
                        <Link to="/register" className="btn-primary text-sm">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Track your competitive programming progress
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                        All your coding stats,
                        <br />
                        <span className="text-slate-500">one dashboard.</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
                        Stop switching between platforms. CodeTracker aggregates your progress
                        from Codeforces, LeetCode, and CodeChef into a clean, unified analytics dashboard.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
                            Start Tracking <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/login" className="btn-secondary text-base px-8 py-3">
                            Log in
                        </Link>
                    </div>
                </div>
            </section>

            {/* What is CodeTracker */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">What is CodeTracker?</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
                            CodeTracker is a coding progress tracker designed for competitive programmers.
                            It connects to your Codeforces, LeetCode, and CodeChef accounts and pulls your
                            real statistics — problems solved, ratings, contest history, and submission activity —
                            into one beautiful, unified dashboard.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div key={i} className="bg-white rounded-xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                                        <Icon className="w-5 h-5 text-slate-700" />
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-900 mb-2">{f.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">How to Use CodeTracker</h2>
                        <p className="text-slate-500">Three simple steps to get started.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((s, i) => (
                            <div key={i} className="relative bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center">
                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold mx-auto mb-4">{s.num}</div>
                                <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platform Details */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Supported Platforms</h2>
                        <p className="text-slate-500">We fetch your real stats from these competitive programming platforms.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm">
                            <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold text-lg mb-4">C</div>
                            <h3 className="font-semibold text-slate-900 mb-1">Codeforces</h3>
                            <p className="text-xs text-emerald-600 font-medium mb-3 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Live API
                            </p>
                            <ul className="text-sm text-slate-500 space-y-1">
                                <li>• Rating & Rank</li>
                                <li>• Problems solved (by difficulty)</li>
                                <li>• Contest participation</li>
                                <li>• Submission heatmap</li>
                                <li>• Recent submissions</li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm">
                            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-lg mb-4">L</div>
                            <h3 className="font-semibold text-slate-900 mb-1">LeetCode</h3>
                            <p className="text-xs text-emerald-600 font-medium mb-3 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Live API
                            </p>
                            <ul className="text-sm text-slate-500 space-y-1">
                                <li>• Total problems solved</li>
                                <li>• Easy / Medium / Hard breakdown</li>
                                <li>• Global ranking</li>
                                <li>• Submission calendar</li>
                                <li>• Acceptance rate</li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg mb-4">C</div>
                            <h3 className="font-semibold text-slate-900 mb-1">CodeChef</h3>
                            <p className="text-xs text-slate-400 font-medium mb-3 flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" /> Demo Data
                            </p>
                            <ul className="text-sm text-slate-500 space-y-1">
                                <li>• Star rating</li>
                                <li>• Problems solved</li>
                                <li>• Contest count</li>
                                <li>• Activity heatmap</li>
                                <li className="text-slate-400 italic">• (No public API available)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Features */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Dashboard Features</h2>
                        <p className="text-slate-500">Everything you see once you connect your accounts.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {[
                            { title: 'Total Problems Solved', desc: 'Combined count across all connected platforms.' },
                            { title: 'Platform-wise Breakdown', desc: 'See stats for each platform individually with rating, rank, and difficulty split.' },
                            { title: 'Activity Heatmap', desc: 'GitHub-style contribution graph showing your daily coding activity over 90 days.' },
                            { title: 'Streak Tracking', desc: 'Current and longest coding streaks to keep you motivated.' },
                            { title: 'Difficulty Pie Chart', desc: 'Visual breakdown of Easy, Medium, and Hard problems you\'ve solved.' },
                            { title: 'Recent Submissions', desc: 'A feed of your latest submissions with verdict and difficulty tags.' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-3 p-4 rounded-lg border border-slate-100 bg-white">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-slate-900">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to track your progress?</h2>
                    <p className="text-slate-400 mb-8">Join CodeTracker and keep all your competitive programming stats in one place.</p>
                    <Link to="/register" className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-lg font-bold text-base hover:bg-slate-100 transition">
                        Create Free Account <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-100 py-8 bg-white">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Code2 className="w-4 h-4" />
                        <span>CodeTracker</span>
                    </div>
                    <p className="text-xs text-slate-400">© {new Date().getFullYear()} CodeTracker. Built for learners.</p>
                </div>
            </footer>
        </div>
    );
}
