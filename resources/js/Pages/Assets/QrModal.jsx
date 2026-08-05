import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Download, Printer } from 'lucide-react';

export default function QrModal({ isOpen, onClose, asset }) {
    if (!asset) return null;

    const qrUrl = route('assets.qr', asset.id);

    const handlePrint = () => {
        const printWindow = window.open(qrUrl, '_blank');
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print();
            };
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                                <div className="flex justify-end absolute right-4 top-4">
                                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1 rounded-full transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="mt-2">
                                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-slate-900 mb-1">
                                        QR Code Aset
                                    </Dialog.Title>
                                    <p className="text-sm text-slate-500 mb-6">
                                        {asset.nama} <br/>
                                        <span className="font-mono text-xs">{asset.no_seri || asset.uuid}</span>
                                    </p>
                                    
                                    <div className="flex justify-center bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6 shadow-inner">
                                        <img src={qrUrl} alt={`QR Code ${asset.nama}`} className="w-48 h-48" />
                                    </div>

                                    <div className="flex justify-center gap-3">
                                        <a
                                            href={qrUrl}
                                            download={`QR_${asset.nama}.svg`}
                                            className="inline-flex items-center gap-2 justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none transition-colors w-full shadow-sm"
                                        >
                                            <Download size={16} /> Download
                                        </a>
                                        <button
                                            onClick={handlePrint}
                                            className="inline-flex items-center gap-2 justify-center rounded-lg border border-transparent bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none transition-colors w-full shadow-sm"
                                        >
                                            <Printer size={16} /> Print
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
