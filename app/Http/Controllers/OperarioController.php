<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Empleado;
use App\Models\Maquina;
use Illuminate\Support\Facades\Validator;
use App\Models\Registro_control_empleados;
use App\Models\Registro_actividad;
use App\Models\Producto;
use App\Models\Registro_calidad;
use App\Models\Defecto;
use App\Models\Motivos_presencia;
use App\Models\Presencia;
use App\Models\Horario;
use DateTime;
use Illuminate\Support\Facades\DB;


class OperarioController extends Controller
{

    private function registros($registro_ids)
    {
        return Registro_actividad::whereIn('registro_actividads.id', $registro_ids);
    }

    private function getCurrentDayClosingTime($dia)
    {
        $horario = Horario::all();
        $dayOfWeek = (int)$dia->format('w') - 1;

        $current_final_time = new \DateTime('00:00:00');
        foreach ($horario as $dia) {
            $final_time = new \DateTime($dia['hora_fin']);
            if ($dia['dia'] == $dayOfWeek && $final_time > $current_final_time) {
                $current_final_time = $final_time;
            }
        }

        return $current_final_time;
    }

    private function dateTime2secs($interval)
    {
        return ($interval->days * 24 * 60 * 60) +
            ($interval->h * 60 * 60) +
            ($interval->i * 60) +
            $interval->s;
    }

    public function getDiales($id, Request $request)
    {
        $validator = Validator::make(['id' => $id, 'desde' => $request->desde, 'hasta' => $request->hasta], [
            'id' => 'required|integer',
            'desde' => 'date|date_format:Y-m-d',
            'hasta' => 'date|date_format:Y-m-d|after_or_equal:desde',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $registros_control = Registro_control_empleados::join('registro_controls', 'registro_control_empleados.registro_control_id', '=', 'registro_controls.id')
            ->where('registro_control_empleados.empleado_id', $id)
            ->where([
                ['inicio', '<=',  date('Y-m-d', strtotime($request->hasta . ' + 1 day'))],
                ['fin', '>=', $request->desde]
            ])
            ->get();

        $registro_ids = [];
        foreach ($registros_control as $registro) {
            $reg_act = Registro_actividad::where([
                ['inicio', '<=', $registro->fin],
                ['fin', '>=', $registro->inicio],
                ['maquina_id', $registro->maquina_id]
            ])->pluck('id')->toArray();

            $registro_ids = array_merge($registro_ids, $reg_act);
        }

        $registros = $this->registros($registro_ids);

        if ($registros->count() == 0) {
            return response()->json([], 204);
        }

        //DISPONIBILIDAD
        $piezas_totales = $registros->sum('piezas');

        $disponibilidad = $registros->select(DB::Raw("nombre, sum(TIMESTAMPDIFF(SECOND, inicio, fin)) cantidad, color"))
            ->join('estados', 'estados.id', '=', 'estado_id')
            ->groupBy('estado_id', 'nombre', 'color')
            ->orderBy('estado_id')
            ->get();

        //RENDIMIENTO
        $tiempo_real = $this->registros($registro_ids)
            ->where('estado_id', 1)
            ->select(DB::Raw("sum(TIMESTAMPDIFF(SECOND, inicio, fin)) cantidad"))
            ->first()
            ->cantidad;

        $registros_trabajo = $this->registros($registro_ids)
            ->select(DB::Raw("maquina_id, orden_id, sum(TIMESTAMPDIFF(SECOND, inicio, fin)) cantidad, sum(piezas) piezas"))
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
        $rendimiento = [
            "tiempo_real" => intval($tiempo_real),
            "tiempo_plan" => $tiempo_plan,
        ];

        //CALIDAD
        $reg_calidad = [];

        foreach ($registros_control as $registro) {
            $reg_cal = Registro_calidad::where([
                ['fecha', '<=', $registro->fin],
                ['fecha', '>=', $registro->inicio],
                ['maquina_id', $registro->maquina_id]
            ])->get()->toArray();
            $reg_calidad = array_merge($reg_calidad, $reg_cal);
        }

        $defectuosas = 0;
        foreach ($reg_calidad as $registro) {
            $defectuosas += $registro['cantidad'];
        }

        $prev_calidad = [];
        foreach ($reg_calidad as $registro) {
            if (!isset($prev_calidad[$registro['defecto_id']])) {
                $defecto = Defecto::find($registro['defecto_id']);
                $prev_calidad[$registro['defecto_id']] = [
                    "nombre" => $defecto->nombre,
                    "color" => $defecto->color,
                    "cantidad" => 0
                ];
            }
            $prev_calidad[$registro['defecto_id']]['cantidad'] += $registro['cantidad'];
        }

        $calidad = [
            [
                "nombre" => "Correctas",
                "color" => "#009933",
                "cantidad" => $piezas_totales - $defectuosas,
            ]
        ];

        $calidad = array_merge($calidad, $prev_calidad);

        $data = [
            'disponibilidad' => $disponibilidad,
            'rendimiento'    => $rendimiento,
            'calidad'        => $calidad,
        ];
        return ($data);
    }


    public function getInfoOperario($id, Request $request)
    {
        $validation = Validator::make(array_merge($request->all(), ['id' => $id]), [
            'id' => 'required|integer|exists:empleados,id',
            'inicio' => 'required|date',
            'fin' => 'required|date'
        ]);

        if ($validation->fails()) {
            return response()->json([
                'message' => 'Datos no válidos',
                'errors' => $validation->errors()
            ], 400);
        }

        $registros_control = Registro_control_empleados::join('registro_controls', 'registro_control_empleados.registro_control_id', '=', 'registro_controls.id')
            ->where('registro_control_empleados.empleado_id', $id)
            ->where([
                ['inicio', '<=',  date('Y-m-d', strtotime($request->fin . ' + 1 day'))],
                ['fin', '>=', $request->inicio]
            ])
            ->get();

        $registros_actividad = [];
        foreach ($registros_control as $registro) {
            $reg_act = Registro_actividad::where([
                ['inicio', '<=', $registro->fin],
                ['fin', '>=', $registro->inicio],
                ['maquina_id', $registro->maquina_id]
            ])->get()->toArray();

            foreach ($reg_act as $key => $r) {
                $reg_act[$key]['producto_id'] = $registro->producto_id; // Modify the actual array
            }

            $registros_actividad = array_merge($registros_actividad, $reg_act);
        }

        //Calculo máquinas

        $maquinas = [];
        foreach ($registros_actividad as $registro) {

            if (!isset($maquinas[$registro['maquina_id']])) {
                $maq = Maquina::find($registro['maquina_id']);
                $maquinas[$registro['maquina_id']] = [
                    "nombre" => $maq->nombre,
                    "imagen" => $maq->imagen,
                    "piezas" => 0,
                    "tiempo" => 0
                ];
            }

            $maquinas[$registro['maquina_id']]['piezas'] += $registro['piezas'];
            $maquinas[$registro['maquina_id']]['tiempo'] += strtotime($registro['fin']) - strtotime($registro['inicio']);
        }

        //Calculo productos

        $productos = [];
        foreach ($registros_actividad as $registro) {

            if (!isset($productos[$registro['producto_id']])) {
                $prod = Producto::find($registro['producto_id']);
                $productos[$registro['producto_id']] = [
                    "nombre" => $prod->nombre,
                    "imagen" => $prod->imagen,
                    "piezas" => 0,
                    "tiempo" => 0
                ];
            }

            $productos[$registro['producto_id']]['piezas'] += $registro['piezas'];
            $productos[$registro['producto_id']]['tiempo'] += strtotime($registro['fin']) - strtotime($registro['inicio']);
        }

        //Estadisticas 

        $registros_ids = [];
        foreach ($registros_actividad as $registro) {
            array_push($registros_ids, $registro['id']);
        }


        //Presencia
        $motivos = Motivos_presencia::all();

        $presencia = Presencia::where([
            ['operario_id', $id],
            ['fechahora', '>=', $request->inicio],
            ['fechahora', '<=',  date('Y-m-d', strtotime($request->fin . ' + 1 day'))]
        ])
            ->join('motivos_presencias', 'motivo_id', '=', 'motivos_presencias.id')
            ->get();

        $presencia_final = [];

        foreach ($motivos as $motivo) {
            array_push($presencia_final, ['motivo_id' => $motivo['id'], 'motivo' => $motivo['nombre'], 'tiempo' => 0, 'color' => $motivo['color']]);
        }

        for ($i = 0; $i < count($presencia); $i += 1) {
            $fechahora = new Datetime($presencia[$i]['fechahora']);
            $final_horario = new DateTime($fechahora->format('Y-m-d') . ' ' . $this->getCurrentDayClosingTime($fechahora)->format('H:i:s'));

            //Calcular el tiempo intermedio
            if ($i == count($presencia) - 1) {

                //si ya has acabado, hasta el horario, sino, hasta el momento actual
                $current_daytime = new DateTime();
                if ($final_horario < $current_daytime) {
                    $tiempo = $final_horario->diff($fechahora);
                } else {
                    $tiempo = $current_daytime->diff($fechahora);
                }
            } else {
                $next_fechahora = new DateTime($presencia[$i + 1]['fechahora']);
                if ($next_fechahora->format('Y-m-d') != $fechahora->format('Y-m-d')) {
                    $tiempo = $final_horario->diff($fechahora);
                } else {
                    $tiempo = $next_fechahora->diff($fechahora);
                }
            }

            // return response()->json($this->dateTime2secs($tiempo));

            for ($j = 0; $j < count($presencia_final); $j += 1) {
                if ($presencia_final[$j]["motivo_id"] == $presencia[$i]['motivo_id']) {
                    $presencia_final[$j]["tiempo"] += $this->dateTime2secs($tiempo);
                }
            }
        }

        $operario = [
            "operario" => Empleado::find($id),
            "registros_actividad" => $registros_actividad,
            "maquinas" => $maquinas,
            "productos" => $productos,
            "presencia" => $presencia_final
        ];

        return response()->json($operario);
    }

    public function getPresenciaDia(Request $request, $id)
    {
        $validation = Validator::make(array_merge($request->all(), ['id' => $id]), [
            'id' => 'required|integer|exists:empleados,id',
            'fecha' => 'required|date'
        ]);

        if ($validation->fails()) {
            return response()->json([
                'message' => 'Datos no válidos',
                'errors' => $validation->errors()
            ], 400);
        }

        $dayOfWeek = (new DateTime($request->fecha))->format('w') - 1;
        $horario = Horario::where('dia', $dayOfWeek)->get();

        $inicio_horario = new DateTime($request->fecha . ' 23:59:59');
        $fin_horario = new DateTime($request->fecha . '00:00:00');

        foreach ($horario as $turno) {
            $curr_inicio = new DateTime($request->fecha . ' ' . $turno['hora_inicio']);
            $curr_fin = new DateTime($request->fecha . ' ' . $turno['hora_fin']);

            $inicio_horario = ($curr_inicio < $inicio_horario) ? $curr_inicio : $inicio_horario;
            $fin_horario = ($curr_fin > $fin_horario) ? $curr_fin : $fin_horario;
        }

        $presencia = Presencia::where([
            ['operario_id', $id],
            ['fechahora', '>=', $request->fecha],
            ['fechahora', '<=',  date('Y-m-d', strtotime($request->fecha . ' + 1 day'))]
        ])
            ->orderBy('fechahora', 'ASC')
            ->join('motivos_presencias', 'motivo_id', '=', 'motivos_presencias.id')
            ->get();

        $timeline = [];
        if (count($presencia) == 0) {
            return response()->json([], 204);
        }


        $fechahora_anterior = new DateTime($presencia[0]['fechahora']);
        for ($i = 0; $i <= count($presencia); $i++) {
            if ($i == 0) {
                $fechahora = new Datetime($presencia[$i]['fechahora']);

                if ($fechahora > $inicio_horario) {
                    array_push($timeline, [
                        'motivo' => "Sin fichar",
                        'color' => '#999999',
                        'inicio' => $inicio_horario->format('H:i'),
                        'fin' => $fechahora->format('H:i')
                    ]);
                }
            } elseif ($i == count($presencia)) {
                if ($fechahora_anterior < $fin_horario) {
                    array_push($timeline, [
                        'motivo' => $presencia[$i - 1]['nombre'],
                        'color' => $presencia[$i - 1]['color'],
                        'inicio' => $fechahora_anterior->format('H:i'),
                        'fin' => $fin_horario->format('H:i:s')
                    ]);
                }
            } else {
                $fechahora = new Datetime($presencia[$i]['fechahora']);
                array_push($timeline, [
                    'motivo' => $presencia[$i - 1]['nombre'],
                    'color' => $presencia[$i - 1]['color'],
                    'inicio' => $fechahora_anterior->format('H:i'),
                    'fin' => $fechahora->format('H:i:s')
                ]);
            }
            $fechahora_anterior = $fechahora;
        }


        return response()->json($timeline);
    }
}
