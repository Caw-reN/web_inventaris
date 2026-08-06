<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Category;
use App\Models\Location;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Asset::with(['category', 'location'])
            ->when($request->search, fn($q, $s) => $q->where('nama', 'like', "%{$s}%")
                ->orWhere('no_seri', 'like', "%{$s}%")
                ->orWhere('merk', 'like', "%{$s}%")
                ->orWhere('nomor_inventaris', 'like', "%{$s}%"))
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->category_id, fn($q, $id) => $q->where('category_id', $id))
            ->when($request->location_id, function ($q, $id) {
                // Cek apakah lokasi ini memiliki child; jika ya, tampilkan semua aset parent + children
                $location = Location::find($id);
                if ($location) {
                    $childIds = $location->children()->pluck('id');
                    $allIds = $childIds->prepend((int) $id);
                    $q->whereIn('location_id', $allIds);
                }
            })
            ->latest();

        return Inertia::render('Assets/Index', [
            'assets'     => $query->get(),
            'categories' => Category::where('tipe', 'aset')->orderBy('nama')->get(),
            'locations'  => Location::getHierarchical(),
            'filters'    => $request->only(['search', 'status', 'category_id', 'location_id']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Assets/Create', [
            'categories' => Category::where('tipe', 'aset')->orderBy('nama')->get(),
            'locations'  => Location::getHierarchical(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama'         => 'required|string|max:255',
            'no_seri'      => 'nullable|string|max:255|unique:assets',
            'merk'         => 'nullable|string|max:255',
            'category_id'  => 'required|exists:categories,id',
            'location_id'  => 'nullable|exists:locations,id',
            'status'       => 'required|in:tersedia,digunakan,maintenance,rusak,tidak_aktif',
            'spesifikasi'  => 'nullable|array',
            'harga_beli'   => 'nullable|numeric|min:0',
            'tanggal_beli' => 'nullable|date',
            'ip_address'   => 'nullable|string|max:50',
            'catatan'      => 'nullable|string',
            'foto'         => 'nullable|image|max:2048',
            'jumlah'       => 'nullable|integer|min:1|max:100',
        ]);

        $jumlah = $validated['jumlah'] ?? 1;

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('assets/foto', 'public');
        }

        // Jika insert lebih dari 1, kita tidak bisa menggunakan no_seri yang sama
        if ($jumlah > 1) {
            $validated['no_seri'] = null;
        }

        $baseName = $validated['nama'];
        $createdAssets = [];

        for ($i = 1; $i <= $jumlah; $i++) {
            $assetData = $validated;
            
            if ($jumlah > 1) {
                $assetData['nama'] = $baseName . ' - ' . $i;
            }

            $asset = Asset::create($assetData);
            activity()->causedBy(auth()->user())->performedOn($asset)->log('created');
            $createdAssets[] = $asset;
        }

        // Jika hanya buat 1, redirect ke halaman detail. Jika banyak, kembali ke index.
        if ($jumlah === 1) {
            return redirect()->route('assets.show', $createdAssets[0])->with('success', 'Aset berhasil ditambahkan.');
        }

        return redirect()->route('assets.index')->with('success', "Berhasil menambahkan {$jumlah} aset secara massal.");
    }

    public function show(Asset $asset): Response
    {
        $asset->load([
            'category', 
            'location', 
            'reports' => fn($q) => $q->latest()->limit(5),
            'loans' => fn($q) => $q->with('user')->latest()
        ]);

        $auditLog = \Spatie\Activitylog\Models\Activity::forSubject($asset)
            ->latest()
            ->limit(20)
            ->get();

        $borrowers = \App\Models\Loan::select('nama_peminjam')->distinct()->pluck('nama_peminjam');

        return Inertia::render('Assets/Show', [
            'asset'    => $asset,
            'auditLog' => $auditLog,
            'borrowers' => $borrowers,
        ]);
    }

    public function edit(Asset $asset): Response
    {
        return Inertia::render('Assets/Edit', [
            'asset'      => $asset->load(['category', 'location']),
            'categories' => Category::where('tipe', 'aset')->orderBy('nama')->get(),
            'locations'  => Location::orderBy('nama')->get(),
        ]);
    }

    public function update(Request $request, Asset $asset): RedirectResponse
    {
        $validated = $request->validate([
            'nama'         => 'required|string|max:255',
            'no_seri'      => 'nullable|string|max:255|unique:assets,no_seri,' . $asset->id,
            'merk'         => 'nullable|string|max:255',
            'category_id'  => 'required|exists:categories,id',
            'location_id'  => 'nullable|exists:locations,id',
            'status'       => 'required|in:tersedia,digunakan,maintenance,rusak,tidak_aktif',
            'spesifikasi'  => 'nullable|array',
            'harga_beli'   => 'nullable|numeric|min:0',
            'tanggal_beli' => 'nullable|date',
            'ip_address'   => 'nullable|string|max:50',
            'catatan'      => 'nullable|string',
            'foto'         => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            if ($asset->foto) Storage::disk('public')->delete($asset->foto);
            $validated['foto'] = $request->file('foto')->store('assets/foto', 'public');
        }

        $asset->update($validated);

        return redirect()->route('assets.show', $asset)->with('success', 'Aset berhasil diperbarui.');
    }

    public function destroy(Asset $asset): RedirectResponse
    {
        if ($asset->foto) Storage::disk('public')->delete($asset->foto);
        $asset->delete();

        return redirect()->route('assets.index')->with('success', 'Aset berhasil dihapus.');
    }
}
