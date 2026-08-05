import { useState, Fragment } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { Save, UploadCloud, X } from 'lucide-react';
import SelectInput from '@/Components/SelectInput';

export default function CreateModal({ isOpen, onClose, categories, locations }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        nama: '',
        jumlah: 1,
        no_seri: '',
        merk: '',
        category_id: '',
        location_id: '',
        status: 'tersedia',
        spesifikasi: [],
        harga_beli: '',
        tanggal_beli: '',
        ip_address: '',
        catatan: '',
        foto: null,
    });

    const [preview, setPreview] = useState(null);

    const handleClose = () => {
        reset();
        clearErrors();
        setPreview(null);
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('assets.store'), {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    // Mapping data for SelectInput
    const categoryOptions = categories.map(c => ({ value: c.id, label: c.nama }));

    // Build tree for locations to order them parent -> children recursively
    const buildLocationTree = (locs) => {
        const map = {};
        const roots = [];
        locs.forEach(loc => map[loc.id] = { ...loc, children: [] });
        locs.forEach(loc => {
            if (loc.parent_id && map[loc.parent_id]) {
                map[loc.parent_id].children.push(map[loc.id]);
            } else {
                roots.push(map[loc.id]);
            }
        });
        
        const flatList = [];
        const flatten = (nodes, depth) => {
            nodes.forEach(node => {
                flatList.push({
                    value: node.id,
                    label: node.nama,
                    displayLabel: node.full_path || node.nama,
                    depth: depth
                });
                flatten(node.children, depth + 1);
            });
        };
        flatten(roots, 0);
        return flatList;
    };

    const locationOptions = [
        { value: '', label: 'Tidak Ditentukan', displayLabel: 'Tidak Ditentukan', depth: 0 },
        ...buildLocationTree(locations)
    ];

    const statusOptions = [
        { value: 'tersedia', label: 'Tersedia' },
        { value: 'digunakan', label: 'Digunakan' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'rusak', label: 'Rusak' },
    ];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between border-b border-slate-100 px-6 md:px-8 py-4">
                                    <Dialog.Title as="h3" className="text-lg font-semibold text-slate-900">
                                        Tambah Aset Baru
                                    </Dialog.Title>
                                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Nama */}
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Nama Aset <span className="text-red-500">*</span></label>
                                                <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} required
                                                    className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] ${errors.nama ? 'border-red-500' : 'border-slate-300'}`} />
                                                {errors.nama && <p className="text-red-500 text-xs">{errors.nama}</p>}
                                            </div>
                                            {/* Jumlah */}
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Jumlah Input (Bulk) <span className="text-red-500">*</span></label>
                                                <input type="number" min="1" max="100" value={data.jumlah} onChange={e => setData('jumlah', e.target.value)} required
                                                    className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] ${errors.jumlah ? 'border-red-500' : 'border-slate-300'}`} />
                                                {errors.jumlah && <p className="text-red-500 text-xs">{errors.jumlah}</p>}
                                            </div>
                                            {/* Kategori */}
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Kategori <span className="text-red-500">*</span></label>
                                                <SelectInput 
                                                    value={data.category_id} 
                                                    onChange={val => setData('category_id', val)} 
                                                    options={categoryOptions} 
                                                    placeholder="Pilih Kategori" 
                                                    error={!!errors.category_id} 
                                                />
                                                {errors.category_id && <p className="text-red-500 text-xs">{errors.category_id}</p>}
                                            </div>
                                            {/* Merk */}
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Merk / Brand</label>
                                                <input type="text" value={data.merk} onChange={e => setData('merk', e.target.value)}
                                                    className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] border-slate-300`} />
                                            </div>
                                            {/* Nomor Seri */}
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Nomor Seri / SN</label>
                                                <input type="text" value={data.no_seri} onChange={e => setData('no_seri', e.target.value)}
                                                    disabled={data.jumlah > 1}
                                                    className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] ${errors.no_seri ? 'border-red-500' : 'border-slate-300'} disabled:bg-slate-100 disabled:text-slate-400`} />
                                                {data.jumlah > 1 && (
                                                    <p className="text-xs text-amber-600 mt-1">Nomor seri dinonaktifkan untuk input massal (Bulk).</p>
                                                )}
                                                {errors.no_seri && <p className="text-red-500 text-xs">{errors.no_seri}</p>}
                                            </div>
                                            {/* Lokasi */}
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Lokasi Penempatan</label>
                                                <SelectInput 
                                                    value={data.location_id} 
                                                    onChange={val => setData('location_id', val)} 
                                                    options={locationOptions} 
                                                    placeholder="Tidak Ditentukan" 
                                                    error={!!errors.location_id} 
                                                />
                                            </div>
                                            {/* Status */}
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-slate-700">Status Awal <span className="text-red-500">*</span></label>
                                                <SelectInput 
                                                    value={data.status} 
                                                    onChange={val => setData('status', val)} 
                                                    options={statusOptions} 
                                                />
                                            </div>
                                        </div>

                                        <hr className="border-slate-100" />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Tgl Beli & Harga */}
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-slate-700">Tanggal Pembelian</label>
                                                    <input type="date" value={data.tanggal_beli} onChange={e => setData('tanggal_beli', e.target.value)}
                                                        className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] border-slate-300`} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-slate-700">Harga Beli (Rp)</label>
                                                    <input type="number" min="0" value={data.harga_beli} onChange={e => setData('harga_beli', e.target.value)}
                                                        className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] border-slate-300`} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-slate-700">IP Address (Jika Perlu)</label>
                                                    <input type="text" placeholder="192.168.x.x" value={data.ip_address} onChange={e => setData('ip_address', e.target.value)}
                                                        className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] border-slate-300`} />
                                                </div>
                                            </div>
                                            {/* Foto */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Foto Aset</label>
                                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                                                    {preview ? (
                                                        <div className="relative inline-block">
                                                            <img src={preview} alt="Preview" className="h-32 rounded object-cover" />
                                                            <button type="button" onClick={() => { setData('foto', null); setPreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow">
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <label className="cursor-pointer flex flex-col items-center justify-center py-4">
                                                            <UploadCloud className="text-slate-400 mb-2" size={32} />
                                                            <span className="text-sm text-slate-600 font-medium">Klik untuk upload foto</span>
                                                            <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</span>
                                                            <input type="file" className="hidden" accept="image/*" onChange={e => {
                                                                const file = e.target.files[0];
                                                                if(file) {
                                                                    setData('foto', file);
                                                                    setPreview(URL.createObjectURL(file));
                                                                }
                                                            }} />
                                                        </label>
                                                    )}
                                                    {errors.foto && <p className="text-red-500 text-xs mt-2">{errors.foto}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700">Catatan Tambahan</label>
                                            <textarea rows="3" value={data.catatan} onChange={e => setData('catatan', e.target.value)}
                                                className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] border-slate-300`} />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 px-6 md:px-8 py-4 border-t border-slate-200 flex justify-end gap-3">
                                        <button type="button" onClick={handleClose} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100">
                                            Batal
                                        </button>
                                        <button type="submit" disabled={processing} className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-50">
                                            <Save size={16} /> {processing ? 'Menyimpan...' : 'Simpan Aset'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
