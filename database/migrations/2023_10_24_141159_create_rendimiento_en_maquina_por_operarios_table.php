<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRendimientoEnMaquinaPorOperariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rendimiento_en_maquina_por_operarios', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('maquina_id');
            $table->unsignedBigInteger('numero_operarios');
            $table->float('rendimiento_teorico');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rendimiento_en_maquina_por_operarios');
    }
}
