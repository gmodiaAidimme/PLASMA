<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParadasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('paradas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->nullable();
            $table->time('inicio');
            $table->time('fin');
            $table->boolean('lunes');
            $table->boolean('martes');
            $table->boolean('miercoles');
            $table->boolean('jueves');
            $table->boolean('viernes');
            $table->boolean('sabado');
            $table->boolean('domingo');
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
        Schema::dropIfExists('paradas');
    }
}
