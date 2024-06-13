<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use App\Models\Maquina;
use App\Models\Producto;
use App\Models\Producto_maquina;
use App\Models\Registro_actividad;
use App\Models\Registro_control;
use App\Models\Registro_control_empleados;
use App\Models\Registro_stock;
use App\Models\Operarios_en_maquina;
use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;

class ControlController extends Controller
{
    public function getEstadoMaquina($id){
        $validation = Validator::make(['id' => $id], [
            'id' => 'required|integer|exists:maquinas,id'
        ]);

        if($validation->fails()){
            return response()->json([
                'message' => 'Maquina no válida',
                'errors' => $validation->errors()
            ], 400);
        }

        $registro_activo = Registro_control::where('maquina_id', $id)->whereNull('fin')->orderBy("inicio", "DESC")->first();
        if(!$registro_activo){
            $registros_otras_maquinas = Registro_control::whereNull('fin')
                                            ->orderBy("inicio", "DESC")
                                            ->join('registro_control_empleados', 'registro_control_empleados.registro_control_id', '=', 'registro_controls.id')
                                            ->get();
            return response()->json([
                'registro_activo' => false,
                'trabajadores_no_disponibles' => $registros_otras_maquinas,
                'message' => 'Maquina no está activa',
            ], 200);
        }
        $registro_operarios = Registro_control_empleados::where('registro_control_id', $registro_activo->id)->get();

        return response()->json([
            'registro_activo' => true,
            'producto' => $registro_activo->producto_id,
            'operarios' => $registro_operarios,
        ]);
    }

    public function getRegistroControlAbiertos(){
        $registros = Registro_control::whereNull('fin')->get();

        return response()->json([
            'registros' => $registros,
        ]);
    }

    public function getEstado(){
        $emp = Empleado::where('posicion', 'operario')->get();

        $operarios = [];
        foreach($emp as $e){
            $operarios[] = [
                'id' => $e->id,
                'nombre' => $e->nombre . ' ' . $e->apellido,
                'imagen' => $e->imagen,
            ];
        }

        return response()->json([
            'maquinas' => Maquina::all(),
            'productos' => Producto::all(),
            'producto_maquinas' => Producto_maquina::all(),
            'operarios' => $operarios,
            'registros_abiertos' => Registro_control::whereNull('fin')->get(),
            'registro_control_empleados' => Registro_control::whereNull('fin')->join('registro_control_empleados', 'registro_control_empleados.registro_control_id', '=', 'registro_controls.id')->get()
        ]);


    }

    public function pararMaquina($id){
        $validation = Validator::make(['id' => $id], [
            'id' => 'required|integer|exists:maquinas,id'
        ]);

        if($validation->fails()){
            return response()->json([
                'message' => 'Maquina no válida',
                'errors' => $validation->errors()
            ], 400);
        }

        $registro_activo = Registro_control::where('maquina_id', $id)->whereNull('fin')->orderBy("inicio", "DESC")->first();
        if(!$registro_activo){
            return response()->json([
                'message' => 'Maquina no está activa',
            ], 400);
        }

        $registro_activo->fin = date('Y-m-d H:i:s');
        $registro_activo->save();

        $piezas_fabricadas = Registro_actividad::where([
            ['maquina_id', '=', $id],
            ['inicio', '>=', $registro_activo->inicio],
            ['inicio', '<=', $registro_activo->fin],
        ])->sum('piezas');

        Registro_stock::create([
            'producto_id' => $registro_activo->producto_id,
            'usuario_id' => 1,
            'cantidad' => $piezas_fabricadas,
            'tipo' => 'Automatico',
            'fechahora' => date('Y-m-d H:i:s'),
            'registro_control_id' => $registro_activo->id,
        ]);

        Producto::where('id', $registro_activo->producto_id)->increment('stock', $piezas_fabricadas);

        return response()->json([
            'message' => 'Maquina parada',
        ], 200);
        
    }

    public function iniciarMaquina(Request $request, $id){
        $validation = Validator::make(['id' => $id, 'producto_id' => $request['producto_id'], 'operarios' => $request['operarios']], [
            'id' => 'required|integer|exists:maquinas,id',
            'producto_id' => 'required|integer|exists:productos,id',
            'operarios' => 'required|array',
            'operarios.*' => 'required|integer|exists:empleados,id',
        ]);

        if($validation->fails()){
            return response()->json([
                'message' => 'Datos no válidos',
                'errors' => $validation->errors()
            ], 400);
        }

        $registro_activo = Registro_control::where('maquina_id', $id)->whereNull('fin')->orderBy("inicio", "DESC")->first();
        if($registro_activo){
            return response()->json([
                'message' => 'Maquina ya está activa',
            ], 400);
        }

        $registro = new Registro_control();
        $registro->maquina_id = $id;
        $registro->producto_id = $request['producto_id'];
        $registro->inicio = date('Y-m-d H:i:s');
        $registro->save();

        foreach($request['operarios'] as $operario){
            $registro_operario = new Registro_control_empleados();
            $registro_operario->registro_control_id = $registro->id;
            $registro_operario->empleado_id = $operario;
            $registro_operario->save();
        }

        Operarios_en_maquina::where('maquina_id', $id)->where('fecha', date('Y-m-d'))->delete();

        $operarios = new Operarios_en_maquina();
        $operarios->maquina_id = $id;
        $operarios->numero_operarios = count($request['operarios']);
        $operarios->fecha = date('Y-m-d');
        $operarios->save();

        return response()->json([
            'message' => 'Maquina iniciada',
        ], 200);
    }

    public function getRegistros(Request $request){
        $validation = Validator::make($request->all(), [
            'maquina_id' => 'required|integer',
            'inicio' => 'nullable|date',
            'fin' => 'nullable|date',
        ]);

        if($validation->fails()){
            return response()->json([
                'message' => 'Datos no válidos',
                'errors' => $validation->errors()
            ], 400);
        }
        if($request['maquina_id'] != 0){
            $registros = Registro_control::where('maquina_id', $request['maquina_id']);
        }
        else{
            $registros = Registro_control::whereNotNull('inicio');
        }

        if($request['inicio'] && $request['fin']){
            $registros = $registros->where('inicio', '>=', $request['inicio'])->where('inicio', '<', $request['fin']);
        }
        else{
            $registros = $registros->where('inicio', '>=', date('Y-m-d'));
        }
        

        $registros = $registros->join('productos', 'productos.id', '=', 'registro_controls.producto_id')
                                ->select('registro_controls.*', 'productos.nombre as producto', 'productos.imagen as imagen_producto', 'productos.id as producto_id')
                                ->orderBy('inicio', 'DESC');

        $registros = $registros->get();

        foreach($registros as $registro){
            $registro->operarios = Registro_control_empleados::where('registro_control_id', $registro->id)
                                    ->join('empleados', 'empleados.id', '=', 'registro_control_empleados.empleado_id')
                                    ->select('empleados.id', 'empleados.nombre', 'empleados.apellido', 'empleados.imagen')
                                    ->get();
            $registro->piezas_fabricadas = Registro_actividad::where([
                ['maquina_id', '=', $request['maquina_id']],
                ['inicio', '>=', $registro->inicio],
                ['inicio', '<=', $registro->fin],
            ])->sum('piezas');
        }



        return response()->json([
            'registros' => $registros,
        ]);

    }

}


