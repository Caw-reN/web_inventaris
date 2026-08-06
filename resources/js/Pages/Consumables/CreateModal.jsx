import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Package, X } from 'lucide-react';
import { useEffect } from 'react';

export default function CreateModal({ show, onClose, categories = [], locations = [] }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        nama: '',
        category_id: '',
        location_id: '',
        satuan: 'Pcs',
        stok: '0',
        stok_minimum: '5',
        harga_satuan: '',
        keterangan: '',
    });

    useEffect(() => {
        if (show) {
            reset();
            clearErrors();
        }
    }, [show]);

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
        post(route('consumables.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] rounded-lg">
                            <Package size={18} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Tambah Item Consumable Baru
                        </h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                    {/* Satuan & Stok awal (Grid 2 Kolom) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            <InputLabel htmlFor="stok" value="Stok Awal *" />
                            <TextInput
                                id="stok"
                                type="number"
                                min="0"
                                value={data.stok}
                                onChange={e => setData('stok', e.target.value)}
                                className="mt-1 block w-full text-sm"
                                required
                            />
                            <InputError message={errors.stok} className="mt-1" />
                        </div>
                    </div>

                    {/* Stok Min & Harga Satuan (Grid 2 Kolom) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                        <div>
                            <InputLabel htmlFor="harga_satuan" value="Harga Satuan (Rp)" />
                            <TextInput
                                id="harga_satuan"
                                type="number"
                                min="0"
                                value={data.harga_satuan}
                                onChange={e => setData('harga_satuan', e.target.value)}
                                className="mt-1 block w-full text-sm"
                                placeholder="Opsional"
                            />
                            <InputError message={errors.harga_satuan} className="mt-1" />
                        </div>
                    </div>

                    {/* Keterangan */}
                    <div>
                        <InputLabel htmlFor="keterangan" value="Keterangan / Catatan" />
                        <textarea
                            id="keterangan"
                            value={data.keterangan}
                            onChange={e => setData('keterangan', e.target.value)}
                            className="border-slate-300 focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] rounded-lg shadow-xs mt-1 block w-full text-sm"
                            rows="2"
                            placeholder="Catatan tambahan (opsional)..."
                        />
                        <InputError message={errors.keterangan} className="mt-1" />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <SecondaryButton type="button" onClick={onClose}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-[hsl(var(--primary))] hover:opacity-90">
                            Simpan Item
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
