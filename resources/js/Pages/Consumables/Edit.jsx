import { useForm, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeft, Save, Package } from 'lucide-react';

export default function Edit({ consumable, categories = [], locations = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: consumable.nama || '',
        category_id: consumable.category_id || '',
        location_id: consumable.location_id || '',
        satuan: consumable.satuan || 'Pcs',
        stok_minimum: consumable.stok_minimum ?? 5,
        harga_satuan: consumable.harga_satuan || '',
        keterangan: consumable.keterangan || '',
    });

    const categoryOptions = categories.map(c => ({
        value: c.id,
        label: c.nama
    }));

    const locationOptions = locations.map(l => ({
        value: l.id,
        label: l.nama,
        displayLabel: l.full_path || l.nama,
        depth: l.full_path ? (l.full_path.split(' > ').length - 1) : 0
    }));

    const satuanOptions = [
        { value: 'Pcs', label: 'Pcs (Pieces)' },
        { value: 'Box', label: 'Box / Dus' },
        { value: 'Rim', label: 'Rim (Kertas)' },
        { value: 'Pack', label: 'Pack / Pak' },
        { value: 'Roll', label: 'Roll / Gulung' },
        { value: 'Botol', label: 'Botol' },
        { value: 'Unit', label: 'Unit' },
        { value: 'Meter', label: 'Meter' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('consumables.update', consumable.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight">Edit Consumable</h2>}>
            <Head title={`Edit Consumable: ${consumable.nama}`} />

            <PageTransition>
                <div className="max-w-4xl mx-auto pb-10">
                    <div className="mb-4">
                        <Link href={route('consumables.index')} className="text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 text-sm font-medium">
                            <ArrowLeft size={16} /> Kembali ke Daftar
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                            <div className="p-2.5 bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] rounded-lg">
                                <Package size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-slate-800">Edit Data Master Consumable</h3>
                                <p className="text-sm text-slate-500">Perbarui informasi dasar untuk item ini.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Nama Item */}
                            <div>
                                <InputLabel htmlFor="nama" value="Nama Item Consumable *" />
                                <TextInput
                                    id="nama"
                                    type="text"
                                    value={data.nama}
                                    onChange={e => setData('nama', e.target.value)}
                                    className="mt-1 block w-full text-sm"
                                    placeholder="Contoh: Kertas A4 80gsm, Tinta Printer Black, dsb."
                                    required
                                />
                                <InputError message={errors.nama} className="mt-1" />
                            </div>

                            {/* Kategori dan Lokasi */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="category_id" value="Kategori *" />
                                    <SelectInput
                                        value={data.category_id}
                                        onChange={val => setData('category_id', val)}
                                        options={categoryOptions}
                                        placeholder="-- Pilih Kategori --"
                                        className="mt-1"
                                        error={!!errors.category_id}
                                    />
                                    <InputError message={errors.category_id} className="mt-1" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="location_id" value="Lokasi (Opsional)" />
                                    <SelectInput
                                        value={data.location_id}
                                        onChange={val => setData('location_id', val)}
                                        options={locationOptions}
                                        placeholder="-- Pilih Lokasi --"
                                        className="mt-1"
                                        error={!!errors.location_id}
                                    />
                                    <InputError message={errors.location_id} className="mt-1" />
                                </div>
                            </div>

                            {/* Satuan & Stok Min (Grid 2 Kolom) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="satuan" value="Satuan *" />
                                    <SelectInput
                                        value={data.satuan}
                                        onChange={val => setData('satuan', val)}
                                        options={satuanOptions}
                                        placeholder="Pilih Satuan"
                                        className="mt-1"
                                        error={!!errors.satuan}
                                    />
                                    <InputError message={errors.satuan} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="stok_minimum" value="Stok Minimum *" />
                                    <TextInput
                                        id="stok_minimum"
                                        type="number"
                                        min="0"
                                        value={data.stok_minimum}
                                        onChange={e => setData('stok_minimum', e.target.value)}
                                        className="mt-1 block w-full text-sm"
                                        placeholder="Alert jika stok < min"
                                        required
                                    />
                                    <p className="text-[11px] text-slate-500 mt-0.5">Peringatan stok menipis</p>
                                    <InputError message={errors.stok_minimum} className="mt-1" />
                                </div>
                            </div>

                            {/* Harga Satuan */}
                            <div>
                                <InputLabel htmlFor="harga_satuan" value="Harga Satuan (Rp)" />
                                <TextInput
                                    id="harga_satuan"
                                    type="number"
                                    min="0"
                                    value={data.harga_satuan}
                                    onChange={e => setData('harga_satuan', e.target.value)}
                                    className="mt-1 block w-full md:w-1/2 text-sm"
                                    placeholder="Opsional"
                                />
                                <InputError message={errors.harga_satuan} className="mt-1" />
                            </div>

                            {/* Keterangan */}
                            <div>
                                <InputLabel htmlFor="keterangan" value="Keterangan / Catatan" />
                                <textarea
                                    id="keterangan"
                                    value={data.keterangan}
                                    onChange={e => setData('keterangan', e.target.value)}
                                    className="border-slate-300 focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] rounded-lg shadow-xs mt-1 block w-full text-sm"
                                    rows="3"
                                    placeholder="Catatan tambahan (opsional)..."
                                />
                                <InputError message={errors.keterangan} className="mt-1" />
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                                <Link href={route('consumables.index')} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                    Batal
                                </Link>
                                <PrimaryButton disabled={processing} className="bg-[hsl(var(--primary))] hover:opacity-90 flex items-center gap-2">
                                    <Save size={16} /> Simpan Perubahan
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </PageTransition>
        </AuthenticatedLayout>
    );
}
