<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProyectoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'nombre' => "Proyecto " . $this->faker->word(),
            'descripcion' => $this->faker->text(),
            'fecha_inicio' => $this->faker->date(),
            'fecha_fin' => $this->faker->date(),
            'estado' => $this->faker->randomElement([1, 2, 3]),
            'horas_estimadas' => $this->faker->randomFloat(2, 0, 1000),
            'cliente' => $this->faker->name(),
        ];
    }
}
