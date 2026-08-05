import { Activity, Clock } from 'lucide-react';

export default function AuditLogTimeline({ logs }) {
    if (!logs || logs.length === 0) {
        return <p className="text-sm text-slate-500 py-4 text-center">Belum ada riwayat aktivitas.</p>;
    }

    return (
        <div className="relative border-l border-slate-200 ml-3 space-y-6 pb-4">
            {logs.map((log, index) => (
                <div key={log.id} className="relative pl-6">
                    {/* Circle marker */}
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-[hsl(var(--primary))] rounded-full ring-4 ring-white" />

                    <div className="bg-slate-50 rounded-lg p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-slate-900 capitalize">
                                {log.description}
                            </span>
                            <span className="flex items-center text-xs text-slate-500">
                                <Clock size={12} className="mr-1" />
                                {new Date(log.created_at).toLocaleString('id-ID')}
                            </span>
                        </div>

                        {log.causer && (
                            <p className="text-xs text-slate-500 mb-2">
                                Oleh: <span className="font-medium text-slate-700">{log.causer.name}</span>
                            </p>
                        )}

                        {/* Tampilkan perubahan properties (old -> new) jika ada */}
                        {log.properties?.old && log.properties?.attributes && (
                            <div className="mt-2 space-y-1 bg-white p-2 rounded border border-slate-100">
                                {Object.keys(log.properties.attributes).map(key => {
                                    const oldVal = log.properties.old[key];
                                    const newVal = log.properties.attributes[key];
                                    // Skip jika nilai sebenarnya tidak berubah (kadang spatie merekam object)
                                    if (JSON.stringify(oldVal) === JSON.stringify(newVal)) return null;

                                    return (
                                        <div key={key} className="grid grid-cols-[1fr_auto_1fr] gap-2 text-xs items-center">
                                            <span className="font-medium text-slate-500 truncate text-right capitalize">{key.replace('_', ' ')}:</span>
                                            <div className="flex flex-col">
                                                <span className="text-red-500 line-through truncate max-w-[150px]" title={oldVal || '-'}>
                                                    {oldVal || '-'}
                                                </span>
                                                <span className="text-green-600 font-medium truncate max-w-[150px]" title={newVal || '-'}>
                                                    {newVal || '-'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
