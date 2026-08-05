import { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function BorrowModal({ asset = null, availableAssets = [], borrowers = [], show, onClose }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        asset_id: asset ? asset.id : '',
        nama_peminjam: '',
        tenggat_waktu: '',
        catatan_pinjam: '',
        foto_pinjam: null,
    });

    const [filteredBorrowers, setFilteredBorrowers] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (show) {
            reset();
            clearErrors();
            setFilteredBorrowers([]);
            setShowSuggestions(false);
            if (asset) {
                setData('asset_id', asset.id);
            } else {
                setData('asset_id', '');
            }
        }
    }, [show, asset]);

    useEffect(() => {
        if (data.nama_peminjam.trim() === '') {
            setFilteredBorrowers([]);
            setShowSuggestions(false);
            return;
        }

        const filtered = borrowers.filter(b => 
            b.toLowerCase().includes(data.nama_peminjam.toLowerCase()) && 
            b !== data.nama_peminjam
        );
        
        setFilteredBorrowers(filtered);
        setShowSuggestions(filtered.length > 0);
    }, [data.nama_peminjam, borrowers]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [wrapperRef]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('loans.store'), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                    {asset ? `Pinjamkan Aset: ${asset.nama}` : 'Tambah Peminjaman Baru'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!asset && (
                        <div>
                            <InputLabel htmlFor="asset_id" value="Pilih Aset" />
                            <select
                                id="asset_id"
                                value={data.asset_id}
                                onChange={e => setData('asset_id', e.target.value)}
                                className="border-slate-300 focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] rounded-md shadow-sm mt-1 block w-full text-sm"
                                required
                            >
                                <option value="">-- Pilih Aset (Tersedia) --</option>
                                {availableAssets.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.nama} ({a.nomor_inventaris}) {a.merk ? `- ${a.merk}` : ''}
                                    </option>
                                ))}
                            </select>
                            {availableAssets.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1 font-medium">Saat ini tidak ada aset berstatus &quot;Tersedia&quot;.</p>
                            )}
                            <InputError message={errors.asset_id} className="mt-2" />
                        </div>
                    )}

                    <div ref={wrapperRef} className="relative">
                        <InputLabel htmlFor="nama_peminjam" value="Nama Peminjam" />
                        <TextInput
                            id="nama_peminjam"
                            type="text"
                            value={data.nama_peminjam}
                            onChange={e => setData('nama_peminjam', e.target.value)}
                            onFocus={() => {
                                if (filteredBorrowers.length > 0) setShowSuggestions(true);
                            }}
                            className="mt-1 block w-full"
                            placeholder="Ketik atau pilih nama..."
                            required
                        />
                        <InputError message={errors.nama_peminjam} className="mt-2" />

                        {/* Autocomplete Suggestions */}
                        {showSuggestions && (
                            <ul className="absolute z-10 w-full bg-white border border-slate-200 mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                {filteredBorrowers.map((b, idx) => (
                                    <li 
                                        key={idx}
                                        onClick={() => {
                                            setData('nama_peminjam', b);
                                            setShowSuggestions(false);
                                        }}
                                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                                    >
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <InputLabel htmlFor="tenggat_waktu" value="Batas Waktu Pinjam (Opsional)" />
                        <TextInput
                            id="tenggat_waktu"
                            type="date"
                            value={data.tenggat_waktu}
                            onChange={e => setData('tenggat_waktu', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.tenggat_waktu} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="foto_pinjam" value="Foto Barang (Opsional)" />
                        <input
                            id="foto_pinjam"
                            type="file"
                            onChange={e => setData('foto_pinjam', e.target.files[0])}
                            className="mt-1 block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[hsl(var(--primary)/0.1)] file:text-[hsl(var(--primary))]
                                hover:file:bg-[hsl(var(--primary)/0.2)]
                                cursor-pointer"
                            accept="image/*"
                        />
                        <InputError message={errors.foto_pinjam} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="catatan_pinjam" value="Catatan Tambahan (Opsional)" />
                        <textarea
                            id="catatan_pinjam"
                            value={data.catatan_pinjam}
                            onChange={e => setData('catatan_pinjam', e.target.value)}
                            className="border-slate-300 focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] rounded-md shadow-sm mt-1 block w-full text-sm"
                            rows="3"
                        />
                        <InputError message={errors.catatan_pinjam} className="mt-2" />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton onClick={onClose}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing || (!asset && availableAssets.length === 0)}>Pinjamkan</PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
