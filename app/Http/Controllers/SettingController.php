<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings/Index', [
            'settings' => Setting::getAllAsArray(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'institution_name'  => 'required|string|max:255',
            'app_description'   => 'nullable|string|max:500',
            'primary_color'     => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'primary_color_hsl' => 'nullable|string',
            'contact_email'     => 'nullable|email',
            'institution_logo'  => 'nullable|image|mimes:png,jpg,jpeg,svg|max:1024',
        ]);

        // Simpan logo jika ada upload baru
        if ($request->hasFile('institution_logo')) {
            $oldLogo = Setting::get('institution_logo');
            if ($oldLogo) Storage::disk('public')->delete($oldLogo);

            $path = $request->file('institution_logo')->store('logo', 'public');
            Setting::set('institution_logo', $path);
        }

        // Simpan semua setting lainnya
        $keys = ['institution_name', 'app_description', 'primary_color', 'primary_color_hsl', 'contact_email'];
        foreach ($keys as $key) {
            if (isset($validated[$key])) {
                Setting::set($key, $validated[$key]);
            }
        }

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }

    /**
     * Hapus logo institusi.
     */
    public function deleteLogo(): RedirectResponse
    {
        $logo = Setting::get('institution_logo');
        if ($logo) {
            Storage::disk('public')->delete($logo);
            Setting::set('institution_logo', null);
        }

        return back()->with('success', 'Logo berhasil dihapus.');
    }
}
