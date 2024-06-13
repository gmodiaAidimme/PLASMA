<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EmpleadoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'nombre' => $this->faker->firstName(),
            'apellido' => $this->faker->lastName(), 
            'email' => $this->faker->unique()->safeEmail(),
            'posicion' => $this->faker->randomElement(['operario', 'supervisor']),
        ];
    }
}
