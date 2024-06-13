<?php

namespace Database\Seeders;

use App\Models\Estado;
use Illuminate\Database\Seeder;

class EstadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Estado::create([
            'id' => 1,
            'nombre' => 'Funcionamiento',
            'descripcion' => 'La máquina está en producción',
            'color' => '#28a745',
        ]);
        Estado::create([
            'id' => 2,
            'nombre' => 'Microparo',
            'descripcion' => 'La máquina está en un microparo',
            'color' => '#ffcc99',
        ]);
        Estado::create([
            'id' => 3,
            'nombre' => 'Paro fuera OF',
            'descripcion' => 'La máquina está parada',
            'color' => '#dc3545',
        ]);
        Estado::create([
            'id' => 4,
            'nombre' => 'Preparación',
            'descripcion' => 'La máquina está en preparación',
            'color' => '#3366ff',
        ]);
        Estado::create([
            'id' => 5,
            'nombre' => 'No justificado',
            'descripcion' => 'Se ha descartado la justificación del paro',
            'color' => '#800000',
        ]);
        Estado::create([
            'id' => 6,
            'nombre' => 'Pendiente justificación',
            'descripcion' => 'Esperando justificación del paro',
            'color' => '#9933ff',
        ]);
        Estado::create([
            'id' => 7,
            'nombre' => 'Averia',
            'descripcion' => 'Se para por una avería imprevista de la máquina',
            'color' => '#ff0000',
        ]);
        Estado::create([
            'id' => 8,
            'nombre' => 'Mantenimiento',
            'descripcion' => 'Se para para realizar un mantenimiento programado',
            'color' => '#ff9900',
        ]);
    }
}
