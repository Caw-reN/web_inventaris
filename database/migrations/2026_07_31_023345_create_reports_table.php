<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained('assets')->cascadeOnDelete();
            $table->string('nama_pelapor');
            $table->string('kelas')->nullable();
            $table->text('deskripsi_kendala');
            $table->enum('status', ['open', 'in_progress', 'resolved'])->default('open');
            $table->foreignId('handled_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('catatan_teknisi')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->string('ip_pelapor')->nullable(); // Untuk rate limiting
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
