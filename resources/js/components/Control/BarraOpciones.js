import React from 'react';
import { throwToast } from '../../lib/notifications';
import axios from 'axios';

function BarraOpciones({ maquinaSeleccionada, registroActivo, productoSeleccionado, operariosSeleccionados, actualizarEstado }) {
    const handleIniciar = () => {
        if (productoSeleccionado === 0 || operariosSeleccionados.length === 0) {
            throwToast("Entrada incompleta", "Selecciona máquina, producto y operarios antes de iniciar", "warning")
        }

        axios.post("/api/control/iniciar/" + maquinaSeleccionada, {
            producto_id: productoSeleccionado,
            operarios: operariosSeleccionados
        })
        .then(response => {
            throwToast("Registro iniciado", "El registro de la máquina se ha iniciado", "success")
            actualizarEstado()
        })
        .catch(error => {
            throwToast("Error", "No se ha podido iniciar el registro, por favor, inténtalo de nuevo", "error")
            console.log(error)
        })
    }

    const handleParar = () => {
        axios.put("/api/control/parar/" + maquinaSeleccionada)
            .then(response => {
                throwToast("Registro parado", "El registro de la máquina se ha parado", "success")
                actualizarEstado()
            })
            .catch(error => {
                throwToast("Error", "No se ha podido parar el registro, por favor, inténtalo de nuevo", "error")
                console.log(error)
            })
    }


    return (
        <div className='row'>
            <div className="col-10">
                <div className="barra-opciones">
                    {maquinaSeleccionada === 0 ?
                        <span>Selecciona una máquina para empezar</span>
                        :
                        registroActivo ?
                            <span>La máquina está funcionando</span>
                            :
                            <span>La máquina no está funcionando</span>
                    }
                </div>
            </div>
            <div className="col-2">
                {registroActivo ?
                    <button 
                        className="btn btn-danger" 
                        style={{ width: "100%" }}
                        onClick={handleParar}
                    >Parar</button>
                    :
                    <button
                        className={`btn btn-success ${productoSeleccionado === 0 || operariosSeleccionados.length === 0 ? 'disabled' : ''}`}
                        style={{ width: "100%" }}
                        onClick={handleIniciar}
                    >Iniciar</button>
                }
            </div>
        </div>
    );

}

export default BarraOpciones;
