<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class OrdenFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'of' => $this->faker->name,
            'maquina_id' => 1,
            'tiempo_ciclo_teorico' => 20,
            'total_piezas' => 100,
            'estado' => 1,
            'inicio' => '2021-01-01 00:00:00',
            'fin' => '2021-01-01 00:00:00',
        ];
    }
}
