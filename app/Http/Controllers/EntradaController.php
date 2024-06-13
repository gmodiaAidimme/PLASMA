<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Operarios_en_orden;
use App\Models\Registro_actividad;
use App\Models\Registro_calidad;
use App\Models\Maquina;
use App\Models\Estado;
use App\Models\Orden;
use App\Models\Defecto;
use App\Models\Empleado;
use App\Models\Variable;
use App\Models\Proyecto;

use Illuminate\Support\Facades\Validator;

class EntradaController extends Controller
{
    // ----------------------
    // Estado OF
    // 1 - Preparacion
    // 2 - Produccion
    // 3 - Pendiente calidad
    // 0 - Terminada
    // ----------------------

    public function iniciarPreparacion(Request $request)
    {
        // Validación de campos
        $validator = Validator::make($request->all(), [
            'of' => 'required',
            'maquina' => 'required|exists:maquinas,id',
            'ciclo' => 'required|numeric|min:1',
            'piezas' => 'required|numeric|min:1',
            'proyecto' => 'nullable|exists:proyectos,id',
            'empleados' => 'required|array|min:1',
            'empleados.*' => 'numeric|exists:empleados,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->all()], 400);
        }

        if (Orden::where('of', $request->of)->exists()) {
            return response()->json(['error' => 'Orden ya existe'], 400);
        }

        if ($request->proyecto) {
            $of = Orden::create([
                'of' => $request->of,
                'maquina_id' => $request->maquina,
                'tiempo_ciclo_teorico' => $request->ciclo,
                'total_piezas' => $request->piezas,
                'proyecto_id' => $request->proyecto,
                'estado' => 1,
                'inicio' => date('Y-m-d H:i:s')
            ]);
        } else {
            $of = Orden::create([
                'of' => $request->of,
                'maquina_id' => $request->maquina,
                'tiempo_ciclo_teorico' => $request->ciclo,
                'total_piezas' => $request->piezas,
                'estado' => 1,
                'inicio' => date('Y-m-d H:i:s')
            ]);
        }

        foreach ($request->empleados as $empleado) {
            Operarios_en_orden::create([
                'operario_id' => $empleado,
                'orden_id' => $of->id
            ]);
        }

        $maquina = Maquina::find($request->maquina);
        $maquina->preparacion = 1;
        $maquina->save();

        $preparacion = Estado::where('nombre', 'Preparación')->first()->id;
        $last_reg = Registro_actividad::where('maquina_id', $request->maquina)->orderBy('id', 'desc')->first();
        if ($last_reg) {
            $ultima_pieza = $last_reg->ultima_pieza;
        } else {
            $ultima_pieza = date('Y-m-d H:i:s');
        }

        Registro_actividad::create([
            'maquina_id' => $request->maquina,
            'estado_id' => $preparacion,
            'orden_id'  => $of->id,
            'inicio'    => date("Y-m-d H:i:s"),
            'fin'       => date("Y-m-d H:i:s"),
            'ultima_pieza' => $ultima_pieza,
            'piezas'    => 0
        ]);
        return response()->json(['success' => 'Orden creada correctamente'], 200);
    }

    public function finalizarProduccion(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'of' => 'required|exists:ordens,of',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $of = Orden::where('of', $request->of)->first();
        $of->estado = 3;
        $of->fin = date('Y-m-d H:i:s');

        if (Variable::where('nombre', 'modo_manual')->first()->valor) {
            $last_reg = Registro_actividad::where('orden_id', $of->id)->orderBy('id', 'desc')->first();
            Registro_actividad::create(
                [
                    'maquina_id' => $of->maquina_id,
                    'estado_id' => 1,
                    'orden_id'  => $of->id,
                    'inicio'    => $last_reg->fin,
                    'fin'       => date("Y-m-d H:i:s"),
                    'ultima_pieza' => date("Y-m-d H:i:s"),
                    'piezas'    => 0
                ]
            );
        }

        $of->save();
    }

    public function iniciarProduccion(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'of' => 'required|exists:ordens,of',
            'maquina' => 'required|exists:maquinas,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $of = Orden::where('OF', $request->of)->first();
        $of->estado = 2;
        $of->save();

        $maquina = maquina::find($request->maquina);
        $maquina->preparacion = 0;
        $maquina->save();

        $preparacion = Estado::where('nombre', 'Preparación')->first()->id;

        $registro = Registro_actividad::where('maquina_id', $request->maquina)->orderBy('fin', 'DESC')->first();

        if ($registro->estado_id != $preparacion) {
            return response()->json(['error' => 'El útimo registro no era de preparacion'], 400);
        }
        $registro->fin = date("Y-m-d H:i:s");
        $registro->save();

        return response()->json(['success' => 'Orden iniciada correctamente'], 200);
    }

    public function getEstado($maquina)
    {
        $validator = Validator::make(['maquina' => $maquina], [
            'maquina' => 'required|numeric|exists:maquinas,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $of = Orden::where('maquina_id', $maquina)->orderBy('inicio', 'DESC')->first();
        if (!$of || $of->estado == 0) {
            return response()->json([
                'estado' => 0,
                'of' => "",
                'piezas' => "",
                'ciclo' => "",
                'proyecto' => 0,
                'empleados' => [],
                'en_paro_manual' => 0
            ], 200);
        }

        $last_reg = Registro_actividad::where('orden_id', $of->id)->orderBy('inicio', 'DESC')->first();

        $empleados = Operarios_en_orden::where('orden_id', $of->id)->get();
        $empleados = $empleados->map(function ($item) {
            return $item->operario_id;
        });
        return [
            'estado' => $of->estado,
            'of' => $of->of,
            'piezas' => $of->total_piezas,
            'ciclo' => $of->tiempo_ciclo_teorico,
            'proyecto' => is_null($of->proyecto_id) ? 0 : $of->proyecto_id,
            'empleados' => $empleados,
            'en_paro_manual' => ($last_reg && $last_reg->estado_id > 4 && $last_reg->inicio == $last_reg->fin)
        ];

        return response()->json(['estado' => $of->estado], 200);
    }

    public function terminarOF(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'of' => 'required|string|exists:ordens,of'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $of = Orden::where('of', $request->of)->first();
        $of->estado = 0;
        $of->save();

        return response()->json(['success' => 'Orden terminada correctamente'], 200);
    }

    public function guardarCalidad(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'nullable|numeric|exists:ordens,id',
            'of' => 'nullable|string|exists:ordens,of',
            'reporte' => 'required|array|min:1',
            'reporte.*.piezas' => 'required|integer|min:1',
            'reporte.*.defecto' => 'required|integer|exists:defectos,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $of = $request->has('id') ? Orden::find($request->id) : Orden::where('of', $request->of)->orderBy('inicio', 'DESC')->first();

        Registro_calidad::where('orden_id', $of->id)->delete();
        foreach ($request->reporte as $rep) {

            Registro_calidad::create([
                'cantidad' => $rep['piezas'],
                'defecto_id' => $rep['defecto'],
                'maquina_id' => $of->maquina_id,
                'orden_id' => $of->id,
                'fecha' => date('Y-m-d', strtotime($of->fin))
            ]);
        }

        return response()->json(['success' => 'Orden terminada correctamente'], 200);
    }

    public function getPiezasEnOrden($of_name)
    {
        $validator = Validator::make(['of_name' => $of_name], [
            'of_name' => 'required|string|exists:ordens,of',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        $of = Orden::where('of', $of_name)->first();
        $piezas = Registro_actividad::where('orden_id', $of->id)->sum('piezas');
        return response()->json(['piezas' => $piezas], 200);
    }

    public function getPiezasEnOrdenID($of_id)
    {
        $validator = Validator::make(['of_id' => $of_id], [
            'of_id' => 'required|numeric|exists:ordens,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $of = Orden::find($of_id);
        $piezas = Registro_actividad::where('orden_id', $of->id)->sum('piezas');
        return response()->json(['piezas' => $piezas], 200);
    }

    public function justificarParo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|numeric|exists:registro_actividads,id',
            'justificacion' => 'required|numeric|exists:estados,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $paro = Registro_actividad::find($request->id);
        $paro->estado_id = $request->justificacion;
        $paro->save();
        return response()->json(['success' => 'Paro justificado correctamente'], 200);
    }

    public function parosSinJustificar($maquina_id)
    {
        $validator = Validator::make(['maquina_id' => $maquina_id], [
            'maquina_id' => 'required|numeric|exists:maquinas,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $paros = Registro_actividad::where('maquina_id', $maquina_id)->where('estado_id', 6)->get();
        $justificaciones = Estado::where('id', '>', 6)->get();
        return response()->json(['paros' => $paros, 'justificaciones' => $justificaciones], 200);
    }

    public function eliminarParos($maquina_id)
    {
        $validator = Validator::make(['maquina_id' => $maquina_id], [
            'maquina_id' => 'required|numeric|exists:maquinas,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $paros = Registro_actividad::where('maquina_id', $maquina_id)->where('estado_id', 6)->get();
        foreach ($paros as $paro) {
            $paro->estado_id = 5;
            $paro->save();
        }
        return response()->json(['success' => 'Paros eliminados correctamente'], 200);
    }

    public function getConfInicial()
    {
        $maquinas = Maquina::all();
        $empleados = Empleado::all();
        $defectos = Defecto::all();
        $modo_manual = Variable::where('nombre', 'modo_manual')->first()->valor;
        $proyectos = Proyecto::all();
        return response()->json([
            'maquinas' => $maquinas,
            'empleados' => $empleados,
            'defectos' => $defectos,
            'proyectos' => $proyectos,
            'modo_manual' => ($modo_manual == 0 ? False : True)
        ], 200);
    }

    public function iniciarParoManual(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'maquina' => 'required|numeric|exists:maquinas,id',
            'of' => 'required|string|exists:ordens,of',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $last_reg = Registro_actividad::where('maquina_id', $request->maquina)->orderBy('fin', 'DESC')->first();
        $of = Orden::where('of', $request->of)->first();

        Registro_actividad::create([
            'piezas' => 0,
            'maquina_id' => $request->maquina,
            'orden_id' => $of->id,
            'estado_id' => 1,
            'inicio' => $last_reg->fin,
            'ultima_pieza' => date('Y-m-d H:i:s'),
            'fin' => date('Y-m-d H:i:s')
        ]);

        Registro_actividad::create([
            'piezas' => 0,
            'maquina_id' => $request->maquina,
            'orden_id' => $of->id,
            'estado_id' => 6,
            'inicio' => date('Y-m-d H:i:s'),
            'ultima_pieza' => date('Y-m-d H:i:s'),
            'fin' => date('Y-m-d H:i:s')
        ]);

        return response()->json(['success' => 'Paro iniciado correctamente'], 200);
    }

    public function terminarParoManual(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'maquina' => 'required|numeric|exists:maquinas,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $last_reg = Registro_actividad::where('maquina_id', $request->maquina)->orderBy('inicio', 'DESC')->first();
        if ($last_reg && $last_reg->estado_id > 4) {
            $last_reg->fin = date('Y-m-d H:i:s');
            $last_reg->save();
            return response()->json(['success' => 'Paro terminado correctamente'], 200);
        } else {
            return response()->json(['error' => 'No existe un paro que terminar'], 400);
        }
    }

    public function terminarOFManual(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'maquina' => 'required|numeric|exists:maquinas,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        
        $of = Orden::where('maquina_id', $request->maquina)->where('estado', '!=', 0)->orderBy('inicio', 'DESC')->first();
        $of->estado = 0;
        $of->save();

        $piezas_defectuosas = intval(Registro_calidad::where('orden_id', $of->id)->sum('cantidad'));

        $piezas_totales = $of->total_piezas + $piezas_defectuosas;

        $registros_trabajo = Registro_actividad::where('orden_id', $of->id)->where("estado_id", 1)->get();

        $tiempo_total = 0;
        foreach ($registros_trabajo as $reg) {
            $inicio = strtotime($reg->inicio);
            $fin = strtotime($reg->fin);
            $tiempo_total += $fin - $inicio;
        }
        $piezas_restantes = $piezas_totales;
        for ($i = 0; $i < count($registros_trabajo); $i++) {
            //si es el ultimo, asignamos todo lo que queda
            if ($i == count($registros_trabajo) - 1) {
                $registros_trabajo[$i]->piezas = $piezas_restantes;
            } else {
                //Si no, asignamos la parte proporcional al tiempo de trabajo
                $registros_trabajo[$i]->piezas = floor($piezas_totales * (strtotime($registros_trabajo[$i]->fin) - strtotime($registros_trabajo[$i]->inicio)) / $tiempo_total);
                $piezas_restantes -= $registros_trabajo[$i]->piezas;
            }
            $registros_trabajo[$i]->save();
        }

        return response()->json(['success' => 'Orden terminada correctamente'], 200);
    }
}
