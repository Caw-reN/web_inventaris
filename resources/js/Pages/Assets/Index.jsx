import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import DataTable from '@/Components/DataTable';
import StatusBadge from '@/Components/StatusBadge';
import ConfirmDialog from '@/Components/ConfirmDialog';
import CreateModal from './CreateModal';
import QrModal from './QrModal';
import { Plus, Search, Filter, Trash2, Edit, Eye, X, Printer, QrCode, ChevronDown, ChevronRight } from 'lucide-react';

export default function Index({ assets, categories, locations, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category_id || '');
    const [locationFilter, setLocationFilter] = useState(filters.location_id || '');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, asset: null });
    const [qrModal, setQrModal] = useState({ isOpen: false, asset: null });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [expandedMobileGroups, setExpandedMobileGroups] = useState(new Set());

    const toggleMobileGroup = (key) => {
        const newSet = new Set(expandedMobileGroups);
        if (newSet.has(key)) newSet.delete(key);
        else newSet.add(key);
        setExpandedMobileGroups(newSet);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('assets.index'), { search, status: statusFilter, category_id: categoryFilter, location_id: locationFilter }, { preserveState: true });
    };

    const handleResetFilters = () => {
        setSearch(''); setStatusFilter(''); setCategoryFilter(''); setLocationFilter('');
        router.get(route('assets.index'));
    };

    const handleDelete = () => {
        if (!deleteModal.asset) return;
        router.delete(route('assets.destroy', deleteModal.asset.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteModal({ isOpen: false, asset: null })
        });
    };

    const handlePrintGroup = (items) => {
        const assetIds = items.map(item => item.id);
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('assets.bulk-qr-export');
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);

        assetIds.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'asset_ids[]';
            input.value = id;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    const columns = [
        {
            header: 'Aset',
            accessor: 'nama',
            cell: (row) => (
                <div className="flex flex-col gap-1.5 py-1">
                    <div className="font-semibold text-slate-900 text-sm leading-tight">{row.nama}</div>
                    <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] tracking-wider border border-[hsl(var(--primary)/0.2)]">
                            {row.nomor_inventaris || 'BELUM ADA NO. INV'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        {row.merk && (
                            <span className="inline-flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                <span className="font-medium text-slate-600">{row.merk}</span>
                            </span>
                        )}
                        {row.merk && row.no_seri && <span className="text-slate-300">|</span>}
                        {row.no_seri ? <span>SN: <span className="font-mono text-slate-600 tracking-tight">{row.no_seri}</span></span> : (!row.merk && '-')}
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
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200/60 whitespace-nowrap">
                    {row.location.nama}
                </span>
            ) : <span className="text-slate-400">-</span> 
        },
        { header: 'Status', accessor: 'status', cell: row => <StatusBadge status={row.status} label={row.status_label} /> },
        {
            header: 'Aksi',
            headerClassName: 'text-center w-36',
            cellClassName: 'text-center w-36',
            cell: (row) => (
                <div className="flex items-center justify-center gap-1">
                    <button onClick={() => setQrModal({ isOpen: true, asset: row })} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Lihat QR Code">
                        <QrCode size={16} />
                    </button>
                    <Link href={route('assets.show', row.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Detail">
                        <Eye size={16} />
                    </Link>
                    <Link href={route('assets.edit', row.id)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                        <Edit size={16} />
                    </Link>
                    <button onClick={() => setDeleteModal({ isOpen: true, asset: row })} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Hapus">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    const assetList = Array.isArray(assets) ? assets : (assets?.data || []);

    const [collapsedMobileCategories, setCollapsedMobileCategories] = useState({});

    const toggleMobileCategory = (category) => {
        setCollapsedMobileCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight">Daftar Aset</h2>}>
            <Head title="Daftar Aset" />

            <PageTransition>
                <div className="w-full pb-10">

                    {/* Top Search, Filters & Action Bar (Matching Consumable UI) */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <form onSubmit={handleSearch} className="w-full sm:flex-1 flex flex-wrap gap-2">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari nama, seri, merk..."
                                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))]"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={e => { setStatusFilter(e.target.value); router.get(route('assets.index'), { search, status: e.target.value, category_id: categoryFilter, location_id: locationFilter }, { preserveState: true }); }}
                                className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:ring-[hsl(var(--primary))]"
                            >
                                <option value="">Semua Status</option>
                                <option value="tersedia">Tersedia</option>
                                <option value="digunakan">Digunakan</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="rusak">Rusak</option>
                                <option value="tidak_aktif">Tidak Aktif</option>
                            </select>
                            <select
                                value={categoryFilter}
                                onChange={e => { setCategoryFilter(e.target.value); router.get(route('assets.index'), { search, status: statusFilter, category_id: e.target.value, location_id: locationFilter }, { preserveState: true }); }}
                                className="border border-slate-300 rounded-lg text-sm px-3 py-2 focus:ring-[hsl(var(--primary))]"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.nama}</option>)}
                            </select>
                            {(search || statusFilter || categoryFilter || locationFilter) && (
                                <button type="button" onClick={handleResetFilters} className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-center gap-1">
                                    <X size={14} /> Reset
                                </button>
                            )}
                        </form>

                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 whitespace-nowrap shadow-xs cursor-pointer"
                        >
                            <Plus size={16} /> Tambah Aset
                        </button>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <DataTable 
                            columns={columns} 
                            data={assets} 
                            groupBy={[
                                (row) => row.category?.nama || 'Tanpa Kategori',
                                (row) => row.nama.replace(/\s-\s\d+$/, '')
                            ]}
                            groupHeader={(key, items, depth) => {
                                if (depth === 0) {
                                    return (
                                        <div className="flex items-center gap-2 py-0.5">
                                            <span className="font-bold text-[14px] text-slate-800 uppercase tracking-wider">{key}</span>
                                            <span className="bg-slate-200 text-slate-700 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                                {items.length} Aset
                                            </span>
                                        </div>
                                    );
                                }
                                return (
                                    <div className="flex items-center gap-1.5 py-0.5">
                                        <span className="font-semibold text-[13px] text-slate-700">{key}</span>
                                        <span className="bg-[hsl(var(--primary))] text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                            {items.length} Item
                                        </span>
                                    </div>
                                );
                            }}
                            groupByAction={(key, items, depth) => (
                                <div className="flex justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePrintGroup(items);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                                        title={`Print QR Code untuk semua ${key}`}
                                    >
                                        <Printer size={14} className="text-slate-500" />
                                        <span className="hidden sm:inline">Print QR</span>
                                    </button>
                                </div>
                            )}
                        />
                    </div>

                    {/* Mobile View (Matching Consumable Collapsible Accordion UI) */}
                    <div className="md:hidden">
                        {assetList.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center mt-4">
                                <p className="text-slate-500 text-sm">Tidak ada data aset yang ditemukan.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 pb-6 mt-2">
                                {Object.entries(
                                    assetList.reduce((acc, item) => {
                                        const category = item.category?.nama || 'Tanpa Kategori';
                                        const baseName = item.nama.replace(/\s-\s\d+$/, '');
                                        if (!acc[category]) acc[category] = {};
                                        if (!acc[category][baseName]) acc[category][baseName] = [];
                                        acc[category][baseName].push(item);
                                        return acc;
                                    }, {})
                                ).map(([category, baseGroups]) => {
                                    const isCategoryCollapsed = !!collapsedMobileCategories[category];
                                    return (
                                        <div key={category} className="space-y-3">
                                            {/* Category Header (Clickable Accordion) */}
                                            <button
                                                type="button"
                                                onClick={() => toggleMobileCategory(category)}
                                                className="w-full sticky top-14 z-20 bg-slate-100/95 hover:bg-slate-200/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between transition-all text-left cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {isCategoryCollapsed ? (
                                                        <ChevronRight size={16} className="text-slate-500 shrink-0" />
                                                    ) : (
                                                        <ChevronDown size={16} className="text-slate-500 shrink-0" />
                                                    )}
                                                    <span className="font-bold text-slate-800 text-xs tracking-wide uppercase flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] shrink-0"></span>
                                                        {category}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                                                    {Object.values(baseGroups).flat().length} Aset
                                                </span>
                                            </button>

                                            {/* Sub-Group Base Names (Shrank when category is collapsed) */}
                                            {!isCategoryCollapsed && (
                                                <div className="px-1 space-y-3">
                                                    {Object.entries(baseGroups).map(([baseName, items]) => {
                                                        const groupKey = `${category}-${baseName}`;
                                                        const isExpanded = expandedMobileGroups.has(groupKey);
                                                        
                                                        return (
                                                        <div key={baseName} className={`relative before:content-[''] before:absolute before:left-0 before:top-6 before:bottom-0 before:w-0.5 before:bg-[hsl(var(--primary)/0.2)] pl-3 ${isExpanded ? 'pb-3' : ''}`}>
                                                            {/* Base Name Header (Clickable) */}
                                                            <div 
                                                                onClick={() => toggleMobileGroup(groupKey)}
                                                                className="flex items-center justify-between py-2 cursor-pointer select-none"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className="absolute left-[-3px] top-[14px] w-2 h-2 rounded-full bg-[hsl(var(--primary))]"></div>
                                                                    {isExpanded ? (
                                                                        <ChevronDown size={16} className="text-slate-500" />
                                                                    ) : (
                                                                        <ChevronRight size={16} className="text-slate-400" />
                                                                    )}
                                                                    <span className="font-semibold text-slate-700 text-sm">{baseName}</span>
                                                                    <span className="bg-[hsl(var(--primary))] text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                                                        {items.length} Item
                                                                    </span>
                                                                </div>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); handlePrintGroup(items); }}
                                                                    className="flex items-center gap-1 p-1 px-2 text-slate-600 bg-white border border-slate-200 rounded text-[10px] font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                                                                    title={`Print QR Code untuk semua ${baseName}`}
                                                                >
                                                                    <Printer size={12} /> Print QR
                                                                </button>
                                                            </div>
                                                            
                                                            {/* Asset Cards (Collapsible) */}
                                                            {isExpanded && (
                                                                <div className="space-y-3 mt-2">
                                                                    {items.map(item => (
                                                                    <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative ml-1">
                                                                        {/* Card Header */}
                                                                        <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
                                                                            <div className="flex justify-between items-start gap-2">
                                                                                <div>
                                                                                    <h3 className="font-semibold text-slate-900 leading-tight mb-1">{item.nama}</h3>
                                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] tracking-wider border border-[hsl(var(--primary)/0.2)]">
                                                                                        {item.nomor_inventaris || 'BELUM ADA NO. INV'}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="shrink-0 flex flex-col items-end gap-1.5">
                                                                                    <StatusBadge status={item.status} label={item.status_label} />
                                                                                    <button onClick={() => setQrModal({ isOpen: true, asset: item })} className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors shadow-sm mt-1 flex items-center gap-1">
                                                                                        <QrCode size={14} /> <span className="text-[10px] font-semibold uppercase">QR</span>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            {/* Details Grid */}
                                                                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                                                <div>
                                                                                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Lokasi</div>
                                                                                    <div className="text-xs text-slate-700 font-medium truncate">{item.location?.nama || '-'}</div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Merk</div>
                                                                                    <div className="text-xs text-slate-700 font-medium truncate">{item.merk || '-'}</div>
                                                                                </div>
                                                                                <div className="col-span-2">
                                                                                    <div className="text-[9px] text-slate-400 uppercase font-semibold">Serial Number</div>
                                                                                    <div className="text-xs text-slate-700 font-mono tracking-tight truncate">{item.no_seri || '-'}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* Card Actions */}
                                                                        <div className="p-3 flex items-center gap-2">
                                                                            <Link href={route('assets.show', item.id)} className="flex-1 flex justify-center items-center gap-1.5 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors">
                                                                                <Eye size={16} /> Detail
                                                                            </Link>
                                                                            <Link href={route('assets.edit', item.id)} className="flex-1 flex justify-center items-center gap-1.5 py-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg text-sm font-medium transition-colors">
                                                                                <Edit size={16} /> Edit
                                                                            </Link>
                                                                            <button onClick={() => setDeleteModal({ isOpen: true, asset: item })} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shrink-0">
                                                                                <Trash2 size={16} />
                                                                            </button>
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
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </PageTransition>

            <CreateModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                categories={categories} 
                locations={locations} 
            />

            <ConfirmDialog
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, asset: null })}
                onConfirm={handleDelete}
                title="Hapus Aset"
                description={`Apakah Anda yakin ingin menghapus aset "${deleteModal.asset?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
            />

            <QrModal
                isOpen={qrModal.isOpen}
                onClose={() => setQrModal({ isOpen: false, asset: null })}
                asset={qrModal.asset}
            />
        </AuthenticatedLayout>
    );
}
