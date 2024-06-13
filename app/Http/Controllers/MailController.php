<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Mail\ElasticEmailTest;
use App\Models\Registro_actividad;
use App\Models\Registro_calidad;
use App\Models\Variable;
use App\Models\Maquina;
use App\Models\Alarma;
use App\Models\Receptor;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Mail;

use DB;
use Illuminate\Support\Facades\Log;

class MailController extends Controller
{
    private function sendAlarmEmail($alarm, $receptor){
        $curl = curl_init();

        $maquina = Maquina::find($alarm->maquina_id);
        $contenido = urlencode('<p>La siguiente alarma ha saltado:</p>
            <ul>
                <li>Máquina: ' . $maquina->nombre . '</li>
                <li>Magnitud: ' . $alarm->magnitud . '</li>
                <li>Valor: ' . $alarm->valor . '</li>
                <li>Fecha y hora: ' . $alarm->ultima_activacion . '</li>
            </ul>
            <p>Para más información, acceda a la <a href="' . env('APP_URL') . '">aplicación web</a>.</p>
            <p>Este correo ha sido generado automáticamente. Por favor, no responda.</p>');


        curl_setopt_array($curl, array(
          CURLOPT_URL => 'https://api.elasticemail.com/v2/email/send',
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'POST',
          CURLOPT_POSTFIELDS => 'apikey=' . env('ELASTIC_EMAIL_API_KEY') . '&from=' . urlencode(env('ELASTIC_EMAIL_ACCOUNT')) . '&to=' . urlencode($receptor) . '&subject=' . urlencode('Una alarma ha saldado') . '&bodyHTML=' . $contenido . '&bodyText=Una%20alarma%20ha%20saltado',
          CURLOPT_HTTPHEADER => array(
            'Content-Type: application/x-www-form-urlencoded',
            'Accept: application/json'
          ),
        ));
        
        $response = curl_exec($curl);
        curl_close($curl);
        return $response;
        
    }

    private function registros($desde, $hasta, $id)
    {
        $registros = Registro_actividad::where('inicio', '>', $desde)
            ->where('inicio', '<', date('Y-m-d', strtotime($hasta . ' + 1 days')));
        if ($id > 0) {
            $registros = $registros->where('maquina_id', $id);
        }
        return $registros;
    }

    private function get_disponibilidad($maquina_id){
        $registros = $this->registros(date('Y-m-d'), date('Y-m-d'), $maquina_id);

        if ($registros->count() == 0) {
            return 100;
        }
        
        $piezas_totales = $registros->sum('piezas');
        
        $disponibilidad = $registros->select(DB::Raw("nombre, sum(TIMESTAMPDIFF(SECOND, inicio, fin)) cantidad, color"))
            ->join('estados', 'estados.id', '=', 'estado_id')
            ->groupBy('estado_id', 'nombre', 'color')
            ->orderBy('estado_id')
            ->get();
        
        $funcionando = 0;
        $fallo = 0;
        foreach ($disponibilidad as $item) {
            
            if ($item->estado_id == 1){
                $funcionando = $item->cantidad;
            }
            else{
                $fallo = $fallo + $item->cantidad;
            }
        }

        $disponibilidad = ($funcionando / ($funcionando + $fallo)) * 100;
    }

    private function get_rendimiento($maquina_id){

        $registros = $this->registros(date('Y-m-d'), date('Y-m-d'), $maquina_id);

        if ($registros->count() == 0) {
            return 100;
        }

        $tiempo_real = $this->registros(date('Y-m-d'), date('Y-m-d'), $maquina_id)
        ->where('estado_id', 1)
        ->select(DB::Raw("sum(TIMESTAMPDIFF(SECOND, inicio, fin)) cantidad"))
        ->first()
        ->cantidad;
        if ($maquina_id > 0) {
            $tiempo_plan = 0;
            $ciclo_defecto = Maquina::find($maquina_id)->tiempo_ciclo_defecto;

            $regs_rend = $this->registros(date('Y-m-d'), date('Y-m-d'), $maquina_id)->where('estado_id', 1)->get();

            for ($i = 0; $i < count($regs_rend); $i++) {
                if (!is_null($regs_rend[$i]->orden_id)) {
                    $ciclo = $regs_rend[$i]->orden->tiempo_ciclo_teorico;
                    $tiempo_plan += $ciclo * $regs_rend[$i]->piezas;
                } else {
                    $tiempo_plan += $ciclo_defecto * $regs_rend[$i]->piezas;
                }
            }
        } else {

            $registros_trabajo = $this->registros(date('Y-m-d'), date('Y-m-d'), $maquina_id)->where('estado_id', 1)
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
        return ($tiempo_plan / $tiempo_real) * 100;
    }

    private function get_calidad($maquina_id){

        $piezas_totales = $this->registros(date('Y-m-d'), date('Y-m-d'), $maquina_id)->sum('piezas');

        if ($piezas_totales == 0) {
            return 100;
        }

        $reg_calidad = Registro_calidad::where('fecha', '>=', date('Y-m-d'))->where('fecha', '<', date('Y-m-d', strtotime(date('Y-m-d') . ' + 1 days')));
        if ($maquina_id > 0) {
            $reg_calidad = $reg_calidad->where('maquina_id', $maquina_id);
        }
        $defectuosas = $reg_calidad->sum('cantidad');

        return 100*($piezas_totales - $defectuosas) / $piezas_totales;
    }

    public function sendTestMail()
    {
        $curl = curl_init();

        $contenido = urlencode('<p>Este es un email de prueba.</p>');

        curl_setopt_array($curl, array(
          CURLOPT_URL => 'https://api.elasticemail.com/v2/email/send',
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'POST',
          CURLOPT_POSTFIELDS => 'apikey=' . env('ELASTIC_EMAIL_API_KEY') . '&from=' . urlencode(env('ELASTIC_EMAIL_ACCOUNT')) . '&to=' . urlencode('gabrielmodiapozuelo@gmail.com') . '&subject=' . urlencode('Email de prueba') . '&bodyHTML=' . $contenido . '&bodyText=Esto%20es%20un%20email%20de%20prueba.',
          CURLOPT_HTTPHEADER => array(
            'Content-Type: application/x-www-form-urlencoded',
            'Accept: application/json'
          ),
        ));
        
        $response = curl_exec($curl);
        curl_close($curl);
        return $response;
    }

    public function checkAlarms(){
        
        $receptores = Receptor::all();
        $gap = Variable::where('nombre', 'gap_alarmas')->first()->valor;
        $alarms = Alarma::all();
        $ya_calculado = [];
        $activadas = [];
        foreach($alarms as $alarm){
            if(!is_null($alarm->ultima_activacion) && Date::now()->diffInSeconds($alarm->ultima_activacion) < $gap){
                continue;
            }
            $activada = false;
            switch($alarm->magnitud){
                case 'disponibilidad':
                    if(array_key_exists($alarm->maquina_id, $ya_calculado) && array_key_exists('disp', $ya_calculado[$alarm->maquina_id])){
                        $disp = $ya_calculado[$alarm->maquina_id]['disp'];
                    }
                    else{
                        $disp = $this->get_disponibilidad($alarm->maquina_id);
                        $ya_calculado[$alarm->maquina_id]['disp'] = $disp;
                    }
                    $activada = ($alarm->valor > $disp);
                    break;
                case 'rendimiento':
                    if(array_key_exists($alarm->maquina_id, $ya_calculado) && array_key_exists('rend', $ya_calculado[$alarm->maquina_id])){
                        $rend = $ya_calculado[$alarm->maquina_id]['rend'];
                    }
                    else{
                        $rend = $this->get_rendimiento($alarm->maquina_id);
                        $ya_calculado[$alarm->maquina_id]['rend'] = $rend;
                    }
                    $activada = ($alarm->valor > $rend);
                    
                    break;
                case 'calidad':
                    if(array_key_exists($alarm->maquina_id, $ya_calculado) && array_key_exists('cal', $ya_calculado[$alarm->maquina_id])){
                        $cal = $ya_calculado[$alarm->maquina_id]['cal'];
                    }
                    else{
                        $cal = $this->get_calidad($alarm->maquina_id);
                        $ya_calculado[$alarm->maquina_id]['cal'] = $cal;
                    }
                    $activada = ($alarm->valor > $cal);
                    
                    break;
                case 'OEE':
                    if(array_key_exists($alarm->maquina_id, $ya_calculado) && array_key_exists('disp', $ya_calculado[$alarm->maquina_id])){
                        $disp = $ya_calculado[$alarm->maquina_id]['disp'];
                    }
                    else{
                        $disp = $this->get_disponibilidad($alarm->maquina_id);
                        $ya_calculado[$alarm->maquina_id]['disp'] = $disp;
                    }
                    if(array_key_exists($alarm->maquina_id, $ya_calculado) && array_key_exists('rend', $ya_calculado[$alarm->maquina_id])){
                        $rend = $ya_calculado[$alarm->maquina_id]['rend'];
                    }
                    else{
                        $rend = $this->get_rendimiento($alarm->maquina_id);
                        $ya_calculado[$alarm->maquina_id]['rend'] = $rend;
                    }
                    if(array_key_exists($alarm->maquina_id, $ya_calculado) && array_key_exists('cal', $ya_calculado[$alarm->maquina_id])){
                        $cal = $ya_calculado[$alarm->maquina_id]['cal'];
                    }
                    else{
                        $cal = $this->get_calidad($alarm->maquina_id);
                        $ya_calculado[$alarm->maquina_id]['cal'] = $cal;
                    }
                    $oee = $disp * $rend * $cal / 10000;

                    $activada = ($alarm->valor > $oee);
                    break;
                default:
                    break;
            }
            if($activada){
                $alarm->ultima_activacion = Date::now();
                $alarm->save();
                foreach($receptores as $receptor){
                    // Log::info('Enviando email a ' . $receptor->email . ' por alarma ' . $alarm->id);
                    $response = $this->sendAlarmEmail($alarm, $receptor->email);
                    // Log::info('Respuesta: ' . $response);
                }
                $activadas[] = $alarm;
            }
        }
        return $activadas;
    }
}
