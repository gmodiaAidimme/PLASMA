<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Operarios_en_orden;

class EmpleadosEnOFSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Operarios en la OF-001
        Operarios_en_orden::create([
            'orden_id' => 1,
            'operario_id' => 1,
        ]);
        Operarios_en_orden::create([
            'orden_id' => 1,
            'operario_id' => 2,
        ]);
        Operarios_en_orden::create([
            'orden_id' => 1,
            'operario_id' => 3,
        ]);

        //Operarios en la OF-002
        Operarios_en_orden::create([
            'orden_id' => 2,
            'operario_id' => 1,
        ]);
        Operarios_en_orden::create([
            'orden_id' => 2,
            'operario_id' => 2,
        ]);

        //Operarios en la OF-003
        Operarios_en_orden::create([
            'orden_id' => 3,
            'operario_id' => 4,
        ]);
        Operarios_en_orden::create([
            'orden_id' => 3,
            'operario_id' => 5,
        ]);

        //Operarios en la OF-004
        Operarios_en_orden::create([
            'orden_id' => 4,
            'operario_id' => 6,
        ]);
        Operarios_en_orden::create([
            'orden_id' => 4,
            'operario_id' => 7,
        ]);

        //Operarios en la OF-005
        Operarios_en_orden::create([
            'orden_id' => 5,
            'operario_id' => 8,
        ]);
        Operarios_en_orden::create([
            'orden_id' => 5,
            'operario_id' => 1,
        ]);

    }
}
