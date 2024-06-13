<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRegistroActividadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('registro_actividads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('maquina_id'); 
            $table->unsignedBigInteger('estado_id');
            $table->unsignedBigInteger('orden_id')->nullable(); 
            $table->dateTime('inicio'); 
            $table->dateTime('fin');
            $table->integer('piezas');
            $table->dateTime('ultima_pieza')->nullable();
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
        Schema::dropIfExists('registro_actividads');
    }
}
