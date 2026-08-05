import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ReportSuccess({ asset }) {
    return (
        <GuestLayout>
            <Head title="Laporan Terkirim" />

            <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Laporan Terkirim!</h2>
                <p className="text-slate-400 text-sm mb-6">
                    Terima kasih telah melaporkan kendala pada aset <span className="font-semibold text-white">{asset.nama}</span>.
                    Tim teknisi kami akan segera menindaklanjutinya.
                </p>

                <a
                    href={route('public.asset', asset.uuid)}
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Kembali ke Detail Aset
                </a>
            </div>
        </GuestLayout>
    );
}
