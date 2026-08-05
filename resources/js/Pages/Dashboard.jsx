import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import ThresholdAlert from '@/Components/ThresholdAlert';
import StatusBadge from '@/Components/StatusBadge';
import {
    Cpu, Package, FileWarning, Users, Activity,
    TrendingUp, ArrowRight, Wrench, AlertTriangle
} from 'lucide-react';

export default function Dashboard({ stats, lowStockItems, laporanTerbaru, asetTerbaru }) {

    const StatCard = ({ title, value, icon: Icon, color, link }) => (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110 ${color}`} />
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-80`}>
                    <Icon size={22} className="opacity-80" />
                </div>
            </div>
            {link && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <Link href={link} className="text-xs font-medium text-slate-500 hover:text-[hsl(var(--primary))] flex items-center gap-1 transition-colors">
                        Lihat Detail <ArrowRight size={14} />
                    </Link>
                </div>
            )}
        </div>
    );

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight">Dashboard</h2>}>
            <Head title="Dashboard" />

            <PageTransition>
                <div className="w-full pb-10">

                    {/* Alert Stok Menipis */}
                    <ThresholdAlert items={lowStockItems} />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Aset Terbaru */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Activity size={18} className="text-[hsl(var(--primary))]" />
                                    Aset Terbaru
                                </h3>
                                <Link href={route('assets.index')} className="text-xs font-medium text-[hsl(var(--primary))] hover:underline">
                                    Lihat Semua
                                </Link>
                            </div>
                            <div className="p-0 overflow-x-auto flex-1">
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
                                                        <Link href={route('assets.show', aset.id)} className="font-medium text-[hsl(var(--primary))] hover:underline">
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
                        </div>

                        {/* Laporan Terbaru */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-red-500" />
                                    Laporan Kendala Terbaru
                                </h3>
                                <Link href={route('reports.index')} className="text-xs font-medium text-[hsl(var(--primary))] hover:underline">
                                    Lihat Semua
                                </Link>
                            </div>
                            <div className="p-0 overflow-x-auto flex-1">
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
                        </div>
                    </div>

                </div>
            </PageTransition>
        </AuthenticatedLayout>
    );
}
