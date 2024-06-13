<?php

namespace Database\Seeders;

use App\Models\Orden;
use Illuminate\Database\Seeder;

class OrdenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Ordenes del proyecto 1

        Orden::create(
            [
                'of' => 'OF-001',
                'maquina_id' => 1,
                'tiempo_ciclo_teorico' => 35,
                'total_piezas' => 50,
                'estado' => 5,
                'proyecto_id' => 1,
                'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:00:00',
                'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:48:25',
            ]
        );
        Orden::create(
            [
                'of' => 'OF-002',
                'maquina_id' => 1,
                'tiempo_ciclo_teorico' => 35,
                'total_piezas' => 50,
                'estado' => 5,
                'proyecto_id' => 1,
                'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:48:25',
                'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 11:36:50',
            ]
        );
        Orden::create(
            [
                'of' => 'OF-003',
                'maquina_id' => 2,
                'tiempo_ciclo_teorico' => 150,
                'total_piezas' => 100,
                'estado' => 5,
                'proyecto_id' => 1,
                'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 1 days')) . ' 11:00:50',
                'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 1 days')) . ' 16:15:50',
            ]
        );
        Orden::create(
            [
                'of' => 'OF-004',
                'maquina_id' => 3,
                'tiempo_ciclo_teorico' => 120,
                'total_piezas' => 50,
                'estado' => 5,
                'proyecto_id' => 1,
                'inicio' => date('Y-m-d', strtotime(Date('Y-m-d'))) . ' 10:15:50',
                'fin' => date('Y-m-d', strtotime(Date('Y-m-d'))) . ' 12:15:50',
            ]
        );
        Orden::create(
            [
                'of' => 'OF-005',
                'maquina_id' => 3,
                'tiempo_ciclo_teorico' => 80,
                'total_piezas' => 50,
                'estado' => 5,
                'proyecto_id' => 1,
                'inicio' => date('Y-m-d', strtotime(Date('Y-m-d'))) . ' 12:15:50',
                'fin' => date('Y-m-d', strtotime(Date('Y-m-d'))) . ' 13:35:50',
            ]
        );

        //Ordenes del proyecto 2


        //Ordenes sin proyecto





        Orden::create([
            'of' => 'OF-101',
            'maquina_id' => 1,
            'tiempo_ciclo_teorico' => 5,
            'total_piezas' => 720,
            'estado' => 5,
            'inicio' => '2022-04-01 10:00:00',
            'fin' => '2022-04-01 11:00:00'
        ]);
        Orden::create([
            'of' => 'OF-102',
            'maquina_id' => 2,
            'tiempo_ciclo_teorico' => 10,
            'total_piezas' => 360,
            'estado' => 5,
            'inicio' => '2022-04-01 8:00:00',
            'fin' => '2022-04-01 9:00:00'
        ]);
        Orden::create([
            'of' => 'OF-103',
            'maquina_id' => 3,
            'tiempo_ciclo_teorico' => 15,
            'total_piezas' => 180,
            'estado' => 5,
            'inicio' => '2022-04-01 12:00:00',
            'fin' => '2022-04-01 13:00:00'
        ]);
    }
}
