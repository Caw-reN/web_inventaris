<?php

namespace App\Http\Middleware;

use App\Models\Location;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Bagikan data global ke semua halaman React via Inertia.
     * Ini mencakup: user yang login, settings tema/branding, dan Ziggy routes.
     */
    public function share(Request $request): array
    {
        // Ambil semua settings dari DB sekali saja
        $settings = Setting::getAllAsArray();

        return [
            ...parent::share($request),

            // Data user yang sedang login (termasuk role)
            'auth' => [
                'user' => $request->user() ? [
                    'id'       => $request->user()->id,
                    'name'     => $request->user()->name,
                    'email'    => $request->user()->email,
                    'role'     => $request->user()->role,
                    'is_admin' => $request->user()->isAdmin(),
                ] : null,
            ],

            // Settings branding & tema — digunakan oleh ThemeProvider, Sidebar, Login
            'settings' => [
                'institution_name'  => $settings['institution_name']  ?? 'Sistem Inventaris',
                'institution_logo'  => isset($settings['institution_logo']) && $settings['institution_logo']
                    ? asset('storage/' . $settings['institution_logo'])
                    : null,
                'app_description'   => $settings['app_description']   ?? 'Sistem Inventaris Aset & Lab',
                'primary_color'     => $settings['primary_color']     ?? '#3B82F6',
                'primary_color_hsl' => $settings['primary_color_hsl'] ?? '217 91% 60%',
            ],

            // Flash messages untuk toast notification
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
            ],

            // Lokasi untuk sidebar navigasi (parent + children)
            'sidebarLocations' => fn() => $request->user()
                ? Location::with('children')
                    ->whereNull('parent_id')
                    ->orderBy('nama')
                    ->get(['id', 'nama', 'kode'])
                    ->map(fn($loc) => [
                        'id'       => $loc->id,
                        'nama'     => $loc->nama,
                        'kode'     => $loc->kode,
                        'children' => $loc->children->sortBy('nama')->values()->map(fn($c) => [
                            'id'   => $c->id,
                            'nama' => $c->nama,
                            'kode' => $c->kode,
                        ]),
                    ])
                : [],

            // Ziggy untuk named routes di React
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
