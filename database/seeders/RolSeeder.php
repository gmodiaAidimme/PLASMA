<?php

namespace Database\Seeders;

use App\Models\Rol;
use Illuminate\Database\Seeder;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Rol::create(['name' => 'Administrador', 'description' => 'Tiene acceso a todos los permisos']);
        Rol::create(['name' => 'Gerente', 'description' => 'Tiene acceso a las funcionalidades de visualización pero no a la introducción de datos']);
        Rol::create(['name' => 'Operario', 'description' => 'Tiene acceso a las funcionalidades de introducción de datos pero no a la visualización de los mismos']);
    }
}
