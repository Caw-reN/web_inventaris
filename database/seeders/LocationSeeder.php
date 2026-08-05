<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            ['nama' => 'Lab Komputer 1',    'kode' => 'LAB-KOM-1',  'keterangan' => 'Laboratorium Komputer Utama'],
            ['nama' => 'Lab Komputer 2',    'kode' => 'LAB-KOM-2',  'keterangan' => 'Laboratorium Komputer Cadangan'],
            ['nama' => 'Lab Jaringan',      'kode' => 'LAB-NET',    'keterangan' => 'Laboratorium Jaringan & Infrastruktur'],
            ['nama' => 'Ruang Server',      'kode' => 'SERVER',     'keterangan' => 'Ruang Server & NOC'],
            ['nama' => 'Ruang Guru / TU',   'kode' => 'GURU-TU',   'keterangan' => 'Ruang Tata Usaha dan Guru'],
            ['nama' => 'Gudang',            'kode' => 'GUDANG',     'keterangan' => 'Tempat penyimpanan aset non-aktif'],
        ];

        foreach ($locations as $location) {
            DB::table('locations')->updateOrInsert(
                ['kode' => $location['kode']],
                array_merge($location, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}
