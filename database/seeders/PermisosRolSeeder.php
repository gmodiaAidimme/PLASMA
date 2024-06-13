<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Permisos_rol;

class PermisosRolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 1]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 2]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 3]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 4]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 5]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 6]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 7]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 8]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 9]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 10]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 11]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 12]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 13]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 14]);
        Permisos_rol::create(['rol_id' => 1, 'permiso_id' => 15]);

    }
}
