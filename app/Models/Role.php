<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $fillable = ['name', 'label', 'description', 'is_system'];

    protected $casts = [
        'is_system' => 'boolean',
    ];

    /**
     * User-user yang memiliki role ini.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'role', 'name');
    }
}
