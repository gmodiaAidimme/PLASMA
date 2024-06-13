<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registro_calidad extends Model
{
    use HasFactory;

    protected $fillable =   [
        'cantidad',
        'defecto_id',
        'maquina_id',
        'orden_id',
        'fecha'
    ];

    public function defecto()
    {
        return $this->belongsTo('App\Models\Defecto');
    }
    public function maquina()
    {
        return $this->belongsTo('App\Models\maquina');
    }
    public function orden()
    {
        return $this->belongsTo('App\Models\Orden');
    }
}
