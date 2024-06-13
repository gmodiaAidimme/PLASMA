<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AddTipoCalculoRendimientoToMaquinasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('maquinas', function (Blueprint $table) {
            $table->string('tipo_calculo_rendimiento')->default('basico')->after('tiempo_ciclo_defecto');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // If you want to reverse this migration, you would drop the column.
        Schema::table('maquinas', function (Blueprint $table) {
            $table->dropColumn('tipo_calculo_rendimiento');
        });
    }
}
