<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Maquina;

class MaquinaSeeder extends Seeder{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(){
        Maquina::create(
            [
                'nombre' => 'Ensacadora',
                'Abreviacion' => 'SAC',
                'preparacion' => false,
                'tiempo_ciclo_defecto' => 900
            ]
        );
        Maquina::create(
            [
                'nombre' => 'Cosedora',
                'Abreviacion' => 'COS',
                'preparacion' => false,
                'tiempo_ciclo_defecto' => 40
            ]
        );
        Maquina::create(
            [
                'nombre' => 'Enfilmadora 1',
                'Abreviacion' => 'FIL1',
                'preparacion' => false,
                'tiempo_ciclo_defecto' => 10
            ]
        );
        Maquina::create(
            [
                'nombre' => 'Enfilmadora 2',
                'Abreviacion' => 'FIL2',
                'preparacion' => false,
                'tiempo_ciclo_defecto' => 10
            ]
        );
        Maquina::create(
            [
                'nombre' => 'Cortadora',
                'Abreviacion' => 'COR',
                'preparacion' => false,
                'tiempo_ciclo_defecto' => 10
            ]
        );
    }
}
