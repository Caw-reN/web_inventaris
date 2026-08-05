<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class LoanController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Loan::with(['asset', 'user'])
            ->when($request->search, function ($q, $s) {
                $q->where('nama_peminjam', 'like', "%{$s}%")
                  ->orWhereHas('asset', fn($qAsset) => $qAsset->where('nama', 'like', "%{$s}%"));
            })
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->latest();

        $availableAssets = Asset::where('status', 'tersedia')
            ->select('id', 'nama', 'nomor_inventaris', 'merk')
            ->orderBy('nama')
            ->get();

        $borrowers = Loan::select('nama_peminjam')->distinct()->pluck('nama_peminjam');

        return Inertia::render('Loans/Index', [
            'loans' => $query->get(),
            'filters' => $request->only(['search', 'status']),
            'availableAssets' => $availableAssets,
            'borrowers' => $borrowers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'asset_id' => 'required|exists:assets,id',
            'nama_peminjam' => 'required|string|max:255',
            'tenggat_waktu' => 'nullable|date',
            'catatan_pinjam' => 'nullable|string',
            'foto_pinjam' => 'nullable|image|max:2048',
        ]);

        $asset = Asset::findOrFail($validated['asset_id']);
        
        if ($asset->status !== 'tersedia') {
            return back()->withErrors(['asset_id' => 'Aset tidak tersedia untuk dipinjam.']);
        }

        if ($request->hasFile('foto_pinjam')) {
            $validated['foto_pinjam'] = $request->file('foto_pinjam')->store('loans/pinjam', 'public');
        }

        $validated['user_id'] = auth()->id();
        $validated['tanggal_pinjam'] = now();
        $validated['status'] = 'dipinjam';

        $loan = Loan::create($validated);

        $asset->update(['status' => 'digunakan']);

        return back()->with('success', 'Aset berhasil dipinjamkan.');
    }

    public function returnAsset(Request $request, Loan $loan): RedirectResponse
    {
        $validated = $request->validate([
            'catatan_kembali' => 'nullable|string',
            'foto_kembali' => 'nullable|image|max:2048',
        ]);

        if ($loan->status === 'dikembalikan') {
            return back()->withErrors(['error' => 'Aset ini sudah dikembalikan.']);
        }

        if ($request->hasFile('foto_kembali')) {
            $validated['foto_kembali'] = $request->file('foto_kembali')->store('loans/kembali', 'public');
        }

        $validated['tanggal_kembali'] = now();
        $validated['status'] = 'dikembalikan';

        $loan->update($validated);

        $loan->asset->update(['status' => 'tersedia']);

        return back()->with('success', 'Aset berhasil dikembalikan.');
    }
}
