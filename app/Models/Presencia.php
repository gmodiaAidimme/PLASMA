<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Presencia extends Model
{
    use HasFactory;

    protected $fillable = ['operario_id', 'motivo_id', 'fechahora'];
}
