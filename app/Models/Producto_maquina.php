<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto_maquina extends Model
{
    use HasFactory;

    protected $fillable = ['maquina_id', 'producto_id'];
}
