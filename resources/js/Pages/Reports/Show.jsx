import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import { ArrowLeft, MapPin, Tag, Calendar, User, Clock, CheckCircle2, Wrench, Send, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function Show({ report }) {
    const { data, setData, put, processing } = useForm({
        status: report.status,
        catatan_teknisi: report.catatan_teknisi || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('reports.update', report.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight">Detail Laporan Kendala</h2>}>
            <Head title={`Laporan #${report.id}`} />

            <PageTransition>
                <div className="max-w-3xl mx-auto space-y-6 pb-12">
                    <div className="flex items-center justify-between">
                        <Link href={route('reports.index')} className="text-slate-500 hover:text-slate-700 inline-flex items-center gap-1.5 text-sm font-medium">
                            <ArrowLeft size={16} /> Kembali ke Daftar Laporan
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">Laporan Kendala #{report.id}</h1>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Dilaporkan pada: {new Date(report.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>

                        {/* Rincian Aset */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aset Terkait</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800 text-base">{report.asset?.nama}</p>
                                    <p className="text-xs font-mono text-slate-500">{report.asset?.nomor_inventaris}</p>
                                </div>
                                {report.asset && (
                                    <Link href={route('assets.show', report.asset.id)} className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                                        Lihat Detail Aset
                                    </Link>
                                )}
                            </div>
                            {report.asset?.location && (
                                <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                                    <MapPin size={13} className="text-emerald-500" /> {report.asset.location.full_path || report.asset.location.nama}
                                </p>
                            )}
                        </div>

                        {/* Info Pelapor & Kendala */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Pelapor</p>
                                    <p className="font-bold text-slate-800">{report.nama_pelapor}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Kelas</p>
                                    <p className="font-bold text-slate-800">{report.kelas}</p>
                                </div>
                            </div>

                            <div className="bg-red-50/70 border border-red-200/80 p-4 rounded-xl">
                                <p className="text-[10px] font-bold text-red-700 uppercase mb-1 flex items-center gap-1">
                                    <AlertTriangle size={13} /> Deskripsi Kendala
                                </p>
                                <p className="text-sm text-red-950 font-medium leading-relaxed">{report.deskripsi_kendala}</p>
                            </div>
                        </div>

                        {/* Form Update Status Teknisi */}
                        <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-100 space-y-4">
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <Wrench size={16} className="text-[hsl(var(--primary))]" /> Update Status & Catatan Perbaikan
                            </h3>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Status Penanganan <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setData('status', 'open')}
                                        className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                            data.status === 'open'
                                                ? 'border-amber-400 bg-amber-50/80 text-amber-900 ring-2 ring-amber-400/20'
                                                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1.5">
                                            <div className={`p-1.5 rounded-lg ${data.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200/80 text-slate-500'}`}>
                                                <Clock size={16} />
                                            </div>
                                            {data.status === 'open' && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
                                        </div>
                                        <span className="font-bold text-xs">Menunggu</span>
                                        <span className="text-[10px] text-slate-500 mt-0.5">Belum ditangani</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setData('status', 'in_progress')}
                                        className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                            data.status === 'in_progress'
                                                ? 'border-blue-500 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20'
                                                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1.5">
                                            <div className={`p-1.5 rounded-lg ${data.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200/80 text-slate-500'}`}>
                                                <Wrench size={16} />
                                            </div>
                                            {data.status === 'in_progress' && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                                        </div>
                                        <span className="font-bold text-xs">Sedang Diproses</span>
                                        <span className="text-[10px] text-slate-500 mt-0.5">Teknisi memperbaiki</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setData('status', 'resolved')}
                                        className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                            data.status === 'resolved'
                                                ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20'
                                                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1.5">
                                            <div className={`p-1.5 rounded-lg ${data.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200/80 text-slate-500'}`}>
                                                <CheckCircle2 size={16} />
                                            </div>
                                            {data.status === 'resolved' && <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />}
                                        </div>
                                        <span className="font-bold text-xs">Selesai Ditangani</span>
                                        <span className="text-[10px] text-slate-500 mt-0.5">Perbaikan tuntas</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Catatan Teknisi / Tindakan Perbaikan</label>
                                <textarea
                                    rows="3"
                                    value={data.catatan_teknisi}
                                    onChange={e => setData('catatan_teknisi', e.target.value)}
                                    placeholder="Tuliskan detail perbaikan yang telah dilakukan..."
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-[hsl(var(--primary))] px-3 py-2 shadow-2xs"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs bg-[hsl(var(--primary))] text-white hover:opacity-90 transition-opacity shadow-xs"
                            >
                                <Send size={14} /> {processing ? 'Menyimpan...' : 'Simpan Update Laporan'}
                            </button>
                        </form>
                    </div>
                </div>
            </PageTransition>
        </AuthenticatedLayout>
    );
}
