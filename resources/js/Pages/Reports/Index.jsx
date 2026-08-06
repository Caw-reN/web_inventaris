import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import Pagination from '@/Components/Pagination';
import { 
    AlertTriangle, Search, Filter, CheckCircle2, Clock, 
    Wrench, Trash2, Eye, Cpu, User, MapPin, X, Send, FileWarning, ArrowUpRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ reports, filters }) {
    const { auth, flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    
    // Modal state for editing report status
    const [selectedReport, setSelectedReport] = useState(null);
    const [editStatus, setEditStatus] = useState('');
    const [catatanTeknisi, setCatatanTeknisi] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Modal view detail
    const [detailReport, setDetailReport] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('reports.index'), { search, status: statusFilter }, { preserveState: true, replace: true });
    };

    const handleFilterStatus = (newStatus) => {
        setStatusFilter(newStatus);
        router.get(route('reports.index'), { search, status: newStatus }, { preserveState: true, replace: true });
    };

    const openEditModal = (report) => {
        setSelectedReport(report);
        setEditStatus(report.status);
        setCatatanTeknisi(report.catatan_teknisi || '');
    };

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        if (!selectedReport) return;
        setIsUpdating(true);

        router.put(route('reports.update', selectedReport.id), {
            status: editStatus,
            catatan_teknisi: catatanTeknisi,
        }, {
            onSuccess: () => {
                setSelectedReport(null);
                setIsUpdating(false);
            },
            onError: () => setIsUpdating(false),
        });
    };

    const handleDelete = (reportId) => {
        if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
            router.delete(route('reports.destroy', reportId));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'open':
                return <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold"><Clock size={12} /> Menunggu</span>;
            case 'in_progress':
                return <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-bold"><Wrench size={12} /> Diprofil / Diproses</span>;
            case 'resolved':
                return <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold"><CheckCircle2 size={12} /> Selesai</span>;
            default:
                return <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight text-slate-800">Laporan Kendala Aset</h2>}>
            <Head title="Laporan Kendala Aset" />

            <PageTransition>
                <div className="w-full space-y-4 pb-12">
                    {/* Mobile Search & Filter Card */}
                    <div className="md:hidden bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari pelapor, kelas, atau aset..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] focus:border-[hsl(var(--primary))]"
                            />
                        </form>

                                    {/* Status Filter Pills (Mobile Scrollable) */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
                            <button
                                type="button"
                                onClick={() => handleFilterStatus('')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                    statusFilter === '' 
                                        ? 'bg-slate-900 text-white shadow-2xs' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterStatus('open')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                                    statusFilter === 'open' 
                                        ? 'bg-amber-500 text-white shadow-2xs' 
                                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
                                }`}
                            >
                                <Clock size={13} /> Menunggu
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterStatus('in_progress')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                                    statusFilter === 'in_progress' 
                                        ? 'bg-blue-600 text-white shadow-2xs' 
                                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
                                }`}
                            >
                                <Wrench size={13} /> Diproses
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterStatus('resolved')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                                    statusFilter === 'resolved' 
                                        ? 'bg-emerald-600 text-white shadow-2xs' 
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                                }`}
                            >
                                <CheckCircle2 size={13} /> Selesai
                            </button>
                        </div>
                    </div>

                    {/* Desktop Search & Filter Bar */}
                    <div className="hidden md:block bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                            <form onSubmit={handleSearch} className="relative flex-1 min-w-[240px]">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari pelapor, kelas, atau aset..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] focus:border-[hsl(var(--primary))]"
                                />
                            </form>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => handleFilterStatus('')}
                                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                        statusFilter === '' 
                                            ? 'bg-slate-900 text-white shadow-xs' 
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFilterStatus('open')}
                                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                                        statusFilter === 'open' 
                                            ? 'bg-amber-500 text-white shadow-xs' 
                                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
                                    }`}
                                >
                                    <Clock size={13} /> Menunggu
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFilterStatus('in_progress')}
                                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                                        statusFilter === 'in_progress' 
                                            ? 'bg-blue-600 text-white shadow-xs' 
                                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
                                    }`}
                                >
                                    <Wrench size={13} /> Diproses
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFilterStatus('resolved')}
                                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                                        statusFilter === 'resolved' 
                                            ? 'bg-emerald-600 text-white shadow-xs' 
                                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                                    }`}
                                >
                                    <CheckCircle2 size={13} /> Selesai
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table View (Desktop) */}
                    <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="py-3.5 px-4">Tgl Laporan</th>
                                        <th className="py-3.5 px-4">Aset Terkait</th>
                                        <th className="py-3.5 px-4">Pelapor & Kelas</th>
                                        <th className="py-3.5 px-4">Deskripsi Kendala</th>
                                        <th className="py-3.5 px-4">Status</th>
                                        <th className="py-3.5 px-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                    {reports.data && reports.data.length > 0 ? (
                                        reports.data.map((report) => (
                                            <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                                                    <p className="font-semibold text-slate-700">
                                                        {new Date(report.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">
                                                        {new Date(report.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </td>
                                                <td className="py-3.5 px-4 font-medium">
                                                    {report.asset ? (
                                                        <Link 
                                                            href={route('assets.show', report.asset.id)}
                                                            className="group flex flex-col hover:text-[hsl(var(--primary))]"
                                                        >
                                                            <span className="font-bold text-slate-800 group-hover:underline flex items-center gap-1">
                                                                {report.asset.nama} <ArrowUpRight size={12} className="text-slate-400 group-hover:text-[hsl(var(--primary))]" />
                                                            </span>
                                                            <span className="text-[11px] font-mono text-slate-400">
                                                                {report.asset.nomor_inventaris || report.asset.no_seri}
                                                            </span>
                                                        </Link>
                                                    ) : (
                                                        <span className="text-slate-400 font-italic">Aset Dihapus</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <p className="font-bold text-slate-800">{report.nama_pelapor}</p>
                                                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                                        {report.kelas}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 max-w-xs">
                                                    <p className="text-slate-700 line-clamp-2 leading-relaxed" title={report.deskripsi_kendala}>
                                                        {report.deskripsi_kendala}
                                                    </p>
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    {getStatusBadge(report.status)}
                                                    {report.handler && (
                                                        <p className="text-[10px] text-slate-400 mt-1">
                                                            Oleh: <span className="font-semibold text-slate-600">{report.handler.name}</span>
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => setDetailReport(report)}
                                                            className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                                            title="Lihat Detail"
                                                        >
                                                            <Eye size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => openEditModal(report)}
                                                            className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-medium transition-colors text-xs flex items-center gap-1"
                                                            title="Tindak Lanjuti Laporan"
                                                        >
                                                            <Wrench size={14} /> Update
                                                        </button>
                                                        {auth.user?.is_admin && (
                                                            <button
                                                                onClick={() => handleDelete(report.id)}
                                                                className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                                title="Hapus Laporan"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-12 text-center text-slate-400">
                                                <AlertTriangle size={32} className="mx-auto mb-2 opacity-50 text-slate-400" />
                                                <p className="font-semibold text-sm">Tidak ada laporan kendala ditemukan.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Desktop */}
                        {reports.data && reports.data.length > 0 && (
                            <div className="p-4 border-t border-slate-100">
                                <Pagination links={reports.links} />
                            </div>
                        )}
                    </div>

                    {/* Mobile Card List View */}
                    <div className="md:hidden space-y-3">
                        {reports.data && reports.data.length > 0 ? (
                            reports.data.map((report) => (
                                <div key={report.id} className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                                    {/* Card Header */}
                                    <div className="p-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="p-1.5 bg-slate-200/80 text-slate-700 rounded-lg shrink-0">
                                                <User size={14} />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-slate-800 text-xs truncate">{report.nama_pelapor}</h4>
                                                <span className="inline-block text-[10px] font-semibold text-slate-600 bg-slate-200/60 px-1.5 py-0.2 rounded border border-slate-200">
                                                    {report.kelas}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="shrink-0 flex flex-col items-end">
                                            {getStatusBadge(report.status)}
                                            <span className="text-[10px] text-slate-400 mt-1">
                                                {new Date(report.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} • {new Date(report.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-3.5 space-y-2.5">
                                        <div className="flex items-start justify-between gap-2 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Aset Terkait</p>
                                                {report.asset ? (
                                                    <Link href={route('assets.show', report.asset.id)} className="font-bold text-xs text-slate-800 hover:text-[hsl(var(--primary))] flex items-center gap-1 mt-0.5 truncate">
                                                        {report.asset.nama} <ArrowUpRight size={12} className="text-slate-400" />
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Aset Dihapus</span>
                                                )}
                                            </div>
                                            {report.asset && (
                                                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                                                    {report.asset.nomor_inventaris || report.asset.no_seri}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold uppercase text-red-600 tracking-wider">Deskripsi Kendala</p>
                                            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-red-50/50 p-2.5 rounded-lg border border-red-100">
                                                {report.deskripsi_kendala}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Footer Actions */}
                                    <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
                                        <button
                                            onClick={() => setDetailReport(report)}
                                            className="flex-1 py-1.5 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                                        >
                                            <Eye size={14} /> Detail
                                        </button>
                                        <button
                                            onClick={() => openEditModal(report)}
                                            className="flex-1 py-1.5 px-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                                        >
                                            <Wrench size={14} /> Tindak Lanjuti
                                        </button>
                                        {auth.user?.is_admin && (
                                            <button
                                                onClick={() => handleDelete(report.id)}
                                                className="p-1.5 text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer shadow-2xs"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))))
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
                                <AlertTriangle size={32} className="mx-auto mb-2 opacity-50 text-slate-400" />
                                <p className="font-semibold text-sm">Tidak ada laporan kendala ditemukan.</p>
                            </div>
                        )}

                        {/* Mobile Pagination */}
                        {reports.data && reports.data.length > 0 && (
                            <div className="pt-2">
                                <Pagination links={reports.links} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Update Status & Catatan Teknisi */}
                <AnimatePresence>
                    {selectedReport && (
                        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 overflow-hidden"
                            >
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                                            <Wrench size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-base">Tindak Lanjuti Laporan</h3>
                                            <p className="text-xs text-slate-500">Aset: {selectedReport.asset?.nama}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                                        <X size={18} />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateStatus} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                            Status Penanganan <span className="text-red-500">*</span>
                                        </label>
                                        <div className="space-y-2">
                                            {/* Option 1: Open */}
                                            <button
                                                type="button"
                                                onClick={() => setEditStatus('open')}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                                    editStatus === 'open'
                                                        ? 'border-amber-400 bg-amber-50/80 text-amber-900 ring-2 ring-amber-400/20 shadow-2xs'
                                                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg shrink-0 ${editStatus === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200/80 text-slate-500'}`}>
                                                        <Clock size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-xs">Menunggu (Open)</p>
                                                        <p className="text-[11px] text-slate-500">Laporan baru belum ditangani</p>
                                                    </div>
                                                </div>
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${editStatus === 'open' ? 'border-amber-500 bg-amber-500 text-white' : 'border-slate-300'}`}>
                                                    {editStatus === 'open' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                </div>
                                            </button>

                                            {/* Option 2: In Progress */}
                                            <button
                                                type="button"
                                                onClick={() => setEditStatus('in_progress')}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                                    editStatus === 'in_progress'
                                                        ? 'border-blue-500 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20 shadow-2xs'
                                                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg shrink-0 ${editStatus === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200/80 text-slate-500'}`}>
                                                        <Wrench size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-xs">Sedang Diproses (In Progress)</p>
                                                        <p className="text-[11px] text-slate-500">Teknisi sedang melakukan perbaikan</p>
                                                    </div>
                                                </div>
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${editStatus === 'in_progress' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                                                    {editStatus === 'in_progress' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                </div>
                                            </button>

                                            {/* Option 3: Resolved */}
                                            <button
                                                type="button"
                                                onClick={() => setEditStatus('resolved')}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                                    editStatus === 'resolved'
                                                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20 shadow-2xs'
                                                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg shrink-0 ${editStatus === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200/80 text-slate-500'}`}>
                                                        <CheckCircle2 size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-xs">Selesai Ditangani (Resolved)</p>
                                                        <p className="text-[11px] text-slate-500">Kendala telah selesai diperbaiki</p>
                                                    </div>
                                                </div>
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${editStatus === 'resolved' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>
                                                    {editStatus === 'resolved' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">Catatan Perbaikan / Tindakan Teknisi</label>
                                        <textarea
                                            rows="3"
                                            value={catatanTeknisi}
                                            onChange={(e) => setCatatanTeknisi(e.target.value)}
                                            placeholder="Jelaskan tindakan perbaikan yang dilakukan..."
                                            className="w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-[hsl(var(--primary))] px-3 py-2 shadow-2xs"
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedReport(null)}
                                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="flex-[2] py-2.5 px-4 rounded-xl text-xs font-bold bg-[hsl(var(--primary))] text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                                        >
                                            <Send size={14} /> {isUpdating ? 'Simpan...' : 'Simpan Perubahan'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Modal Detail Laporan */}
                <AnimatePresence>
                    {detailReport && (
                        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 overflow-hidden"
                            >
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <h3 className="font-bold text-slate-900 text-base">Rincian Laporan Kendala</h3>
                                    <button onClick={() => setDetailReport(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="space-y-3 text-xs sm:text-sm">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Aset</p>
                                        <p className="font-bold text-slate-800">{detailReport.asset?.nama}</p>
                                        <p className="text-xs text-slate-500 font-mono mt-0.5">{detailReport.asset?.nomor_inventaris}</p>
                                        {detailReport.asset?.location && (
                                            <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                                                <MapPin size={12} className="text-emerald-500" /> {detailReport.asset.location.full_path || detailReport.asset.location.nama}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Pelapor</p>
                                            <p className="font-bold text-slate-800">{detailReport.nama_pelapor}</p>
                                        </div>
                                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Kelas</p>
                                            <p className="font-bold text-slate-800">{detailReport.kelas}</p>
                                        </div>
                                    </div>

                                    <div className="bg-red-50/70 border border-red-200/80 p-3 rounded-xl">
                                        <p className="text-[10px] font-bold text-red-700 uppercase mb-1">Deskripsi Kendala</p>
                                        <p className="text-xs text-red-950 font-medium leading-relaxed">{detailReport.deskripsi_kendala}</p>
                                    </div>

                                    {detailReport.catatan_teknisi && (
                                        <div className="bg-blue-50/70 border border-blue-200/80 p-3 rounded-xl">
                                            <p className="text-[10px] font-bold text-blue-700 uppercase mb-1">Catatan Teknisi / Penanganan</p>
                                            <p className="text-xs text-blue-950 font-medium leading-relaxed">{detailReport.catatan_teknisi}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={() => setDetailReport(null)}
                                        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </PageTransition>
        </AuthenticatedLayout>
    );
}
