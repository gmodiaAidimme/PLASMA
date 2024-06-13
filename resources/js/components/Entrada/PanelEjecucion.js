import React from "react";
import Swal from 'sweetalert2';

var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});


function PanelEjecucion(props) {
    let img

    switch (props.estado) {
        case 0:
            img = '/dist/img/engranajeparado.png'
            break
        case 1:
            img = '/dist/img/preparando.gif'
            break
        case 2:
            img = '/dist/img/engranajes.gif'
            break
    }

    const iniciarPreparacion = () => {
        if (props.state.of == "" || props.state.piezas == "" || props.state.ciclo == "") {
            Toast.fire({
                icon: 'warning',
                title: 'Ningún campo puede estar vacío'
            })
        }
        else if (props.state.empleadosEnOF.length == 0) {
            Toast.fire({
                icon: 'warning',
                title: "No hay empleados en la OF"
            })
        }
        else {
            axios.post('/api/entrada/iniciarPreparacion', {
                of: props.state.of,
                piezas: props.state.piezas,
                ciclo: props.state.ciclo,
                proyecto: props.state.proyecto != 0 ? props.state.proyecto : null,
                maquina: props.state.maquinaSeleccionada,
                empleados: props.state.empleadosEnOF
            }).then(res => {
                props.dispatch({ type: 'SET', payload: { key: "estado", value: 1 } })
                Toast.fire({
                    icon: 'success',
                    title: 'Preparación iniciada'
                })
            }).catch(err => {
                if (err.response.status === 400) {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Esta OF ya ha sido registrada. Las OF no se pueden repetir.'
                    })
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: "Error al registrar OF"
                    })
                }
                console.log(err)
            })
        }
    }

    const iniciarOF = () => {
        axios.post('/api/entrada/iniciarProduccion', {
            of: props.state.of,
            maquina: props.state.maquinaSeleccionada
        }).then(res => {
            props.dispatch({ type: 'SET', payload: { key: "estado", value: 2 } })
            Toast.fire({
                icon: 'success',
                title: 'OF iniciada'
            })
        }).catch(err => {
            Toast.fire({
                icon: 'error',
                title: "Error al iniciar la OF"
            })
            console.log(err)
        })
    }

    const finalizarOF = () => {
        axios.post('/api/entrada/finalizarProduccion', {
            of: props.state.of
        }).then(res => {
            props.dispatch({ type: 'SET', payload: { key: "estado", value: 3 } })
            Toast.fire({
                icon: 'success',
                title: 'OF finalizada'
            })
        }).catch(err => {
            Toast.fire({
                icon: 'error',
                title: "Error al finalizar la OF"
            })
            console.log(err)
        })
    }

    const iniciarParoManual = () => {
        axios.post('/api/entrada/iniciar_paro_manual', {
            of: props.state.of,
            maquina: props.state.maquinaSeleccionada
        }).then(res => {
            props.dispatch({ type: 'INICIAR_PARO_MANUAL' })
            Toast.fire({
                icon: 'success',
                title: 'Paro manual iniciado'
            })
        }).catch(err => {
            Toast.fire({
                icon: 'error',
                title: 'Error al iniciar paro manual'
            })
            console.log(err)
        })
    }

    const terminarParoManual = () => {

        axios.post('/api/entrada/terminar_paro_manual', {
            maquina: props.state.maquinaSeleccionada
        }).then(res => {
            props.dispatch({ type: "SET", payload: { key: "en_paro_manual", value: false } })
            Toast.fire({
                icon: 'success',
                title: 'Paro manual finalizado'
            })
        }).catch(err => {
            Toast.fire({
                icon: 'error',
                title: 'Error al terminar paro manual'
            })
            console.log(err)
        })
    }

    return (
        <>
            {props.state.estado == 0 ? <button type="button" className="btn btn-block btn-primary" onClick={iniciarPreparacion}>Inicio preparación</button> : null}
            {props.state.estado == 1 ? <button type="button" className="btn btn-block btn-primary" onClick={iniciarOF}>Terminar preparación e iniciar OF</button> : null}
            {props.state.estado == 2 ? <button type="button" className="btn btn-block btn-primary" onClick={finalizarOF} disabled={props.state.modo_manual && props.state.en_paro_manual}>Fin OF</button> : null}
            {props.state.estado == 3 ?
                <>
                    <button type="button" className="btn btn-block btn-success" onClick={() => props.dispatch({ type: "SET", payload: { key: "showModCalidad", value: true } })}>Informar calidad</button>
                    <button type="button" className="btn btn-block btn-outline-success" onClick={props.terminarOF}>Omitir</button>
                </>
                : null
            }

            {
                props.state.modo_manual ?
                    <>
                        <div style={{ marginTop: "10px" }}></div>
                        {/* <h6 className="text-center"> MODO MANUAL</h6> */}
                        <hr />
                        {
                            props.state.estado == 2 ?
                                props.state.en_paro_manual ?
                                    <button type="button" className="btn btn-block btn-warning" onClick={terminarParoManual}>Terminar paro</button>
                                    :
                                    <button type="button" className="btn btn-block btn-warning" onClick={iniciarParoManual}>Iniciar paro</button>
                                : null
                        }
                    </>
                    : null
            }
            {/* Muestra la imagen de engranajes.gif */}
            <div>
                {/* <img src={img} alt="engranajes" style={{ display: "block", margin: "auto" }} /> */}
            </div>
        </>
    )
}

export default PanelEjecucion