<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entrada extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'unidades',
        'maquina_id'
    ];

    public function maquina()
    {
        return $this->belongsTo(Maquina::class);
    }
}
