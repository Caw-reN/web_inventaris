import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function ReturnModal({ loan, show, onClose }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        catatan_kembali: '',
        foto_kembali: null,
    });

    useEffect(() => {
        if (show) {
            reset();
            clearErrors();
        }
    }, [show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('loans.return', loan.id), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    if (!loan) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Kembalikan Aset: {loan.asset?.nama}
                </h2>

                <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                    <p><span className="text-slate-500">Peminjam:</span> <span className="font-medium">{loan.nama_peminjam}</span></p>
                    <p><span className="text-slate-500">Tgl Pinjam:</span> <span className="font-medium">{new Date(loan.tanggal_pinjam).toLocaleDateString('id-ID')}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="foto_kembali" value="Foto Barang Saat Kembali (Opsional)" />
                        <input
                            id="foto_kembali"
                            type="file"
                            onChange={e => setData('foto_kembali', e.target.files[0])}
                            className="mt-1 block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-emerald-50 file:text-emerald-700
                                hover:file:bg-emerald-100
                                cursor-pointer"
                            accept="image/*"
                        />
                        <InputError message={errors.foto_kembali} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="catatan_kembali" value="Catatan Kondisi Barang (Opsional)" />
                        <textarea
                            id="catatan_kembali"
                            value={data.catatan_kembali}
                            onChange={e => setData('catatan_kembali', e.target.value)}
                            className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm mt-1 block w-full text-sm"
                            rows="3"
                        />
                        <InputError message={errors.catatan_kembali} className="mt-2" />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton onClick={onClose}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">Kembalikan</PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
