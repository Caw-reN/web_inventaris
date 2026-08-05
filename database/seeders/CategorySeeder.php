<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // Kategori Aset
            ['nama' => 'Komputer & Laptop',     'tipe' => 'aset',        'keterangan' => 'PC Desktop, Laptop, dan sejenisnya'],
            ['nama' => 'Monitor',               'tipe' => 'aset',        'keterangan' => 'Layar monitor semua tipe'],
            ['nama' => 'Perangkat Jaringan',    'tipe' => 'aset',        'keterangan' => 'Router, Switch, Access Point, Mikrotik'],
            ['nama' => 'Printer & Scanner',     'tipe' => 'aset',        'keterangan' => 'Printer, Scanner, dan Mesin Fotokopi'],
            ['nama' => 'Perangkat Audio Visual','tipe' => 'aset',        'keterangan' => 'Proyektor, Speaker, Mikrofon'],
            ['nama' => 'Furnitur Lab',          'tipe' => 'aset',        'keterangan' => 'Meja, Kursi, Lemari, Rak'],
            ['nama' => 'Lainnya',               'tipe' => 'aset',        'keterangan' => 'Aset yang tidak termasuk kategori lain'],
            // Kategori Consumable
            ['nama' => 'Kabel & Konektor',      'tipe' => 'consumable',  'keterangan' => 'Kabel UTP, RJ45, kabel power'],
            ['nama' => 'Alat Tulis & Kantor',   'tipe' => 'consumable',  'keterangan' => 'Kertas, tinta, spidol, dll'],
            ['nama' => 'Komponen Hardware',     'tipe' => 'consumable',  'keterangan' => 'RAM, HDD, baut, thermal paste'],
            ['nama' => 'Consumable Lainnya',    'tipe' => 'consumable',  'keterangan' => 'Barang habis pakai lainnya'],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->updateOrInsert(
                ['nama' => $category['nama'], 'tipe' => $category['tipe']],
                array_merge($category, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}
