<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Proyecto;
use App\Models\Orden;
use App\Models\Registro_actividad;
use App\Models\Operarios_en_orden;
use App\Models\Empleado;
use App\Models\Maquina;
use App\Models\Registro_calidad;

use DateTime;

class ProyectosController extends Controller
{

    private function getRegistros($id){
        return Registro_actividad::join('ordens', 'registro_actividads.orden_id', '=', 'ordens.id')
            ->join('proyectos', 'ordens.proyecto_id', '=', 'proyectos.id')
            ->where('proyectos.id', $id)
            ->select('registro_actividads.*');
    }

    public function getProyectos(){
        $proyectos = Proyecto::all();
        return response()->json([
            'proyectos' => $proyectos
        ], 200);
    }

    public function getProyecto($id){
        $proyecto = Proyecto::find($id);

        $ordenes = Orden::where('proyecto_id', $id)->get();

        $registros = [];
        foreach($ordenes as $orden){
            array_merge($registros, Registro_actividad::where('orden_id', $orden->id)->get()->toArray());
        }

        $empleados = Empleado::join('operarios_en_ordens', 'empleados.id', '=', 'operarios_en_ordens.operario_id')
            ->join('ordens', 'operarios_en_ordens.orden_id', '=', 'ordens.id')
            ->join('proyectos', 'ordens.proyecto_id', '=', 'proyectos.id')
            ->where('proyectos.id', $id)
            ->groupBy('empleados.id')
            ->select(['empleados.id', 'empleados.nombre', DB::raw('count(*) as ordenes')])
            ->get();

        $maquinas = Maquina::join('ordens', 'maquinas.id', '=', 'ordens.maquina_id')
            ->join('proyectos', 'ordens.proyecto_id', '=', 'proyectos.id')
            ->where('proyectos.id', $id)
            ->groupBy('maquinas.id')
            ->select(['maquinas.id', 'maquinas.nombre', DB::raw('count(*) as ordenes')])
            ->get();
        // dd($empleados);

        $dias = [];
        $horas = 0; 
        foreach($ordenes as $orden){
            $fin = strtotime($orden->fin);
            $inicio = strtotime($orden->inicio);

            $horas += ($fin - $inicio) / 3600;

            $fecha = date('Y-m-d', $inicio);
            array_push($dias, [
                'fecha' => $fecha,
                'horas' => ($fin - $inicio) / 3600,
                'orden' => $orden->of
            ]);
        }

        return response()->json([
            'proyecto' => $proyecto,
            'ordenes' => $ordenes,
            'registros' => $registros,
            'empleados' => $empleados,
            'maquinas' => $maquinas,
            'horasEstimadas' => $proyecto->horas_estimadas,
            'horasTrabajadas' => $horas,
            'dias' => $dias,
        ], 200);
    }

    public function nuevoProyecto(Request $request){
        $proyecto = new Proyecto();
        $proyecto->nombre = $request->nombre;
        $proyecto->descripcion = $request->descripcion;
        $proyecto->fecha_inicio = $request->fecha_inicio;
        $proyecto->fecha_fin = $request->fecha_fin;
        $proyecto->estado = "activo";
        $proyecto->cliente = $request->cliente;
        $proyecto->horas_estimadas = $request->horas_estimadas;
        $proyecto->save();
        return response()->json([
            'proyecto' => $proyecto
        ], 200);
    }

    public function modificarProyecto(Request $request, $id){
        $proyecto = Proyecto::find($id);
        $proyecto->nombre = $request->nombre;
        $proyecto->descripcion = $request->descripcion;
        $proyecto->fecha_inicio = $request->fecha_inicio;
        $proyecto->fecha_fin = $request->fecha_fin;
        $proyecto->horas_estimadas = $request->horas_estimadas;
        $proyecto->save();
        return response()->json([
            'proyecto' => $proyecto
        ], 200);
    }

    public function eliminarProyecto($id){
        $ordenes = Orden::where('proyecto_id', $id)->get();
        foreach($ordenes as $orden){
            $orden->proyecto_id = null;
            $orden->save();
        }
        $proyecto = Proyecto::find($id);

        $proyecto->delete();
        return response()->json([
            'proyecto' => $proyecto
        ], 200);
    }

    public function getDialesProyecto($id)
    {

        $registros = $this->getRegistros($id);

        if ($registros->count() == 0) {
            return response()->json([], 204);
        }

        //DISPONIBILIDAD
        $piezas_totales = $registros->sum('piezas');
        $disponibilidad = $registros->select(DB::Raw("estados.nombre, sum(TIMESTAMPDIFF(SECOND, registro_actividads.inicio, registro_actividads.fin)) cantidad, color"))
            ->join('estados', 'estados.id', '=', 'estado_id')
            ->groupBy('estado_id')
            ->orderBy('estado_id')
            ->get();

        //RENDIMIENTO
        $tiempo_real = $this->getRegistros($id)
            ->where('estado_id', 1)
            ->select(DB::Raw("sum(TIMESTAMPDIFF(SECOND, registro_actividads.inicio, registro_actividads.fin)) cantidad"))
            ->first()
            ->cantidad;
        if ($id > 0) {
            $tiempo_plan = 0;
            $ciclo_defecto = Maquina::find($id)->tiempo_ciclo_defecto;

            $regs_rend = $this->getRegistros($id)->where('estado_id', 1)->get();

            for ($i = 0; $i < count($regs_rend); $i++) {
                if (!is_null($regs_rend[$i]->orden_id)) {
                    $ciclo = $regs_rend[$i]->orden->tiempo_ciclo_teorico;
                    $tiempo_plan += $ciclo * $regs_rend[$i]->piezas;
                } else {
                    $tiempo_plan += $ciclo_defecto * $regs_rend[$i]->piezas;
                }
            }
        } else {

            $registros_trabajo = $this->getRegistros($id)->where('estado_id', 1)
                ->select(DB::Raw("maquina_id, orden_id, sum(TIMESTAMPDIFF(SECOND, registro_actividads.inicio, registro_actividads.fin)) cantidad, sum(piezas) piezas"))
                ->groupBy('maquina_id', 'orden_id')
                ->get();
            $tiempo_plan = 0;

            foreach ($registros_trabajo as $registro) {
                if (!is_null($registro->orden_id)) {
                    $tiempo_plan += $registro->orden->tiempo_ciclo_teorico * $registro->piezas;
                } else {
                    $tiempo_plan += Maquina::find($registro->maquina_id)->tiempo_ciclo_defecto * $registro->piezas;
                }
            }
        }
        $rendimiento = [
            "tiempo_real" => intval($tiempo_real),
            "tiempo_plan" => $tiempo_plan,
        ];

        //CALIDAD
        $ofs = Orden::where('proyecto_id', $id)->get();
        $reg_calidad = Registro_calidad::whereIn('orden_id', $ofs->pluck('id'));
        if ($id > 0) {
            $reg_calidad = $reg_calidad->where('maquina_id', $id);
        }
        $defectuosas = $reg_calidad->sum('cantidad');

        $prev_calidad = $reg_calidad
            ->groupBy('defecto_id')
            ->join('defectos', 'defectos.id', '=', 'defecto_id')
            ->select(DB::Raw("defectos.nombre, defectos.color, sum(cantidad) cantidad"))
            ->get()->toArray();
        $calidad = [
            [
                "nombre" => "Correctas",
                "color" => "#009933",
                "cantidad" => $piezas_totales - $defectuosas,
            ]
        ];

        foreach ($prev_calidad as $prev) {
            array_push($calidad, $prev);
        }

        $data = [
            'disponibilidad' => $disponibilidad,
            'rendimiento'    => $rendimiento,
            'calidad'        => $calidad,
        ];
        return ($data);
    }
}
