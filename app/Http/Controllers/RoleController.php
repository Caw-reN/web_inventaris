<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Roles/Index', [
            'roles' => Role::withCount('users')->orderBy('is_system', 'desc')->orderBy('label')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'label'       => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
        ]);

        // Buat slug dari label
        $name = Str::slug($validated['label'], '_');

        // Pastikan slug unik
        if (Role::where('name', $name)->exists()) {
            return back()->withErrors(['label' => 'Role dengan nama tersebut sudah ada.']);
        }

        Role::create([
            'name'        => $name,
            'label'       => $validated['label'],
            'description' => $validated['description'] ?? null,
            'is_system'   => false,
        ]);

        return back()->with('success', "Role \"{$validated['label']}\" berhasil dibuat.");
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'label'       => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
        ]);

        // Hanya label & description yang bisa diubah; name (slug) tidak boleh berubah
        $role->update([
            'label'       => $validated['label'],
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('success', "Role berhasil diperbarui.");
    }

    public function destroy(Role $role): RedirectResponse
    {
        if ($role->is_system) {
            return back()->withErrors(['role' => 'Role sistem tidak dapat dihapus.']);
        }

        if ($role->users()->exists()) {
            return back()->withErrors(['role' => "Role \"{$role->label}\" tidak dapat dihapus karena masih digunakan oleh " . $role->users()->count() . " user."]);
        }

        $label = $role->label;
        $role->delete();

        return back()->with('success', "Role \"{$label}\" berhasil dihapus.");
    }
}
