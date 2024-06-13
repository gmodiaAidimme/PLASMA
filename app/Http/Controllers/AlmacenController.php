<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Producto;
use Illuminate\Support\Facades\Validator;
use App\Models\Registro_stock;
use Illuminate\Support\Facades\Auth;

class AlmacenController extends Controller
{
    public function getStock(){
        $productos = Producto::all();

        return response()->json([
            'productos' => $productos,
        ]);
    }

    public function getInfoProducto($id, Request $request){
        $producto = Producto::find($id);
        $dia_siguiente = date('Y-m-d', strtotime($request->fin . ' + 1 days'));
        $registro = Registro_stock::where('producto_id', $id)
                    ->join('users', 'users.id', '=', 'registro_stocks.usuario_id')
                    ->where('fechahora', '>=', $request->inicio)
                    ->where('fechahora', '<=', $dia_siguiente)
                    ->select('registro_stocks.*', 'users.name', 'users.id')
                    ->orderBy('fechahora', 'desc')
                    ->get();

        return response()->json([
            'producto' => $producto,
            'registro' => $registro,
        ]);
    }

    public function postEntradaManual(Request $request){
        $validator = Validator::make($request->all(), [
            'producto_id' => 'required|numeric',
            'cantidad' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user_id = Auth::user()->id;

        $producto = Producto::find($request->producto_id);
        $producto->stock = $producto->stock + $request->cantidad;

        $registro = new Registro_stock();
        $registro->producto_id = $request->producto_id;
        $registro->usuario_id = $user_id;
        $registro->cantidad = $request->cantidad;
        $registro->tipo = 'Manual';
        $registro->notas = $request->notas;
        $registro->fechahora = date('Y-m-d H:i:s');


        $registro->save();
        $producto->save();
        
        return response()->json([
            'producto' => $producto,
            'registro' => Registro_stock::where('producto_id', $request->producto_id)
                            ->join('users', 'users.id', '=', 'registro_stocks.usuario_id')
                            ->select('registro_stocks.*', 'users.name', 'users.id')
                            ->orderBy('fechahora', 'desc')
                            ->get(),
        ]);
    }
    
}
