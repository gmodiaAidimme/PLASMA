<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orden extends Model
{
    use HasFactory;

    protected $fillable = [
        'of',
        'maquina_id',
        'tiempo_ciclo_teorico',
        'total_piezas',
        'estado',
        'proyecto_id',
        'inicio',
        'fin'
    ];

    public function maquina()
    {
        return $this->belongsTo(Maquina::class);
    }
}
