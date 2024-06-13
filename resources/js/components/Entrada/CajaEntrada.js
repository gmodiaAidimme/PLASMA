import React, { useEffect, useRef } from 'react'
import PanelEjecucion from "./PanelEjecucion";
import { Caja } from "../generales";
import Loader from '../Comun/Loader';
import ModalEmpleados from "./ModalEmpleados";
import ModalCalidad from "./ModalCalidad";
import ModalParos from "./Paros";
import Swal from 'sweetalert2';

var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

function InputDatos(props) {
    return (
        <div className="form-group">
            <label>{props.titulo}</label>
            <input type={props.tipo}
                className="form-control"
                placeholder={props.placeholder}
                value={props.elem}
                onChange={props.onChange}
                disabled={props.activado}
            />
        </div>
    )
}

function DatosOF(props) {

    // return (
    //     <>
    //         <InputDatos tipo="text" titulo="Orden de fabricación" elem={props.state.of} onChange={(e) => props.dispatch({ type: 'SET', payload: { key: "of", value: e.target.value } })} placeholder="Introduzca OF" activado={props.state.estado != 0} />
    //         <InputDatos tipo="number" titulo="Piezas a fabricar" elem={props.state.piezas} onChange={(e) => props.dispatch({ type: 'SET', payload: { key: "piezas", value: e.target.value } })} placeholder="Introduzca piezas" activado={props.state.estado != 0} />
    //         <InputDatos tipo="number" titulo="Tiempo de ciclo teórico" elem={props.state.ciclo} onChange={(e) => props.dispatch({ type: 'SET', payload: { key: "ciclo", value: e.target.value } })} placeholder="Introduzca ciclo" activado={props.state.estado != 0} />
    //         <div className="form-group">
    //             <label htmlFor="select_proyecto">Proyecto</label>
    //             <select className="form-control" id="select_proyecto" value={props.state.proyecto} onChange={(e) => props.dispatch({ type: 'SET', payload: { key: "proyecto", value: e.target.value } })} disabled={props.state.estado != 0}>
    //                 <option value="0">Sin proyecto asignado</option>
    //                 {props.state.proyectos.map((proyecto, index) => {
    //                     return <option key={index} value={proyecto.id}>{proyecto.nombre}</option>
    //                 })}
    //             </select>
    //         </div>
    //     </>
    // )

    return (
        <div className="form-group">
            <label htmlFor="select_proyecto">Orden de fabricación</label>
            <select className="form-select" aria-label="Default select example">
                <option selected>Selecciona OF</option>
                <option value="option1">OF0001 - 3pz - Producto10 - 92s - ProyectoA</option>
                <option value="option2">OF0002 - 72pz - Producto5 - 91s</option>
                <option value="option3">OF0003 - 54pz - Producto5 - 85s - ProyectoB</option>
                <option value="option3">OF0004 - 98pz - Producto2 - 91s</option>
            </select>
        </div>
    )
}

function CajaEntrada(props) {

    useEffect(() => {
        axios.get("/api/entrada/getEstado/" + props.state.maquinaSeleccionada)
            .then(res => {
                props.dispatch({ type: 'SET_ESTADO', payload: res.data })
            })
            .catch(err => {
                console.log(err)
                Toast.fire({
                    icon: 'error',
                    title: 'Error al obtener estado de la máquina'
                })
                dispatch({ type: 'SET', payload: { key: "isLoading", value: false } })
            })
    }, [props.state.maquinaSeleccionada])

    const terminarOF = () => {
        console.log(props.state)
        if (props.state.modo_manual) {
            axios.post('/api/entrada/terminar_of_manual', {
                maquina: props.state.maquinaSeleccionada
            }).then(res => {
                props.dispatch({ type: 'REINICIAR_RECOGIDA' })
                Toast.fire({
                    icon: 'success',
                    title: 'Toma de datos concluida'
                })
            }).catch(err => {
                Toast.fire({
                    icon: 'error',
                    title: "Error al finalizar la OF"
                })
                console.log(err)
            })
        }
        else {
            axios.post('/api/entrada/terminarOF', {
                of: props.state.of
            }).then(res => {
                props.dispatch({ type: 'REINICIAR_RECOGIDA' })
                Toast.fire({
                    icon: 'success',
                    title: 'Toma de datos concluida'
                })
            }).catch(err => {
                Toast.fire({
                    icon: 'error',
                    title: 'Error al terminar la OF'
                })
                console.log(err)
            })
        }
    }

    const nombreEstado = () => {
        if (props.state.isLoading) {
            return "Obteniendo datos..."
        }
        switch (props.state.estado) {
            case 0:
                return "Sin OF"
            case 1:
                return "Preparación"
            case 2:
                return "Fabricando OF"
            case 4:
                return "Paro"
            case 3:
                return "Finalizado"
            default:
                return "Error"
        }
    }
    //-----MOCK-----------

    const handleButtonClick = () => {
        fileInputRef.current.click();
      };
    
      const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          // Handle the .xlsx file here
          console.log('File selected:', file);
        } else {
          console.error('Please upload a valid .xlsx file');
        }
      };
    const fileInputRef = useRef(null);
    let buttonUpload = <>
        <button className='btn btn-primary btn-sm' onClick={handleButtonClick}>Cargar órdenes de fabricación</button>
        <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".xlsx"
            onChange={handleFileChange}
        /></>

    //-----MOCK-----------
    return (
        <>
            <Caja titulo="Entrada" emoji="📥" tools={buttonUpload}>
                <Loader isLoading={props.state.loadingEstado} height="296px">
                    {props.state.maquinas.length > 0 ?
                        <div className="row">
                            <div className="col-md-6">
                                <DatosOF state={props.state} dispatch={props.dispatch} />
                                <div>
                                    <button className="btn btn-block btn-primary" onClick={() => props.dispatch({ type: "SET", payload: { key: "showModEmpleados", value: true } })}> {props.state.estado == 0 ? "Elegir" : "Ver"} operarios</button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <PanelEjecucion state={props.state} dispatch={props.dispatch} terminarOF={terminarOF} />
                            </div>
                        </div>
                        :
                        <div className="alert alert-danger" role="alert">
                            No hay máquinas registradas. Puede registrarlas en la sección de configuración.
                        </div>
                    }
                </Loader>
                <hr />
                <h4 id="estado_maquina"> Estado de la máquina: {nombreEstado()} </h4>
            </Caja>
            <ModalEmpleados state={props.state} dispatch={props.dispatch} />
            <ModalCalidad state={props.state} dispatch={props.dispatch} terminarOF={terminarOF} />
            {
                props.state.loadingEstado ?
                    null
                    :
                    <ModalParos state={props.state} dispatch={props.dispatch} />
            }
        </>
    )
}

export default CajaEntrada