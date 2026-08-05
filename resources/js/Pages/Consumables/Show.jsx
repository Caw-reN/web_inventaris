import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import { ArrowLeft, PackagePlus, PackageMinus, History, Check } from 'lucide-react';
import { useState } from 'react';

export default function Show({ consumable, transactions }) {
    const { flash } = usePage().props;
    const [transaksiType, setTransaksiType] = useState('masuk'); // masuk | keluar

    const { data, setData, post, processing, errors, reset } = useForm({
        tipe: 'masuk',
        jumlah: 1,
        keterangan: '',
    });

    const handleTransaksi = (e) => {
        e.preventDefault();
        post(route('consumables.transaksi', consumable.id), {
            preserveScroll: true,
            onSuccess: () => reset('jumlah', 'keterangan'),
        });
    };

    const isLowStock = consumable.stok <= consumable.stok_minimum;

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight">Detail Consumable</h2>}>
            <Head title={`Consumable: ${consumable.nama}`} />

            <PageTransition>
                <div className="w-full pb-10">
                    <div className="mb-4">
                        <Link href={route('consumables.index')} className="text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 text-sm font-medium">
                            <ArrowLeft size={16} /> Kembali ke Daftar
                        </Link>
                    </div>

                    {flash.success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                            <Check size={18} /> {flash.success}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Info & Form Transaksi */}
                        <div className="space-y-6">
                            {/* Card Info */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h1 className="text-2xl font-bold text-slate-900 mb-1">{consumable.nama}</h1>
                                <p className="text-sm text-slate-500 mb-6">{consumable.category?.nama || 'Tanpa Kategori'}</p>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Stok Saat Ini</p>
                                        <p className={`text-3xl font-bold ${isLowStock ? 'text-red-600' : 'text-slate-800'}`}>
                                            {consumable.stok} <span className="text-base font-normal text-slate-500">{consumable.satuan}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Stok Min.</p>
                                        <p className="text-lg font-medium text-slate-700">{consumable.stok_minimum}</p>
                                    </div>
                                </div>

                                {isLowStock && (
                                    <p className="mt-3 text-sm text-red-600 font-medium flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> Stok menipis! Segera lakukan restock.
                                    </p>
                                )}
                            </div>

                            {/* Card Form Transaksi */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="flex border-b border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => { setTransaksiType('masuk'); setData('tipe', 'masuk'); }}
                                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors
                                            ${transaksiType === 'masuk' ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))] bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <PackagePlus size={16} /> Restock (Masuk)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setTransaksiType('keluar'); setData('tipe', 'keluar'); }}
                                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors
                                            ${transaksiType === 'keluar' ? 'border-amber-500 text-amber-600 bg-amber-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <PackageMinus size={16} /> Pemakaian (Keluar)
                                    </button>
                                </div>
                                <form onSubmit={handleTransaksi} className="p-6 space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Jumlah {transaksiType === 'masuk' ? 'Ditambahkan' : 'Digunakan'}</label>
                                        <div className="flex items-center gap-2">
                                            <input type="number" min="1" value={data.jumlah} onChange={e => setData('jumlah', e.target.value)} required
                                                className={`flex-1 rounded-lg border text-sm focus:ring-[hsl(var(--primary))] ${errors.jumlah ? 'border-red-500' : 'border-slate-300'}`} />
                                            <span className="text-slate-500 font-medium">{consumable.satuan}</span>
                                        </div>
                                        {errors.jumlah && <p className="text-red-500 text-xs">{errors.jumlah}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Keterangan / Tujuan</label>
                                        <textarea rows="2" value={data.keterangan} onChange={e => setData('keterangan', e.target.value)} required={transaksiType === 'keluar'}
                                            placeholder={transaksiType === 'keluar' ? 'Contoh: Digunakan untuk Lab Komputer 1' : 'Contoh: Pembelian dari Supplier X'}
                                            className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]" />
                                    </div>
                                    <button type="submit" disabled={processing}
                                        className={`w-full py-2.5 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity
                                            ${transaksiType === 'masuk' ? 'bg-[hsl(var(--primary))]' : 'bg-amber-600'}`}>
                                        {transaksiType === 'masuk' ? <PackagePlus size={16}/> : <PackageMinus size={16}/>}
                                        {processing ? 'Menyimpan...' : 'Catat Transaksi'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Riwayat Transaksi */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <History size={18} className="text-slate-500" /> Riwayat Transaksi (Kartu Stok)
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Waktu</th>
                                                <th className="px-4 py-3 font-medium">Tipe</th>
                                                <th className="px-4 py-3 font-medium text-center">Jumlah</th>
                                                <th className="px-4 py-3 font-medium">Sisa Stok</th>
                                                <th className="px-4 py-3 font-medium">Keterangan</th>
                                                <th className="px-4 py-3 font-medium">Oleh</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {transactions.data.length === 0 ? (
                                                <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500">Belum ada riwayat transaksi.</td></tr>
                                            ) : (
                                                transactions.data.map(trx => (
                                                    <tr key={trx.id} className="hover:bg-slate-50">
                                                        <td className="px-4 py-3 text-slate-600">{new Date(trx.created_at).toLocaleString('id-ID')}</td>
                                                        <td className="px-4 py-3">
                                                            {trx.tipe === 'masuk'
                                                                ? <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded flex items-center gap-1 w-max"><PackagePlus size={12}/> Masuk</span>
                                                                : <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded flex items-center gap-1 w-max"><PackageMinus size={12}/> Keluar</span>
                                                            }
                                                        </td>
                                                        <td className={`px-4 py-3 font-bold text-center ${trx.tipe === 'masuk' ? 'text-green-600' : 'text-amber-600'}`}>
                                                            {trx.tipe === 'masuk' ? '+' : '-'}{trx.jumlah}
                                                        </td>
                                                        <td className="px-4 py-3 font-medium text-slate-800">{trx.stok_sesudah}</td>
                                                        <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate" title={trx.keterangan}>{trx.keterangan || '-'}</td>
                                                        <td className="px-4 py-3 text-slate-600">{trx.user?.name || '-'}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Simple Pagination */}
                                {transactions.links.length > 3 && (
                                    <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-center gap-1">
                                        {transactions.links.map((link, i) => (
                                            <Link key={i} href={link.url}
                                                className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-[hsl(var(--primary))] text-white' : link.url ? 'bg-white border text-slate-600 hover:bg-slate-100' : 'text-slate-400 cursor-not-allowed'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </AuthenticatedLayout>
    );
}
