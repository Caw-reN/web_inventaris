import { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageTransition from '@/Components/PageTransition';
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5Qrcode } from 'html5-qrcode';
import { ScanLine, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function Index() {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const scannerRef = useRef(null);

    useEffect(() => {
        // Inisialisasi scanner
        const html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { 
                fps: 10, 
                qrbox: { width: 250, height: 250 },
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                rememberLastUsedCamera: true,
                aspectRatio: 1.0
            },
            /* verbose= */ false
        );

        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = html5QrcodeScanner;

        // Cleanup saat komponen dilepas
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(e => console.error("Failed to clear scanner", e));
            }
        };
    }, []);

    const onScanSuccess = async (decodedText, decodedResult) => {
        // Hentikan scan sementara saat memproses
        if (scannerRef.current) {
            scannerRef.current.pause(true);
        }

        setProcessing(true);
        setError(null);
        setScanResult(decodedText);

        try {
            // Ekstrak UUID dari URL (asumsi URL format: http://domain/aset/{uuid})
            // Kita pisahkan berdasarkan '/' dan ambil bagian terakhir
            const urlParts = decodedText.split('/');
            const uuid = urlParts[urlParts.length - 1];

            // Validasi format UUID sederhana
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            
            if (!uuidRegex.test(uuid)) {
                throw new Error("Format QR Code tidak dikenali sebagai URL aset sistem ini.");
            }

            // Kirim ke backend untuk diproses
            const response = await fetch(route('scanner.process'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ uuid })
            });

            const data = await response.json();

            if (data.success && data.redirect_url) {
                // Arahkan teknisi ke halaman detail aset
                window.location.href = data.redirect_url;
            } else {
                throw new Error(data.message || "Aset tidak ditemukan.");
            }

        } catch (err) {
            setError(err.message);
            setProcessing(false);
        }
    };

    const onScanFailure = (error) => {
        // Mengabaikan error scan (biasanya karena belum fokus ke QR)
        // console.warn(`Code scan error = ${error}`);
    };

    const resumeScanning = () => {
        setScanResult(null);
        setError(null);
        setProcessing(false);
        if (scannerRef.current) {
            scannerRef.current.resume();
        }
    };

    return (
        <AuthenticatedLayout header="Scan QR Code">
            <Head title="Scan QR Code" />
            
            <PageTransition>
                <div className="w-full pb-10">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ScanLine size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Scanner Aset</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                Arahkan kamera ke QR Code yang tertempel di aset untuk melihat atau mengubah detailnya.
                            </p>
                        </div>

                        <div className="p-6">
                            {/* Area Scanner */}
                            <div className={`relative max-w-sm mx-auto overflow-hidden rounded-xl border-2 ${error ? 'border-red-300' : (scanResult && !error ? 'border-green-300' : 'border-slate-200')}`}>
                                <div id="reader" className="w-full"></div>
                                
                                {/* Overlay Loading */}
                                {processing && !error && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                        <RefreshCw size={32} className="text-[hsl(var(--primary))] animate-spin mb-3" />
                                        <p className="text-sm font-medium text-slate-700">Memproses aset...</p>
                                    </div>
                                )}
                            </div>

                            {/* Status Messages */}
                            {error && (
                                <div className="mt-6 max-w-sm mx-auto bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex flex-col items-center text-center">
                                    <AlertCircle size={24} className="mb-2" />
                                    <p className="text-sm font-medium">{error}</p>
                                    <button 
                                        onClick={resumeScanning}
                                        className="mt-3 px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold rounded-full transition-colors"
                                    >
                                        Coba Lagi
                                    </button>
                                </div>
                            )}

                            {scanResult && !error && !processing && (
                                <div className="mt-6 max-w-sm mx-auto bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex flex-col items-center text-center">
                                    <CheckCircle2 size={24} className="mb-2" />
                                    <p className="text-sm font-medium">Berhasil dipindai!</p>
                                    <p className="text-xs mt-1 break-all opacity-80">{scanResult}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </PageTransition>

            {/* Tambahan style CSS untuk menimpa gaya bawaan html5-qrcode */}
            <style dangerouslySetInnerHTML={{__html: `
                #reader {
                    border: none !important;
                }
                #reader__scan_region {
                    background: #f8fafc;
                }
                #reader__dashboard_section_csr span {
                    color: #475569 !important;
                    font-size: 14px;
                }
                #reader button {
                    background-color: hsl(var(--primary));
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    margin: 8px 0;
                    transition: opacity 0.2s;
                }
                #reader button:hover {
                    opacity: 0.9;
                }
                #reader select {
                    padding: 8px;
                    border-radius: 6px;
                    border: 1px solid #cbd5e1;
                    margin: 8px 0;
                    width: 100%;
                    max-width: 250px;
                }
                #reader__dashboard_section_swaplink {
                    color: hsl(var(--primary)) !important;
                    text-decoration: none !important;
                    font-weight: 500;
                    margin-top: 8px;
                    display: inline-block;
                }
            `}} />
        </AuthenticatedLayout>
    );
}
