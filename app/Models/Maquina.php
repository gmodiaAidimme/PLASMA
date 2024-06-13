<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maquina extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'abreviacion',  'tiempo_ciclo_defecto', 'tipo_calculo_rendimiento', 'imagen'];
    protected $attributes = ['preparacion' => 0];
}
