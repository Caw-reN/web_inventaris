import { Head, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import StatusBadge from '@/Components/StatusBadge';
import { Tag, MapPin, Activity, AlertTriangle, Send } from 'lucide-react';
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
            <Head title={`Info Aset: ${asset.nama}`} />

            {/* Jika ada error flash global */}
            {flash.error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                    {flash.error}
                </div>
            )}

            <div className="text-center mb-6">
                <StatusBadge status={asset.status} label={asset.status_label} className="mb-3 text-sm px-3 py-1" />
                <h2 className="text-2xl font-bold text-white mb-1">{asset.nama}</h2>
                <p className="text-slate-400 text-sm">SN: {asset.no_seri || '-'}</p>
            </div>

            {asset.foto && (
                <div className="mb-6 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <img src={asset.foto} alt={asset.nama} className="w-full h-48 object-cover" />
                </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-1"><Tag size={12}/> Kategori</p>
                    <p className="text-sm font-medium text-white">{asset.category?.nama || '-'}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-1"><MapPin size={12}/> Lokasi</p>
                    <p className="text-sm font-medium text-white">{asset.location?.nama || '-'}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10 col-span-2">
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-1"><Activity size={12}/> Merk/Brand</p>
                    <p className="text-sm font-medium text-white">{asset.merk || '-'}</p>
                </div>
            </div>

            {asset.catatan && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6">
                    <p className="text-xs text-blue-300 font-semibold mb-1 uppercase tracking-wider">Catatan Publik</p>
                    <p className="text-sm text-blue-100">{asset.catatan}</p>
                </div>
            )}

            <div className="border-t border-white/10 pt-6">
                {!showForm ? (
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg shadow-red-500/20"
                    >
                        <AlertTriangle size={18} /> Lapor Kerusakan / Kendala
                    </button>
                ) : (
                    <AnimatePresence>
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white/5 rounded-xl border border-white/10 p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertTriangle size={18} className="text-red-400" />
                                    <h3 className="font-semibold text-white">Form Laporan Kendala</h3>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-300">Nama Pelapor <span className="text-red-400">*</span></label>
                                        <input type="text" value={data.nama_pelapor} onChange={e => setData('nama_pelapor', e.target.value)} required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-[hsl(var(--primary))] px-3 py-2" />
                                        {errors.nama_pelapor && <p className="text-red-400 text-xs">{errors.nama_pelapor}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-300">Kelas / Unit (Opsional)</label>
                                        <input type="text" value={data.kelas} onChange={e => setData('kelas', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-[hsl(var(--primary))] px-3 py-2" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-300">Deskripsi Kendala <span className="text-red-400">*</span></label>
                                        <textarea rows="3" value={data.deskripsi_kendala} onChange={e => setData('deskripsi_kendala', e.target.value)} required
                                            placeholder="Jelaskan kerusakan yang terjadi..."
                                            className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-[hsl(var(--primary))] px-3 py-2" />
                                        {errors.deskripsi_kendala && <p className="text-red-400 text-xs">{errors.deskripsi_kendala}</p>}
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 px-3 rounded-lg text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 transition-colors">
                                            Batal
                                        </button>
                                        <button type="submit" disabled={processing} className="flex-[2] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium bg-[hsl(var(--primary))] text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                                            <Send size={16} /> {processing ? 'Mengirim...' : 'Kirim Laporan'}
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
