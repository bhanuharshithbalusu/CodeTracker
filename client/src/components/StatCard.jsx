export default function StatCard({ icon: Icon, label, value, subtitle, color = 'slate' }) {
    const colorMap = {
        slate: 'bg-slate-100 text-slate-600',
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        rose: 'bg-rose-50 text-rose-600',
    };

    return (
        <div className="card p-5 animate-fade-in">
            <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg ${colorMap[color] || colorMap.slate}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{value}</h3>
                    {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
}
