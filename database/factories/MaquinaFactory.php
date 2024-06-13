<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class MaquinaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'nombre' => $this->faker->name,
            'abreviacion' => $this->faker->name,
            'preparacion' => 0,
            'tiempo_ciclo_defecto' => 20,
        ];
        
    }
}
