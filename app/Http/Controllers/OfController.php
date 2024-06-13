<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Operarios_en_orden;
use App\Models\Orden;
use App\Models\Registro_actividad;
use App\Models\Registro_calidad;
use App\Models\Defecto;
use App\Models\Proyecto;
use DB;

use Illuminate\Support\Facades\Validator;

class OfController extends Controller
{
    private function estadoOF($estado)
    {
        switch ($estado) {
            case 0:
                return "Terminada";
            case 1:
                return "En preparación";
            case 2:
                return "En producción";
            case 3:
                return "Pendiente calidad";
            case 4:
                return "Parada";
        }
    }

    public function getEmpleadosOf($of)
    {
        $validator = Validator::make(['of' => $of], [
            'of' => 'required|integer|exists:ordens,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $empleados = Operarios_en_orden::where('orden_id', $of)->with('operario')->get();
        return response()->json($empleados);
    }

    public function getInforme($of_id)
    {

        $validator = Validator::make(['of_id' => $of_id], [
            'of_id' => 'required|integer|exists:ordens,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $of = Orden::find($of_id);

        $registros = Registro_actividad::where('orden_id', $of_id)->orderBy('inicio', 'ASC')->get();

        if (!$registros || $registros->count() == 0) {
            return response()->json([], 204);
        }

        $tiempo_teorico = $of->tiempo_ciclo_teorico * $of->total_piezas;
        $inicio = strtotime($registros->first()->inicio);
        $fin = strtotime($registros->last()->fin);
        $tiempo_real = $fin - $inicio;
        $piezas_reales = $registros->sum('piezas');

        $registros_parado = Registro_actividad::where('orden_id', $of_id)->where('piezas', 0)->get();
        $tiempo_parado = 0;
        foreach ($registros_parado as $registro) { 
            $tiempo_parado += strtotime($registro->fin) - strtotime($registro->inicio);
        }

        $tiempo_efectivo = $tiempo_real - $tiempo_parado;

        $informe = [
            'piezas' => [
                'real' => $piezas_reales,
                'plan' => $of->total_piezas
            ],
            'inicio' => [
                'real' => strtotime($registros->first()->inicio),
                'plan' => strtotime($of->inicio)
            ],
            'fin' => [
                'real' => strtotime($registros->last()->fin),
                'plan' => strtotime($of->inicio) + $tiempo_teorico
            ],
            'tiempo' => [
                'real' => $tiempo_real,
                'plan' => $tiempo_teorico
            ],
            'tiempo_parado' => [
                'real' => $tiempo_parado,
                'plan' => 0
            ],
            'tiempo_efectivo' => [
                'real' => $tiempo_efectivo,
                'plan' => $tiempo_teorico
            ],
            'ciclo' => [
                'real' => $piezas_reales > 0 ? $tiempo_real / $piezas_reales : 0,
                'plan' => $of->tiempo_ciclo_teorico
            ],
            'estado' => $this->estadoOF($of->estado)
        ];
        // dd($informe);

        return response()->json($informe);
    }

    public function getDisponibilidad($of_id)
    {
        $validator = Validator::make(compact('of_id'), [
            'of_id' => 'required|integer|exists:ordens,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $disponibilidad = Registro_actividad::where('orden_id', $of_id)->select(DB::Raw("nombre, sum(TIMESTAMPDIFF(SECOND, inicio, fin)) cantidad, color"))
            ->join('estados', 'estados.id', '=', 'estado_id')
            ->groupBy('estado_id')
            ->groupBy('nombre')
            ->groupBy('color')
            ->orderBy('estado_id')
            ->get();

        return response()->json($disponibilidad);
    }

    public function getRendimiento($of_id)
    {
        Validator::make(compact('of_id'), [
            'of_id' => 'required|integer|exists:ordens,id',
        ])->validate();

        $of = Orden::find($of_id);

        $tiempo_real = Registro_actividad::where('orden_id', $of_id)
            ->where('estado_id', 1)
            ->select(DB::Raw("sum(TIMESTAMPDIFF(SECOND, inicio, fin)) cantidad"))
            ->first()->cantidad;

        $rendimiento = [
            [
                "nombre" => "Tiempo planificado",
                "cantidad" => $of->tiempo_ciclo_teorico * $of->total_piezas,
                "color" => "#009933"
            ],
            [
                "nombre" => "Retraso",
                "cantidad" => $tiempo_real - ($of->tiempo_ciclo_teorico * $of->total_piezas),
                "color" => "#ff9900"
            ]
        ];

        return response()->json($rendimiento);
    }

    public function getCalidad($of_id)
    {
        Validator::make(compact('of_id'), [
            'of_id' => 'required|integer|exists:ordens,id',
        ])->validate();

        $piezas_totales = Registro_actividad::where('orden_id', $of_id)->sum('piezas');

        $reg_calidad = Registro_calidad::where('orden_id', $of_id);
        $defectuosas = $reg_calidad->sum('cantidad');
        $prev_calidad = $reg_calidad
            ->join('defectos', 'defectos.id', '=', 'defecto_id')
            ->select('nombre', 'color', 'cantidad')
            ->get()->toArray();

        $calidad = [
            [
                "nombre" => "Correctas",
                "color" => "#009933",
                "cantidad" =>  $piezas_totales - $defectuosas,
            ]
        ];

        foreach ($prev_calidad as $prev) {
            array_push($calidad, $prev);
        }

        return response()->json($calidad);
    }

    public function getAcciones($of_id)
    {
        Validator::make(compact('of_id'), [
            'of_id' => 'required|integer|exists:ordens,id',
        ])->validate();

        $registros = Registro_calidad::where('orden_id', $of_id)->get();
        $reporteCalidad = [];
        foreach ($registros as $registro) {
            $reporteCalidad[] = [
                "defecto" => $registro->defecto_id,
                "piezas" => $registro->cantidad,
            ];
        }

        $proyectos = Proyecto::all();
        $proyecto = Orden::find($of_id)->proyecto_id;

        if (!$proyecto) {
            $proyecto = 0;
        }

        $defectos = Defecto::all();
        return response()->json([
            "reporte" => $reporteCalidad,
            "defectos" => $defectos,
            "proyectos" => $proyectos,
            "proyecto" => $proyecto
        ], 200);
    }

    public function cambiarProyecto($of_id, Request $request)
    {
        Validator::make(array_merge(compact('of_id'), $request->all()), [
            'of_id' => 'required|integer|exists:ordens,id',
            'proyecto' => 'required|integer|exists:proyectos,id|nullable',
        ])->validate();

        $of = Orden::find($of_id);
        if ($request->proyecto == 0) {
            $of->proyecto_id = null;
        } else {
            $of->proyecto_id = $request->proyecto;
        }
        $of->save();
        return response()->json(["proyecto" => $request->proyecto], 200);
    }
    
}
