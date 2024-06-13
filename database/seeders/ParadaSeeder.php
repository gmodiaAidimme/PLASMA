<?php

namespace Database\Seeders;

use App\Models\Parada;
use Illuminate\Database\Seeder;

class ParadaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Parada::create([
            'nombre' => 'Almuerzo',
            'inicio' => '10:00:00',
            'fin' => '10:30:00',
            'lunes' => true,
            'martes' => true,
            'miercoles' => true,
            'jueves' => true,
            'viernes' => true,
            'sabado' => false,
            'domingo' => false,
        ]);
        Parada::create([
            'nombre' => 'Comida',
            'inicio' => '14:00:00',
            'fin' => '15:00:00',
            'lunes' => true,
            'martes' => true,
            'miercoles' => true,
            'jueves' => true,
            'viernes' => false,
            'sabado' => false,
            'domingo' => false,
        ]);
    }
}
