import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import ThresholdAlert from '@/Components/ThresholdAlert';
import StatusBadge from '@/Components/StatusBadge';
import {
    Cpu, Package, FileWarning, Users, Activity,
    ArrowRight, Wrench, AlertTriangle, ScanLine,
    Warehouse, Tag, MapPin, Plus, Sparkles, ChevronRight
} from 'lucide-react';

export default function Dashboard({ stats, lowStockItems, laporanTerbaru, asetTerbaru }) {

    const StatCard = ({ title, value, icon: Icon, color, link }) => {
        const Content = (
            <>
                {/* Mobile Compact Horizontal Design */}
                <div className="flex sm:hidden items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors relative overflow-hidden">
                    <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-15 pointer-events-none ${color}`} />
                    <div className={`p-2.5 rounded-lg ${color} bg-opacity-10 text-opacity-80 shrink-0 relative z-10`}>
                        <Icon size={20} />
                    </div>
                    <div className="min-w-0 flex-1 relative z-10">
                        <p className="text-[11px] font-medium text-slate-500 truncate">{title}</p>
                        <h3 className="text-lg font-bold text-slate-800 leading-tight mt-0.5">{value}</h3>
                    </div>
                </div>

                {/* Desktop Detailed Design */}
                <div className="hidden sm:block bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden group">
                    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110 ${color}`} />
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{title}</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
                        </div>
                        <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-80 shrink-0`}>
                            <Icon size={22} className="opacity-80" />
                        </div>
                    </div>
                    {link && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <span className="text-xs font-medium text-slate-500 group-hover:text-[hsl(var(--primary))] flex items-center gap-1 transition-colors">
                                Lihat Detail <ArrowRight size={14} />
                            </span>
                        </div>
                    )}
                </div>
            </>
        );

        return link ? <Link href={link} className="block">{Content}</Link> : <div>{Content}</div>;
    };

    const quickActions = [
        { label: 'Scan QR', icon: ScanLine, href: '/scanner', color: 'bg-emerald-500 text-white', accent: true },
        { label: 'Aset Baru', icon: Plus, href: route('assets.create'), color: 'bg-[hsl(var(--primary))] text-white' },
        { label: 'Peminjaman', icon: Warehouse, href: '/loans', color: 'bg-blue-50 text-blue-600 border border-blue-200/60' },
        { label: 'Consumable', icon: Package, href: '/consumables', color: 'bg-indigo-50 text-indigo-600 border border-indigo-200/60' },
        { label: 'Lapor Kendala', icon: FileWarning, href: '/reports', color: 'bg-red-50 text-red-600 border border-red-200/60' },
        { label: 'Kategori', icon: Tag, href: '/categories', color: 'bg-purple-50 text-purple-600 border border-purple-200/60' },
        { label: 'Lokasi', icon: MapPin, href: '/locations', color: 'bg-sky-50 text-sky-600 border border-sky-200/60' },
        { label: 'Users', icon: Users, href: '/users', color: 'bg-amber-50 text-amber-600 border border-amber-200/60' },
    ];

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight">Dashboard</h2>}>
            <Head title="Dashboard" />

            <PageTransition>
                <div className="w-full pb-10 space-y-6">

                    {/* Alert Stok Menipis */}
                    <ThresholdAlert items={lowStockItems} />

                    {/* Pintasan Cepat (Quick Shortcuts) */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 md:p-6 shadow-2xs">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                                <Sparkles size={16} className="text-[hsl(var(--primary))]" /> Pintasan Cepat
                            </h3>
                            <span className="text-[10px] sm:text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold border border-slate-200/60">Aksi Cepat</span>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 md:gap-5">
                            {quickActions.map((act, i) => (
                                <Link
                                    key={i}
                                    href={act.href}
                                    className="flex flex-col items-center gap-2 p-2 sm:p-3 rounded-2xl text-center transition-all hover:bg-slate-50/80 hover:shadow-2xs active:scale-95 group"
                                >
                                    <div className={`w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-2xs transition-all duration-200 group-hover:scale-110 group-hover:shadow-md ${act.color}`}>
                                        <act.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                    </div>
                                    <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-700 leading-tight group-hover:text-slate-900 transition-colors text-center">
                                        {act.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <StatCard
                            title="Total Aset"
                            value={stats.total_aset}
                            icon={Cpu}
                            color="bg-blue-500 text-blue-600"
                            link={route('assets.index')}
                        />
                        <StatCard
                            title="Total Consumable"
                            value={stats.total_consumable}
                            icon={Package}
                            color="bg-indigo-500 text-indigo-600"
                            link={route('consumables.index')}
                        />
                        <StatCard
                            title="Laporan Menunggu"
                            value={stats.laporan_open}
                            icon={FileWarning}
                            color="bg-red-500 text-red-600"
                            link={route('reports.index', { status: 'open' })}
                        />
                        <StatCard
                            title="Aset Maintenance"
                            value={stats.aset_maintenance}
                            icon={Wrench}
                            color="bg-orange-500 text-orange-600"
                            link={route('assets.index', { status: 'maintenance' })}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Aset Terbaru */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-semibold text-slate-800 text-xs sm:text-base flex items-center gap-1.5 sm:gap-2">
                                    <Activity size={16} className="text-[hsl(var(--primary))] sm:hidden" />
                                    <Activity size={18} className="text-[hsl(var(--primary))] hidden sm:block" />
                                    Aset Terbaru
                                </h3>
                                <Link href={route('assets.index')} className="text-[11px] sm:text-xs font-medium text-[hsl(var(--primary))] hover:underline flex items-center gap-0.5">
                                    Lihat Semua <ChevronRight size={12} />
                                </Link>
                            </div>
                            
                            {/* Desktop Table View */}
                            <div className="hidden sm:block p-0 overflow-x-auto flex-1">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Nama Aset</th>
                                            <th className="px-4 py-3 font-medium">Kategori</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {asetTerbaru.length === 0 ? (
                                            <tr><td colSpan="3" className="px-4 py-8 text-center text-slate-500">Belum ada aset.</td></tr>
                                        ) : (
                                            asetTerbaru.map(aset => (
                                                <tr key={aset.id} className="hover:bg-slate-50">
                                                    <td className="px-4 py-3">
                                                        <Link href={route('assets.show', aset.uuid)} className="font-medium text-[hsl(var(--primary))] hover:underline">
                                                            {aset.nama}
                                                        </Link>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600">{aset.category?.nama}</td>
                                                    <td className="px-4 py-3">
                                                        <StatusBadge status={aset.status} label={aset.status_label} />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card List View (Ultra Compact) */}
                            <div className="sm:hidden divide-y divide-slate-100">
                                {asetTerbaru.length === 0 ? (
                                    <div className="p-4 text-center text-slate-500 text-xs">Belum ada aset.</div>
                                ) : (
                                    asetTerbaru.slice(0, 4).map(aset => (
                                        <Link key={aset.id} href={route('assets.show', aset.uuid)} className="py-2.5 px-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div className="min-w-0 flex-1 pr-2">
                                                <h4 className="font-semibold text-slate-800 text-xs truncate">{aset.nama}</h4>
                                                <span className="text-[10px] text-slate-400 block truncate">{aset.category?.nama || '-'}</span>
                                            </div>
                                            <div className="shrink-0 flex items-center gap-1.5">
                                                <StatusBadge status={aset.status} label={aset.status_label} />
                                                <ChevronRight size={14} className="text-slate-400" />
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Laporan Terbaru */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-semibold text-slate-800 text-xs sm:text-base flex items-center gap-1.5 sm:gap-2">
                                    <AlertTriangle size={16} className="text-red-500 sm:hidden" />
                                    <AlertTriangle size={18} className="text-red-500 hidden sm:block" />
                                    Laporan Kendala Terbaru
                                </h3>
                                <Link href={route('reports.index')} className="text-[11px] sm:text-xs font-medium text-[hsl(var(--primary))] hover:underline flex items-center gap-0.5">
                                    Lihat Semua <ChevronRight size={12} />
                                </Link>
                            </div>
                            
                            {/* Desktop Table View */}
                            <div className="hidden sm:block p-0 overflow-x-auto flex-1">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Pelapor</th>
                                            <th className="px-4 py-3 font-medium">Aset</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {laporanTerbaru.length === 0 ? (
                                            <tr><td colSpan="3" className="px-4 py-8 text-center text-slate-500">Belum ada laporan aktif.</td></tr>
                                        ) : (
                                            laporanTerbaru.map(lap => (
                                                <tr key={lap.id} className="hover:bg-slate-50">
                                                    <td className="px-4 py-3">
                                                        <Link href={route('reports.show', lap.id)} className="font-medium text-slate-800 hover:text-[hsl(var(--primary))]">
                                                            {lap.nama_pelapor}
                                                        </Link>
                                                        <div className="text-xs text-slate-500 truncate max-w-[150px]">{lap.deskripsi_kendala}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600">{lap.asset?.nama}</td>
                                                    <td className="px-4 py-3">
                                                        <StatusBadge status={lap.status} label={lap.status_label} />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card List View (Ultra Compact) */}
                            <div className="sm:hidden divide-y divide-slate-100">
                                {laporanTerbaru.length === 0 ? (
                                    <div className="p-4 text-center text-slate-500 text-xs">Belum ada laporan aktif.</div>
                                ) : (
                                    laporanTerbaru.slice(0, 4).map(lap => (
                                        <Link key={lap.id} href={route('reports.show', lap.id)} className="py-2.5 px-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div className="min-w-0 flex-1 pr-2">
                                                <h4 className="font-semibold text-slate-800 text-xs truncate">{lap.nama_pelapor}</h4>
                                                <span className="text-[10px] text-slate-400 block truncate">Aset: {lap.asset?.nama || '-'}</span>
                                            </div>
                                            <div className="shrink-0 flex items-center gap-1.5">
                                                <StatusBadge status={lap.status} label={lap.status_label} />
                                                <ChevronRight size={14} className="text-slate-400" />
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </PageTransition>
        </AuthenticatedLayout>
    );
}
