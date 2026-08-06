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

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Status Penanganan</label>
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-[hsl(var(--primary))] px-3 py-2 font-medium"
                                >
                                    <option value="open">⏳ Menunggu (Open)</option>
                                    <option value="in_progress">⚙️ Sedang Diproses (In Progress)</option>
                                    <option value="resolved">✅ Selesai Ditangani (Resolved)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Catatan Teknisi / Tindakan Perbaikan</label>
                                <textarea
                                    rows="3"
                                    value={data.catatan_teknisi}
                                    onChange={e => setData('catatan_teknisi', e.target.value)}
                                    placeholder="Tuliskan detail perbaikan yang telah dilakukan..."
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:ring-[hsl(var(--primary))] px-3 py-2"
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
