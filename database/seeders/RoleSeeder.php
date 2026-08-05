<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name'        => 'admin',
                'label'       => 'Admin',
                'description' => 'Akses penuh ke seluruh sistem',
                'is_system'   => true,
            ],
            [
                'name'        => 'teknisi',
                'label'       => 'Teknisi',
                'description' => 'Mengelola aset dan laporan kendala',
                'is_system'   => true,
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['name' => $role['name']], $role);
        }
    }
}
