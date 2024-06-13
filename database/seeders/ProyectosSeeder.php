<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Proyecto;

class ProyectosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Proyecto terminado
        Proyecto::create([
            'nombre' => 'Proyecto 1',
            'descripcion' => 'Proyecto 1',
            'fecha_inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 3 days')),
            'fecha_fin' => Date('Y-m-d'),
            'estado' => 1,
            'horas_estimadas' => 8,
            'cliente' => 'Tableros Salgado'
        ]);

        //Proyecto en curso
        Proyecto::create([
            'nombre' => 'Proyecto 2',
            'descripcion' => 'Proyecto 2',
            'fecha_inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 1 days')),
            'fecha_fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' + 3 days')),
            'estado' => 1,
            'horas_estimadas' => 150,
            'cliente' => 'Mesas Pamesa'
        ]);
    }
}
