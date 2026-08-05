<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consumables', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('satuan'); // Contoh: "buah", "meter", "roll"
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->integer('stok')->default(0);
            $table->integer('stok_minimum')->default(5); // Threshold alert jika stok <= nilai ini
            $table->decimal('harga_satuan', 15, 2)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consumables');
    }
};
