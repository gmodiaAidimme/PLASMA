<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Registro_actividad;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\Maquina;

class HistoricoController extends Controller
{
    public function getFechasDisponibles($maquina_id){

        $maquinas = Maquina::select('id')->get()->pluck('id')->toArray();
        array_push($maquinas, 0);
        
        $validator = Validator::make(['maquina_id' => $maquina_id], [
            'maquina_id' => [
                'required',
                'numeric',
                // maquina_id must be 0 or exist in the maquinas table
                Rule::in($maquinas)
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Obtener las fechas disponibles para la maquina del campo inicio casteado a date
        if ($maquina_id == 0) {
            $fechas_disponibles = Registro_actividad::selectRaw('DATE(inicio) as fecha')
            ->groupBy('fecha')
            ->get();
        } else {
            $fechas_disponibles = Registro_actividad::where('maquina_id', $maquina_id)
            ->selectRaw('DATE(inicio) as fecha')
            ->groupBy('fecha')
            ->get();
        }
        
        return $fechas_disponibles;
    }
}
