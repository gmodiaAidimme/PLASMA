<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Empresa;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        //OBLIGATORIOS
        $this->call([ParadaSeeder::class]);
        $this->call([EstadoSeeder::class]);
        $this->call([VariableSeeder::class]);
        $this->call([UserSeeder::class]);
        $this->call([PermisosSeeder::class]);
        $this->call([PermisosRolSeeder::class]);
        $this->call([RolSeeder::class]);

        Empresa::create([
            'id' => 1,
            'nombre' => 'Leñas Legua',
            'CIF' => 'B96936364',
            'licencia' => 'anual',
            'logo' => 'fimmaMaderalia.png'
        ]);
        
        //DEMO
        // $this->call([ProyectosSeeder::class]);
        // $this->call([OrdenSeeder::class]);
        // $this->call([RegistroActividadSeeder::class]);
        // $this->call([DefectoSeeder::class]);
        $this->call([MaquinaSeeder::class]);
        $this->call([EmpleadoSeeder::class]);
        // $this->call([EmpleadosEnOFSeeder::class]);
    }
}
