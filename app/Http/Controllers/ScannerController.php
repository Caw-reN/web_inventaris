<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScannerController extends Controller
{
    /**
     * Tampilkan halaman QR Scanner.
     */
    public function index(): Response
    {
        return Inertia::render('Scanner/Index');
    }

    /**
     * Proses hasil scan.
     * Menerima payload uuid dari frontend, mencari id internal aset,
     * lalu mengembalikan route redirect ke halaman detail/edit aset.
     */
    public function process(Request $request)
    {
        $request->validate([
            'uuid' => 'required|uuid',
        ]);

        $asset = Asset::where('uuid', $request->uuid)->first();

        if (!$asset) {
            return response()->json([
                'success' => false,
                'message' => 'Aset tidak ditemukan dalam sistem.'
            ], 404);
        }

        // Redirect URL yang akan dieksekusi frontend
        return response()->json([
            'success'      => true,
            'redirect_url' => route('assets.show', $asset->id)
        ]);
    }
}
