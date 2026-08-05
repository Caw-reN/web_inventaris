import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import DataTable from '@/Components/DataTable';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Plus, Search, Trash2, Edit, Eye, X, AlertTriangle } from 'lucide-react';

export default function Index({ consumables, categories, filters }) {
    // Pastikan filters selalu object karena PHP [] (kosong) menjadi Array JS
    const safeFilters = Array.isArray(filters) ? {} : (filters || {});
    const [search, setSearch] = useState(safeFilters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(safeFilters.category_id || '');
    const [stockFilter, setStockFilter] = useState(safeFilters.stock_filter || '');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('consumables.index'), { search, category_id: categoryFilter, stock_filter: stockFilter }, { preserveState: true });
    };

    const handleResetFilters = () => {
        setSearch(''); setCategoryFilter(''); setStockFilter('');
        router.get(route('consumables.index'));
    };

    const handleDelete = () => {
        if (!deleteModal.item) return;
        router.delete(route('consumables.destroy', deleteModal.item.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteModal({ isOpen: false, item: null })
        });
    };

    const columns = [
        {
            header: 'Item',
            accessor: 'nama',
            cell: (row) => (
                <div>
                    <div className="font-medium text-slate-900 flex items-center gap-2">
                        {row.nama}
                        {row.stok <= row.stok_minimum && (
                            <span className="flex items-center text-xs text-red-600 bg-red-100 px-1.5 py-0.5 rounded gap-1" title="Stok Menipis">
                                <AlertTriangle size={12} /> Low
                            </span>
                        )}
                    </div>
                </div>
            )
        },
        { 
            header: 'Kategori', 
            accessor: 'category', 
            cell: row => row.category?.nama ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60 whitespace-nowrap">
                    {row.category.nama}
                </span>
            ) : <span className="text-slate-400">-</span> 
        },
        {
            header: 'Stok Saat Ini',
            accessor: 'stok',
            cell: (row) => (
                <span className={`font-medium ${row.stok <= row.stok_minimum ? 'text-red-600' : 'text-slate-700'}`}>
                    {row.stok} {row.satuan}
                </span>
            )
        },
        { header: 'Stok Min.', accessor: 'stok_minimum' },
        {
            header: 'Aksi',
            cellClassName: 'text-right',
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <Link href={route('consumables.show', row.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Kelola Stok (In/Out)">
                        <Eye size={16} />
                    </Link>
                    <Link href={route('consumables.edit', row.id)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Edit">
                        <Edit size={16} />
                    </Link>
                    <button onClick={() => setDeleteModal({ isOpen: true, item: row })} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight">Daftar Consumable</h2>}>
            <Head title="Daftar Consumable" />

            <PageTransition>
                <div className="w-full pb-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <form onSubmit={handleSearch} className="w-full sm:flex-1 flex flex-wrap gap-2">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari item..."
                                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-[hsl(var(--primary))]"
                                />
                            </div>
                            <select
                                value={categoryFilter}
                                onChange={e => { setCategoryFilter(e.target.value); router.get(route('consumables.index'), { search, category_id: e.target.value, stock_filter: stockFilter }, { preserveState: true }); }}
                                className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:ring-[hsl(var(--primary))]"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.nama}</option>)}
                            </select>
                            <select
                                value={stockFilter}
                                onChange={e => { setStockFilter(e.target.value); router.get(route('consumables.index'), { search, category_id: categoryFilter, stock_filter: e.target.value }, { preserveState: true }); }}
                                className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:ring-[hsl(var(--primary))]"
                            >
                                <option value="">Semua Stok</option>
                                <option value="low_stock">Stok Menipis / Habis</option>
                            </select>
                            {(search || categoryFilter || stockFilter) && (
                                <button type="button" onClick={handleResetFilters} className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1">
                                    <X size={14} /> Reset
                                </button>
                            )}
                        </form>

                        <Link
                            href={route('consumables.create')}
                            className="flex items-center gap-2 bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 whitespace-nowrap"
                        >
                            <Plus size={16} /> Tambah Item
                        </Link>
                    </div>

                    <DataTable columns={columns} data={consumables} />
                </div>
            </PageTransition>

            <ConfirmDialog
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, item: null })}
                onConfirm={handleDelete}
                title="Hapus Consumable"
                description={`Apakah Anda yakin ingin menghapus item "${deleteModal.item?.nama}"? Tindakan ini tidak dapat dibatalkan dan akan menghapus riwayat transaksinya juga.`}
            />
        </AuthenticatedLayout>
    );
}
