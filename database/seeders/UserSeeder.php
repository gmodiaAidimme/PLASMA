<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Administrador_PLASMA',
            'email' => 'gmodia@aidimme.es',
            'password' => Hash::make('gaboadmin'),
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey',
            'estado' => 'Activo',
            'email_verified_at' => now(),
            'rol_id' => 1,
        ]);
        User::create([
            'name' => 'Francis Albert',
            'email' => 'falbert@arcae.eu',
            'password' => Hash::make('arcae_plasma2024'),
            'estado' => 'Activo',
            'email_verified_at' => now(),
            'rol_id' => 2,
        ]);
        User::create([
            'name' => 'Jorge Morales',
            'email' => 'jmorales@arcae.eu',
            'password' => Hash::make('arcae_mes_24'),
            'estado' => 'Activo',
            'email_verified_at' => now(),
            'rol_id' => 2,
        ]);
        User::create([
            'name' => 'Ruben Mañez',
            'email' => 'rmanez@aidimme.es',
            'password' => Hash::make('Aidimme2024'),
            'estado' => 'Activo',
            'email_verified_at' => now(),
            'rol_id' => 2,
        ]);
        User::create([
            'name' => 'Jose Morales',
            'email' => 'jmorales@unicoffin.es',
            'password' => Hash::make('arcae-2024'),
            'estado' => 'Activo',
            'email_verified_at' => now(),
            'rol_id' => 2,
        ]);

    }
}
