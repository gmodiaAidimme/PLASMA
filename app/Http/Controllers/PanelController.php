<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Maquina;
use App\Models\Registro_actividad;
use App\Models\Registro_calidad;
use App\Models\Orden;
use App\Models\Variable;
use App\Models\Comentario;
use App\Models\Operarios_en_maquina;
use App\Models\Parada;
use App\Models\Rendimiento_en_maquina_por_operarios;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Validator;

use DateTime;
use DB;

class PanelController extends Controller
{
    private function registros($desde, $hasta, $id)
    {
        $registros = Registro_actividad::where('inicio', '>', $desde)
            ->where('inicio', '<', date('Y-m-d', strtotime($hasta . ' + 1 days')));
        if ($id > 0) {
            $registros = $registros->where('maquina_id', $id);
        }
        return $registros;
    }

    private function acumularRegistrosGeneral($registros)
    {
        $tiempos = [];
        $real = [];
        foreach ($registros as $registro) {
            if (!in_array($registro->fin, $tiempos)) {
                $inicio = date('Y-m-d H:i:s', max(strtotime($registro->inicio), strtotime(end($tiempos))));
                $registro->inicio = $inicio;
                array_push($tiempos, $registro->fin);
                array_push($real, $registro);
            } else {
                $index = array_search($registro->fin, $tiempos);
                $real[$index]->piezas += $registro->piezas;
            }
        }
        return collect($real);
    }

    private function calcularProductividadTeoricaGeneral($inicio, $fin, $optimo)
    {
        if ($optimo == "todas") {
            $maquinas = Maquina::all();
        } else {
            $maquinas = [];
            $todas_maq = Maquina::all();

            foreach ($todas_maq as $maquina) {
                $reg = Registro_actividad::where('inicio', '>', date('Y-m-d', strtotime($inicio)))
                    ->where('maquina_id', $maquina->id)
                    ->where('inicio', '<', date('Y-m-d', strtotime($fin . ' + 1 days')))
                    ->first();
                if ($reg) {
                    array_push($maquinas, $maquina);
                }
            }
        }

        $productividad = 0;
        foreach ($maquinas as $maquina) {
            $productividad += $this->calcularProductividadTeorica($maquina, $inicio, $fin);
        }
        return $productividad;
    }

    private function calcularProductividadTeorica($maquina, $inicio, $fin)
    {
        $rendimiento = 1;
        if ($maquina->tipo_calculo_rendimiento == "basico") {
            $rendimiento = $maquina->tiempo_ciclo_defecto;
        } else {
            $n_operarios = Operarios_en_maquina::where('maquina_id', $maquina->id)->where('fecha', date('Y-m-d', strtotime($inicio)))->get();
            if ($n_operarios->count() == 0) {
                $rendimiento = $maquina->tiempo_ciclo_defecto;
            } else {
                $rendimiento_real = Rendimiento_en_maquina_por_operarios::where('maquina_id', $maquina->id)->where('numero_operarios', $n_operarios[0]->numero_operarios)->get();
                if ($rendimiento_real->count() == 0) {
                    $rendimiento = $maquina->tiempo_ciclo_defecto;
                } else {
                    $rendimiento = $rendimiento_real[0]->rendimiento_teorico;
                }
            }
        }

        $paradas = Parada::where('inicio', '<', $inicio)->where('fin', '>', $fin)->count();
        if ($paradas > 0) {
            return 0;
        }

        $gap = strtotime($fin) - strtotime($inicio);

        return $gap / $rendimiento;
    }

    private function obtenerOIniciarOperarios($id)
    {
        if ($id == 0) {
            return 1;
        }

        $maquina = Maquina::find($id);
        if ($maquina->tipo_calculo_rendimiento == "basico") {
            return 1;
        }

        $rendimientos = Rendimiento_en_maquina_por_operarios::where('maquina_id', $id)->get();
        $operarios = Operarios_en_maquina::where('maquina_id', $id)->where('fecha', date('Y-m-d'))->first();

        if (!$operarios) {
            $first = true;
            foreach ($rendimientos as $rendimiento) {
                if ($first) {
                    $operarios = $rendimiento->numero_operarios;
                    $first = false;
                    continue;
                }
                if ($rendimiento->rendimiento_teorico < $operarios) {
                    $operarios = $rendimiento->numero_operarios;
                }
            }
            Operarios_en_maquina::create([
                'maquina_id' => $id,
                'numero_operarios' => $operarios,
                'fecha' => date('Y-m-d')
            ]);
        } else {
            $operarios = $operarios->numero_operarios;
        }

        return $operarios;
    }

    public function getIndicadoresMaq($id, Request $request)
    {
        $validator = Validator::make(['id' => $id, 'desde' => $request->desde, 'hasta' => $request->hasta], [
            'id' => 'required|integer',
            'desde' => 'nullable|date|date_format:Y-m-d',
            'hasta' => 'nullable|date|date_format:Y-m-d|after_or_equal:desde',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $desde = ($request->has('desde') ? $request->desde : date('Y-m-d'));
        $hasta = ($request->has('hasta') ? $request->hasta : date('Y-m-d'));

        $registros_trabajo = Registro_actividad::where('inicio', '>', $desde)
            ->where('inicio', '<', date('Y-m-d', strtotime($hasta . ' + 1 days')))
            ->where('estado_id', '=', 1);
        $registros_paro    = Registro_actividad::where('inicio', '>', $desde)
            ->where('inicio', '<', date('Y-m-d', strtotime($hasta . ' + 1 days')))
            ->where('estado_id', '!=', 1);

        if ($id > 0) {
            $registros_trabajo = $registros_trabajo->where('maquina_id', $id);
            $registros_paro    = $registros_paro->where('maquina_id', $id);
        }

        $tiempo_trabajado = 0;

        $registros = $registros_trabajo->get();
        if ($registros->count() == 0) {
            return response()->json([], 204);
        }

        foreach ($registros_trabajo->get() as $registro) {
            $tiempo_trabajado += (strtotime($registro->fin) - strtotime($registro->inicio));
        }

        $tiempo_paro = 0;
        foreach ($registros_paro->get() as $registro) {
            $tiempo_paro += (strtotime($registro->fin) - strtotime($registro->inicio));
        }

        $defectuosas = Registro_calidad::where('fecha', '>=', $desde)->where('fecha', '<', date('Y-m-d', strtotime($hasta . ' + 1 days')));
        if ($id > 0) {
            $defectuosas = $defectuosas->where('maquina_id', $id);
        }

        //Calcular unidades producidas y tiempo total trabajado 
        $fabricadas = intval($registros_trabajo->sum('piezas'));

        $operarios = $this->obtenerOIniciarOperarios($id);

        $data = [
            'fabricadas' => $fabricadas,
            'defectuosas' => $defectuosas->sum('cantidad'),
            'funcionando' => $tiempo_trabajado,
            'parado' => $tiempo_paro,
            'operarios' => $operarios,
            'rendimiento_por_operarios' => $id != 0 ? Maquina::find($id)->tipo_calculo_rendimiento == "por_operario" : false,
            'rendimiento' => $fabricadas > 0 ? round((($tiempo_trabajado + $tiempo_paro) * $operarios) / $fabricadas, 2) : 0,
        ];
        return $data;
    }

    public function getDiales($id, Request $request)
    {
        $validator = Validator::make(['id' => $id, 'desde' => $request->desde, 'hasta' => $request->hasta], [
            'id' => 'required|integer',
            'desde' => 'nullable|date|date_format:Y-m-d',
            'hasta' => 'nullable|date|date_format:Y-m-d|after_or_equal:desde',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $desde = ($request->has('desde') ? $request->desde : date('Y-m-d'));
        $hasta = ($request->has('hasta') ? $request->hasta : date('Y-m-d'));

        $registros = $this->registros($desde, $hasta, $id);

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
        $tiempo_real = $this->registros($desde, $hasta, $id)
            ->where('estado_id', 1)
            ->select(DB::Raw("sum(TIMESTAMPDIFF(SECOND, inicio, fin)) cantidad"))
            ->first()
            ->cantidad;
        if ($id > 0) {
            $tiempo_plan = 0;
            $ciclo_defecto = Maquina::find($id)->tiempo_ciclo_defecto;

            $regs_rend = $this->registros($desde, $hasta, $id)->where('estado_id', 1)->get();

            for ($i = 0; $i < count($regs_rend); $i++) {
                if (!is_null($regs_rend[$i]->orden_id)) {
                    $ciclo = $regs_rend[$i]->orden->tiempo_ciclo_teorico;
                    $tiempo_plan += $ciclo * $regs_rend[$i]->piezas;
                } else {
                    $tiempo_plan += $ciclo_defecto * $regs_rend[$i]->piezas;
                }
            }
        } else {

            $registros_trabajo = $this->registros($desde, $hasta, $id)->where('estado_id', 1)
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
        }
        $rendimiento = [
            "tiempo_real" => intval($tiempo_real),
            "tiempo_plan" => $tiempo_plan,
        ];

        //CALIDAD
        $reg_calidad = Registro_calidad::where('fecha', '>=', $desde)->where('fecha', '<', date('Y-m-d', strtotime($hasta . ' + 1 days')));
        if ($id > 0) {
            $reg_calidad = $reg_calidad->where('maquina_id', $id);
        }
        $defectuosas = $reg_calidad->sum('cantidad');

        $prev_calidad = $reg_calidad
            ->groupBy('defecto_id', 'nombre', 'color')
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

    public function getTimeline($id, Request $request)
    {
        $desde = ($request->has('desde') ? $request->desde : date('Y-m-d'));
        $hasta = ($request->has('hasta') ? $request->hasta : date('Y-m-d'));

        $registros = $this->registros($desde, $hasta, $id)->orderBy('inicio')->get();

        if ($registros->count() == 0) {
            return response()->json([], 204);
        }

        $data = [];

        foreach ($registros as $registro) {
            $data[] = [
                'nombre' => $registro->estado->nombre,
                'color' => $registro->estado->color,
                'inicio' => [
                    'hora' => intval(date('H', strtotime($registro->inicio))),
                    'minuto' => intval(date('i', strtotime($registro->inicio))),
                ],
                'fin' => [
                    'hora' => intval(date('H', strtotime($registro->fin))),
                    'minuto' => intval(date('i', strtotime($registro->fin))),
                ]
            ];
        }

        return $data;
    }

    public function getTimelineOF($id, Request $request)
    {

        $registros = Registro_actividad::where('orden_id', $id)->orderBy('inicio')->get();

        if ($registros->count() == 0) {
            return response()->json([], 204);
        }

        $data = [];

        foreach ($registros as $registro) {
            $data[] = [
                'nombre' => $registro->estado->nombre,
                'color' => $registro->estado->color,
                'inicio' => [
                    'hora' => intval(date('H', strtotime($registro->inicio))),
                    'minuto' => intval(date('i', strtotime($registro->inicio))),
                ],
                'fin' => [
                    'hora' => intval(date('H', strtotime($registro->fin))),
                    'minuto' => intval(date('i', strtotime($registro->fin))),
                ]
            ];
        }

        return $data;
    }

    public function getProductividadGeneralPorMaquinas(Request $request)
    {
        $desde = ($request->has('desde') ? $request->desde : date('Y-m-d'));
        $hasta = ($request->has('hasta') ? $request->hasta : date('Y-m-d'));

        $maquinas = Maquina::all();

        $productividad = [];
        foreach ($maquinas as $maquina) {

            $prod_maq = [];
            $registros = Registro_actividad::where('inicio', '>', $desde)
                ->where('maquina_id', $maquina->id)
                ->where('inicio', '<', date('Y-m-d', strtotime($hasta . ' + 1 days')))
                ->orderBY('inicio', 'ASC')
                ->get();

            $first = true;
            $acumulado = 0;
            $opt_acu = 0;
            foreach ($registros as $registro) {
                if ($first) {
                    array_push($prod_maq, ['datetime' => $registro->inicio, 'cantidad' => $acumulado, 'optimo' => $opt_acu]);
                    $first = false;
                }
                $acumulado += $registro->piezas;
                array_push($prod_maq, ['datetime' => $registro->fin, 'cantidad' => $acumulado, 'optimo' => $opt_acu]);
            }

            $productividad[$maquina->nombre]["productividad"] = $prod_maq;
            $productividad[$maquina->nombre]["color"] = $maquina->color;
        }

        return $productividad;
    }

    public function getProductividad($id, Request $request)
    {
        $desde = ($request->has('desde') ? $request->desde : date('Y-m-d'));
        $hasta = ($request->has('hasta') ? $request->hasta : date('Y-m-d'));

        if ($id == 0) {
            $registros = Registro_actividad::where('inicio', '>', $desde)
                ->where('inicio', '<', date('Y-m-d', strtotime($hasta . ' + 1 days')))
                ->orderBY('fin', 'ASC')
                ->get();

            $registros = $this->acumularRegistrosGeneral($registros);
        } else {
            $registros = Registro_actividad::where('inicio', '>', $desde)
                ->where('maquina_id', $id)
                ->where('inicio', '<', date('Y-m-d', strtotime($hasta . ' + 1 days')))
                ->orderBY('inicio', 'ASC')
                ->get();
        }

        if ($registros->count() == 0) {
            return response()->json([], 204);
        }

        $maquina = Maquina::find($id);

        $productividad = [];
        $first = true;
        $acumulado = 0;
        $opt_acu = 0;

        foreach ($registros as $registro) {
            if ($first) {
                array_push($productividad, ['datetime' => $registro->inicio, 'cantidad' => $acumulado, 'optimo' => $opt_acu]);
                $first = false;
            }
            $acumulado += $registro->piezas;
            if ($id != 0) {
                $opt_acu += $this->calcularProductividadTeorica($maquina, $registro->inicio, $registro->fin);
            } else {
                $opt_acu += $this->calcularProductividadTeoricaGeneral($registro->inicio, $registro->fin, $request->optimo);
            }
            array_push($productividad, ['datetime' => $registro->fin, 'cantidad' => $acumulado, 'optimo' => $opt_acu]);
        }

        $data = ['productividad' => $productividad];
        return ($data);
    }

    public function getProductividadOF($id)
    {
        $registros = Registro_actividad::where('orden_id', $id)->orderBY('inicio', 'ASC')->get();

        if ($registros->count() == 0) {
            return response()->json([], 204);
        }

        $productividad = [];
        $first = true;
        $acumulado = 0;
        foreach ($registros as $registro) {
            if ($first) {
                array_push($productividad, ['datetime' => $registro->inicio, 'cantidad' => $acumulado]);
                $first = false;
            }
            $acumulado += $registro->piezas;
            array_push($productividad, ['datetime' => $registro->fin, 'cantidad' => $acumulado]);
        }

        $data = ['productividad' => $productividad];
        return ($data);
    }

    public function getOfs($id, Request $request)
    {
        $desde = ($request->has('desde') ? $request->desde : date('Y-m-d'));
        $hasta = ($request->has('hasta') ? $request->hasta : date('Y-m-d'));

        $ofs = Orden::where('fin', '>', $desde)->where('inicio', '<', date('Y-m-d', strtotime($hasta . ' + 1 days')));
        if ($id > 0) {
            $ofs = $ofs->where('maquina_id', $id);
        }
        $ofs = $ofs->orderBy('inicio', 'ASC')->get();

        if ($ofs->count() == 0) {
            return response([], 204);
        } else return $ofs;
    }

    public function getEstado($id)
    {
        $ult_reg = Registro_actividad::where('maquina_id', $id)->orderBy('fin', 'DESC')->first();
        $max_tiempo_sin_datos = Variable::where('nombre', 'tiempo_falta_datos')->first()->valor;

        if (is_null($ult_reg)) {
            return response()->json([], 204);
        }

        if (strtotime("now") - strtotime($ult_reg->fin) > $max_tiempo_sin_datos) {
            return response()->json(['estado' => 'Sin datos', 'color' => '#ffffff'], 204);
        } else return response()->json(['estado' => $ult_reg->estado->nombre, 'color' => $ult_reg->estado->color], 200);
    }

    public function getInfoTemporizador($id)
    {
        $ult_reg = Registro_actividad::where('maquina_id', $id)->orderBy('fin', 'DESC')->first();
        $of = Orden::where('maquina_id', $id)->orderBy('inicio', 'DESC')->first();

        if (!$ult_reg) {
            return response()->json([], 204);
        }
        $ultima_pieza = $ult_reg->ultima_pieza;

        if ($of && $of->estado != 0) {
            $ciclo = $of->tiempo_ciclo_teorico;
        } else {
            $ciclo = Maquina::find($id)->tiempo_ciclo_defecto;
        }

        return response()->json(['ultima_pieza' => (strtotime("now") - strtotime($ultima_pieza)), 'ciclo' => $ciclo], 200);
    }

    public function getComentarios(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'maquina_id' => 'required|integer',
            'desde' => 'nullable|date|date_format:Y-m-d',
            'hasta' => 'nullable|date|date_format:Y-m-d|after_or_equal:desde',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $comentarios = Comentario::orderBy('fecha_hora', 'ASC');

        if ($request->maquina_id > 0) {
            $comentarios = $comentarios->where('maquina_id', $request->maquina_id);
        }

        if ($request->has("desde") && $request->has("hasta")) {
            $comentarios = $comentarios->where('fecha_hora', '>=', $request->desde)->where('fecha_hora', '<', date('Y-m-d', strtotime($request->hasta . ' + 1 days')));
        } else {
            $comentarios = $comentarios->where('fecha_hora', '>=', date('Y-m-d'))->where('fecha_hora', '<', date('Y-m-d', strtotime(date('Y-m-d') . ' + 1 days')));
        }

        return $comentarios->join('users', 'users.id', '=', 'user_id')->select('comentarios.*', 'users.name', 'users.avatar')->get();
    }

    public function postComentario(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'comentario' => 'required|string',
            'maquina_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $comentario = new Comentario();
        $comentario->comentario = $request->comentario;
        $comentario->fecha_hora = date('Y-m-d H:i:s');
        $comentario->user_id = Auth::user()->id;
        $comentario->maquina_id = $request->maquina_id;
        $comentario->save();

        return response()->json(['message' => 'Comentario creado correctamente'], 201);
    }

    public function deleteComentario($id)
    {

        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer|exists:comentarios,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $comentario = Comentario::find($id);

        if (Auth::user()->id != $comentario->user_id) {
            return response()->json(['message' => 'No tienes permiso para eliminar este comentario'], 403);
        }

        // Check if the comment's date is older than the current date
        $commentDate = new DateTime($comentario->fecha_hora);
        $currentDate = new DateTime();
        if ($commentDate < $currentDate->modify('-1 day')) {
            return response()->json(['message' => 'No es posible eliminar comentarios antiguos'], 400);
        }

        if (is_null($comentario)) {
            return response()->json(['message' => 'Comentario no encontrado'], 404);
        }
        $comentario->delete();
        return response()->json(['message' => 'Comentario eliminado correctamente'], 200);
    }

    public function editarComentario($id, Request $request)
    {
        $validator = Validator::make(['id' => $id, 'mensaje' => $request->mensaje], [
            'id' => 'required|integer|exists:comentarios,id',
            'mensaje' => 'required|string|min:1|max:1024',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $comentario = Comentario::find($id);

        if (Auth::user()->id != $comentario->user_id) {
            return response()->json(['message' => 'No tienes permiso para eliminar este comentario'], 403);
        }

        // Check if the comment's date is older than the current date
        $commentDate = new DateTime($comentario->fecha_hora);
        $currentDate = new DateTime();
        if ($commentDate < $currentDate->modify('-1 day')) {
            return response()->json(['message' => 'No es posible eliminar comentarios antiguos'], 400);
        }

        if (is_null($comentario)) {
            return response()->json(['message' => 'Comentario no encontrado'], 404);
        }

        $comentario->comentario = $request->mensaje;
        $comentario->save();

        return response()->json(['message' => 'Comentario editado correctamente'], 200);
    }

    public function getOperariosEnMaquina($id)
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer|exists:maquinas,id|exists:rendimiento_en_maquina_por_operarios,maquina_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $rendimientos = Rendimiento_en_maquina_por_operarios::where('maquina_id', $id)->get();

        $operarios = $this->obtenerOIniciarOperarios($id);

        return response()->json(['rendimientos' => $rendimientos, 'operarios' => $operarios], 200);
    }

    public function postOperariosEnMaquina($id, Request $request)
    {
        $validator = Validator::make(['id' => $id, 'operarios' => $request->operarios], [
            'id' => 'required|integer|exists:maquinas,id',
            'operarios' => 'required|integer|exists:rendimiento_en_maquina_por_operarios,numero_operarios',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        Operarios_en_maquina::where('maquina_id', $id)->where('fecha', date('Y-m-d'))->delete();

        $operarios = new Operarios_en_maquina();
        $operarios->maquina_id = $id;
        $operarios->numero_operarios = $request->operarios;
        $operarios->fecha = date('Y-m-d');
        $operarios->save();

        return response()->json(['message' => 'Operarios en máquina actualizados correctamente'], 200);
    }
}
