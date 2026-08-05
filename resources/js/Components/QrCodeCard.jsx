import { QrCode, Download, Printer } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function QrCodeCard({ asset }) {
    const [svgData, setSvgData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch SVG dari endpoint QrCodeController
        fetch(route('assets.qr', asset.id))
            .then(res => res.text())
            .then(svg => {
                setSvgData(svg);
                setLoading(false);
            })
            .catch(err => {
                console.error("Gagal meload QR Code", err);
                setLoading(false);
            });
    }, [asset.id]);

    const handleDownload = () => {
        if (!svgData) return;
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `QR-${asset.no_seri || asset.nama}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <QrCode size={18} className="text-slate-500" />
                <h3 className="font-semibold text-slate-800 text-sm">QR Code Aset</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col items-center justify-center">
                {loading ? (
                    <div className="w-48 h-48 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">
                        <span className="text-slate-400 text-sm">Memuat...</span>
                    </div>
                ) : (
                    <div
                        className="w-48 h-48 border-4 border-white shadow-sm rounded-lg overflow-hidden bg-white"
                        dangerouslySetInnerHTML={{ __html: svgData }}
                    />
                )}
                <p className="mt-4 text-xs text-center text-slate-500">
                    Scan QR Code ini untuk melihat detail aset melalui portal publik.
                </p>
            </div>
            <div className="p-3 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-2">
                <button
                    onClick={handleDownload}
                    disabled={loading || !svgData}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                    <Download size={16} /> Unduh SVG
                </button>
                <form action={route('assets.bulk-qr-export')} method="POST" target="_blank" className="w-full">
                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                    <input type="hidden" name="asset_ids[]" value={asset.id} />
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium bg-[hsl(var(--primary))] text-white hover:opacity-90 transition-opacity"
                    >
                        <Printer size={16} /> Cetak PDF
                    </button>
                </form>
            </div>
        </div>
    );
}
