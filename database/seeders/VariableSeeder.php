<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Variable;

class VariableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Variable::create([
            'nombre' => 'tiempo_falta_datos',
            'valor' => '20',
            'tipo' => 'int'
        ]);
        Variable::create([
            'nombre' => 'limite_registro',
            'valor' => '900',
            'tipo' => 'int'
        ]);
        Variable::create([
            'nombre' => 'limite_microparo',
            'valor' => '300',
            'tipo' => 'int'
        ]);
        Variable::create([
            'nombre' => 'modo_manual',
            'valor' => '0',
            'tipo' => 'bool'
        ]);
        Variable::create([
            'nombre' => 'gap_alarmas',
            'valor' => '3600',
            'tipo' => 'int'
        ]);
        Variable::create([
            'nombre' => 'unidades_productividad',
            'valor' => '0',
            'tipo' => 'int'
        ]);
    }
}
