<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Empresa;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call([ParadaSeeder::class]);
        $this->call([EstadoSeeder::class]);
        $this->call([VariableSeeder::class]);
        $this->call([UserSeeder::class]);
        $this->call([DefectoSeeder::class]);

        Empresa::create([
            'id' => 1,
            'nombre' => 'AIDIMME',
            'CIF' => 'A12345678',
            'licencia' => 'anual',
        ]);
    }
}
