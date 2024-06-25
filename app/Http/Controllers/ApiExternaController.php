<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Registro_actividad;
use App\Models\Maquina;
use App\Models\Estado;
use App\Models\Horario;
use App\Models\Parada;
use App\Models\Orden;
use App\Models\Presencia;
use App\Models\Producto;
use App\Models\Registro_stock;
use App\Models\Variable;
use App\Models\User;

use Illuminate\Support\Facades\Validator;

class ApiExternaController extends Controller
{
    //FUNCIONES PRIVADAS
    private function get_of($maquina)
    {
        $reg_of = Orden::where('maquina_id', $maquina)
            ->whereNull('fin')
            ->orderBy('inicio', 'DESC')
            ->first();
        if ($reg_of) {
            $of = $reg_of->id;
        } else {
            $of = null;
        }
        return $of;
    }

    private function enHorario($inicio)
    {
        $horario = Horario::where('dia', (date('w') + 6) % 7)->get();
        if ($horario->count() == 0) {
            return true;
        }
        foreach ($horario as $turno) {
            if (date('H:i:s', strtotime($inicio)) > $turno->hora_inicio && date('H:i:s', strtotime($inicio)) < $turno->hora_fin) {
                return true;
            }
        }
        return false;
    }

    private function fueraDeParada($inicio)
    {
        $paradas = Parada::all();
        $timeToCheck = date('H:i:s', strtotime($inicio));

        foreach ($paradas as $parada) {
            if (($timeToCheck > $parada->inicio) && ($timeToCheck < $parada->fin)){
                return false;
            }
        }
        return true;
    }

    private function noPreparacion($maquina_id)
    {
        $maquina = Maquina::find($maquina_id);
        return ($maquina->preparacion != 1);
    }

    private function turnoActual($inicio){
        $horario = Horario::where('dia', (date('w') + 6) % 7)->get();
        if ($horario->count() == 0) {
            return ['id' => 0, 'dia' => (date('w') + 6) % 7, 'hora_inicio'=> '00:00:00', 'hora_fin' => '23:59:59'];
        }
        foreach ($horario as $turno) {
            if (date('H:i:s', strtotime($inicio)) > $turno->hora_inicio && date('H:i:s', strtotime($inicio)) < $turno->hora_fin) {
                return $turno;
            }
        }
        return null;
    }

    //FUNCIONES PUBLICAS
    public function start_of(Request $request)
    {
        /*
                request = [
                    of - of que se desea iniciar
                    user_id - id del usuario responsable
                    maquina_id - id maquina asociada a la of
                    tciclo_teorico - tiempo de ciclo teorico en segundos
                    total_piezas - total de piezas planificadas
                    piezas_reales - piezas reales fabricadas
                    estado - estado de la of
                    paros_automaticos - valor de los paros automáticos para la of
                    inicio - fecha hora de inicio
                ]
            */
        $of_preexistente = Orden::where('OF', $request->of)->first();
        if (!$of_preexistente) {
            Orden::create([
                'OF'                       => $request->of,
                'user_id'                  => $request->user_id,
                'maquina_id'               => $request->maquina_id,
                'tiempo_ciclo_teorico'     => $request->tciclo_teorico,
                'total_piezas'             => $request->total_piezas,
                'piezas_reales'            => $request->piezas_reales,
                'estado'                   => $request->estado,
                'paros_automaticos'        => $request->paros_automaticos,
                'inicio'                   => $request->inicio,
            ]);
        } else {
            $of_preexistente->total_piezas += $request->total_piezas;
            $of_preexistente->save();
        }
    }

    public function end_of(Request $request)
    {
        /*
            request = [
                of - of que se desea iniciar
                user_id - id del usuario responsable
                maquina_id - id maquina asociada a la of
                tciclo_teorico - tiempo de ciclo teorico en segundos
                total_piezas - total de piezas planificadas
                piezas_reales - piezas reales fabricadas
                estado - estado de la of
                paros_automaticos - valor de los paros automáticos para la of
                inicio - fecha hora de inicio
    
                fin - datetime de finalizacion
            ]
            */
        $of_preexistente = Orden::where('OF', $request->of)->first();
        if (!$of_preexistente) {
            Orden::create([
                'OF'                       => $request->of,
                'user_id'                  => $request->user_id,
                'maquina_id'               => $request->maquina_id,
                'tiempo_ciclo_teorico'     => $request->tciclo_teorico,
                'total_piezas'             => 0,
                'piezas_reales'            => $request->piezas_reales,
                'estado'                   => $request->estado,
                'paros_automaticos'        => $request->paros_automaticos,
                'inicio'                   => $request->inicio,
                'fin'                      => $request->fin
            ]);
        } else {
            $of_preexistente->fin = $request->fin;
            $of_preexistente->save();
        }
    }

    public function reporte(Request $request)
    {
        /*
            request = [
                maquina - maquina de la que se informa (id)
                piezas  - cantidad de piezas a incluir
                inicio  - datetime de inicio de toma de datos
                fin     - datetime de fin de toma de datos
                orf     - (opcional) orden de fabricación a la que asignarlo, 
                          si no se explicita, se asigna a la que esté funcionando en ese momento
            ]
            */
        //Los reportes en estos momentos no se guardan

        $validator = Validator::make($request->all(), [
            'maquina' => 'required|exists:maquinas,id', 
            'piezas' => 'required|integer',
            'inicio' => 'required|date_format:Y-m-d H:i:s',
            'fin' => 'required|date_format:Y-m-d H:i:s|after:inicio',
            'orf' => 'nullable|exists:ordens,OF'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $modo_autoencendido = Variable::where('nombre','modo_autoencendido')->first();

        // Comprobar en que turno estamos, si estamos fuera de turno devuelve error
        $turno =$this->turnoActual($request->inicio);

        if(is_null($turno)){
            return response()->json(['resultado' => 'Ningun registro creado', 'motivo' => 'Lectura fuera de horario'], 400);
        }

        if($modo_autoencendido){
            //Comprobar si hay valores en ese turno
            $fechahora_inicio_turno = date('Y-m-d H:i:s', strtotime(explode(" ", $request->inicio)[0] . ' ' . $turno->hora_inicio));
            $fechahora_fin_turno = date('Y-m-d H:i:s', strtotime(explode(" ", $request->inicio)[0] . ' ' . $turno->hora_fin));
            $num_reg = Registro_actividad::where('maquina_id', $request->maquina)
                ->where('inicio', '>=', $fechahora_inicio_turno)
                ->where('fin', '<=', $fechahora_fin_turno)
                ->count();
            
            //Si no hubiera, y la peticion tiene las piezas a cero, enviar error
            if($num_reg == 0 && $request->piezas == 0){
                return response()->json(['resultado' => 'Ningun registro creado', 'motivo' => 'Modo autoencendido y no se han creado aún registros con piezas'], 400);
            }
        }

        // if (!$this->enHorario($request->inicio)) {
        //     return response()->json(['resultado' => 'Ningun registro creado', 'motivo' => 'Lectura fuera de horario'], 400);
        // }
        if (!$this->fueraDeParada($request->inicio)) {
            return response()->json(['resultado' => 'Ningun registro creado', 'motivo' => 'Lectura en parada programada'], 400);
        }
        if (Maquina::find($request->maquina)->preparacion == 1) {
            return response()->json(['resultado' => 'Ningun registro creado', 'motivo' => 'Máquina en preparacion'], 400);
        }

        $gap_recepcion    = (int)Variable::where('nombre', 'tiempo_falta_datos')->first()->valor;
        $limite_registro  = (int)Variable::where('nombre', 'limite_registro')->first()->valor;
        $limite_microparo = (int)Variable::where('nombre', 'limite_microparo')->first()->valor;

        $microparo    = Estado::where('nombre', 'Microparo')->first()->id;
        $paro         = 6;
        $improductivo = Estado::where('nombre', 'Paro fuera OF')->first()->id;

        if ($request->has('orf')) {
            $of = Orden::where('OF', $request->orf)->first()->id;
        } else {
            $of = $this->get_of($request->maquina);
        }

        $registro_anterior = Registro_actividad::where('maquina_id', $request->maquina)
            ->orderBy('fin', 'DESC')
            ->first();
        //Toca cambiar el registro viejo
        if (
            $registro_anterior &&                                                                            //hay registro anterior
            strtotime($request->inicio) - strtotime($registro_anterior->fin) < $gap_recepcion &&             //no ha pasado mucho desde la última toma
            strtotime($registro_anterior->fin) - strtotime($registro_anterior->inicio) < $limite_registro && //el registro anterior no es demasiado largo
            $registro_anterior->orden_id == $of &&                                                           //Tienen la misma OF
            (($registro_anterior->estado_id == 1 && $request->piezas > 0) ||
                ($registro_anterior->estado_id != 1 && $request->piezas == 0))                                //ambas son del mismo tipo
        ) {
            //Actualizar registro anterior
            $registro_anterior->fin = $request->fin;
            if ($request->piezas > 0) {
                $registro_anterior->piezas += $request->piezas;
            } else {
                //Cambiar microparo a lo que toque
                if ($registro_anterior->estado_id == $microparo && (strtotime($registro_anterior->fin) - strtotime($registro_anterior->inicio)) > $limite_microparo) {
                    if ($of == 0) {
                        $registro_anterior->estado_id = $improductivo;
                    } else {
                        $registro_anterior->estado_id =  $paro;
                    }
                }
            }
            $registro_anterior->save();
            return response()->json(['resultado' => 'Registro anterior actualizado'], 200);
        }

        //Toca registro nuevo
        $estado = 1; //Funcionando
        if ($request->piezas == 0) {
            if (strtotime($request->fin) - strtotime($request->inicio) < $limite_microparo) {
                $estado = $microparo;
            } else {
                $estado = ($of == 0 ? $improductivo : $paro);
            }
        }

        Registro_actividad::create([
            'maquina_id' => $request->maquina,
            'estado_id' => $estado,
            'orden_id'  => $of,
            'inicio'    => $request->inicio,
            'fin'       => $request->fin,
            'piezas'    => $request->piezas
        ]);
        return response()->json(['resultado' => 'Registro nuevo creado'], 200);
    }

    public function reporte_maquina(Request $request)
    {
        /*
          request = [
              maquina - maquina de la que se informa (id)
              piezas  - cantidad de piezas a incluir
              inicio  - datetime de inicio de toma de datos
              fin     - datetime de fin de toma de datos
              orf     - (opcional) orden de fabricación a la que asignarlo, 
                        si no se explicita, se asigna a la que esté funcionando en ese momento
          ]
          */
        //Los reportes en estos momentos no se guardan
        if ($this->enHorario($request->inicio) && $this->fueraDeParada($request->inicio) && $this->noPreparacion($request->maquina)) {
            $gap_recepcion    = (int)Variable::where('nombre', 'tiempo_falta_datos')->first()->valor;
            $limite_registro  = (int)Variable::where('nombre', 'limite_registro')->first()->valor;
            $limite_microparo = (int)Variable::where('nombre', 'limite_microparo')->first()->valor;

            $microparo    = Estado::where('nombre', 'Microparo')->first()->id;
            $paro         = Estado::where('nombre', 'Paro no justificado')->first()->id;
            $improductivo = Estado::where('nombre', 'Tiempo improductivo')->first()->id;

            if ($request->has('orf')) {
                $of = Orden::where('OF', $request->orf)->first()->id;
            } else {
                $of = $this->get_of($request->maquina);
            }

            $maq = Maquina::find($request->maquina);

            $registro_anterior = Registro_actividad::where('maquina_id', $request->maquina)
                ->orderBy('fin', 'DESC')
                ->first();

            //Toca actualizar el registro anterior
            if ($registro_anterior) {
                $t_gap          = strtotime($request->inicio) - strtotime($registro_anterior->fin);            //Tiempo entre el fin del registro anterior y el incio del nuevo
                $t_reg_anterior = strtotime($registro_anterior->fin) - strtotime($registro_anterior->inicio);  //Longitud del registro anterior
            }
            if (
                $registro_anterior &&                                                      //Hay registro anterior
                $t_gap < $gap_recepcion &&                                                 //No ha pasado mucho desde la última toma
                $t_reg_anterior < $limite_registro &&                                      //El registro anterior no es demasiado largo
                $registro_anterior->Orden_id == $of &&                         //Tienen la misma OF
                (
                    ($registro_anterior->Estado_id == 1 && $request->piezas > 0) ||      //Los dos son registros de funcionamiento
                    ($registro_anterior->Estado_id != 1 && $request->piezas == 0) ||     //Los dos son registros de paro
                    ($registro_anterior->Estado_id == 1 &&                              //El registro anterior es funcionamiento
                        strtotime($request->fin) - strtotime($registro_anterior->ultima_pieza) < 1.1 * ($maq->tiempo_ciclo_defecto)                           //No se excede en un 10% el tiempo de ciclo teorico
                    )
                )
            ) {
                //Actualizar registro anterior
                $registro_anterior->fin = $request->fin;
                if ($request->piezas > 0) {
                    $registro_anterior->piezas += $request->piezas;
                    $registro_anterior->ultima_pieza = $request->inicio;
                } else {
                    //Cambiar microparo a lo que toque
                    if ($registro_anterior->Estado_id == $microparo && (strtotime($registro_anterior->fin) - strtotime($registro_anterior->inicio)) > $limite_microparo) {
                        if ($of == 0) {
                            $registro_anterior->Estado_id = $improductivo;
                        } else {
                            $registro_anterior->Estado_id =  $paro;
                        }
                    }
                }
                $registro_anterior->save();
            } else {
                //Toca registro nuevo
                $fallo = 1;
                $ultima_pieza = null;
                if ($request->piezas == 0) {
                    if ($registro_anterior && $registro_anterior->estado == 1 && strtotime($request->fin) - strtotime($registro_anterior->ultima_pieza) < 1.1 * ($maq->tiempo_ciclo_defecto)) {
                        $ultima_pieza = $registro_anterior->ultima_pieza;
                    } else {
                        if (strtotime($request->fin) - strtotime($request->inicio) < $limite_microparo) {
                            $fallo = $microparo;
                        } else {
                            $fallo = ($of == 0 ? $improductivo : $paro);
                        }
                    }
                } else {
                    $ultima_pieza = $request->inicio;
                }

                $registrado = Registro_actividad::create([
                    'maquina_id'           => $request->maquina,
                    'Estado_id'        => $fallo,
                    'Orden_id' => $of,
                    'inicio'               => $request->inicio,
                    'fin'                  => $request->fin,
                    'piezas'               => $request->piezas,
                    'ultima_pieza'         => $ultima_pieza
                ]);
            }
            return ['resultado' => 'actualizacion correcta'];
        }
        return ['resultado' => 'fuera de horario'];
    }

    public function reporte_f(Request $request)
    {
        /*
            Hace lo mismo que reporte pero para una máquina que indique el funcionamiento en una variable a parte
    
            request = [
                maquina     - maquina de la que se informa (id)
                piezas      - cantidad de piezas a incluir
                inicio      - datetime de inicio de toma de datos
                fin         - datetime de fin de toma de datos
                funcionando - 1 si la maquina esta funcionando, 0 en caso contrario
                orf         - (opcional) orden de fabricación a la que asignarlo, 
                               si no se explicita, se asigna a la que esté funcionando en ese momento
            ]
            */
        //Los reportes en estos momentos no se guardan

        $validator = Validator::make($request->all(), [
            'maquina' => 'required|exists:maquinas,id',
            'piezas' => 'required|integer',
            'inicio' => 'required|date_format:Y-m-d H:i:s',
            'fin' => 'required|date_format:Y-m-d H:i:s|after:inicio',
            'funcionando' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        if (!$this->enHorario($request->inicio)) {
            return response()->json(['resultado' => 'Ningun registro creado', 'motivo' => 'Lectura fuera de horario'], 400);
        }
        if (!$this->fueraDeParada($request->inicio)) {
            return response()->json(['resultado' => 'Ningun registro creado', 'motivo' => 'Lectura en parada programada'], 400);
        }
        if (Maquina::find($request->maquina)->preparacion == 1) {
            return response()->json(['resultado' => 'Ningun registro creado', 'motivo' => 'Máquina en preparacion'], 400);
        }

        $gap_recepcion    = (int)Variable::where('nombre', 'tiempo_falta_datos')->first()->valor;
        $limite_registro  = (int)Variable::where('nombre', 'limite_registro')->first()->valor;
        $limite_microparo = (int)Variable::where('nombre', 'limite_microparo')->first()->valor;

        $microparo    = Estado::where('nombre', 'Microparo')->first()->id;
        $paro         = 6;
        $improductivo = Estado::where('nombre', 'Paro fuera OF')->first()->id;

        if ($request->has('orf')) {
            $of = Orden::where('OF', $request->orf)->first()->id;
        } else {
            $of = $this->get_of($request->maquina);
        }

        $registro_anterior = Registro_actividad::where('maquina_id', $request->maquina)
            ->orderBy('fin', 'DESC')
            ->first();

        //Toca cambiar el registro viejo
        if (
            $registro_anterior &&                                                                            //hay registro anterior
            strtotime($request->inicio) - strtotime($registro_anterior->fin) < $gap_recepcion &&             //no ha pasado mucho desde la última toma
            strtotime($registro_anterior->fin) - strtotime($registro_anterior->inicio) < $limite_registro && //el registro anterior no es demasiado largo
            $registro_anterior->orden_id == $of &&                                                           //Tienen la misma OF
            (($registro_anterior->estado_id == 1 && $request->funcionando == 1) ||
                ($registro_anterior->estado_id != 1 && $request->funcionando == 0))                              //ambas son del mismo tipo
        ) {
            //Actualizar registro anterior
            $registro_anterior->fin = $request->fin;
            if ($registro_anterior->estado_id == 1) {
                $registro_anterior->piezas += $request->piezas;
                $registro_anterior->ultima_pieza = $request->fin;
            }
            if ($request->funcionando == 0) {
                //Cambiar microparo a lo que toque
                if ($registro_anterior->estado_id == $microparo && (strtotime($registro_anterior->fin) - strtotime($registro_anterior->inicio)) > $limite_microparo) {
                    if ($of == 0) {
                        $registro_anterior->estado_id = $improductivo;
                    } else {
                        $registro_anterior->estado_id =  $paro;
                    }
                }
            }
            $registro_anterior->save();
            return response()->json(['resultado' => 'Registro anterior actualizado'], 200);
        } else {
            //Toca registro nuevo
            $fallo = 1; //Funcionando
            if ($request->funcionando == 0) {
                if (strtotime($request->fin) - strtotime($request->inicio) < $limite_microparo) {
                    $fallo = $microparo;
                } else {
                    $fallo = ($of == 0 ? $improductivo : $paro);
                }
            }

            Registro_actividad::create([
                'maquina_id' => $request->maquina,
                'estado_id'  => $fallo,
                'orden_id'   => $of,
                'inicio'     => $request->inicio,
                'fin'        => $request->fin,
                'piezas'     => $request->funcionando == 1 ? $request->piezas : 0,
                'ultima_pieza' => $request->piezas > 0 || !$registro_anterior ? $request->fin : $registro_anterior->ultima_pieza
            ]);
            return response()->json(['resultado' => 'Registro nuevo creado'], 200);
        }
        return response()->json(['resultado' => 'Error al crear registro'], 500);
    }

    public function consultar_stock(){
        $productos = Producto::select('id', 'nombre', 'stock')->get();
        return response()->json($productos, 200);
    }

    public function modificar_stock(Request $request){
        $validator = Validator::make($request->all(), [
            'producto_id' => 'required|exists:productos,id',
            'stock' => 'required|integer',
            'notas' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user_id = User::where('api_key', $request->header('API-Key'))->first()->id;
        
        Registro_stock::create([
            'producto_id' => $request->producto_id,
            'usuario_id' => $user_id,
            'cantidad' => $request->stock,
            'fechahora' => date('Y-m-d H:i:s'),
            'tipo' => 'API',
            'notas' => $request->notas ? $request->notas : ''
        ]);
        
        $producto = Producto::find($request->producto_id);
        $producto->stock = $producto->stock + $request->stock;
        $producto->save();
        return response()->json(['resultado' => 'Stock modificado'], 200);
    }

    public function consultar_movimientos_stock(Request $request){
        $validator = Validator::make($request->all(), [
            'inicio' => 'required|date_format:Y-m-d',
            'fin' => 'required|date_format:Y-m-d',
            'producto_id' => 'nullable|exists:productos,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $movimientos = Registro_stock::select('id', 'producto_id', 'usuario_id', 'cantidad', 'fechahora', 'tipo', 'notas')
            ->where('fechaHora', '>=', $request->inicio)
            ->where('fechaHora', '<=', date('Y-m-d', strtotime($request->fin . ' +1 day')));

        if ($request->has('producto_id')) {
            $movimientos = $movimientos->where('producto_id', $request->producto_id);
        }

        $movimientos = $movimientos->get();

        return response()->json($movimientos, 200);
    }

    public function set_stock_erp(Request $request){
        $validator = Validator::make($request->all(), [
            'stock_productos' => 'required|array',
            'stock_productos.*.producto_id' => 'required|exists:productos,id',
            'stock_productos.*.stock' => 'required|integer'
        ]);
            
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
 
        foreach ($request->stock_productos as $producto) {
            $producto_nuevo = Producto::find($producto['producto_id']);
            $producto_nuevo->stock_erp = $producto['stock'];
            $producto_nuevo->save();
        }

        return response()->json(['resultado' => 'Stock modificado'], 200);
    }

    public function registrar_presencia(Request $request){
        $validator = Validator::make($request->all(), [
            'operario_id' => 'required|exists:empleados,id',
            'motivo_id' => 'required|exists:motivos_presencia,id'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        Presencia::create([
            'operario_id' => $request->operario_id,
            'motivo_id' => $request->motivo_id,
            'fechahora' => date('Y-m-d H:i:s')
        ]);
    }
}
