<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'asset_id', 'user_id', 'nama_peminjam', 'tanggal_pinjam', 'tenggat_waktu',
        'tanggal_kembali', 'foto_pinjam', 'foto_kembali', 'catatan_pinjam',
        'catatan_kembali', 'status'
    ];

    protected $casts = [
        'tanggal_pinjam' => 'datetime',
        'tanggal_kembali' => 'datetime',
        'tenggat_waktu' => 'date',
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
