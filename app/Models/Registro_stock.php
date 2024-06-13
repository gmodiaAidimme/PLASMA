<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registro_stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'producto_id',
        'usuario_id',
        'cantidad',
        'fechahora',
        'tipo',
        'notas'
    ];
}
