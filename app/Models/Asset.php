<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Asset extends Model
{
    use LogsActivity;

    protected $fillable = [
        'uuid', 'nomor_inventaris', 'nama', 'no_seri', 'merk', 'category_id', 'location_id',
        'status', 'spesifikasi', 'harga_beli', 'tanggal_beli',
        'ip_address', 'catatan', 'foto',
    ];

    protected $casts = [
        'spesifikasi'  => 'array',
        'harga_beli'   => 'decimal:2',
        'tanggal_beli' => 'date',
    ];

    /**
     * Field-field yang dicatat perubahan-nya oleh Spatie Activity Log.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['nama', 'nomor_inventaris', 'status', 'location_id', 'category_id', 'no_seri', 'merk'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => "Aset {$eventName}");
    }

    /**
     * Generate UUID otomatis saat membuat aset baru.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Asset $asset) {
            if (empty($asset->uuid)) {
                $asset->uuid = (string) Str::uuid();
            }

            if (empty($asset->nomor_inventaris)) {
                $prefix = 'ASSET-TKJ-';
                $lastAsset = self::where('nomor_inventaris', 'like', $prefix . '%')
                                 ->orderByRaw('LENGTH(nomor_inventaris) DESC')
                                 ->orderBy('nomor_inventaris', 'desc')
                                 ->first();

                if ($lastAsset) {
                    $lastNumber = (int) str_replace($prefix, '', $lastAsset->nomor_inventaris);
                    $newNumber = $lastNumber + 1;
                } else {
                    $newNumber = 1;
                }
                
                $asset->nomor_inventaris = $prefix . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }

    /**
     * URL publik untuk halaman hasil scan QR Code.
     */
    public function getPublicUrlAttribute(): string
    {
        return route('public.asset', $this->uuid);
    }

    /**
     * Set route key to UUID for public and dashboard URLs.
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Label status dalam Bahasa Indonesia.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'tersedia'    => 'Tersedia',
            'digunakan'   => 'Digunakan',
            'maintenance' => 'Maintenance',
            'rusak'       => 'Rusak',
            'tidak_aktif' => 'Tidak Aktif',
            default       => ucfirst($this->status),
        };
    }
}
