<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Consumable;
use App\Models\Report;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_aset'         => Asset::count(),
            'aset_maintenance'   => Asset::where('status', 'maintenance')->count(),
            'aset_rusak'         => Asset::where('status', 'rusak')->count(),
            'laporan_open'       => Report::where('status', 'open')->count(),
            'laporan_in_progress'=> Report::where('status', 'in_progress')->count(),
            'total_consumable'   => Consumable::count(),
            'low_stock_count'    => Consumable::whereColumn('stok', '<=', 'stok_minimum')->count(),
            'total_pengguna'     => User::count(),
        ];

        $low_stock_items = Consumable::with('category')
            ->whereColumn('stok', '<=', 'stok_minimum')
            ->orderBy('stok')
            ->limit(5)
            ->get();

        $laporan_terbaru = Report::with('asset')
            ->whereIn('status', ['open', 'in_progress'])
            ->latest()
            ->limit(5)
            ->get();

        $aset_terbaru = Asset::with(['category', 'location'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats'          => $stats,
            'lowStockItems'  => $low_stock_items,
            'laporanTerbaru' => $laporan_terbaru,
            'asetTerbaru'    => $aset_terbaru,
        ]);
    }
}
