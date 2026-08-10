import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import { ArrowLeft, Save, UploadCloud, X } from 'lucide-react';
import { useState } from 'react';

export default function Edit({ asset, categories, locations }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        nama: asset.nama || '',
        no_seri: asset.no_seri || '',
        merk: asset.merk || '',
        category_id: asset.category_id || '',
        location_id: asset.location_id || '',
        status: asset.status || 'tersedia',
        spesifikasi: asset.spesifikasi || [],
        harga_beli: asset.harga_beli || '',
        tanggal_beli: asset.tanggal_beli ? asset.tanggal_beli.split('T')[0] : '',
        ip_address: asset.ip_address || '',
        catatan: asset.catatan || '',
        foto: null,
    });

    const [preview, setPreview] = useState(asset.foto ? `/storage/${asset.foto}` : null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('assets.update', asset.uuid));
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight">Edit Aset</h2>}>
            <Head title={`Edit Aset: ${asset.nama}`} />

            <PageTransition>
                <div className="w-full pb-10">
                    <div className="mb-4 flex items-center justify-between">
                        <Link href={route('assets.show', asset.uuid)} className="text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 text-sm font-medium">
                            <ArrowLeft size={16} /> Kembali ke Detail
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Nama Aset <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} required
                                        className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] ${errors.nama ? 'border-red-500' : 'border-slate-300'}`} />
                                    {errors.nama && <p className="text-red-500 text-xs">{errors.nama}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Kategori <span className="text-red-500">*</span></label>
                                    <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} required
                                        className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] ${errors.category_id ? 'border-red-500' : 'border-slate-300'}`}>
                                        <option value="">Pilih Kategori</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.nama}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Nomor Seri / SN</label>
                                    <input type="text" value={data.no_seri} onChange={e => setData('no_seri', e.target.value)}
                                        className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] ${errors.no_seri ? 'border-red-500' : 'border-slate-300'}`} />
                                    {errors.no_seri && <p className="text-red-500 text-xs">{errors.no_seri}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Merk / Brand</label>
                                    <input type="text" value={data.merk} onChange={e => setData('merk', e.target.value)}
                                        className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] border-slate-300`} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Lokasi Penempatan</label>
                                    <select value={data.location_id} onChange={e => setData('location_id', e.target.value)}
                                        className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] border-slate-300`}>
                                        <option value="">Tidak Ditentukan</option>
                                        {locations.map(l => <option key={l.id} value={l.id}>{l.full_path}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Status Awal <span className="text-red-500">*</span></label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)} required
                                        className={`w-full rounded-lg border text-sm focus:ring-[hsl(var(--primary))] border-slate-300`}>
                                        <option value="tersedia">Tersedia</option>
                                        <option value="digunakan">Digunakan</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="rusak">Rusak</option>
                                        <option value="tidak_aktif">Tidak Aktif</option>
                                    </select>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Ubah Foto Aset</label>
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
                                                <span className="text-sm text-slate-600 font-medium">Klik untuk upload foto baru</span>
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

                        <div className="bg-slate-50 p-4 px-8 flex justify-end gap-3 border-t border-slate-200">
                            <Link href={route('assets.show', asset.uuid)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100">
                                Batal
                            </Link>
                            <button type="submit" disabled={processing} className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-50">
                                <Save size={16} /> {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </PageTransition>
        </AuthenticatedLayout>
    );
}
