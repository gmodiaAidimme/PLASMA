<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class Registro_actividadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'maquina_id' => $this->faker->numberBetween(1, 10),
            'estado_id' => $this->faker->numberBetween(1, 3),
            'orden_id' => $this->faker->numberBetween(1, 10),
            'inicio' => $this->faker->dateTimeBetween('-1 day', 'now'),
            'fin' => $this->faker->dateTimeBetween('-1 day', 'now'),
            'piezas' => $this->faker->numberBetween(1, 1000),
            'ultima_pieza' => $this->faker->dateTime('now')
        ];
    }
}
