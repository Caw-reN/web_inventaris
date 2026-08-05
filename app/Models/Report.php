<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    protected $fillable = [
        'asset_id', 'nama_pelapor', 'kelas', 'deskripsi_kendala',
        'status', 'handled_by', 'catatan_teknisi', 'resolved_at', 'ip_pelapor',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }

    /**
     * Label status dalam Bahasa Indonesia.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'open'        => 'Menunggu',
            'in_progress' => 'Diproses',
            'resolved'    => 'Selesai',
            default       => ucfirst($this->status),
        };
    }
}
