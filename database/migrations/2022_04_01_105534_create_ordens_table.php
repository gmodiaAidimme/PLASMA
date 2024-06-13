<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ordens', function (Blueprint $table) {
            $table->id();
            $table->string("of");
            $table->unsignedBigInteger("maquina_id");
            $table->float("tiempo_ciclo_teorico");
            $table->integer("total_piezas");
            $table->integer("estado");
            $table->unsignedBigInteger("proyecto_id")->nullable();
            $table->dateTime("inicio");
            $table->dateTime("fin")->nullable();
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
        Schema::dropIfExists('ordens');
    }
}
