<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique(); // Digunakan untuk URL QR Code
            $table->string('nama');
            $table->string('no_seri')->nullable()->unique();
            $table->string('merk')->nullable();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->foreignId('location_id')->nullable()->constrained('locations')->nullOnDelete();
            $table->enum('status', ['tersedia', 'digunakan', 'maintenance', 'rusak', 'tidak_aktif'])->default('tersedia');
            $table->json('spesifikasi')->nullable(); // Spesifikasi teknis dalam format JSON
            $table->decimal('harga_beli', 15, 2)->nullable(); // Disembunyikan dari publik
            $table->date('tanggal_beli')->nullable();
            $table->string('ip_address')->nullable(); // Disembunyikan dari publik
            $table->text('catatan')->nullable();
            $table->string('foto')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
