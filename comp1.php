<?php

public function reporte(Request $request){
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

        $registro_anterior = Registro_actividad::where('maquina_id', $request->maquina)
                            ->orderBy('fin', 'DESC')
                            ->first();
        //Toca cambiar el registro viejo
        if( 
            $registro_anterior &&                                                                            //hay registro anterior
            strtotime($request->inicio) - strtotime($registro_anterior->fin) < $gap_recepcion &&             //no ha pasado mucho desde la última toma
            strtotime($registro_anterior->fin) - strtotime($registro_anterior->inicio) < $limite_registro && //el registro anterior no es demasiado largo
            $registro_anterior->Orden_id == $of &&                                               //Tienen la misma OF
            (($registro_anterior->Estado_id == 1 && $request->piezas > 0) ||
            ($registro_anterior->Estado_id != 1 && $request->piezas == 0))                                //ambas son del mismo tipo
        ){
            //Actualizar registro anterior
            $registro_anterior->fin = $request->fin;
            if($request->piezas >0){
                $registro_anterior->piezas += $request->piezas;
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
            if($request->piezas == 0){
                if(strtotime($request->fin) - strtotime($request->inicio) < $limite_microparo){
                    $fallo = $microparo;
                }
                else{
                    $fallo = ($of==0 ? $improductivo : $paro);
                }
            }

            $registrado = Registro_actividad::create([
                'maquina_id'           => $request->maquina,
                'Estado_id'        => $fallo,
                'Orden_id' => $of,
                'inicio'               => $request->inicio,
                'fin'                  => $request->fin,
                'piezas'               => $request->piezas
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
}