import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import { Save, UploadCloud, Building2, Paintbrush, Trash2, Check } from 'lucide-react';
import { useState } from 'react';

export default function Index({ settings }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        institution_name: settings.institution_name || '',
        app_description: settings.app_description || '',
        primary_color: settings.primary_color || '#3B82F6',
        contact_email: settings.contact_email || '',
        institution_logo: null,
    });

    const [preview, setPreview] = useState(settings.institution_logo ? `/storage/${settings.institution_logo}` : null);

    // Konversi HEX ke HSL untuk variable tailwind
    const hexToHSL = (hex) => {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        } else if (hex.length === 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        r /= 255; g /= 255; b /= 255;
        let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
        if (delta === 0) h = 0;
        else if (cmax === r) h = ((g - b) / delta) % 6;
        else if (cmax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        l = (cmax + cmin) / 2;
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);
        return `${h} ${s}% ${l}%`;
    };

    const handleColorChange = (e) => {
        const hex = e.target.value;
        setData('primary_color', hex);
        // Preview warna secara realtime dengan HSL injection
        document.documentElement.style.setProperty('--primary', hexToHSL(hex));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Set HSL values directly before submit via transform or backend controller
        // Inertia form doesn't easily let us add dynamic calculated fields on submit unless we use transform
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('institution_name', data.institution_name);
        formData.append('app_description', data.app_description);
        formData.append('primary_color', data.primary_color);
        formData.append('primary_color_hsl', hexToHSL(data.primary_color));
        formData.append('contact_email', data.contact_email);
        if (data.institution_logo) formData.append('institution_logo', data.institution_logo);

        router.post(route('settings.update'), formData, { preserveScroll: true });
    };

    const handleDeleteLogo = () => {
        router.delete(route('settings.delete-logo'), {
            preserveScroll: true,
            onSuccess: () => setPreview(null),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl leading-tight">Pengaturan Sistem</h2>}>
            <Head title="Pengaturan" />

            <PageTransition>
                <div className="w-full pb-10">
                    {flash.success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                            <Check size={18} /> {flash.success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Identitas Institusi */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                                <Building2 size={18} className="text-slate-500" />
                                <h3 className="font-semibold text-slate-800">Identitas Institusi</h3>
                            </div>
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700">Nama Institusi / Organisasi</label>
                                            <input type="text" value={data.institution_name} onChange={e => setData('institution_name', e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]" />
                                            {errors.institution_name && <p className="text-red-500 text-xs">{errors.institution_name}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700">Deskripsi Singkat Aplikasi</label>
                                            <input type="text" value={data.app_description} onChange={e => setData('app_description', e.target.value)}
                                                placeholder="Sistem Inventaris Aset & Lab"
                                                className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700">Email Kontak (Opsional)</label>
                                            <input type="email" value={data.contact_email} onChange={e => setData('contact_email', e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Logo Institusi</label>
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                                            {preview ? (
                                                <div className="flex flex-col items-center">
                                                    <img src={preview} alt="Logo" className="h-24 w-auto object-contain rounded mb-3" />
                                                    <div className="flex gap-2">
                                                        <label className="cursor-pointer text-xs font-medium text-[hsl(var(--primary))] bg-blue-50 px-3 py-1.5 rounded border border-blue-100 hover:bg-blue-100 transition-colors">
                                                            Ganti
                                                            <input type="file" className="hidden" accept="image/*" onChange={e => {
                                                                const file = e.target.files[0];
                                                                if(file) { setData('institution_logo', file); setPreview(URL.createObjectURL(file)); }
                                                            }} />
                                                        </label>
                                                        {settings.institution_logo && (
                                                            <button type="button" onClick={handleDeleteLogo} className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded border border-red-100 hover:bg-red-100 transition-colors flex items-center gap-1">
                                                                <Trash2 size={12}/> Hapus
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer flex flex-col items-center justify-center py-6">
                                                    <UploadCloud className="text-slate-400 mb-2" size={32} />
                                                    <span className="text-sm text-slate-600 font-medium">Upload Logo</span>
                                                    <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 1MB</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={e => {
                                                        const file = e.target.files[0];
                                                        if(file) { setData('institution_logo', file); setPreview(URL.createObjectURL(file)); }
                                                    }} />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Branding & Tema */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                                <Paintbrush size={18} className="text-slate-500" />
                                <h3 className="font-semibold text-slate-800">Personalisasi Tema</h3>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="max-w-xs space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Warna Utama (Primary Color)</label>
                                    <div className="flex items-center gap-3 mt-1">
                                        <input
                                            type="color"
                                            value={data.primary_color}
                                            onChange={handleColorChange}
                                            className="h-10 w-20 cursor-pointer rounded bg-white border border-slate-300 p-0.5"
                                        />
                                        <input
                                            type="text"
                                            value={data.primary_color}
                                            onChange={handleColorChange}
                                            className="flex-1 rounded-lg border border-slate-300 text-sm focus:ring-[hsl(var(--primary))]"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Ubah warna ini untuk menyesuaikan seluruh tampilan aplikasi dengan identitas instansi Anda.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" disabled={processing} className="px-6 py-2.5 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-50 shadow-md">
                                <Save size={16} /> {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </button>
                        </div>
                    </form>
                </div>
            </PageTransition>
        </AuthenticatedLayout>
    );
}
