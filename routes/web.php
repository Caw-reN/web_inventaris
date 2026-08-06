<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ConsumableController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\QrCodeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ScannerController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// ─── Portal Publik (Tanpa Autentikasi) ──────────────────────────────────────
Route::prefix('aset')->name('public.')->group(function () {
    Route::get('/{uuid}', [PublicController::class, 'show'])->name('asset');
    Route::post('/{uuid}/laporan', [PublicController::class, 'laporkan'])
        ->middleware('throttle:3,10') // Max 3 laporan per 10 menit per IP
        ->name('report');
    Route::post('/{uuid}/pinjam', [PublicController::class, 'pinjam'])
        ->middleware('throttle:3,10') // Max 3 pengajuan per 10 menit per IP
        ->name('pinjam');
    Route::get('/{uuid}/sukses', [PublicController::class, 'success'])->name('success');
});

// ─── Redirect root ke dashboard atau login ───────────────────────────────────
Route::get('/', fn() => redirect()->route('dashboard'));

// ─── Area Terautentikasi ─────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile (bawaan Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ─── Aset ─────────────────────────────────────────────────────────────
    Route::resource('assets', AssetController::class);

    // ─── Peminjaman ───────────────────────────────────────────────────────
    Route::resource('loans', \App\Http\Controllers\LoanController::class)->only(['index', 'store']);
    Route::post('/loans/{loan}/return', [\App\Http\Controllers\LoanController::class, 'returnAsset'])->name('loans.return');

    // QR Code
    Route::get('/assets/{asset}/qr', [QrCodeController::class, 'show'])->name('assets.qr');
    Route::post('/assets/bulk-qr-export', [QrCodeController::class, 'bulkExport'])->name('assets.bulk-qr-export');

    // ─── Consumable ───────────────────────────────────────────────────────
    Route::resource('consumables', ConsumableController::class);
    Route::post('/consumables/{consumable}/transaksi', [ConsumableController::class, 'transaksi'])->name('consumables.transaksi');

    // ─── Laporan Kerusakan ────────────────────────────────────────────────
    Route::resource('reports', ReportController::class)->only(['index', 'show', 'update', 'destroy']);

    // ─── Master Data ──────────────────────────────────────────────────────
    Route::resource('categories', CategoryController::class)->except(['create', 'edit', 'show']);
    Route::resource('locations', LocationController::class)->except(['create', 'edit', 'show']);

    // ─── Scanner QR ───────────────────────────────────────────────────────
    Route::get('/scanner', [ScannerController::class, 'index'])->name('scanner.index');
    Route::post('/scanner/process', [ScannerController::class, 'process'])->name('scanner.process');

    // ─── Admin Only ───────────────────────────────────────────────────────
    Route::middleware('admin')->group(function () {
        Route::resource('users', UserController::class);
        Route::resource('roles', RoleController::class)->except(['create', 'edit', 'show']);
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');
        Route::delete('/settings/logo', [SettingController::class, 'deleteLogo'])->name('settings.delete-logo');
    });
});

require __DIR__ . '/auth.php';
