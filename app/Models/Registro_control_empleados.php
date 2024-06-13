<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registro_control_empleados extends Model
{
    use HasFactory;

    protected $fillable = [
        'empleado_id',
        'registro_control_id',
    ];
}
