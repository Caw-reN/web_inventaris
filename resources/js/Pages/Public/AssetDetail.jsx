import { Head, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import StatusBadge from '@/Components/StatusBadge';
import { Tag, MapPin, AlertTriangle, Send, Info, ShieldAlert, Cpu, Barcode, Calendar, UserCheck, Wrench, ShieldCheck, Camera, Image as ImageIcon, Maximize2, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AssetDetail({ asset }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        nama_pelapor: '',
        kelas: '',
        deskripsi_kendala: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('public.report', asset.uuid));
    };

    // Helper untuk merender spesifikasi jika berupa object/array
    const renderSpesifikasi = () => {
        if (!asset.spesifikasi) return null;
        if (typeof asset.spesifikasi === 'object' && Object.keys(asset.spesifikasi).length > 0) {
            return (
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-4 mb-5 shadow-2xs">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Wrench size={13} className="text-indigo-500" /> Spesifikasi Teknis
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(asset.spesifikasi).map(([key, val]) => (
                            <div key={key} className="bg-white p-2 rounded-lg border border-slate-200/60">
                                <span className="font-semibold text-slate-500 block text-[10px] uppercase">{key}</span>
                                <span className="font-bold text-slate-800">{String(val)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        if (typeof asset.spesifikasi === 'string' && asset.spesifikasi.trim() !== '') {
            return (
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-4 mb-5 shadow-2xs">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Wrench size={13} className="text-indigo-500" /> Spesifikasi Teknis
                    </p>
                    <p className="text-xs font-medium text-slate-700 leading-relaxed">{asset.spesifikasi}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <GuestLayout>
            <Head title={`Informasi Aset: ${asset.nama}`} />

            {/* Flash notification */}
            {flash?.error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2 shadow-xs">
                    <AlertTriangle size={16} className="shrink-0 text-red-500" />
                    <span>{flash.error}</span>
                </div>
            )}

            {/* Status & Title Header */}
            <div className="text-center pb-5 mb-5 border-b border-slate-100">
                <div className="inline-flex justify-center mb-3">
                    <StatusBadge status={asset.status} label={asset.status_label} className="text-xs px-3.5 py-1 rounded-full shadow-2xs font-bold" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">{asset.nama}</h2>

                {/* Identification Badges */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)] px-2.5 py-1 rounded-lg border border-[hsl(var(--primary)/0.2)]">
                        <Barcode size={14} /> {asset.nomor_inventaris || 'REG-UNSET'}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        SN: {asset.no_seri || '-'}
                    </span>
                </div>
            </div>

            {/* Banner Status Peminjaman Aktif (Jika Sedang Dipinjam) */}
            {asset.status === 'digunakan' && asset.active_loan && (
                <div className="mb-5 bg-blue-50/90 border border-blue-200/80 rounded-xl p-3.5 flex items-start gap-3 shadow-2xs">
                    <div className="p-2 bg-blue-500 text-white rounded-lg shrink-0 mt-0.5">
                        <UserCheck size={16} />
                    </div>
                    <div className="text-xs">
                        <p className="font-bold text-blue-900 text-xs">Sedang Dipinjam</p>
                        <p className="font-semibold text-blue-800 mt-0.5">
                            {asset.active_loan.peminjam} {asset.active_loan.kelas_unit ? `(${asset.active_loan.kelas_unit})` : ''}
                        </p>
                        <p className="text-[11px] text-blue-600 mt-0.5">
                            Sejak: {asset.active_loan.tanggal_pinjam || '-'}
                        </p>
                    </div>
                </div>
            )}

            {/* Frame Foto Fisik Aset */}
            <div className="mb-5">
                {asset.foto ? (
                    <div 
                        onClick={() => setIsImageModalOpen(true)}
                        className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 cursor-pointer"
                    >
                        <img 
                            src={asset.foto} 
                            alt={asset.nama} 
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                        
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                            <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
                                <Camera size={13} /> Foto Fisik Aset
                            </span>
                            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium hover:bg-white/30 transition-colors">
                                <Maximize2 size={12} /> Perbesar
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200/80 p-5 bg-slate-50/60 text-center flex flex-col items-center justify-center">
                        <div className="w-11 h-11 rounded-2xl bg-white text-slate-400 flex items-center justify-center mb-2 border border-slate-200/80 shadow-2xs">
                            <ImageIcon size={22} />
                        </div>
                        <p className="text-xs font-bold text-slate-700">Foto Fisik Belum Diunggah</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Admin dapat mengunggah foto melalui halaman Edit Aset.</p>
                    </div>
                )}
            </div>

            {/* Grid 4 Kartu Informasi Utama */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
                {/* Kategori */}
                <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <Tag size={12} className="text-indigo-500 shrink-0" /> Kategori
                    </p>
                    <p className="text-xs font-bold text-slate-800 truncate" title={asset.category?.nama}>
                        {asset.category?.nama || '-'}
                    </p>
                </div>

                {/* Merk/Brand */}
                <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <Cpu size={12} className="text-amber-500 shrink-0" /> Merk / Brand
                    </p>
                    <p className="text-xs font-bold text-slate-800 truncate" title={asset.merk}>
                        {asset.merk || '-'}
                    </p>
                </div>

                {/* Lokasi Penempatan (Full Width) */}
                <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 shadow-2xs col-span-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <MapPin size={12} className="text-emerald-500 shrink-0" /> Lokasi Penempatan
                    </p>
                    <p className="text-xs font-bold text-slate-800 leading-snug">
                        {asset.location?.full_path || asset.location?.nama || 'Belum Diset'}
                    </p>
                </div>

                {/* Tanggal / Tahun Pembelian (Jika Ada) */}
                {asset.tanggal_beli && (
                    <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 shadow-2xs col-span-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                            <Calendar size={12} className="text-blue-500 shrink-0" /> Tanggal Registrasi / Pembelian
                        </p>
                        <p className="text-xs font-bold text-slate-800">
                            {asset.tanggal_beli}
                        </p>
                    </div>
                )}
            </div>

            {/* Spesifikasi Teknis */}
            {renderSpesifikasi()}

            {/* Catatan / Keterangan Tambahan (Jika Ada) */}
            {asset.catatan && (
                <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3.5 mb-5 shadow-2xs">
                    <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Info size={13} className="text-amber-600 shrink-0" /> Catatan / Keterangan
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

            {/* Footer Verification Stamp */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-500" /> Informasi Resmi Sistem Inventaris
                </p>
            </div>

            {/* Modal Zoom Foto Aset (Lightbox) */}
            {asset.foto && (
                <AnimatePresence>
                    {isImageModalOpen && (
                        <div 
                            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
                            onClick={() => setIsImageModalOpen(false)}
                        >
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative max-w-2xl w-full flex flex-col items-center"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setIsImageModalOpen(false)}
                                    className="absolute -top-10 right-0 text-white hover:text-slate-300 bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                                <img
                                    src={asset.foto}
                                    alt={asset.nama}
                                    className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-white/20"
                                />
                                <div className="mt-3 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-white text-xs font-semibold text-center">
                                    {asset.nama} — {asset.nomor_inventaris || asset.no_seri}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            )}
        </GuestLayout>
    );
}
