<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parada extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'inicio',
        'fin'
    ];

    protected $attributes = array(
        'lunes' => 0,
        'martes' => 0,
        'miercoles' => 0,
        'jueves' => 0,
        'viernes' => 0,
        'sabado' => 0,
        'domingo' => 0
    );
}
