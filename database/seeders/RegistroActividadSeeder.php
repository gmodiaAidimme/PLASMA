<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Registro_actividad;

class RegistroActividadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Registros de la OF-001
        Registro_actividad::create([
            'maquina_id' => 1,
            'estado_id' => 1, 
            'orden_id' => 1, 
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:00:00', 
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:08:25',
            'piezas' => 14, 
            'ultima_pieza' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:08:25',
        ]);
        Registro_actividad::create([
            'maquina_id' => 1,
            'estado_id' => 7, 
            'orden_id' => 1, 
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:08:25',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:16:50',
            'piezas' => 0, 
            'ultima_pieza' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:16:50'
        ]);
        Registro_actividad::create([
            'maquina_id' => 1,
            'estado_id' => 1, 
            'orden_id' => 1, 
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:16:50',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:25:15',
            'piezas' => 18, 
            'ultima_pieza' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:25:15'
        ]);
        Registro_actividad::create([
            'maquina_id' => 1,
            'estado_id' => 5, 
            'orden_id' => 1, 
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:25:15',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:33:40',
            'piezas' => 0, 
            'ultima_pieza' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:33:40'
        ]);
        Registro_actividad::create([
            'maquina_id' => 1,
            'estado_id' => 1, 
            'orden_id' => 1, 
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:33:40',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:42:05',
            'piezas' => 11, 
            'ultima_pieza' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:42:05'
        ]);
        Registro_actividad::create([
            'maquina_id' => 1,
            'estado_id' => 2, 
            'orden_id' => 1, 
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:42:05',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:43:25',
            'piezas' => 0, 
            'ultima_pieza' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:43:25'
        ]);
        Registro_actividad::create([
            'maquina_id' => 1,
            'estado_id' => 1, 
            'orden_id' => 1, 
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:43:25',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:48:25',
            'piezas' => 7, 
            'ultima_pieza' =>  date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:48:25'
        ]);


        //Registros de la OF-002
        Registro_actividad::create([
            'maquina_id' => 1,
            'estado_id' => 1, 
            'orden_id' => 2, 
            'piezas' => 18,
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:48:25',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:59:50',
        ]);
        Registro_actividad::create([
            'maquina_id' => 1,
            'estado_id' => 7, 
            'orden_id' => 2, 
            'piezas' => 0,
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 10:59:50',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 11:05:15',
        ]);
        Registro_actividad::create([
            'maquina_id' => 1,
            'estado_id' => 1, 
            'orden_id' => 2, 
            'piezas' => 12,
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 11:05:15',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 11:13:40',
        ]);
        Registro_actividad::create([
            'maquina_id' => 1,
            'estado_id' => 2, 
            'orden_id' => 2, 
            'piezas' => 0,
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 11:21:40',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 11:22:05',
        ]);
        Registro_actividad::create([
            'maquina_id' => 1,
            'estado_id' => 1, 
            'orden_id' => 2, 
            'piezas' => 20,
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 11:00:50',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 2 days')) . ' 11:36:50',
        ]);


        //Registros de la OF-003
        Registro_actividad::create([
            'maquina_id' => 2,
            'estado_id' => 4,
            'orden_id' => 3,
            'piezas' => 0,
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 1 days')) . ' 11:36:50',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 1 days')) . ' 11:39:15',
        ]);
        Registro_actividad::create([
            'maquina_id' => 2,
            'estado_id' => 1, 
            'orden_id' => 3, 
            'piezas' => 48,
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 1 days')) . ' 11:39:15',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 1 days')) . ' 13:56:40',
        ]);
        Registro_actividad::create([
            'maquina_id' => 2,
            'estado_id' => 2, 
            'orden_id' => 3, 
            'piezas' => 0,
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 1 days')) . ' 13:56:40',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 1 days')) . ' 14:21:05',
        ]);
        Registro_actividad::create([
            'maquina_id' => 2,
            'estado_id' => 1, 
            'orden_id' => 3, 
            'piezas' => 52,
            'inicio' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 1 days')) . ' 14:21:05',
            'fin' => date('Y-m-d', strtotime(Date('Y-m-d') . ' - 1 days')) . ' 16:15:50',
        ]);

        //Registros de la OF-004
        Registro_actividad::create([
            'maquina_id' => 3,
            'estado_id' => 1, 
            'orden_id' => 4, 
            'piezas' => 0,
            'inicio' => date('Y-m-d') . ' 10:15:50',
            'fin' => date('Y-m-d') . ' 10:16:15',
        ]);
        Registro_actividad::create([
            'maquina_id' => 3,
            'estado_id' => 1, 
            'orden_id' => 4, 
            'piezas' => 10,
            'inicio' => date('Y-m-d') . ' 10:16:15',
            'fin' => date('Y-m-d') . ' 10:38:40',
        ]);
        Registro_actividad::create([
            'maquina_id' => 3,
            'estado_id' => 1, 
            'orden_id' => 4, 
            'piezas' => 0,
            'inicio' => date('Y-m-d') . ' 10:38:40',
            'fin' => date('Y-m-d') . ' 10:46:05',
        ]);
        Registro_actividad::create([
            'maquina_id' => 3,
            'estado_id' => 1, 
            'orden_id' => 4, 
            'piezas' => 25,
            'inicio' => date('Y-m-d') . ' 10:46:05',
            'fin' => date('Y-m-d') . ' 11:39:15',
        ]);
        Registro_actividad::create([
            'maquina_id' => 3,
            'estado_id' => 1, 
            'orden_id' => 4, 
            'piezas' => 0,
            'inicio' => date('Y-m-d') . ' 11:39:15',
            'fin' => date('Y-m-d') . ' 11:46:40',
        ]);
        Registro_actividad::create([
            'maquina_id' => 3,
            'estado_id' => 1, 
            'orden_id' => 4, 
            'piezas' => 15,
            'inicio' => date('Y-m-d') . ' 11:46:40',
            'fin' => date('Y-m-d') . ' 12:15:50',
        ]);


        //Registros de la OF-005
        Registro_actividad::create([
            'maquina_id' => 3,
            'estado_id' => 4, 
            'orden_id' => 5, 
            'piezas' => 20,
            'inicio' => date('Y-m-d') . ' 12:15:50',
            'fin' => date('Y-m-d') . ' 12:18:15',
        ]);
        Registro_actividad::create([
            'maquina_id' => 3,
            'estado_id' => 1, 
            'orden_id' => 5, 
            'piezas' => 10,
            'inicio' => date('Y-m-d') . ' 12:18:15',
            'fin' => date('Y-m-d') . ' 12:50:23',
        ]);
        Registro_actividad::create([
            'maquina_id' => 3,
            'estado_id' => 8, 
            'orden_id' => 5, 
            'piezas' => 0,
            'inicio' => date('Y-m-d') . ' 12:50:23',
            'fin' => date('Y-m-d') . ' 12:55:50',
        ]);
        Registro_actividad::create([
            'maquina_id' => 3,
            'estado_id' => 1, 
            'orden_id' => 5, 
            'piezas' => 30,
            'inicio' => date('Y-m-d') . ' 12:55:50',
            'fin' => date('Y-m-d') . ' 13:35:50',
        ]);

        
    }
}
