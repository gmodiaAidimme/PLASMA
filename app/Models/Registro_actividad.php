<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registro_actividad extends Model
{
    use HasFactory;

    protected $fillable = ['maquina_id', 'estado_id', 'orden_id', 'inicio', 'fin', 'piezas', 'ultima_pieza'];

    public function maquina(){
        return $this->belongsTo('App\Models\Maquina');
    }
    public function estado(){
        return $this->belongsTo('App\Models\Estado');
    }
    public function orden(){
        return $this->belongsTo('App\Models\Orden');
    }
}
