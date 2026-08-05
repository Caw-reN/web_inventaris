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
            cell: row => (
                <div className="flex items-center gap-2 font-medium text-slate-900">
                    <MapPin size={16} className={!row.parent_id ? "text-[hsl(var(--primary))]" : "text-slate-400"} />
                    {row.nama}
                </div>
            )
        },
        { header: 'Deskripsi', accessor: 'deskripsi', cell: row => <span className="text-slate-500">{row.deskripsi || '-'}</span> },
        {
            header: 'Aksi',
            cellClassName: 'text-right',
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(row); }} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Edit">
                        <Edit size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, item: row }); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    // Build tree structure for DataTable
    const locationTree = [];
    const locMap = {};
    locations.forEach(loc => {
        locMap[loc.id] = { ...loc, children: [] };
    });
    locations.forEach(loc => {
        if (loc.parent_id && locMap[loc.parent_id]) {
            locMap[loc.parent_id].children.push(locMap[loc.id]);
        } else {
            locationTree.push(locMap[loc.id]);
        }
    });

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

                    <DataTable 
                        columns={columns} 
                        data={locationTree} 
                        pagination={false} 
                        subItemsKey="children"
                    />
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
