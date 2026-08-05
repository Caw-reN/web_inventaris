<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Locations/Index', [
            'locations' => Location::withCount('assets')->orderBy('nama')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama'       => 'required|string|max:255',
            'kode'       => 'nullable|string|max:50|unique:locations',
            'keterangan' => 'nullable|string',
            'parent_id'  => 'nullable|exists:locations,id',
        ]);

        Location::create($validated);

        return back()->with('success', 'Lokasi berhasil ditambahkan.');
    }

    public function update(Request $request, Location $location): RedirectResponse
    {
        $validated = $request->validate([
            'nama'       => 'required|string|max:255',
            'kode'       => 'nullable|string|max:50|unique:locations,kode,' . $location->id,
            'keterangan' => 'nullable|string',
            'parent_id'  => 'nullable|exists:locations,id|not_in:' . $location->id,
        ]);

        $location->update($validated);

        return back()->with('success', 'Lokasi berhasil diperbarui.');
    }

    public function destroy(Location $location): RedirectResponse
    {
        if ($location->assets()->exists()) {
            return back()->withErrors(['lokasi' => 'Lokasi tidak dapat dihapus karena masih memiliki aset terkait.']);
        }

        $location->delete();

        return back()->with('success', 'Lokasi berhasil dihapus.');
    }
}
