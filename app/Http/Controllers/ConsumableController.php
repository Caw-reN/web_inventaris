<?php

namespace App\Http\Controllers;
use App\Models\Category;
use App\Models\Consumable;
use App\Models\ConsumableTransaction;
use App\Models\Location;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConsumableController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Consumable::with(['category', 'location'])
            ->when($request->search, fn($q, $s) => $q->where('nama', 'like', "%{$s}%"))
            ->when($request->category_id, fn($q, $id) => $q->where('category_id', $id))
            ->when($request->stock_filter === 'low_stock', fn($q) => $q->whereColumn('stok', '<=', 'stok_minimum'))
            ->latest();

        return Inertia::render('Consumables/Index', [
            'consumables' => $query->paginate(15)->withQueryString(),
            'categories'  => Category::where('tipe', 'consumable')->orderBy('nama')->get(),
            'locations'   => Location::orderBy('nama')->get(),
            'filters'     => $request->only(['search', 'category_id', 'stock_filter']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Consumables/Create', [
            'categories' => Category::where('tipe', 'consumable')->orderBy('nama')->get(),
            'locations'  => Location::orderBy('nama')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama'         => 'required|string|max:255',
            'satuan'       => 'required|string|max:50',
            'category_id'  => 'required|exists:categories,id',
            'location_id'  => 'nullable|exists:locations,id',
            'stok'         => 'required|integer|min:0',
            'stok_minimum' => 'required|integer|min:0',
            'harga_satuan' => 'nullable|numeric|min:0',
            'keterangan'   => 'nullable|string',
        ]);

        Consumable::create($validated);

        return redirect()->route('consumables.index')->with('success', 'Consumable berhasil ditambahkan.');
    }

    public function show(Consumable $consumable): Response
    {
        $consumable->load(['category', 'location']);

        $transactions = ConsumableTransaction::with('user')
            ->where('consumable_id', $consumable->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Consumables/Show', [
            'consumable'   => $consumable,
            'transactions' => $transactions,
        ]);
    }

    public function edit(Consumable $consumable): Response
    {
        return Inertia::render('Consumables/Edit', [
            'consumable' => $consumable->load(['category', 'location']),
            'categories' => Category::where('tipe', 'consumable')->orderBy('nama')->get(),
            'locations'  => Location::orderBy('nama')->get(),
        ]);
    }

    public function update(Request $request, Consumable $consumable): RedirectResponse
    {
        $validated = $request->validate([
            'nama'         => 'required|string|max:255',
            'satuan'       => 'required|string|max:50',
            'category_id'  => 'required|exists:categories,id',
            'location_id'  => 'nullable|exists:locations,id',
            'stok_minimum' => 'required|integer|min:0',
            'harga_satuan' => 'nullable|numeric|min:0',
            'keterangan'   => 'nullable|string',
        ]);

        $consumable->update($validated);

        return redirect()->route('consumables.show', $consumable)->with('success', 'Consumable berhasil diperbarui.');
    }

    public function destroy(Consumable $consumable): RedirectResponse
    {
        $consumable->delete();

        return redirect()->route('consumables.index')->with('success', 'Consumable berhasil dihapus.');
    }

    /**
     * Tambah atau kurangi stok consumable.
     */
    public function transaksi(Request $request, Consumable $consumable): RedirectResponse
    {
        $validated = $request->validate([
            'tipe'       => 'required|in:masuk,keluar',
            'jumlah'     => 'required|integer|min:1',
            'keterangan' => 'nullable|string',
        ]);

        $stok_sebelum = $consumable->stok;

        if ($validated['tipe'] === 'keluar' && $consumable->stok < $validated['jumlah']) {
            return back()->withErrors(['jumlah' => 'Stok tidak mencukupi. Stok saat ini: ' . $consumable->stok]);
        }

        $stok_sesudah = $validated['tipe'] === 'masuk'
            ? $stok_sebelum + $validated['jumlah']
            : $stok_sebelum - $validated['jumlah'];

        ConsumableTransaction::create([
            'consumable_id' => $consumable->id,
            'user_id'       => auth()->id(),
            'tipe'          => $validated['tipe'],
            'jumlah'        => $validated['jumlah'],
            'stok_sebelum'  => $stok_sebelum,
            'stok_sesudah'  => $stok_sesudah,
            'keterangan'    => $validated['keterangan'],
        ]);

        $consumable->update(['stok' => $stok_sesudah]);

        $label = $validated['tipe'] === 'masuk' ? 'Restock' : 'Pemakaian';
        return back()->with('success', "{$label} berhasil dicatat. Stok sekarang: {$stok_sesudah}");
    }
}
