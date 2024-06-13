<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRegistroCalidadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('registro_calidads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cantidad');
            $table->unsignedBigInteger('defecto_id');
            $table->unsignedBigInteger('maquina_id');
            $table->unsignedBigInteger('orden_id')->nullable();
            $table->date('fecha');
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
        Schema::dropIfExists('registro_calidads');
    }
}
