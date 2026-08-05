import { usePage } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import { useEffect } from 'react';

export default function GuestLayout({ children }) {
    const { settings } = usePage().props;

    // Inject primary color
    useEffect(() => {
        if (settings?.primary_color_hsl) {
            document.documentElement.style.setProperty('--primary', settings.primary_color_hsl);
        }
    }, [settings?.primary_color_hsl]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-800 font-sans">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
                    style={{ backgroundColor: settings?.primary_color || '#3B82F6' }}
                />
                <div
                    className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
                    style={{ backgroundColor: settings?.primary_color || '#3B82F6' }}
                />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo & Nama Institusi */}
                <div className="text-center mb-8">
                    {settings?.institution_logo ? (
                        <img
                            src={settings.institution_logo}
                            alt={settings.institution_name}
                            className="h-16 w-auto mx-auto mb-4 object-contain"
                        />
                    ) : (
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--primary))] flex items-center justify-center shadow-lg">
                            <Building2 size={32} className="text-white" />
                        </div>
                    )}
                    <h1 className="text-2xl font-bold text-slate-800">
                        {settings?.institution_name || 'Sistem Inventaris'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {settings?.app_description || 'Sistem Inventaris Aset & Lab'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
