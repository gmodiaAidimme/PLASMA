<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Motivos_presencia extends Model
{
    use HasFactory;

    protected $fillable = ['nombre','descripcion','color'];
}
