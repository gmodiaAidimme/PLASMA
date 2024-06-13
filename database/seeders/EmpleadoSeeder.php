<?php

namespace Database\Seeders;

use App\Models\Empleado;
use Illuminate\Database\Seeder;

class EmpleadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Empleado::create(
            [
                'nombre' => 'Juan',
                'apellido' => 'Perez',
                'email' => 'jperez@prueba.org',
                'imagen' => 'operario1.jpg',
                'posicion' => 'Operario'
            ]
        );
        Empleado::create(
            [
                'nombre' => 'Pedro',
                'apellido' => 'Perez',
                'email' => 'pperez@prueba.org',
                'imagen' => 'operario2.jpg',
                'posicion' => 'Operario'
            ]
        );
        Empleado::create(
            [
                'nombre' => 'Ana',
                'apellido' => 'López de la Torre',
                'email' => 'alopez@prueba.org',
                'imagen' => 'operario3.jpg',
                'posicion' => 'Gerente'
            ]
        );
        Empleado::create(
            [
                'nombre' => 'Margarita',
                'apellido' => 'García Panadero',
                'email' => 'mgarcia@prueba.org',
                'imagen' => 'operario4.jpg',
                'posicion' => 'Operario'
            ]
        );
        Empleado::create(
            [
                'nombre' => 'Alegría',
                'apellido' => 'Martinez Alba',
                'email' => 'amartinez@prueba.org',
                'imagen' => 'operario6.jpg',
                'posicion' => 'Operario'
            ]
        );
        Empleado::create(
            [
                'nombre' => 'Roberto',
                'apellido' => 'González',
                'email' => 'rgonzalez@prueba.org',
                'imagen' => 'operario5.jpg',
                'posicion' => 'Gerente'
            ]
        );
        Empleado::create(
            [
                'nombre' => 'Gilberto',
                'apellido' => 'Pérez de la Torre',
                'email' => 'gperez@prueba.org',
                'imagen' => 'operario7.jpg',
                'posicion' => 'Operario'
            ]
        );
        Empleado::create(
            [
                'nombre' => 'Eivor',
                'apellido' => 'Matalobos',
                'email' => 'ematalobos@prueba.org',
                'imagen' => 'operario8.jpg',
                'posicion' => 'Operario'
            ]
        );
    }
}
