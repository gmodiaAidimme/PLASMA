<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VisualFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {

        $tipos = ['disponibilidad', 'rendimiento', 'calidad', 'oee', 'estado', 'productividad'];
        return [
            'vista_id' => 1,
            'maquina_id' => 1,
            'tipo' => $tipos[array_rand($tipos)],
            'ancho' =>  $this->faker->numberBetween(1, 5),
            'alto' =>  $this->faker->numberBetween(1, 3),
            'x' =>  $this->faker->numberBetween(0, 5),
            'y' =>  $this->faker->numberBetween(0, 3),
        ];   
    }
}
