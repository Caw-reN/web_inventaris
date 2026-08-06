<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Consumable extends Model
{
    protected $fillable = [
        'nama', 'satuan', 'category_id', 'location_id', 'stok', 'stok_minimum', 'harga_satuan', 'keterangan',
    ];

    protected $casts = [
        'harga_satuan' => 'decimal:2',
        'stok'         => 'integer',
        'stok_minimum' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(ConsumableTransaction::class);
    }

    /**
     * Cek apakah stok sudah mencapai atau di bawah batas minimum (threshold).
     */
    public function isLowStock(): bool
    {
        return $this->stok <= $this->stok_minimum;
    }

    /**
     * Appended accessor untuk DataTable dan Dashboard.
     */
    protected $appends = ['is_low_stock'];

    public function getIsLowStockAttribute(): bool
    {
        return $this->isLowStock();
    }
}
