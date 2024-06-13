<?php

namespace Database\Seeders;

use App\Models\Defecto;
use Illuminate\Database\Seeder;

class DefectoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Defecto::create([
            'nombre' => 'Cabezal roto',
            'descripcion' => 'El cabezal de la pieza está roto',
            'color' => '#ffc107'
        ]);
        Defecto::create([
            'nombre' => 'Dimensión incorrecta',
            'descripcion' => 'La pieza no tiene la dimensión correcta',
            'color' => '#28a745'
        ]);
        Defecto::create([
            'nombre' => 'Rosca inservible',
            'descripcion' => 'La rosca no se puede usar',
            'color' => '#dc3545'
        ]);
    }
}
