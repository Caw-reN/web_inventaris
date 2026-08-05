import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Plus, Edit, Trash2, Save, X, ShieldCheck, ShieldAlert, Lock } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Index({ roles }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        label: '',
        description: '',
    });

    const openCreateModal = () => {
        setEditingRole(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (role) => {
        setEditingRole(role);
        setData({ label: role.label, description: role.description || '' });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        setEditingRole(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingRole) {
            put(route('roles.update', editingRole.id), { onSuccess: closeModal });
        } else {
            post(route('roles.store'), { onSuccess: closeModal });
        }
    };

    const handleDelete = () => {
        if (!deleteModal.item) return;
        destroy(route('roles.destroy', deleteModal.item.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteModal({ isOpen: false, item: null }),
        });
    };

    const roleColors = {
        admin:   'bg-purple-100 text-purple-700 border-purple-200',
        teknisi: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    const defaultColor = 'bg-blue-100 text-blue-700 border-blue-200';

    return (
        <AuthenticatedLayout header="Manajemen Role">
            <Head title="Manajemen Role" />
            <PageTransition>
                <div className="w-full pb-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <p className="text-slate-500 text-sm">Kelola role dan hak akses pengguna.</p>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
                        >
                            <Plus size={16} /> Tambah Role
                        </button>
                    </div>

                    {/* Role Cards */}
                    <div className="grid gap-4">
                        {roles.map(role => (
                            <div
                                key={role.id}
                                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow"
                            >
                                <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto flex-1">
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${roleColors[role.name] || defaultColor}`}>
                                        {role.is_system
                                            ? <Lock size={18} />
                                            : <ShieldCheck size={18} />
                                        }
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-slate-800">{role.label}</span>
                                            <span className="text-xs text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                                                {role.name}
                                            </span>
                                            {role.is_system && (
                                                <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                                    <Lock size={10} /> Sistem
                                                </span>
                                            )}
                                        </div>
                                        {role.description && (
                                            <p className="text-sm text-slate-500 mt-0.5 truncate">{role.description}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-1 sm:mt-0">
                                    {/* Stats */}
                                    <div className="text-left sm:text-right flex-shrink-0 flex sm:block items-baseline gap-1">
                                        <p className="text-xl sm:text-2xl font-bold text-slate-800">{role.users_count}</p>
                                        <p className="text-xs text-slate-400">user</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => openEditModal(role)}
                                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        {!role.is_system && (
                                            <button
                                                onClick={() => setDeleteModal({ isOpen: true, item: role })}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {roles.length === 0 && (
                        <div className="text-center py-16 text-slate-400">
                            <ShieldAlert size={40} className="mx-auto mb-3 opacity-30" />
                            <p>Belum ada role yang dibuat.</p>
                        </div>
                    )}
                </div>
            </PageTransition>

            {/* Modal Create/Edit */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child as={Fragment}
                        enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment}
                                enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                                leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
                                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                                        <Dialog.Title className="text-lg font-semibold text-slate-900">
                                            {editingRole ? 'Edit Role' : 'Tambah Role Baru'}
                                        </Dialog.Title>
                                        <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="px-6 py-5 space-y-4">
                                            {/* Slug info (edit only) */}
                                            {editingRole && (
                                                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                    <span className="text-xs text-slate-500">Slug (tidak bisa diubah):</span>
                                                    <span className="text-xs font-mono font-semibold text-slate-700">{editingRole.name}</span>
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">
                                                    Nama Role <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.label}
                                                    onChange={e => setData('label', e.target.value)}
                                                    placeholder="Contoh: Operator Lab, Viewer"
                                                    required
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                                                />
                                                {!editingRole && (
                                                    <p className="text-xs text-slate-400">Slug akan dibuat otomatis dari nama ini.</p>
                                                )}
                                                {errors.label && <p className="text-red-500 text-xs">{errors.label}</p>}
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Deskripsi</label>
                                                <textarea
                                                    value={data.description}
                                                    onChange={e => setData('description', e.target.value)}
                                                    placeholder="Opsional — jelaskan fungsi role ini"
                                                    rows={3}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] resize-none"
                                                />
                                                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                                            <button type="button" onClick={closeModal}
                                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
                                                Batal
                                            </button>
                                            <button type="submit" disabled={processing}
                                                className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
                                                <Save size={16} />
                                                {processing ? 'Menyimpan...' : 'Simpan'}
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
                title="Hapus Role"
                description={`Apakah Anda yakin ingin menghapus role "${deleteModal.item?.label}"? Role yang masih digunakan oleh user tidak bisa dihapus.`}
            />
        </AuthenticatedLayout>
    );
}
