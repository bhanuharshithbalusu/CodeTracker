export default function ActivityHeatmap({ data = [] }) {
    if (!data.length) return null;

    const maxCount = Math.max(...data.map(d => d.count), 1);

    const getColor = (count) => {
        if (count === 0) return 'bg-slate-100';
        const ratio = count / maxCount;
        if (ratio <= 0.25) return 'bg-emerald-200';
        if (ratio <= 0.5) return 'bg-emerald-300';
        if (ratio <= 0.75) return 'bg-emerald-400';
        return 'bg-emerald-500';
    };

    // Group by week for a grid display
    const weeks = [];
    let currentWeek = [];
    data.forEach((item, i) => {
        const dayOfWeek = new Date(item.date).getDay();
        if (dayOfWeek === 0 && currentWeek.length > 0) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        currentWeek.push(item);
    });
    if (currentWeek.length) weeks.push(currentWeek);

    return (
        <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Activity (Last 90 Days)</h3>
            <div className="flex gap-[3px] overflow-x-auto pb-2">
                {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                        {week.map((day) => (
                            <div
                                key={day.date}
                                className={`w-3 h-3 rounded-sm ${getColor(day.count)} transition-colors duration-150`}
                                title={`${day.date}: ${day.count} submissions`}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-slate-400">Less</span>
                <div className="flex gap-[3px]">
                    {['bg-slate-100', 'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500'].map((c, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                    ))}
                </div>
                <span className="text-xs text-slate-400">More</span>
            </div>
        </div>
    );
}
