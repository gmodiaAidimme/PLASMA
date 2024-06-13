<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRegistroControlsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('registro_controls', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('maquina_id');
            $table->unsignedBigInteger('producto_id');
            $table->dateTime('inicio');
            $table->dateTime('fin')->nullable();
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
        Schema::dropIfExists('registro_controls');
    }
}
