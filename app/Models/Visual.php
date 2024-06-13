<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visual extends Model
{
    use HasFactory;

    protected $fillable = [
        'vista_id',
        'maquina_id',
        'tipo',
        'ancho',
        'alto',
        'x',
        'y',
    ];

    public function vista()
    {
        return $this->belongsTo(Vista::class);
    }
}
