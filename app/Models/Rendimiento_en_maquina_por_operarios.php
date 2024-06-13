<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rendimiento_en_maquina_por_operarios extends Model
{
    use HasFactory;

    protected $fillable = [
        'maquina_id',
        'numero_operarios',
        'rendimiento_teorico'
    ];
}
