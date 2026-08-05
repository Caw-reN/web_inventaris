import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import StatusBadge from '@/Components/StatusBadge';
import QrCodeCard from '@/Components/QrCodeCard';
import AuditLogTimeline from '@/Components/AuditLogTimeline';
import BorrowModal from '../Loans/BorrowModal';
import ReturnModal from '../Loans/ReturnModal';
import { ArrowLeft, Edit, MapPin, Tag, Calendar, DollarSign, Activity, FileWarning, Warehouse, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useState } from 'react';

export default function Show({ asset, auditLog, borrowers = [] }) {
    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const activeLoan = asset.loans?.find(l => l.status === 'dipinjam');

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight">Detail Aset</h2>}>
            <Head title={`Aset: ${asset.nama}`} />

            <PageTransition>
                <div className="w-full pb-10">
                    <div className="flex justify-between items-center mb-6">
                        <Link href={route('assets.index')} className="text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 text-sm font-medium">
                            <ArrowLeft size={16} /> Kembali ke Daftar
                        </Link>
                        <div className="flex gap-2">
                            {asset.status === 'tersedia' && (
                                <button 
                                    onClick={() => setShowBorrowModal(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                >
                                    <ArrowUpCircle size={16} /> Pinjamkan
                                </button>
                            )}
                            {asset.status === 'digunakan' && activeLoan && (
                                <button 
                                    onClick={() => setShowReturnModal(true)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                >
                                    <ArrowDownCircle size={16} /> Kembalikan
                                </button>
                            )}
                            <Link href={route('assets.edit', asset.id)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                                <Edit size={16} /> Edit Aset
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Kolom Kiri: Detail Utama */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                                    {asset.foto ? (
                                        <img src={`/storage/${asset.foto}`} alt={asset.nama} className="w-full md:w-48 h-48 object-cover rounded-xl border border-slate-200" />
                                    ) : (
                                        <div className="w-full md:w-48 h-48 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center">
                                            <span className="text-slate-400 font-medium">Tidak ada foto</span>
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h1 className="text-2xl font-bold text-slate-900">{asset.nama}</h1>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-bold text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)] px-2 py-0.5 rounded tracking-wide">
                                                        {asset.nomor_inventaris || '-'}
                                                    </span>
                                                    <p className="text-sm text-slate-500">SN: {asset.no_seri || '-'}</p>
                                                </div>
                                            </div>
                                            <StatusBadge status={asset.status} label={asset.status_label} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div>
                                                <p className="text-xs text-slate-500 flex items-center gap-1"><Tag size={14}/> Kategori</p>
                                                <p className="font-medium text-slate-800 mt-1">{asset.category?.nama || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={14}/> Lokasi</p>
                                                <p className="font-medium text-slate-800 mt-1">{asset.location?.nama || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 flex items-center gap-1"><Activity size={14}/> Merk / Brand</p>
                                                <p className="font-medium text-slate-800 mt-1">{asset.merk || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={14}/> Tanggal Beli</p>
                                                <p className="font-medium text-slate-800 mt-1">{asset.tanggal_beli ? new Date(asset.tanggal_beli).toLocaleDateString('id-ID') : '-'}</p>
                                            </div>
                                            {/* Sembunyikan Harga Beli untuk non-admin jika diperlukan, tapi ini internal view */}
                                            <div>
                                                <p className="text-xs text-slate-500 flex items-center gap-1"><DollarSign size={14}/> Harga Beli</p>
                                                <p className="font-medium text-slate-800 mt-1">
                                                    {asset.harga_beli ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(asset.harga_beli) : '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {asset.catatan && (
                                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Catatan Tambahan</p>
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{asset.catatan}</p>
                                    </div>
                                )}
                            </div>

                            {/* Riwayat Laporan Kendala */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <FileWarning size={18} className="text-red-500" /> Riwayat Laporan Kendala
                                    </h3>
                                </div>
                                <div className="p-0">
                                    {asset.reports.length === 0 ? (
                                        <p className="p-6 text-center text-sm text-slate-500">Belum ada laporan kendala pada aset ini.</p>
                                    ) : (
                                        <ul className="divide-y divide-slate-100">
                                            {asset.reports.map(report => (
                                                <li key={report.id} className="p-4 hover:bg-slate-50">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="font-medium text-sm text-slate-900">{report.nama_pelapor}</span>
                                                        <StatusBadge status={report.status} label={report.status_label} />
                                                    </div>
                                                    <p className="text-sm text-slate-600 line-clamp-2">{report.deskripsi_kendala}</p>
                                                    <p className="text-xs text-slate-400 mt-2">{new Date(report.created_at).toLocaleString('id-ID')}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            {/* Riwayat Peminjaman */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <Warehouse size={18} className="text-indigo-500" /> Riwayat Peminjaman
                                    </h3>
                                </div>
                                <div className="p-0">
                                    {!asset.loans || asset.loans.length === 0 ? (
                                        <p className="p-6 text-center text-sm text-slate-500">Belum ada riwayat peminjaman pada aset ini.</p>
                                    ) : (
                                        <ul className="divide-y divide-slate-100">
                                            {asset.loans.map(loan => (
                                                <li key={loan.id} className="p-4 hover:bg-slate-50">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="font-medium text-sm text-slate-900">{loan.nama_peminjam}</span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                            loan.status === 'dipinjam' ? 'bg-amber-100 text-amber-800' : 
                                                            loan.status === 'dikembalikan' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {loan.status === 'dipinjam' ? 'Sedang Dipinjam' : loan.status === 'dikembalikan' ? 'Dikembalikan' : 'Terlambat'}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                                                        <div>
                                                            <p className="text-slate-500 mb-1">Pinjam:</p>
                                                            <p className="font-medium text-slate-700">{new Date(loan.tanggal_pinjam).toLocaleDateString('id-ID')}</p>
                                                            {loan.foto_pinjam && (
                                                                <a href={`/storage/${loan.foto_pinjam}`} target="_blank" className="text-indigo-500 hover:underline mt-1 block">Lihat Foto</a>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-slate-500 mb-1">Kembali:</p>
                                                            <p className="font-medium text-slate-700">{loan.tanggal_kembali ? new Date(loan.tanggal_kembali).toLocaleDateString('id-ID') : '-'}</p>
                                                            {loan.foto_kembali && (
                                                                <a href={`/storage/${loan.foto_kembali}`} target="_blank" className="text-emerald-500 hover:underline mt-1 block">Lihat Foto</a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: QR Code & Audit Trail */}
                        <div className="space-y-6">
                            <QrCodeCard asset={asset} />

                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-100">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <Activity size={18} className="text-blue-500" /> Riwayat Aktivitas
                                    </h3>
                                </div>
                                <div className="p-4 max-h-[500px] overflow-y-auto">
                                    <AuditLogTimeline logs={auditLog} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageTransition>

            <BorrowModal 
                show={showBorrowModal} 
                onClose={() => setShowBorrowModal(false)} 
                asset={asset} 
                borrowers={borrowers} 
            />

            <ReturnModal 
                show={showReturnModal} 
                onClose={() => setShowReturnModal(false)} 
                loan={activeLoan} 
            />
        </AuthenticatedLayout>
    );
}
