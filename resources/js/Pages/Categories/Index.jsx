import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import DataTable from '@/Components/DataTable';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Index({ categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        nama: '',
        tipe: 'aset',
        deskripsi: '',
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setEditingId(category.id);
        setData({
            nama: category.nama,
            tipe: category.tipe,
            deskripsi: category.deskripsi || '',
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
            put(route('categories.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('categories.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = () => {
        if (!deleteModal.item) return;
        destroy(route('categories.destroy', deleteModal.item.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteModal({ isOpen: false, item: null })
        });
    };

    const columns = [
        { header: 'Nama Kategori', accessor: 'nama', className: 'font-medium text-slate-900' },
        {
            header: 'Tipe',
            accessor: 'tipe',
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${row.tipe === 'aset' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {row.tipe}
                </span>
            )
        },
        { header: 'Deskripsi', accessor: 'deskripsi', cell: row => <span className="text-slate-500">{row.deskripsi || '-'}</span> },
        {
            header: 'Aksi',
            headerClassName: 'text-center w-28',
            cellClassName: 'text-center w-28',
            cell: (row) => (
                <div className="flex items-center justify-center gap-1">
                    <button onClick={() => openEditModal(row)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer" title="Edit">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => setDeleteModal({ isOpen: true, item: row })} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Hapus">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight">Master Kategori</h2>}>
            <Head title="Kategori" />

            <PageTransition>
                <div className="w-full pb-10">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-slate-500 text-sm">Kelola kategori untuk Aset dan Consumable.</p>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            <Plus size={16} /> Tambah Kategori
                        </button>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <DataTable columns={columns} data={categories} pagination={false} />
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-3">
                        {(!categories || categories.length === 0) ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
                                Belum ada data kategori.
                            </div>
                        ) : (
                            categories.map(cat => (
                                <div key={cat.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{cat.nama}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{cat.deskripsi || 'Tanpa deskripsi'}</p>
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                            cat.tipe === 'aset' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'
                                        }`}>
                                            {cat.tipe}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 mt-1">
                                        <button onClick={() => openEditModal(cat)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 rounded-lg border border-amber-200">
                                            <Edit size={14} /> Edit
                                        </button>
                                        <button onClick={() => setDeleteModal({ isOpen: true, item: cat })} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg border border-red-200">
                                            <Trash2 size={14} /> Hapus
                                        </button>
                                    </div>
                                </div>
                            ))
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
                                            {editingId ? 'Edit Kategori' : 'Tambah Kategori'}
                                        </Dialog.Title>
                                        <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="px-6 py-4 space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Nama Kategori <span className="text-red-500">*</span></label>
                                                <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} required
                                                    className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]" />
                                                {errors.nama && <p className="text-red-500 text-xs">{errors.nama}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Tipe <span className="text-red-500">*</span></label>
                                                <select value={data.tipe} onChange={e => setData('tipe', e.target.value)} required
                                                    className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]">
                                                    <option value="aset">Aset</option>
                                                    <option value="consumable">Consumable</option>
                                                </select>
                                                {errors.tipe && <p className="text-red-500 text-xs">{errors.tipe}</p>}
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
                title="Hapus Kategori"
                description={`Apakah Anda yakin ingin menghapus kategori "${deleteModal.item?.nama}"? Kategori ini mungkin masih digunakan oleh beberapa item.`}
            />
        </AuthenticatedLayout>
    );
}
