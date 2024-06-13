<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operarios_en_orden extends Model
{
    use HasFactory;

    protected $fillable = [
        'orden_id',
        'operario_id',
    ];

    public function operario()
    {
        return $this->belongsTo(Empleado::class);
    }
    public function orden()
    {
        return $this->belongsTo(Orden::class);
    }

}
