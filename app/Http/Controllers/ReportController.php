<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Report::with(['asset', 'handler'])
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->search, fn($q, $s) =>
                $q->where('nama_pelapor', 'like', "%{$s}%")
                  ->orWhere('deskripsi_kendala', 'like', "%{$s}%"))
            ->latest();

        return Inertia::render('Reports/Index', [
            'reports' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(Report $report): Response
    {
        return Inertia::render('Reports/Show', [
            'report' => $report->load(['asset.location', 'handler']),
        ]);
    }

    public function update(Request $request, Report $report): RedirectResponse
    {
        $validated = $request->validate([
            'status'           => 'required|in:open,in_progress,resolved',
            'catatan_teknisi'  => 'nullable|string',
        ]);

        $validated['handled_by'] = auth()->id();

        if ($validated['status'] === 'resolved') {
            $validated['resolved_at'] = now();
        }

        $report->update($validated);

        return back()->with('success', 'Status laporan berhasil diperbarui.');
    }

    public function destroy(Report $report): RedirectResponse
    {
        $report->delete();

        return redirect()->route('reports.index')->with('success', 'Laporan berhasil dihapus.');
    }
}
