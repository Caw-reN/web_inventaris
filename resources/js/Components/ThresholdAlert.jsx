import { AlertCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function ThresholdAlert({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
                <div className="flex-1">
                    <h3 className="text-red-800 font-semibold text-sm">Peringatan Stok Menipis!</h3>
                    <p className="text-red-700 text-sm mt-1 mb-3">
                        Ada {items.length} consumable yang stoknya mencapai batas minimum atau habis.
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {items.slice(0, 3).map(item => (
                            <Link
                                key={item.id}
                                href={route('consumables.show', item.id)}
                                className="flex items-center justify-between bg-white/60 hover:bg-white rounded-lg px-3 py-2 border border-red-100 transition-colors"
                            >
                                <span className="text-sm font-medium text-red-900 truncate pr-2">{item.nama}</span>
                                <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                                    {item.stok} {item.satuan}
                                </span>
                            </Link>
                        ))}
                    </div>
                    {items.length > 3 && (
                        <Link href={route('consumables.index', { filter: 'low_stock' })} className="inline-block mt-3 text-sm font-medium text-red-700 hover:text-red-800 underline underline-offset-2">
                            Lihat semua {items.length} item
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
