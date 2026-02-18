const PLATFORM_COLORS = {
    codeforces: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', badge: 'bg-red-500' },
    leetcode: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-500' },
    codechef: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-500' },
};

const PLATFORM_LABELS = {
    codeforces: 'Codeforces',
    leetcode: 'LeetCode',
    codechef: 'CodeChef'
};

export default function PlatformCard({ platform, data, onDisconnect }) {
    const colors = PLATFORM_COLORS[platform] || PLATFORM_COLORS.codeforces;
    const label = PLATFORM_LABELS[platform] || platform;

    if (!data?.handle) return null;

    return (
        <div className={`card p-5 animate-slide-up`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${colors.badge} flex items-center justify-center text-white font-bold text-sm`}>
                        {label[0]}
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900">{label}</h4>
                        <p className="text-xs text-slate-500">@{data.handle}</p>
                    </div>
                </div>
                {onDisconnect && (
                    <button
                        onClick={() => onDisconnect(platform)}
                        className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                    >
                        Disconnect
                    </button>
                )}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <p className="text-xs text-slate-500">Solved</p>
                    <p className="text-lg font-bold text-slate-900">{data.stats?.solved || 0}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500">Rating</p>
                    <p className="text-lg font-bold text-slate-900">{data.stats?.rating || '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500">Rank</p>
                    <p className="text-lg font-bold text-slate-900">{data.stats?.rank || '—'}</p>
                </div>
            </div>

            {/* Difficulty breakdown */}
            <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Easy: {data.stats?.easy || 0}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Medium: {data.stats?.medium || 0}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        Hard: {data.stats?.hard || 0}
                    </span>
                </div>
            </div>
        </div>
    );
}
