<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permisos_rol extends Model
{
    use HasFactory;

    protected $fillable = [
        'rol_id',
        'permiso_id',
    ];
}
