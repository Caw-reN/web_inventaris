<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['nama', 'tipe', 'keterangan'];

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class);
    }

    public function consumables(): HasMany
    {
        return $this->hasMany(Consumable::class);
    }
}
