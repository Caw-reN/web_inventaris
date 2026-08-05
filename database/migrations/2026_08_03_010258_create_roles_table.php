<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();        // slug: admin, teknisi, operator_lab
            $table->string('label');                 // Tampilan: "Admin", "Teknisi", "Operator Lab"
            $table->string('description')->nullable();
            $table->boolean('is_system')->default(false); // true = tidak bisa dihapus
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
