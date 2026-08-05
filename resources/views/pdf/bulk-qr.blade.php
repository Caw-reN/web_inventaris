<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 10px; }

        .header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 15px;
            border-bottom: 2px solid #333;
            margin-bottom: 15px;
        }
        .header img { height: 40px; width: auto; }
        .header-text h1 { font-size: 14px; font-weight: bold; }
        .header-text p { font-size: 10px; color: #666; }

        table.grid-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        table.grid-table td {
            width: 20%; /* 5 columns */
            padding: 5px;
            vertical-align: top;
        }

        .qr-card {
            border: 1px solid #ccc;
            border-radius: 6px;
            padding: 8px;
            text-align: center;
            page-break-inside: avoid;
            background: #fff;
        }

        .qr-card img { width: 70px; height: 70px; margin: 0 auto; }
        .qr-card .nama {
            font-size: 8px;
            font-weight: bold;
            margin-top: 4px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .qr-card .lokasi {
            font-size: 7px;
            color: #666;
            margin-top: 2px;
        }
        .qr-card .seri {
            font-size: 7px;
            color: #999;
            margin-top: 1px;
        }

        .footer {
            margin-top: 15px;
            padding: 8px 15px;
            border-top: 1px solid #eee;
            text-align: right;
            font-size: 8px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="header">
        @if($institutionLogo)
            <img src="{{ storage_path('app/public/' . $institutionLogo) }}" alt="Logo">
        @endif
        <div class="header-text">
            <h1>{{ $institutionName }}</h1>
            <p>Dicetak: {{ now()->format('d/m/Y H:i') }} — Total: {{ count($assets) }} aset</p>
        </div>
    </div>

    <table class="grid-table">
        @foreach($assets->chunk(5) as $row)
        <tr>
            @foreach($row as $asset)
            <td>
                <div class="qr-card">
                    <img src="data:image/svg+xml;base64,{{ $asset['qr_svg'] }}" alt="QR {{ $asset['nama'] }}">
                    <div class="nama" title="{{ $asset['nama'] }}">{{ $asset['nama'] }}</div>
                    <div class="lokasi">📍 {{ $asset['lokasi'] }}</div>
                    @if($asset['no_seri'])
                        <div class="seri">SN: {{ $asset['no_seri'] }}</div>
                    @endif
                </div>
            </td>
            @endforeach
            {{-- Isi sel kosong jika kolom terakhir kurang dari 5 --}}
            @for($i = $row->count(); $i < 5; $i++)
                <td></td>
            @endfor
        </tr>
        @endforeach
    </table>

    <div class="footer">
        Sistem Inventaris Aset &amp; Lab — {{ $institutionName }}
    </div>
</body>
</html>
