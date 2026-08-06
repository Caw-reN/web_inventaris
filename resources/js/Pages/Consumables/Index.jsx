import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import DataTable from '@/Components/DataTable';
import ConfirmDialog from '@/Components/ConfirmDialog';
import CreateModal from './CreateModal';
import UseModal from './UseModal';
import SelectInput from '@/Components/SelectInput';
import { Plus, Search, Trash2, Edit, Eye, X, AlertTriangle, PackageMinus, ChevronDown, ChevronRight } from 'lucide-react';

export default function Index({ consumables, categories, locations, filters }) {
    // Pastikan filters selalu object karena PHP [] (kosong) menjadi Array JS
    const safeFilters = Array.isArray(filters) ? {} : (filters || {});
    const [search, setSearch] = useState(safeFilters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(safeFilters.category_id || '');
    const [stockFilter, setStockFilter] = useState(safeFilters.stock_filter || '');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedItemForUse, setSelectedItemForUse] = useState(null);

    // State untuk shrink / expand kategori di tampilan mobile
    const [collapsedCategories, setCollapsedCategories] = useState({});

    const toggleMobileCategory = (category) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

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
            header: 'Lokasi', 
            accessor: 'location', 
            cell: row => row.location?.nama ? (
                <span className="inline-flex items-center text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {row.location.full_path || row.location.nama}
                </span>
            ) : <span className="text-slate-400 text-xs italic">Belum diset</span> 
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
            headerClassName: 'text-center w-52',
            cellClassName: 'text-center w-52',
            cell: (row) => (
                <div className="flex items-center justify-center gap-1">
                    {/* Fungsi Utama: Tombol Gunakan Berwarna Menonjol */}
                    <button
                        type="button"
                        onClick={() => setSelectedItemForUse(row)}
                        disabled={row.stok <= 0}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(var(--primary))] hover:opacity-90 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                        title={row.stok > 0 ? "Catat Pemakaian Stok" : "Stok Habis"}
                    >
                        <PackageMinus size={14} /> Gunakan
                    </button>

                    {/* Fungsi Sekunder: Ikon Minimalis Pengaturan Data Master */}
                    <div className="flex items-center ml-1 border-l border-slate-200 pl-1 gap-0.5">
                        <Link href={route('consumables.show', row.id)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors" title="Riwayat Transaksi & Detail">
                            <Eye size={15} />
                        </Link>
                        <Link href={route('consumables.edit', row.id)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors" title="Edit Data Master">
                            <Edit size={15} />
                        </Link>
                        <button onClick={() => setDeleteModal({ isOpen: true, item: row })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer" title="Hapus Item">
                            <Trash2 size={15} />
                        </button>
                    </div>
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
                            <SelectInput
                                value={categoryFilter}
                                onChange={val => { setCategoryFilter(val); router.get(route('consumables.index'), { search, category_id: val, stock_filter: stockFilter }, { preserveState: true }); }}
                                options={[
                                    { value: '', label: 'Semua Kategori' },
                                    ...categories.map(c => ({ value: c.id, label: c.nama }))
                                ]}
                                className="min-w-[150px]"
                            />
                            <SelectInput
                                value={stockFilter}
                                onChange={val => { setStockFilter(val); router.get(route('consumables.index'), { search, category_id: categoryFilter, stock_filter: val }, { preserveState: true }); }}
                                options={[
                                    { value: '', label: 'Semua Stok' },
                                    { value: 'low_stock', label: 'Stok Menipis / Habis' }
                                ]}
                                className="min-w-[140px]"
                            />
                            {(search || categoryFilter || stockFilter) && (
                                <button type="button" onClick={handleResetFilters} className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1">
                                    <X size={14} /> Reset
                                </button>
                            )}
                        </form>

                        <button
                            type="button"
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 whitespace-nowrap shadow-xs cursor-pointer"
                        >
                            <Plus size={16} /> Tambah Item
                        </button>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <DataTable 
                            columns={columns} 
                            data={consumables} 
                            groupBy={[(row) => row.category?.nama || 'Tanpa Kategori']}
                        />
                    </div>

                    {/* Mobile View (Grouped by Category) */}
                    <div className="md:hidden space-y-4">
                        {consumables.data.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                                <p className="text-slate-500 text-sm">Tidak ada data yang ditemukan.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(
                                    consumables.data.reduce((acc, item) => {
                                        const category = item.category?.nama || 'Tanpa Kategori';
                                        if (!acc[category]) acc[category] = [];
                                        acc[category].push(item);
                                        return acc;
                                    }, {})
                                ).map(([category, items]) => {
                                    const isCollapsed = !!collapsedCategories[category];
                                    return (
                                        <div key={category} className="space-y-3">
                                            {/* Clickable Sticky Category Accordion Header */}
                                            <button
                                                type="button"
                                                onClick={() => toggleMobileCategory(category)}
                                                className="w-full sticky top-14 z-20 bg-slate-100/95 hover:bg-slate-200/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between transition-all text-left cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {isCollapsed ? (
                                                        <ChevronRight size={16} className="text-slate-500 shrink-0" />
                                                    ) : (
                                                        <ChevronDown size={16} className="text-slate-500 shrink-0" />
                                                    )}
                                                    <span className="font-bold text-slate-800 text-xs tracking-wide uppercase flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] shrink-0"></span>
                                                        {category}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs flex items-center gap-1">
                                                    {items.length} item {isCollapsed && <span className="text-slate-400 font-normal text-[9px]">(Klik untuk buka)</span>}
                                                </span>
                                            </button>

                                            {/* Item Cards inside Category (Shrank when isCollapsed) */}
                                            {!isCollapsed && (
                                                <div className="space-y-3 pl-1">
                                                    {items.map(item => (
                                                        <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                                            {/* Card Header */}
                                                            <div className="p-4 border-b border-slate-100 flex justify-between items-start gap-3">
                                                                <div>
                                                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                                                        {item.nama}
                                                                        {item.stok <= item.stok_minimum && (
                                                                            <span className="flex items-center text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded uppercase" title="Stok Menipis">
                                                                                <AlertTriangle size={10} className="mr-0.5" /> Low
                                                                            </span>
                                                                        )}
                                                                    </h3>
                                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                                        {item.location?.nama ? (
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] text-slate-600 bg-slate-100">
                                                                                Lokasi: {item.location.full_path || item.location.nama}
                                                                            </span>
                                                                        ) : <span className="text-slate-400 text-[10px] italic">Lokasi: -</span>}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right shrink-0">
                                                                    <div className="text-[10px] text-slate-500 uppercase font-semibold mb-0.5">Stok Saat Ini</div>
                                                                    <div className={`text-lg font-bold ${item.stok <= item.stok_minimum ? 'text-red-600' : 'text-slate-800'}`}>
                                                                        {item.stok} <span className="text-xs font-normal text-slate-500">{item.satuan}</span>
                                                                    </div>
                                                                    <div className="text-[10px] text-slate-400 mt-0.5">Min: {item.stok_minimum}</div>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Card Actions */}
                                                            <div className="p-3 bg-slate-50 flex items-center justify-between gap-3">
                                                                {/* Primary Action */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelectedItemForUse(item)}
                                                                    disabled={item.stok <= 0}
                                                                    className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2 bg-[hsl(var(--primary))] hover:opacity-90 text-white rounded-lg text-sm font-semibold transition-all shadow-sm disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                                                                >
                                                                    <PackageMinus size={16} /> Gunakan
                                                                </button>
                                                                
                                                                {/* Secondary Actions */}
                                                                <div className="flex items-center gap-1">
                                                                    <Link href={route('consumables.show', item.id)} className="p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-sm">
                                                                        <Eye size={16} />
                                                                    </Link>
                                                                    <Link href={route('consumables.edit', item.id)} className="p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-sm">
                                                                        <Edit size={16} />
                                                                    </Link>
                                                                    <button onClick={() => setDeleteModal({ isOpen: true, item })} className="p-2 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 rounded-lg transition-colors shadow-sm">
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        
                        {/* Mobile Pagination */}
                        {consumables.links && consumables.links.length > 3 && (
                            <div className="flex justify-center flex-wrap gap-1 mt-4 pb-4">
                                {consumables.links.map((link, i) => {
                                    let label = link.label;
                                    if (label.includes('Previous')) label = '«';
                                    if (label.includes('Next')) label = '»';
                                    
                                    return link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${link.active ? 'bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                            dangerouslySetInnerHTML={{ __html: label }}
                                        />
                                    ) : (
                                        <span key={i} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-400 bg-slate-50" dangerouslySetInnerHTML={{ __html: label }} />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </PageTransition>

            <ConfirmDialog
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, item: null })}
                onConfirm={handleDelete}
                title="Hapus Consumable"
                description={`Apakah Anda yakin ingin menghapus item "${deleteModal.item?.nama}"? Tindakan ini tidak dapat dibatalkan dan akan menghapus riwayat transaksinya juga.`}
            />

            <CreateModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                categories={categories}
                locations={locations}
            />

            <UseModal
                item={selectedItemForUse}
                show={!!selectedItemForUse}
                onClose={() => setSelectedItemForUse(null)}
            />
        </AuthenticatedLayout>
    );
}
