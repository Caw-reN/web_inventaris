import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

export default function Error({ status }) {
    const title = status === 404 ? '404 - Halaman Tidak Ditemukan' : 'Terjadi Kesalahan';
    
    return (
        <div className="min-h-screen bg-[#F5F6F8] flex flex-col relative overflow-hidden font-sans">
            <Head title={title} />
            
            {/* Content Container */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-24 lg:px-40 z-10">
                <div className="max-w-3xl">
                    <p className="text-sm md:text-base font-semibold text-slate-500 mb-6 tracking-wider">
                        [ Error ]
                    </p>
                    
                    <h1 className="text-5xl md:text-[5rem] lg:text-[6rem] font-medium leading-[1.1] tracking-tight text-[#222222] mb-1">
                        Mohon Maaf.
                    </h1>
                    <h2 className="text-5xl md:text-[5rem] lg:text-[6rem] font-medium leading-[1.1] tracking-tight text-[#222222] mb-12">
                        Halaman Kosong
                    </h2>
                    
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#2A2A2A] text-white text-sm font-medium hover:bg-[hsl(var(--primary))] transition-all duration-300 rounded-sm shadow-lg hover:shadow-[hsl(var(--primary))] hover:-translate-y-1"
                    >
                        <ArrowUpRight size={18} strokeWidth={2} />
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>

            {/* 404 Watermark in bottom right */}
            <div className="absolute -bottom-8 md:-bottom-16 -right-4 md:-right-8 select-none pointer-events-none">
                <span className="text-[12rem] md:text-[20rem] lg:text-[30rem] font-bold leading-none text-[#2A2A2A] tracking-tighter">
                    404
                </span>
            </div>
        </div>
    );
}
