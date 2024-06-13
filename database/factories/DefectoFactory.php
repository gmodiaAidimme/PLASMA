<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DefectoFactory extends Factory
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
            'descripcion' => $this->faker->text,
            'color' => $this->faker->hexcolor
        ];
    }
}
