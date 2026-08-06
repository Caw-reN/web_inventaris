import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import DataTable from '@/Components/DataTable';
import BorrowModal from './BorrowModal';
import ReturnModal from './ReturnModal';
import DetailModal from './DetailModal';
import { Plus, Search, Filter, Warehouse, Clock, CalendarDays, ArrowDownCircle, Eye, CheckCircle2 } from 'lucide-react';

export default function Index({ loans, filters, availableAssets = [], borrowers = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const [selectedLoanForReturn, setSelectedLoanForReturn] = useState(null);
    const [selectedLoanForDetail, setSelectedLoanForDetail] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/loans', { search, status }, { preserveState: true });
    };

    const columns = [
        {
            header: 'Aset',
            accessor: 'asset',
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{row.asset?.nama}</span>
                    <span className="text-xs text-slate-500 font-mono mt-0.5">{row.asset?.nomor_inventaris}</span>
                </div>
            )
        },
        {
            header: 'Peminjam',
            accessor: 'nama_peminjam',
            cell: (row) => <span className="font-medium text-slate-700">{row.nama_peminjam}</span>
        },
        {
            header: 'Tanggal Pinjam',
            accessor: 'tanggal_pinjam',
            cell: (row) => (
                <div className="flex flex-col text-sm">
                    <span className="text-slate-800">{new Date(row.tanggal_pinjam).toLocaleDateString('id-ID')}</span>
                    <span className="text-xs text-slate-500">{new Date(row.tanggal_pinjam).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        },
        {
            header: 'Batas / Kembali',
            accessor: 'tenggat_waktu',
            cell: (row) => (
                <div className="flex flex-col text-sm py-0.5">
                    {row.tanggal_kembali ? (
                        <div className="flex flex-col">
                            <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px] uppercase tracking-wide">
                                <CheckCircle2 size={12} /> Dikembalikan pada:
                            </span>
                            <span className="text-slate-800 text-sm font-medium mt-0.5">{new Date(row.tanggal_kembali).toLocaleDateString('id-ID')}</span>
                            <span className="text-xs text-slate-500 font-mono">{new Date(row.tanggal_kembali).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <span className="text-amber-600 font-semibold flex items-center gap-1 text-[11px] uppercase tracking-wide">
                                <CalendarDays size={12} /> Batas Waktu:
                            </span>
                            <span className="text-slate-700 text-sm font-medium mt-0.5">
                                {row.tenggat_waktu ? new Date(row.tenggat_waktu).toLocaleDateString('id-ID') : 'Tanpa batas (Opsional)'}
                            </span>
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            cell: (row) => {
                const colors = {
                    'dipinjam': 'bg-amber-100 text-amber-800 border-amber-200',
                    'dikembalikan': 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    'terlambat': 'bg-red-100 text-red-800 border-red-200',
                };
                const label = row.status === 'dipinjam' ? 'Sedang Dipinjam' : 
                              row.status === 'dikembalikan' ? 'Dikembalikan' : 'Terlambat';
                
                return (
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${colors[row.status]}`}>
                        {label}
                    </span>
                );
            }
        },
        {
            header: 'Aksi',
            headerClassName: 'text-center w-40',
            cellClassName: 'text-center w-40',
            accessor: 'actions',
            cell: (row) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setSelectedLoanForDetail(row)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors border border-slate-200/80 shadow-xs cursor-pointer"
                        title="Lihat Detail Peminjaman & Foto"
                    >
                        <Eye size={14} /> Detail
                    </button>
                    {row.status === 'dipinjam' && (
                        <button
                            onClick={() => setSelectedLoanForReturn(row)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm cursor-pointer"
                            title="Proses Pengembalian Aset"
                        >
                            <ArrowDownCircle size={14} /> Kembalikan
                        </button>
                    )}
                </div>
            )
        },
    ];

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight">Peminjaman Aset</h2>}>
            <Head title="Peminjaman" />

            <PageTransition>
                <div className="w-full pb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <p className="text-slate-500 text-sm">Kelola transaksi peminjaman dan pengembalian aset.</p>
                        <button
                            onClick={() => setShowBorrowModal(true)}
                            className="flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-full md:w-auto shadow-sm"
                        >
                            <Plus size={16} /> Tambah Peminjaman
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="bg-[hsl(var(--primary)/0.1)] p-2 rounded-lg text-[hsl(var(--primary))]">
                                <Warehouse size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Riwayat Peminjaman</h3>
                                <p className="text-sm text-slate-500">Kelola barang yang sedang atau pernah dipinjam.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Cari peminjam / nama aset..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] outline-none"
                                />
                            </div>
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    router.get('/loans', { search, status: e.target.value }, { preserveState: true });
                                }}
                                className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-white focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] outline-none"
                            >
                                <option value="">Semua Status</option>
                                <option value="dipinjam">Dipinjam</option>
                                <option value="dikembalikan">Dikembalikan</option>
                            </select>
                            <button type="submit" className="hidden">Search</button>
                        </form>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <DataTable columns={columns} data={loans} emptyMessage="Belum ada data peminjaman" />
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-3 p-3 bg-slate-50 border-t border-slate-100">
                        {(!loans || !loans.data || loans.data.length === 0) ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
                                Belum ada data peminjaman
                            </div>
                        ) : (
                            loans.data.map(loan => (
                                <div key={loan.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{loan.asset?.nama || 'Aset Tidak Ditemukan'}</h4>
                                            <p className="text-xs text-slate-500 font-mono mt-0.5">{loan.asset?.nomor_inventaris || '-'}</p>
                                        </div>
                                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider shrink-0 ${
                                            loan.status === 'dipinjam' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                            loan.status === 'dikembalikan' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                            'bg-red-100 text-red-800 border-red-200'
                                        }`}>
                                            {loan.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                        <div>
                                            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Peminjam</span>
                                            <span className="font-semibold text-slate-700 truncate block">{loan.nama_peminjam}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Tgl Pinjam</span>
                                            <span className="text-slate-700">{new Date(loan.tanggal_pinjam).toLocaleDateString('id-ID')}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                                        <button
                                            onClick={() => setSelectedLoanForDetail(loan)}
                                            className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                                        >
                                            <Eye size={14} /> Detail
                                        </button>
                                        {loan.status === 'dipinjam' && (
                                            <button
                                                onClick={() => setSelectedLoanForReturn(loan)}
                                                className="flex-1 flex justify-center items-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                                            >
                                                <ArrowDownCircle size={14} /> Kembalikan
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                </div>

                <BorrowModal
                    availableAssets={availableAssets}
                    borrowers={borrowers}
                    show={showBorrowModal}
                    onClose={() => setShowBorrowModal(false)}
                />

                <ReturnModal
                    loan={selectedLoanForReturn}
                    show={!!selectedLoanForReturn}
                    onClose={() => setSelectedLoanForReturn(null)}
                />

                <DetailModal
                    loan={selectedLoanForDetail}
                    show={!!selectedLoanForDetail}
                    onClose={() => setSelectedLoanForDetail(null)}
                    onReturn={(loan) => {
                        setSelectedLoanForDetail(null);
                        setSelectedLoanForReturn(loan);
                    }}
                />
            </PageTransition>
        </AuthenticatedLayout>
    );
}
