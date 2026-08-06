import { Head, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import StatusBadge from '@/Components/StatusBadge';
import { Tag, MapPin, Activity, AlertTriangle, Send, Info, ShieldAlert, Cpu } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AssetDetail({ asset }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        nama_pelapor: '',
        kelas: '',
        deskripsi_kendala: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('public.report', asset.uuid));
    };

    return (
        <GuestLayout>
            <Head title={`Informasi Aset: ${asset.nama}`} />

            {/* Flash message */}
            {flash?.error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2 shadow-xs">
                    <AlertTriangle size={16} className="shrink-0 text-red-500" />
                    <span>{flash.error}</span>
                </div>
            )}

            {/* Header / Status & Title */}
            <div className="text-center pb-5 mb-5 border-b border-slate-100">
                <div className="inline-flex justify-center mb-3">
                    <StatusBadge status={asset.status} label={asset.status_label} className="text-xs px-3 py-1 rounded-full shadow-2xs font-semibold" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">{asset.nama}</h2>
                <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">No. Seri / UUID:</span>
                    <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                        {asset.no_seri || asset.uuid.substring(0, 8)}
                    </span>
                </div>
            </div>

            {/* Foto Aset (Jika ada) */}
            {asset.foto && (
                <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-md max-h-56 bg-slate-100">
                    <img src={asset.foto} alt={asset.nama} className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300" />
                </div>
            )}

            {/* Informational Cards Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 shadow-2xs">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Tag size={13} className="text-indigo-500" /> Kategori
                    </p>
                    <p className="text-sm font-bold text-slate-800 truncate">{asset.category?.nama || '-'}</p>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 shadow-2xs">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <MapPin size={13} className="text-emerald-500" /> Lokasi
                    </p>
                    <p className="text-sm font-bold text-slate-800 truncate" title={asset.location?.full_path || asset.location?.nama}>
                        {asset.location?.full_path || asset.location?.nama || 'Belum Diset'}
                    </p>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 shadow-2xs col-span-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Cpu size={13} className="text-amber-500" /> Merk / Brand
                    </p>
                    <p className="text-sm font-bold text-slate-800">{asset.merk || '-'}</p>
                </div>
            </div>

            {/* Catatan Publik (Jika ada) */}
            {asset.catatan && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 mb-6 shadow-2xs">
                    <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Info size={14} className="text-amber-600" /> Catatan / Keterangan
                    </p>
                    <p className="text-xs text-amber-900 leading-relaxed font-medium">{asset.catatan}</p>
                </div>
            )}

            {/* Form Lapor Kerusakan / Kendala */}
            <div className="pt-4 border-t border-slate-100">
                {!showForm ? (
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
                    >
                        <ShieldAlert size={18} /> Lapor Kerusakan / Kendala
                    </button>
                ) : (
                    <AnimatePresence>
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-inner space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                                            <AlertTriangle size={16} />
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-sm">Form Laporan Kendala</h3>
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                        Portal Publik
                                    </span>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-3.5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">Nama Pelapor <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            value={data.nama_pelapor} 
                                            onChange={e => setData('nama_pelapor', e.target.value)} 
                                            required
                                            placeholder="Masukkan nama lengkap Anda..."
                                            className="w-full bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] px-3 py-2 shadow-2xs" 
                                        />
                                        {errors.nama_pelapor && <p className="text-red-500 text-xs mt-0.5">{errors.nama_pelapor}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">Kelas / Unit Workstation (Opsional)</label>
                                        <input 
                                            type="text" 
                                            value={data.kelas} 
                                            onChange={e => setData('kelas', e.target.value)}
                                            placeholder="Contoh: XII TKJ 1 / Meja Server 3..."
                                            className="w-full bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] px-3 py-2 shadow-2xs" 
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">Deskripsi Kendala <span className="text-red-500">*</span></label>
                                        <textarea 
                                            rows="3" 
                                            value={data.deskripsi_kendala} 
                                            onChange={e => setData('deskripsi_kendala', e.target.value)} 
                                            required
                                            placeholder="Jelaskan secara rinci kendala atau kerusakan yang ditemukan..."
                                            className="w-full bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] px-3 py-2 shadow-2xs" 
                                        />
                                        {errors.deskripsi_kendala && <p className="text-red-500 text-xs mt-0.5">{errors.deskripsi_kendala}</p>}
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowForm(false)} 
                                            className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={processing} 
                                            className="flex-[2] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
                                        >
                                            <Send size={14} /> {processing ? 'Mengirim...' : 'Kirim Laporan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </GuestLayout>
    );
}
