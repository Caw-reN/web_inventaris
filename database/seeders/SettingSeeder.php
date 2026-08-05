<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'institution_name',    'value' => 'Nama Institusi Anda'],
            ['key' => 'institution_logo',    'value' => null],
            ['key' => 'app_description',     'value' => 'Sistem Inventaris Aset & Lab'],
            ['key' => 'primary_color',       'value' => '#3B82F6'],
            ['key' => 'primary_color_hsl',   'value' => '217 91% 60%'],
            ['key' => 'contact_email',       'value' => null],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                ['value' => $setting['value'], 'updated_at' => now(), 'created_at' => now()]
            );
        }
    }
}
