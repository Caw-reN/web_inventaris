import { Head, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { CheckCircle2, ArrowLeft, Barcode, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportSuccess({ asset }) {
    const { flash } = usePage().props;

    const message = flash?.success || 'Permintaan / Laporan Anda telah berhasil terkirim dan tercatat di sistem.';

    return (
        <GuestLayout>
            <Head title="Berhasil Dikirim" />

            <div className="text-center py-4 space-y-5">
                {/* Animated Success Icon Ring */}
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-emerald-100/80 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50 shadow-md"
                >
                    <CheckCircle2 size={42} className="stroke-[2.5]" />
                </motion.div>

                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Berhasil Dikirim!</h2>
                    <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed max-w-sm mx-auto font-medium">
                        {message}
                    </p>
                </div>

                {/* Target Asset Summary Pill */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-xs mx-auto shadow-2xs">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Aset Terkait</p>
                    <p className="text-sm font-bold text-slate-800">{asset.nama}</p>
                    <div className="mt-1.5 flex items-center justify-center gap-1.5 font-mono text-[11px] font-semibold text-slate-500">
                        <Barcode size={12} className="text-[hsl(var(--primary))]" />
                        <span>{asset.nomor_inventaris || asset.no_seri || asset.uuid.substring(0, 8)}</span>
                    </div>
                </div>

                {/* Back Button */}
                <div className="pt-2">
                    <a
                        href={route('public.asset', asset.uuid)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-xs sm:text-sm bg-[hsl(var(--primary))] hover:opacity-90 text-white transition-all shadow-md active:scale-[0.99]"
                    >
                        <ArrowLeft size={16} /> Kembali ke Halaman Detail Aset
                    </a>
                </div>

                <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1">
                        <ShieldCheck size={13} className="text-emerald-500" /> Terverifikasi oleh Sistem Inventaris
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
