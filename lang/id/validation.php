<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Baris Bahasa untuk Validasi
    |--------------------------------------------------------------------------
    |
    | Baris bahasa berikut ini berisi pesan kesalahan standar yang digunakan oleh
    | kelas validator. Pesan-pesan ini dirancang agar mudah dibaca oleh orang awam
    | dan informatif.
    |
    */

    'accepted' => ':attribute harus disetujui.',
    'accepted_if' => ':attribute harus disetujui apabila :other adalah :value.',
    'active_url' => ':attribute bukan tautan (URL) yang sah.',
    'after' => ':attribute harus berupa tanggal setelah :date.',
    'after_or_equal' => ':attribute harus berupa tanggal setelah atau sama dengan :date.',
    'alpha' => ':attribute hanya boleh berisi huruf.',
    'alpha_dash' => ':attribute hanya boleh berisi huruf, angka, tanda strip, dan garis bawah.',
    'alpha_num' => ':attribute hanya boleh berisi huruf dan angka.',
    'array' => ':attribute harus berupa daftar (array).',
    'before' => ':attribute harus berupa tanggal sebelum :date.',
    'before_or_equal' => ':attribute harus berupa tanggal sebelum atau sama dengan :date.',
    'between' => [
        'array' => ':attribute harus memiliki dari :min hingga :max anggota.',
        'file' => 'Ukuran file :attribute harus antara :min hingga :max KB.',
        'numeric' => 'Nilai :attribute harus antara :min dan :max.',
        'string' => 'Panjang kata :attribute harus antara :min hingga :max karakter.',
    ],
    'boolean' => ':attribute harus bernilai Ya atau Tidak.',
    'confirmed' => 'Konfirmasi :attribute tidak cocok.',
    'date' => ':attribute bukan tanggal yang sah.',
    'date_equals' => ':attribute harus berupa tanggal yang sama dengan :date.',
    'date_format' => 'Format :attribute tidak cocok dengan format :format.',
    'decimal' => ':attribute harus memiliki :decimal angka di belakang koma.',
    'declined' => ':attribute harus ditolak.',
    'different' => ':attribute dan :other harus berbeda.',
    'digits' => ':attribute harus terdiri dari :digits angka.',
    'digits_between' => ':attribute harus memiliki panjang antara :min hingga :max angka.',
    'dimensions' => 'Ukuran dimensi gambar pada :attribute tidak sesuai standar.',
    'distinct' => ':attribute memiliki nilai yang duplikat.',
    'email' => ':attribute harus berupa alamat email yang valid.',
    'ends_with' => ':attribute harus diakhiri salah satu dari berikut: :values',
    'enum' => 'Pilihan :attribute tidak valid.',
    'exists' => 'Pilihan :attribute tidak valid atau tidak ditemukan.',
    'file' => ':attribute harus berupa sebuah file/berkas.',
    'filled' => ':attribute wajib wajib diisi.',
    'gt' => [
        'array' => ':attribute harus memiliki lebih dari :value anggota.',
        'file' => 'Ukuran file :attribute harus lebih besar dari :value KB.',
        'numeric' => 'Nilai :attribute harus lebih besar dari :value.',
        'string' => 'Panjang teks :attribute harus lebih dari :value karakter.',
    ],
    'gte' => [
        'array' => ':attribute harus memiliki :value anggota atau lebih.',
        'file' => 'Ukuran file :attribute minimal harus :value KB atau lebih.',
        'numeric' => 'Nilai :attribute harus lebih besar atau sama dengan :value.',
        'string' => 'Panjang teks :attribute minimal harus :value karakter atau lebih.',
    ],
    'image' => 'File :attribute harus berupa foto atau gambar (JPG, PNG, atau JPEG).',
    'in' => 'Pilihan :attribute yang dipilih tidak valid.',
    'in_array' => 'Nilai :attribute tidak ada di dalam daftar :other.',
    'integer' => ':attribute harus berupa angka bilangan bulat.',
    'ip' => ':attribute harus berupa alamat IP yang valid.',
    'ipv4' => ':attribute harus berupa alamat IPv4 yang valid.',
    'ipv6' => ':attribute harus berupa alamat IPv6 yang valid.',
    'json' => ':attribute harus berupa format teks JSON yang sah.',
    'lt' => [
        'array' => ':attribute harus memiliki kurang dari :value anggota.',
        'file' => 'Ukuran file :attribute harus di bawah :value KB.',
        'numeric' => 'Nilai :attribute harus kurang dari :value.',
        'string' => 'Panjang teks :attribute harus kurang dari :value karakter.',
    ],
    'lte' => [
        'array' => ':attribute tidak boleh memiliki lebih dari :value anggota.',
        'file' => 'Ukuran file :attribute tidak boleh lebih dari :value KB.',
        'numeric' => 'Nilai :attribute tidak boleh lebih besar dari :value.',
        'string' => 'Panjang teks :attribute tidak boleh lebih dari :value karakter.',
    ],
    'mac_address' => ':attribute harus berupa alamat MAC yang valid.',
    'max' => [
        'array' => ':attribute tidak boleh memiliki lebih dari :max anggota.',
        'file' => 'Ukuran file :attribute terlalu besar (maksimal :max KB / 2 MB).',
        'numeric' => 'Nilai :attribute tidak boleh lebih dari :max.',
        'string' => 'Teks :attribute terlalu panjang (maksimal :max karakter).',
    ],
    'max_digits' => ':attribute tidak boleh memiliki lebih dari :max digit.',
    'mimes' => 'File :attribute harus berupa format berjenis: :values.',
    'mimetypes' => 'File :attribute harus berupa berkas berjenis: :values.',
    'min' => [
        'array' => ':attribute minimal harus memiliki :min anggota.',
        'file' => 'Ukuran file :attribute minimal harus sebesar :min KB.',
        'numeric' => 'Nilai :attribute minimal harus bernilai :min.',
        'string' => 'Teks :attribute terlalu pendek (minimal harus :min karakter).',
    ],
    'min_digits' => ':attribute minimal harus memiliki :min digit angka.',
    'missing' => 'Field :attribute harus tidak ada.',
    'multiple_of' => ':attribute harus merupakan kelipatan dari :value',
    'not_in' => 'Pilihan :attribute tidak valid.',
    'not_regex' => 'Format :attribute tidak sah.',
    'numeric' => ':attribute wajib diisi dengan angka.',
    'password' => [
        'letters' => ':attribute wajib mengandung minimal satu huruf.',
        'mixed' => ':attribute wajib mengandung minimal satu huruf kapital dan satu huruf kecil.',
        'numbers' => ':attribute wajib mengandung minimal satu angka.',
        'symbols' => ':attribute wajib mengandung minimal satu simbol.',
        'uncompromised' => ':attribute yang dimasukkan pernah dicurigai bocor. Silakan gunakan :attribute lain yang lebih aman.',
    ],
    'present' => 'Field :attribute harus ada.',
    'prohibited' => 'Field :attribute tidak diperbolehkan.',
    'prohibits' => 'Field :attribute melarang :other untuk disertakan.',
    'regex' => 'Format :attribute tidak sah.',
    'required' => ':attribute wajib diisi.',
    'required_array_keys' => ':attribute wajib memadai unsur: :values.',
    'required_if' => ':attribute wajib diisi bila :other bernilai :value.',
    'required_unless' => ':attribute wajib diisi kecuali bila :other memiliki nilai :values.',
    'required_with' => ':attribute wajib diisi jika :values tersedia.',
    'required_with_all' => ':attribute wajib diisi jika semua :values tersedia.',
    'required_without' => ':attribute wajib diisi apabila :values tidak tersedia.',
    'required_without_all' => ':attribute wajib diisi apabila tidak ada satupun dari :values tersedia.',
    'same' => ':attribute dan :other harus sama.',
    'size' => [
        'array' => ':attribute harus mengandung tepat :size anggota.',
        'file' => 'Ukuran file :attribute harus berukuran tepat :size KB.',
        'numeric' => 'Nilai :attribute harus bernilai tepat :size.',
        'string' => 'Panjang teks :attribute harus tepat :size karakter.',
    ],
    'starts_with' => ':attribute harus diawali dengan salah satu dari berikut: :values',
    'string' => ':attribute harus berupa teks / kalimat yang valid.',
    'timezone' => ':attribute harus berupa zona waktu yang sah.',
    'unique' => ':attribute sudah terdaftar di sistem. Harap gunakan yang lain.',
    'uploaded' => 'File :attribute gagal diunggah. Pastikan ukuran file tidak terlalu besar.',
    'uppercase' => ':attribute harus menggunakan huruf kapital.',
    'url' => 'Format alamat web (URL) pada :attribute tidak valid.',
    'ulid' => ':attribute harus berupa format ULID yang sah.',
    'uuid' => ':attribute harus berupa pengenal (UUID) yang sah.',

    /*
    |--------------------------------------------------------------------------
    | Pesan Validasi Khusus (Custom Validation Language Lines)
    |--------------------------------------------------------------------------
    |
    | Pesan kesalahan yang secara spesifik disesuaikan untuk field tertentu
    | agar sangat mudah dipahami oleh orang awam (non-teknis).
    |
    */

    'custom' => [
        'foto' => [
            'max' => 'Ukuran file foto terlalu besar! Maksimal ukuran yang diperbolehkan adalah 2 MB.',
            'image' => 'File harus berupa foto atau gambar (format PNG, JPG, atau JPEG).',
            'mimes' => 'Format foto tidak didukung. Gunakan file bertipe JPG, PNG, atau JPEG.',
            'uploaded' => 'Gagal mengunggah foto. Pastikan koneksi lancar dan ukuran foto di bawah 2 MB.',
        ],
        'foto_pinjam' => [
            'max' => 'Ukuran file foto terlalu besar! Maksimal ukuran yang diperbolehkan adalah 2 MB.',
            'image' => 'File yang dipilih harus berupa foto atau gambar (format PNG, JPG, atau JPEG).',
            'mimes' => 'Format foto tidak didukung. Gunakan file bertipe JPG, PNG, atau JPEG.',
            'uploaded' => 'Gagal mengunggah foto. Pastikan koneksi lancar dan ukuran foto di bawah 2 MB.',
        ],
        'foto_kembali' => [
            'max' => 'Ukuran file foto terlalu besar! Maksimal ukuran yang diperbolehkan adalah 2 MB.',
            'image' => 'File harus berupa foto atau gambar (format PNG, JPG, atau JPEG).',
            'mimes' => 'Format foto tidak didukung. Gunakan file bertipe JPG, PNG, atau JPEG.',
            'uploaded' => 'Gagal mengunggah foto. Pastikan koneksi lancar dan ukuran foto di bawah 2 MB.',
        ],
        'asset_id' => [
            'required' => 'Silakan pilih aset yang ingin dipinjam dari daftar menu dropdown.',
            'exists' => 'Aset yang Anda pilih saat ini tidak tersedia atau tidak valid.',
        ],
        'category_id' => [
            'required' => 'Silakan pilih kategori aset dari dropdown.',
            'exists' => 'Kategori yang Anda pilih tidak terdaftar.',
        ],
        'location_id' => [
            'exists' => 'Lokasi yang dipilih tidak terdaftar.',
        ],
        'nama' => [
            'required' => 'Nama aset wajib diisi.',
            'max' => 'Nama aset terlalu panjang (maksimal :max karakter).',
        ],
        'nama_peminjam' => [
            'required' => 'Nama peminjam tidak boleh kosong. Silakan isi atau pilih nama Anda.',
            'max' => 'Nama peminjam terlalu panjang (maksimal :max karakter).',
        ],
        'jumlah' => [
            'required' => 'Jumlah input barang harus dispesifikasikan.',
            'min' => 'Jumlah input barang minimal adalah 1.',
            'max' => 'Input barang secara bersamaan maksimal sebanyak 100 unit.',
        ],
        'no_seri' => [
            'unique' => 'Nomor seri (SN) ini sudah terdaftar untuk barang lain. Nomor seri harus unik.',
        ],
        'nomor_inventaris' => [
            'unique' => 'Nomor inventaris ini sudah dipakai oleh aset lain.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Penyesuaian Nama Atribut (Custom Validation Attributes)
    |--------------------------------------------------------------------------
    |
    | Bagian ini mengubah nama field dari bahasa database menjadi kata ramah
    | manusia, contoh: "foto_pinjam" diganti menjadi "Foto Barang".
    |
    */

    'attributes' => [
        'asset_id' => 'Pilihan Aset',
        'category_id' => 'Kategori Aset',
        'location_id' => 'Lokasi Penempatan',
        'nama' => 'Nama Aset',
        'nama_peminjam' => 'Nama Peminjam',
        'tenggat_waktu' => 'Batas Waktu Pinjam',
        'tanggal_pinjam' => 'Tanggal Peminjaman',
        'tanggal_kembali' => 'Tanggal Pengembalian',
        'catatan_pinjam' => 'Catatan Peminjaman',
        'catatan_kembali' => 'Catatan Pengembalian',
        'foto_pinjam' => 'Foto Barang',
        'foto_kembali' => 'Foto Barang Saat Kembali',
        'foto' => 'Foto Aset',
        'no_seri' => 'Nomor Seri / SN',
        'nomor_inventaris' => 'Nomor Inventaris',
        'merk' => 'Merk / Brand',
        'jumlah' => 'Jumlah Aset',
        'status' => 'Status',
        'harga_beli' => 'Harga Beli',
        'tanggal_beli' => 'Tanggal Pembelian',
        'ip_address' => 'Alamat IP (IP Address)',
        'catatan' => 'Catatan Tambahan',
        'email' => 'Alamat Email',
        'password' => 'Kata Sandi',
        'spesifikasi' => 'Spesifikasi',
    ],

];
