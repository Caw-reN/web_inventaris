<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    protected $fillable = ['nama', 'kode', 'keterangan', 'parent_id'];
    protected $appends = ['full_path'];

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class);
    }

    public function parent()
    {
        return $this->belongsTo(Location::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Location::class, 'parent_id');
    }

    public function getFullPathAttribute()
    {
        $path = [];
        $current = $this;
        while ($current) {
            array_unshift($path, $current->nama);
            $current = $current->parent;
        }
        return implode(' > ', $path);
    }
}
