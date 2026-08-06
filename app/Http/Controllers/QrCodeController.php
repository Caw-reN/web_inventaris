<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QrCodeController extends Controller
{
    /**
     * Generate QR Code SVG untuk satu aset (untuk preview di halaman detail).
     */
    public function show(Asset $asset): Response
    {
        $url = route('public.asset', $asset->uuid);

        $qr = QrCode::format('svg')
            ->size(200)
            ->margin(1)
            ->errorCorrection('M')
            ->generate($url);

        return response($qr, 200, [
            'Content-Type' => 'image/svg+xml',
        ]);
    }

    /**
     * Export PDF berisi QR Code massal dalam format grid (siap cetak stiker).
     */
    public function bulkExport(Request $request): \Illuminate\Http\Response
    {
        $request->validate([
            'asset_ids'   => 'required|array|min:1|max:100',
            'asset_ids.*' => 'exists:assets,id',
        ]);

        $assets = Asset::with(['location', 'category'])
            ->whereIn('id', $request->asset_ids)
            ->get();

        $institutionName = Setting::get('institution_name', 'Sistem Inventaris');
        $institutionLogo = Setting::get('institution_logo');

        // Generate QR SVG untuk setiap aset
        $assetsWithQr = $assets->map(function (Asset $asset) {
            $url = route('public.asset', $asset->uuid);
            $qrSvg = QrCode::format('svg')->size(120)->errorCorrection('M')->generate($url);

            return [
                'nama'     => $asset->nama,
                'no_seri'  => $asset->no_seri,
                'lokasi'   => $asset->location?->nama ?? '-',
                'uuid'     => $asset->uuid,
                'qr_svg'   => base64_encode($qrSvg),
            ];
        });

        $pdf = Pdf::loadView('pdf.bulk-qr', [
            'assets'          => $assetsWithQr,
            'institutionName' => $institutionName,
            'institutionLogo' => $institutionLogo,
        ])->setPaper('a4');

        return $pdf->download('qr-code-aset-' . now()->format('Ymd-His') . '.pdf');
    }
}
