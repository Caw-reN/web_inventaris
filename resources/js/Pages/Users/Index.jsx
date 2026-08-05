import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import DataTable from '@/Components/DataTable';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Plus, Trash2, Edit, Save, X, ShieldAlert } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Index({ users, roles }) {
    const { auth } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'teknisi',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingId(user.id);
        setData({
            name: user.name,
            email: user.email,
            password: '', 
            password_confirmation: '',
            role: user.role,
            is_active: user.is_active,
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
            put(route('users.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = () => {
        if (!deleteModal.item) return;
        destroy(route('users.destroy', deleteModal.item.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteModal({ isOpen: false, item: null })
        });
    };

    const columns = [
        {
            header: 'Nama User',
            accessor: 'name',
            cell: row => (
                <div className="font-medium text-slate-900 flex items-center gap-2">
                    {row.id === auth.user.id && <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Anda</span>}
                    {row.name}
                </div>
            )
        },
        { header: 'Email', accessor: 'email', cell: row => <span className="text-slate-500">{row.email}</span> },
        {
            header: 'Role',
            accessor: 'role',
            cell: row => {
                const role = roles?.find(r => r.name === row.role);
                const isAdmin = row.role === 'admin';
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize flex items-center w-fit gap-1
                        ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {isAdmin && <ShieldAlert size={12} />}
                        {role?.label || row.role}
                    </span>
                );
            }
        },
        {
            header: 'Status',
            accessor: 'is_active',
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                    {row.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
            )
        },
        {
            header: 'Aksi',
            cellClassName: 'text-right',
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEditModal(row)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Edit">
                        <Edit size={16} />
                    </button>
                    {row.id !== auth.user.id && (
                        <button onClick={() => setDeleteModal({ isOpen: true, item: row })} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus">
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <AuthenticatedLayout header="Manajemen User">
            <Head title="Manajemen User" />

            <PageTransition>
                <div className="w-full pb-10">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-slate-500 text-sm">Kelola akun Admin dan Teknisi.</p>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            <Plus size={16} /> Tambah User
                        </button>
                    </div>

                    <DataTable columns={columns} data={users} pagination={true} />
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
                                            {editingId ? 'Edit User' : 'Tambah User'}
                                        </Dialog.Title>
                                        <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="px-6 py-4 space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Nama <span className="text-red-500">*</span></label>
                                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required
                                                    className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]" />
                                                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Email <span className="text-red-500">*</span></label>
                                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required
                                                    className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]" />
                                                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-slate-700">
                                                        Password {editingId && <span className="text-slate-400 font-normal">(Opsional)</span>}
                                                    </label>
                                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} required={!editingId}
                                                        className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]" />
                                                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-slate-700">
                                                        Konfirmasi Password
                                                    </label>
                                                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required={!editingId || data.password.length > 0}
                                                        className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Role <span className="text-red-500">*</span></label>
                                                <select value={data.role} onChange={e => setData('role', e.target.value)} required disabled={editingId === auth.user.id}
                                                    className="w-full rounded-lg border border-slate-300 text-sm pl-3 pr-10 py-2 focus:ring-[hsl(var(--primary))] disabled:bg-slate-100">
                                                    {(roles || []).map(r => (
                                                        <option key={r.name} value={r.name}>{r.label}</option>
                                                    ))}
                                                </select>
                                                {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
                                            </div>
                                            {editingId && editingId !== auth.user.id && (
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-slate-700">Status Akun</label>
                                                    <select value={data.is_active ? '1' : '0'} onChange={e => setData('is_active', e.target.value === '1')} required
                                                        className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]">
                                                        <option value="1">Aktif</option>
                                                        <option value="0">Nonaktif</option>
                                                    </select>
                                                    {errors.is_active && <p className="text-red-500 text-xs">{errors.is_active}</p>}
                                                </div>
                                            )}
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
                title="Hapus User"
                description={`Apakah Anda yakin ingin menghapus akun "${deleteModal.item?.name}"? Tindakan ini tidak dapat dibatalkan.`}
            />
        </AuthenticatedLayout>
    );
}
