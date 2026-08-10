import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { ArrowDown } from 'lucide-react';

export default function Error({ status }) {
    const title = status === 404 ? '404 - Halaman Tidak Ditemukan' : 'Terjadi Kesalahan';
    
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 font-sans text-white relative overflow-hidden">
            <Head title={title} />
            
            {/* Background elements to match project UI but keep it dark */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[hsl(var(--primary))]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[hsl(var(--primary))]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>

            <div className="max-w-5xl w-full z-10 flex flex-col items-center md:items-start">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-12">
                    <h1 className="text-[8rem] md:text-[14rem] font-medium leading-none tracking-tight text-white m-0 p-0">404</h1>
                    <div className="text-lg md:text-3xl font-light tracking-widest uppercase text-slate-300 mb-4 md:mb-16 text-center md:text-left">
                        (Oh tidak! Halaman ini<br/>tidak ditemukan)
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-12 -mt-4 md:-mt-8">
                    <h2 className="text-[6rem] md:text-[12rem] font-medium leading-none tracking-tight text-white m-0 p-0">MAAF</h2>
                    <div className="flex gap-4 md:gap-8 mt-2 md:mt-0 mb-4 md:mb-12">
                        <ArrowDown className="w-16 h-16 md:w-32 md:h-32 text-[hsl(var(--primary))] opacity-80" strokeWidth={1} />
                        <ArrowDown className="w-16 h-16 md:w-32 md:h-32 text-[hsl(var(--primary))] opacity-80" strokeWidth={1} />
                        <ArrowDown className="w-16 h-16 md:w-32 md:h-32 text-[hsl(var(--primary))] opacity-80" strokeWidth={1} />
                    </div>
                </div>

                <div className="mt-16 md:mt-24 w-full flex justify-center">
                    <Link 
                        href="/" 
                        className="inline-flex items-center justify-center px-10 py-3 rounded-full bg-white text-slate-900 font-medium text-lg md:text-xl tracking-wide hover:bg-[hsl(var(--primary))] hover:text-white transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_hsl(var(--primary))]"
                    >
                        KEMBALI KE BERANDA
                    </Link>
                </div>
            </div>
        </div>
    );
}
