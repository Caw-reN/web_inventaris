import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import DataTable from '@/Components/DataTable';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Plus, Trash2, Edit, Save, X, MapPin } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Index({ locations }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        nama: '',
        deskripsi: '',
        parent_id: '',
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (location) => {
        setEditingId(location.id);
        setData({
            nama: location.nama,
            deskripsi: location.deskripsi || '',
            parent_id: location.parent_id || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('locations.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('locations.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = () => {
        if (!deleteModal.item) return;
        destroy(route('locations.destroy', deleteModal.item.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteModal({ isOpen: false, item: null })
        });
    };

    const columns = [
        {
            header: 'Nama Lokasi',
            accessor: 'nama',
            cell: row => {
                const depth = row.full_path ? (row.full_path.split(' > ').length - 1) : 0;
                return (
                    <div 
                        className="flex items-center gap-2 font-medium"
                        style={{ paddingLeft: `${depth * 1.5}rem` }}
                    >
                        {depth > 0 && <span className="text-slate-400 font-mono text-xs select-none">└</span>}
                        <MapPin size={16} className={depth === 0 ? "text-[hsl(var(--primary))]" : "text-slate-400"} />
                        <span className={depth === 0 ? "font-bold text-slate-900" : "text-slate-700"}>{row.nama}</span>
                    </div>
                );
            }
        },
        { header: 'Jalur Lengkap', accessor: 'full_path', cell: row => <span className="text-xs text-slate-500 font-mono">{row.full_path}</span> },
        { header: 'Deskripsi', accessor: 'deskripsi', cell: row => <span className="text-slate-500">{row.deskripsi || '-'}</span> },
        {
            header: 'Aksi',
            headerClassName: 'text-center w-28',
            cellClassName: 'text-center w-28',
            cell: (row) => (
                <div className="flex items-center justify-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(row); }} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer" title="Edit Lokasi">
                        <Edit size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, item: row }); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Hapus Lokasi">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight">Master Lokasi</h2>}>
            <Head title="Lokasi" />

            <PageTransition>
                <div className="w-full pb-10">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-slate-500 text-sm">Kelola lokasi fisik penempatan aset.</p>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            <Plus size={16} /> Tambah Lokasi
                        </button>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <DataTable 
                            columns={columns} 
                            data={locations} 
                            pagination={false} 
                        />
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-2.5">
                        {(!locations || locations.length === 0) ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
                                Belum ada data lokasi.
                            </div>
                        ) : (
                            locations.map(loc => {
                                const depth = loc.full_path ? (loc.full_path.split(' > ').length - 1) : 0;
                                return (
                                    <div 
                                        key={loc.id} 
                                        className={`bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 flex items-center justify-between gap-3 ${depth > 0 ? 'bg-slate-50/60' : ''}`}
                                        style={{ marginLeft: depth > 0 ? `${depth * 0.75}rem` : 0 }}
                                    >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            {depth > 0 && <span className="text-slate-400 font-mono text-xs select-none shrink-0">└</span>}
                                            <MapPin size={16} className={depth === 0 ? "text-[hsl(var(--primary))] shrink-0" : "text-slate-400 shrink-0"} />
                                            <div className="min-w-0">
                                                <h4 className={`text-sm truncate ${depth === 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                                                    {loc.nama}
                                                </h4>
                                                {depth > 0 && (
                                                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                                        {loc.full_path}
                                                    </p>
                                                )}
                                                {loc.deskripsi && <p className="text-xs text-slate-500 truncate mt-0.5">{loc.deskripsi}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); openEditModal(loc); }} 
                                                className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                title="Edit Lokasi"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, item: loc }); }} 
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus Lokasi"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </PageTransition>

            {/* Modal Form */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                                        <Dialog.Title as="h3" className="text-lg font-semibold text-slate-900">
                                            {editingId ? 'Edit Lokasi' : 'Tambah Lokasi'}
                                        </Dialog.Title>
                                        <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="px-6 py-4 space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Nama Lokasi <span className="text-red-500">*</span></label>
                                                <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} required
                                                    className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]"
                                                    placeholder="Contoh: Rak B" />
                                                {errors.nama && <p className="text-red-500 text-xs">{errors.nama}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Induk Lokasi (Opsional)</label>
                                                <select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)}
                                                    className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]">
                                                    <option value="">-- Tidak ada induk (Lokasi Utama) --</option>
                                                    {locations.filter(loc => loc.id !== editingId).map(loc => (
                                                        <option key={loc.id} value={loc.id}>{loc.full_path}</option>
                                                    ))}
                                                </select>
                                                {errors.parent_id && <p className="text-red-500 text-xs">{errors.parent_id}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Deskripsi (Opsional)</label>
                                                <textarea rows="3" value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)}
                                                    className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]" />
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                                            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
                                                Batal
                                            </button>
                                            <button type="submit" disabled={processing} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
                                                <Save size={16}/> {processing ? 'Menyimpan...' : 'Simpan'}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <ConfirmDialog
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, item: null })}
                onConfirm={handleDelete}
                title="Hapus Lokasi"
                description={`Apakah Anda yakin ingin menghapus lokasi "${deleteModal.item?.nama}"? Lokasi ini mungkin masih digunakan oleh beberapa aset.`}
            />
        </AuthenticatedLayout>
    );
}
