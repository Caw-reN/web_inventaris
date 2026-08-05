<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    /**
     * Halaman publik hasil scan QR — tanpa autentikasi.
     * Data sensitif (harga_beli, ip_address) disembunyikan.
     */
    public function show(string $uuid): Response
    {
        $asset = Asset::where('uuid', $uuid)
            ->with(['category', 'location'])
            ->firstOrFail();

        // Sembunyikan field sensitif dari tampilan publik
        $publicAsset = [
            'id'           => $asset->id,
            'uuid'         => $asset->uuid,
            'nama'         => $asset->nama,
            'no_seri'      => $asset->no_seri,
            'merk'         => $asset->merk,
            'status'       => $asset->status,
            'status_label' => $asset->status_label,
            'spesifikasi'  => $asset->spesifikasi,
            'foto'         => $asset->foto ? asset('storage/' . $asset->foto) : null,
            'category'     => $asset->category?->only(['id', 'nama']),
            'location'     => $asset->location?->only(['id', 'nama', 'kode']),
            'catatan'      => $asset->catatan,
        ];

        return Inertia::render('Public/AssetDetail', [
            'asset' => $publicAsset,
        ]);
    }

    /**
     * Proses form laporan kerusakan dari portal publik.
     * Dilindungi rate limiting (didefinisikan di routes).
     */
    public function laporkan(Request $request, string $uuid): RedirectResponse
    {
        $asset = Asset::where('uuid', $uuid)->firstOrFail();

        $validated = $request->validate([
            'nama_pelapor'     => 'required|string|max:255',
            'kelas'            => 'nullable|string|max:100',
            'deskripsi_kendala'=> 'required|string|min:10|max:2000',
        ]);

        Report::create([
            ...$validated,
            'asset_id'   => $asset->id,
            'status'     => 'open',
            'ip_pelapor' => $request->ip(),
        ]);

        return redirect()->route('public.success', $uuid)
            ->with('success', 'Laporan Anda berhasil dikirim. Terima kasih!');
    }

    /**
     * Halaman konfirmasi laporan berhasil dikirim.
     */
    public function success(string $uuid): Response
    {
        $asset = Asset::where('uuid', $uuid)->select('uuid', 'nama')->firstOrFail();

        return Inertia::render('Public/ReportSuccess', [
            'asset' => $asset,
        ]);
    }
}
