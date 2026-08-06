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

    /**
     * Return all locations ordered hierarchically (parents first, then their children).
     */
    public static function getHierarchical()
    {
        $all = self::with('children')->withCount('assets')->orderBy('nama')->get();
        $result = collect();

        $traverse = function ($items) use (&$traverse, &$result) {
            foreach ($items as $item) {
                $result->push($item);
                if ($item->children && $item->children->isNotEmpty()) {
                    $traverse($item->children->sortBy('nama'));
                }
            }
        };

        $rootLocations = $all->whereNull('parent_id');
        $traverse($rootLocations);

        // Include any orphaned children as fallback
        $pushedIds = $result->pluck('id')->all();
        $orphans = $all->whereNotIn('id', $pushedIds);
        foreach ($orphans as $orphan) {
            $result->push($orphan);
        }

        return $result;
    }
}
