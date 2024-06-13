import axios from 'axios';
import React, { useState, useEffect, useReducer, Fragment } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import Swal from "sweetalert2";

var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

function diferenciaHoras(hora1, hora2) {

    let h1 = new Date("1970-01-01 " + hora1);
    let h2 = new Date("1970-01-01 " + hora2);

    let dif = h2.getTime() - h1.getTime();

    let minutos = Math.floor(dif / 60000);

    return minutos + " min";
}


function JustificadorParo(props) {

    const [justificacion, setJustificacion] = useState('');
    const [guardando, setGuardando] = useState(false);

    const handleSave = (e) => {

        if (justificacion === '') {
            Toast.fire({
                icon: 'error',
                title: 'Debe ingresar una justificación'
            });
        } else {
            setGuardando(true);
            const data = {
                id: props.paro.id,
                justificacion: justificacion
            }
            axios.post('/api/entrada/justificar_paro', data)
                .then(res => {
                    Toast.fire({
                        icon: 'success',
                        title: 'Paro justificado'
                    });
                    setGuardando(false);
                    props.quitarParo(props.paro.id);
                }
                ).catch(err => {
                    setGuardando(false);
                    Toast.fire({
                        icon: 'error',
                        title: 'Error al justificar paro'
                    });
                    console.log(err)
                })
        }
    }

    return (
        <>
            <div className="col-md-4" style={{ textAlign: "center" }}>
                <span>{props.paro.inicio.split(" ")[1]} - {props.paro.fin.split(" ")[1]}</span>
                <br />
                <span>({diferenciaHoras(props.paro.inicio.split(" ")[1], props.paro.fin.split(" ")[1])})</span>
            </div>
            <div className="col-md-7">
                <select className="form-control" disabled={guardando} value={justificacion} onChange={(e) => setJustificacion(e.target.value)}>
                    <option hidden> Seleccione una opción</option>
                    {
                        props.justificaciones.map(justificacion => {
                            return (
                                <option key={justificacion.id} value={justificacion.id}>{justificacion.nombre}</option>
                            )
                        })
                    }
                </select>
            </div>
            <div className="col-md-1">
                {
                    guardando ?
                        <Spinner animation='border' variant='success' />
                        :
                        <button className="btn btn-success" onClick={() => handleSave(props.paro.ini)}><i className="fas fa-save"></i></button>
                }
            </div>
        </>
    )
}

function ModalParos(props) {

    useEffect(() => {
        getData();
        if (!props.state.modo_manual) {
            const interval = setInterval(() => {
                getData();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [props.state.maquinaSeleccionada, props.state.en_paro_manual]);

    function getData() {
        axios.get('/api/entrada/paros_sin_justificar/' + props.state.maquinaSeleccionada)
            .then(res => {
                props.dispatch({ type: "UPDATE_PAROS", payload: res.data });
            })
            .catch(err => {
                console.log(err);
            });
    }

    function descartarTodo(e) {
        axios.delete('/api/entrada/paros_sin_justificar/' + props.state.maquinaSeleccionada)
            .then(res => {
                Toast.fire({
                    icon: 'warning',
                    title: 'Paros marcados como "sin justificar"'
                });
                props.dispatch({type: "BORRAR_TODOS_LOS_PAROS"});
            })
            .catch(err => {
                console.log(err);
                Toast.fire({
                    icon: 'error',
                    title: 'Error al descartar paros'
                })
            });
    }


    return (
        <Modal show={props.state.showModParos} onHide={() => props.dispatch({ type: "SET", payload: { key: "showModParos", value: false } })}>
            <Modal.Header>
                <Modal.Title>Paros registrados</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    {
                        props.state.paros.map(item => {
                            return (
                                <Fragment key={item.id}>
                                    <div className="row" >
                                        <JustificadorParo paro={item} justificaciones={props.state.justificaciones} quitarParo={() => props.dispatch({ type: "REMOVE_PARO", payload: item.id })} />
                                    </div>
                                    <div className="vspace"></div>
                                </Fragment>
                            )
                        })
                    }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.dispatch({ type: "SET", payload: { key: "showModParos", value: false } })}>
                    Ahora no..
                </Button>
                <Button variant="danger" onClick={descartarTodo} >
                    Descartar todo <i className="fas fa-trash"></i>
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalParos;