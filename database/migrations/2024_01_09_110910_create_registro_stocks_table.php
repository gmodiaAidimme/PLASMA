<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRegistroStocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('registro_stocks', function (Blueprint $table) {
            $table->id();
            $table->integer('producto_id');
            $table->integer('usuario_id');
            $table->integer('cantidad');
            $table->dateTime('fechahora');
            $table->string('tipo');
            $table->string('notas')->nullable();
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
        Schema::dropIfExists('registro_stocks');
    }
}
