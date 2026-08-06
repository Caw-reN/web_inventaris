<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Loan;
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
            ->with(['category', 'location', 'loans' => fn($q) => $q->where('status', 'dipinjam')->latest()])
            ->firstOrFail();

        $activeLoan = $asset->loans->first();

        // Sembunyikan field sensitif dari tampilan publik
        $publicAsset = [
            'id'               => $asset->id,
            'uuid'             => $asset->uuid,
            'nomor_inventaris' => $asset->nomor_inventaris,
            'nama'             => $asset->nama,
            'no_seri'          => $asset->no_seri,
            'merk'             => $asset->merk,
            'status'           => $asset->status,
            'status_label'     => $asset->status_label,
            'spesifikasi'      => $asset->spesifikasi,
            'tanggal_beli'     => $asset->tanggal_beli ? $asset->tanggal_beli->format('d M Y') : null,
            'foto'             => $asset->foto ? asset('storage/' . $asset->foto) : null,
            'category'         => $asset->category?->only(['id', 'nama']),
            'location'         => $asset->location ? [
                'id'        => $asset->location->id,
                'nama'      => $asset->location->nama,
                'kode'      => $asset->location->kode,
                'full_path' => $asset->location->full_path,
            ] : null,
            'active_loan'      => $activeLoan ? [
                'peminjam'       => $activeLoan->nama_peminjam,
                'kelas_unit'     => $activeLoan->kelas_unit,
                'tanggal_pinjam' => $activeLoan->tanggal_pinjam ? $activeLoan->tanggal_pinjam->format('d M Y') : null,
            ] : null,
            'catatan'          => $asset->catatan,
        ];

        return Inertia::render('Public/AssetDetail', [
            'asset' => $publicAsset,
        ]);
    }

    /**
     * Proses pengajuan peminjaman dari portal publik.
     */
    public function pinjam(Request $request, string $uuid): RedirectResponse
    {
        $asset = Asset::where('uuid', $uuid)->firstOrFail();

        if ($asset->status !== 'tersedia') {
            return back()->with('error', 'Aset saat ini tidak tersedia untuk dipinjam.');
        }

        $validated = $request->validate([
            'nama_peminjam'  => 'required|string|max:255',
            'kelas_unit'     => 'required|string|max:100',
            'tenggat_waktu'   => 'nullable|date|after_or_equal:today',
            'catatan_pinjam' => 'nullable|string|max:1000',
        ]);

        Loan::create([
            'asset_id'       => $asset->id,
            'user_id'        => auth()->id() ?? null,
            'nama_peminjam'  => $validated['nama_peminjam'],
            'kelas_unit'     => $validated['kelas_unit'],
            'tanggal_pinjam' => now(),
            'tenggat_waktu'   => $validated['tenggat_waktu'] ?? null,
            'catatan_pinjam' => $validated['catatan_pinjam'] ?? null,
            'status'         => 'dipinjam',
        ]);

        $asset->update(['status' => 'digunakan']);

        return redirect()->route('public.success', $uuid)
            ->with('success', 'Pengajuan peminjaman aset berhasil dicatat!');
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
            'kelas'            => 'required|string|max:100',
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
     * Halaman konfirmasi laporan / peminjaman berhasil dikirim.
     */
    public function success(string $uuid): Response
    {
        $asset = Asset::where('uuid', $uuid)->select('uuid', 'nama', 'nomor_inventaris', 'no_seri')->firstOrFail();

        return Inertia::render('Public/ReportSuccess', [
            'asset' => $asset,
        ]);
    }
}
