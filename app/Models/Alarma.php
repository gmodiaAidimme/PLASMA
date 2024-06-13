<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alarma extends Model
{
    use HasFactory;

    protected $fillable = ['maquina_id', 'magnitud', 'valor', 'ultima_activacion'];
    
}
