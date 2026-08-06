import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import StatusBadge from '@/Components/StatusBadge';
import SecondaryButton from '@/Components/SecondaryButton';
import { 
    X, User, UserCheck, Clock, CheckCircle2, 
    CalendarDays, Image as ImageIcon, ZoomIn, 
    ArrowDownCircle, Package
} from 'lucide-react';

export default function DetailModal({ loan, show, onClose, onReturn }) {
    const [activePreviewImage, setActivePreviewImage] = useState(null);

    // Reset preview foto jika modal ditutup atau ganti data peminjaman
    useEffect(() => {
        if (!show) {
            setActivePreviewImage(null);
        }
    }, [show, loan]);

    // Intersepsi tombol Escape: jika foto sedang diperbesar, hanya tutup fotonya saja
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && activePreviewImage) {
                e.stopPropagation();
                e.preventDefault();
                setActivePreviewImage(null);
            }
        };
        if (activePreviewImage) {
            window.addEventListener('keydown', handleKeyDown, true);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [activePreviewImage]);

    if (!loan) return null;

    // Handler penutup modal yang cerdas: prioritaskan menutup foto jika sedang aktif
    const handleModalClose = () => {
        if (activePreviewImage) {
            setActivePreviewImage(null);
            return;
        }
        onClose();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        }) + ' WIB';
    };

    const statusLabels = {
        'dipinjam': 'Sedang Dipinjam',
        'dikembalikan': 'Dikembalikan',
        'terlambat': 'Terlambat'
    };

    return (
        <>
            <Modal show={show} onClose={handleModalClose} maxWidth="lg">
                <div className="p-5 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {/* Header Modal */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <Package size={18} className="text-[hsl(var(--primary))]" />
                            <h2 className="text-base font-bold text-slate-900">
                                Detail Peminjaman Aset
                            </h2>
                        </div>
                        <button 
                            type="button"
                            onClick={handleModalClose} 
                            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Ringkasan Aset & Status */}
                    <div className="mt-4 bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">
                                {loan.asset?.nama || 'Aset Dihapus'}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                                <span className="font-mono text-[hsl(var(--primary))] font-semibold">
                                    {loan.asset?.nomor_inventaris || 'TANPA NO. INV'}
                                </span>
                                {loan.asset?.merk && (
                                    <span>• {loan.asset.merk}</span>
                                )}
                            </div>
                        </div>
                        <StatusBadge 
                            status={loan.status} 
                            label={statusLabels[loan.status] || loan.status} 
                            className="px-2.5 py-0.5 text-[11px] font-semibold" 
                        />
                    </div>

                    {/* Info Peminjam & Admin */}
                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                            <span className="text-slate-400 font-medium flex items-center gap-1 mb-0.5">
                                <User size={12} className="text-[hsl(var(--primary))]" /> Peminjam
                            </span>
                            <p className="text-slate-900 font-semibold">{loan.nama_peminjam}</p>
                        </div>
                        <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                            <span className="text-slate-400 font-medium flex items-center gap-1 mb-0.5">
                                <UserCheck size={12} className="text-[hsl(var(--primary))]" /> Admin Pencatat
                            </span>
                            <p className="text-slate-800 font-medium truncate">{loan.user?.name || 'Sistem'}</p>
                        </div>
                    </div>

                    {/* Linimasa Waktu */}
                    <div className="mt-4 space-y-2 text-xs">
                        <h4 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                            <CalendarDays size={13} className="text-[hsl(var(--primary))]" /> Informasi Waktu
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tgl & Jam Pinjam</span>
                                <span className="font-bold text-slate-800 block mt-0.5">{formatDate(loan.tanggal_pinjam)}</span>
                                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                                    <Clock size={10} /> {formatTime(loan.tanggal_pinjam)}
                                </span>
                            </div>

                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="text-amber-600 block text-[10px] uppercase font-semibold">Batas Waktu</span>
                                <span className="font-bold text-slate-800 block mt-0.5">
                                    {loan.tenggat_waktu ? formatDate(loan.tenggat_waktu) : 'Tanpa batas'}
                                </span>
                            </div>

                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="text-emerald-600 block text-[10px] uppercase font-semibold flex items-center gap-1">
                                    {loan.tanggal_kembali ? <CheckCircle2 size={10} /> : <Clock size={10} />} Waktu Kembali
                                </span>
                                {loan.tanggal_kembali ? (
                                    <>
                                        <span className="font-bold text-slate-800 block mt-0.5">{formatDate(loan.tanggal_kembali)}</span>
                                        <span className="text-[11px] text-emerald-600 font-mono font-medium flex items-center gap-1 mt-0.5">
                                            <Clock size={10} /> {formatTime(loan.tanggal_kembali)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="font-semibold text-amber-600 block mt-0.5">Belum Kembali</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dokumentasi & Foto */}
                    <div className="mt-4 text-xs">
                        <h4 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                            <ImageIcon size={13} className="text-[hsl(var(--primary))]" /> Catatan & Foto Kondisi
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Saat Pinjam */}
                            <div className="border border-slate-200 rounded-lg p-2.5 bg-white">
                                <span className="font-semibold text-slate-700 block text-[11px] border-b border-slate-100 pb-1 mb-2">
                                    Saat Dipinjam
                                </span>
                                {loan.catatan_pinjam && (
                                    <p className="text-slate-600 bg-slate-50 p-2 rounded text-[11px] italic mb-2">
                                        &quot;{loan.catatan_pinjam}&quot;
                                    </p>
                                )}
                                {loan.foto_pinjam ? (
                                    <button 
                                        type="button"
                                        onClick={() => setActivePreviewImage({ 
                                            url: `/storage/${loan.foto_pinjam}`, 
                                            title: `Foto Kondisi Awal - ${loan.asset?.nama}` 
                                        })}
                                        className="group relative block w-full text-left rounded overflow-hidden border border-slate-200 cursor-pointer"
                                    >
                                        <img 
                                            src={`/storage/${loan.foto_pinjam}`} 
                                            alt="Foto Pinjam" 
                                            className="w-full h-28 object-cover group-hover:scale-105 transition-transform" 
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] gap-1.5 font-medium">
                                            <ZoomIn size={14} /> Perbesar Foto
                                        </div>
                                    </button>
                                ) : (
                                    <div className="h-20 bg-slate-50 border border-dashed border-slate-200 rounded flex flex-col items-center justify-center text-slate-400 text-[11px]">
                                        <ImageIcon size={16} className="mb-0.5" />
                                        <span>Tidak ada foto</span>
                                    </div>
                                )}
                            </div>

                            {/* Saat Kembali */}
                            <div className="border border-slate-200 rounded-lg p-2.5 bg-white">
                                <span className="font-semibold text-slate-700 block text-[11px] border-b border-slate-100 pb-1 mb-2">
                                    Saat Dikembalikan
                                </span>
                                {loan.status === 'dikembalikan' || loan.tanggal_kembali ? (
                                    <>
                                        {loan.catatan_kembali && (
                                            <p className="text-slate-600 bg-slate-50 p-2 rounded text-[11px] italic mb-2">
                                                &quot;{loan.catatan_kembali}&quot;
                                            </p>
                                        )}
                                        {loan.foto_kembali ? (
                                            <button 
                                                type="button"
                                                onClick={() => setActivePreviewImage({ 
                                                    url: `/storage/${loan.foto_kembali}`, 
                                                    title: `Foto Kondisi Pengembalian - ${loan.asset?.nama}` 
                                                })}
                                                className="group relative block w-full text-left rounded overflow-hidden border border-slate-200 cursor-pointer"
                                            >
                                                <img 
                                                    src={`/storage/${loan.foto_kembali}`} 
                                                    alt="Foto Kembali" 
                                                    className="w-full h-28 object-cover group-hover:scale-105 transition-transform" 
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] gap-1.5 font-medium">
                                                    <ZoomIn size={14} /> Perbesar Foto
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="h-20 bg-slate-50 border border-dashed border-slate-200 rounded flex flex-col items-center justify-center text-slate-400 text-[11px]">
                                                <ImageIcon size={16} className="mb-0.5" />
                                                <span>Tidak ada foto</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="h-24 bg-slate-50/60 rounded flex flex-col items-center justify-center text-slate-400 text-center p-2 text-[11px]">
                                        <span>Belum dikembalikan</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
                        <SecondaryButton onClick={handleModalClose} className="px-3 py-1.5 text-xs">
                            Tutup
                        </SecondaryButton>

                        {loan.status === 'dipinjam' && onReturn && (
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onReturn(loan);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs transition-colors shadow-xs"
                            >
                                <ArrowDownCircle size={14} /> Kembalikan Aset
                            </button>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Overlay Lightbox Popup Perbesar Foto (Independen dari Modal Utama) */}
            {activePreviewImage && (
                <div 
                    className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setActivePreviewImage(null)}
                >
                    <div 
                        className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-slate-100 flex flex-col items-center relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-sm font-bold text-slate-800">{activePreviewImage.title}</span>
                            <button 
                                type="button"
                                onClick={() => setActivePreviewImage(null)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="my-3 flex items-center justify-center w-full max-h-[75vh] overflow-hidden bg-slate-50/80 rounded-xl p-2 border border-slate-100">
                            <img 
                                src={activePreviewImage.url} 
                                alt={activePreviewImage.title} 
                                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
