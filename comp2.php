<?php

public function reporte_maquina(Request $request){
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
    if( $this->enHorario($request->inicio) && $this->fueraDeParada($request->inicio) && $this->noPreparacion($request->maquina)){
        $gap_recepcion    = (int)Variable_propia::where('nombre', 'tiempo_falta_datos')->first()->valor;
        $limite_registro  = (int)Variable_propia::where('nombre', 'limite_registro'   )->first()->valor;
        $limite_microparo = (int)Variable_propia::where('nombre', 'limite_microparo'  )->first()->valor; 

        $microparo    = Estado::where('nombre','Microparo'          )->first()->id;
        $paro         = Estado::where('nombre','Paro no justificado')->first()->id;
        $improductivo = Estado::where('nombre','Tiempo improductivo')->first()->id;

        if ($request->has('orf')){
            $of = Orden::where('OF', $request->orf)->first()->id;
        }
        else{
            $of = $this->get_of($request->maquina);
        }

        $maq = Maquina::find($request->maquina);

        $registro_anterior = Registro_actividad::where('maquina_id', $request->maquina)
                            ->orderBy('fin', 'DESC')
                            ->first();

        //Toca actualizar el registro anterior
        if ($registro_anterior){
        $t_gap          = strtotime($request->inicio) - strtotime($registro_anterior->fin);            //Tiempo entre el fin del registro anterior y el incio del nuevo
        $t_reg_anterior = strtotime($registro_anterior->fin) - strtotime($registro_anterior->inicio);  //Longitud del registro anterior
        }
        if( 
            $registro_anterior &&                                                      //Hay registro anterior
            $t_gap < $gap_recepcion &&                                                 //No ha pasado mucho desde la última toma
            $t_reg_anterior < $limite_registro &&                                      //El registro anterior no es demasiado largo
            $registro_anterior->Orden_id == $of &&                         //Tienen la misma OF
            (
            ($registro_anterior->Estado_id == 1 && $request->piezas > 0) ||      //Los dos son registros de funcionamiento
            ($registro_anterior->Estado_id != 1 && $request->piezas == 0) ||     //Los dos son registros de paro
            (
                $registro_anterior->Estado_id == 1 &&                              //El registro anterior es funcionamiento
                strtotime($request->fin)-strtotime($registro_anterior->ultima_pieza) < 1.1*($maq->tiempo_ciclo_defecto)                           //No se excede en un 10% el tiempo de ciclo teorico
            )
            )                                
        ){
            //Actualizar registro anterior
            $registro_anterior->fin = $request->fin;
            if($request->piezas >0){
                $registro_anterior->piezas += $request->piezas;
                $registro_anterior->ultima_pieza = $request->inicio;
            }
            else{
                //Cambiar microparo a lo que toque
                if($registro_anterior->Estado_id == $microparo && (strtotime($registro_anterior->fin) - strtotime($registro_anterior->inicio)) > $limite_microparo){
                    if($of == 0){
                        $registro_anterior->Estado_id = $improductivo;
                    }
                    else{                            
                        $registro_anterior->Estado_id =  $paro;
                        Paros_no_justificados::create([
                            'paro_id' => $registro_anterior->id, 
                            'email_enviado' => 0
                        ]);}
                }
            }
            $registro_anterior->save();
        }
        else{
            //Toca registro nuevo
            $fallo = 1;
            $ultima_pieza = null;
            if($request->piezas == 0){
            if($registro_anterior && $registro_anterior->estado == 1 && strtotime($request->fin)-strtotime($registro_anterior->ultima_pieza) < 1.1*($maq->tiempo_ciclo_defecto)){
                $ultima_pieza = $registro_anterior->ultima_pieza;
            }
            else{
                if(strtotime($request->fin) - strtotime($request->inicio) < $limite_microparo){
                    $fallo = $microparo;
                }
                else{
                    $fallo = ($of==0 ? $improductivo : $paro);
                }
            }
            }
            else{
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
            if ($fallo == $paro){
                Paros_no_justificados::create([
                    'paro_id' => $registrado->id, 
                    'email_enviado' => 0
                ]);
            }
        }
        return ['resultado' => 'actualizacion correcta'];
    }
    return ['resultado' => 'fuera de horario'];
}