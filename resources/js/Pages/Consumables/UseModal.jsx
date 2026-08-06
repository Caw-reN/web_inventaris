import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { PackageMinus, X } from 'lucide-react';

export default function UseModal({ item, show, onClose }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        tipe: 'keluar',
        jumlah: 1,
        keterangan: '',
    });

    useEffect(() => {
        if (show) {
            reset({
                tipe: 'keluar',
                jumlah: 1,
                keterangan: '',
            });
            clearErrors();
        }
    }, [show]);

    if (!item) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('consumables.transaksi', item.id), {
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
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-200/60">
                            <PackageMinus size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Gunakan Item Consumable
                            </h2>
                            <p className="text-xs text-slate-500">
                                Catat pemakaian / pengurangan stok item
                            </p>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Info Stok Item */}
                <div className="mb-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 font-medium">Item Consumable</p>
                        <p className="text-sm font-bold text-slate-900">{item.nama}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 font-medium">Stok Tersedia</p>
                        <p className="text-sm font-bold text-emerald-600">{item.stok} {item.satuan}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Jumlah Pemakaian */}
                    <div>
                        <InputLabel htmlFor="jumlah" value={`Jumlah Pemakaian (${item.satuan}) *`} />
                        <TextInput
                            id="jumlah"
                            type="number"
                            min="1"
                            max={item.stok}
                            value={data.jumlah}
                            onChange={e => setData('jumlah', e.target.value)}
                            className="mt-1 block w-full text-sm font-semibold"
                            required
                        />
                        {item.stok < data.jumlah && (
                            <p className="text-xs text-red-500 mt-1">Jumlah melebihi stok yang tersedia ({item.stok} {item.satuan})</p>
                        )}
                        <InputError message={errors.jumlah} className="mt-1" />
                    </div>

                    {/* Keterangan Pemakaian */}
                    <div>
                        <InputLabel htmlFor="keterangan" value="Keterangan / Keperluan Pemakaian" />
                        <textarea
                            id="keterangan"
                            value={data.keterangan}
                            onChange={e => setData('keterangan', e.target.value)}
                            className="border-slate-300 focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] rounded-lg shadow-xs mt-1 block w-full text-sm"
                            rows="3"
                            placeholder="Contoh: Digunakan untuk keperluan rapat divisi HRD..."
                        />
                        <InputError message={errors.keterangan} className="mt-1" />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <SecondaryButton type="button" onClick={onClose}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton 
                            disabled={processing || data.jumlah > item.stok || data.jumlah < 1} 
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            <PackageMinus size={15} className="mr-1.5" /> Konfirmasi Pemakaian
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
