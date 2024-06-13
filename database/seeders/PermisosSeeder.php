<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Permiso;

class PermisosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Permiso::create(['name' => 'panel general',          'icon' => 'fas fa-industry']);
        Permiso::create(['name' => 'panel maquina',          'icon' => 'fas fa-tachometer-alt']);
        Permiso::create(['name' => 'entrada manual',         'icon' => 'fas fa-edit']);
        Permiso::create(['name' => 'ordenes de fabricacion', 'icon' => 'fas fa-rocket']);
        Permiso::create(['name' => 'proyectos',              'icon' => 'fas fa-project-diagram']);
        Permiso::create(['name' => 'historico',              'icon' => 'fas fa-calendar-day']);
        Permiso::create(['name' => 'almacen',                'icon' => 'fas fa-warehouse']);
        Permiso::create(['name' => 'operarios',              'icon' => 'fa fa-hard-hat']);
        Permiso::create(['name' => 'control',                'icon' => 'fa fa-tasks']);
        Permiso::create(['name' => 'presentacion',           'icon' => 'fa fa-tv']);
        Permiso::create(['name' => 'configuracion',          'icon' => 'fas fa-cogs']);
        Permiso::create(['name' => 'alarmas',                'icon' => 'fas fa-bell']);
        Permiso::create(['name' => 'ayuda',                  'icon' => 'fas fa-question-circle']);
        Permiso::create(['name' => 'perfil',                 'icon' => 'fas fa-user']);
        Permiso::create(['name' => 'api',                    'icon' => 'fas fa-key']);
    }
}
