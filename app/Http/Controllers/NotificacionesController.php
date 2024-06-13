<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Registro_actividad;
use DB;


class NotificacionesController extends Controller
{
    public function getNotificaciones()
    {
        //Paros
        $paros = Registro_actividad::where('estado_id', 6)
            ->groupBy('registro_actividads.maquina_id', 'abreviacion', 'ordens.of', 'orden_id')
            ->select("registro_actividads.maquina_id", "abreviacion", "of", DB::raw('count(*) as cantidad'))
            ->join('ordens', 'ordens.id', '=', 'registro_actividads.orden_id')
            ->join('maquinas', 'maquinas.id', '=', 'registro_actividads.maquina_id')
            ->get();
        
        $al_paros = [];
        $cont = 1;
        foreach($paros as $paro){
            $notif = [];
            if($paro->cantidad > 1){
                $notif['nombre'] = "Paros en " . $paro->abreviacion;
                $notif['descripcion'] = $paro->cantidad . " paros en " . $paro->of;
            }
            else{
                $notif['nombre'] = "Paro en " . $paro->abreviacion;
                $notif['descripcion'] = "Un paro en " . $paro->of;
            }
            $notif['id'] = $cont;
            $notif['accion'] = "Justificar";
            $notif['pagina'] = "/entrada/" . $paro->maquina_id;

            array_push($al_paros, $notif);
            $cont++;
        }
            
        return response()->json(['paros' => $al_paros], 200);
    }

}
