import React, { useEffect } from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Swal from "sweetalert2";
import axios from "axios";

var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

const sumMalas = (reporte) => {
    return reporte.reduce((acc, cur) => {
        return acc + cur.piezas
    }, 0)
}

function EntradaCalidad(props) {
    return (
        <div className="row">
            <div className="col-md-6">
                <div className="form-group">
                    <label htmlFor="defectos">Defecto</label>
                    <select className="form-control" id="defecto" value={props.valores.defecto} onChange={props.handleChange}>
                        <option value="0">Seleccione un defecto</option>
                        {
                            props.defectos.map((defecto, key) => {
                                return (
                                    <option key={key} value={defecto.id}>{defecto.nombre}</option>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
            <div className="col-md-6">
                <div className="form-group">
                    <label htmlFor="piezas">Piezas</label>
                    <input type="number" className="form-control" id="piezas" value={props.valores.piezas} onChange={props.handleChange} />
                </div>
            </div>
        </div>
    )
}

function PiezasConformes(props) {

    if (props.state.modo_manual) {
        return (
            <span>Piezas conformes: {props.state.piezasEnOrden}</span>
        )
    }
    else {
        let sum = 0
        props.state.reporteCalidad.forEach(item => {
            sum += parseInt(item.piezas)
        })

        return (
            <span>Piezas conformes: {props.state.piezasConformes - sum}</span>
        )
    }
}

function ModalCalidad(props) {

    useEffect(() => {

        if (props.state.modo_manual) {
            props.dispatch({ type: "SET", payload: { key: "piezasEnOrden", value: parseInt(props.state.piezas) } })
        }
        else {
            const url = props.revision ? `/api/entrada/piezasEnOrdenID/${props.state.of}` : `/api/entrada/piezasEnOrden/${props.state.of}`

            axios.get(url)
                .then(res => {
                    props.dispatch({ type: 'SET', payload: { key: "piezasConformes", value: res.data.piezas } })
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }, [props.state.showModCalidad])

    const guardarCalidad = () => {
        let errores = false
        props.state.reporteCalidad.forEach(item => {
            if (item.defecto === "") {
                errores = true
                Toast.fire({
                    icon: 'error',
                    title: 'Debe seleccionar un defecto'
                })
                return
            }
            if (item.piezas === "" || item.piezas === 0) {
                errores = true
                Toast.fire({
                    icon: 'error',
                    title: 'Debe ingresar una cantidad de piezas'
                })
                return
            }
        })

        if (!props.state.modo_manual && sumMalas(props.state.reporteCalidad) > piezas) {
            errores = true
            Toast.fire({
                icon: 'error',
                title: 'La cantidad de piezas no conformes no puede ser mayor a la cantidad de piezas fabricadas'
            })
            return
        }
        if (!errores) {
            
            let data = {reporte: props.state.reporteCalidad}
            if (props.revision) {
                data.id = props.state.of
            }
            else{
                data.of = props.state.of
            }

            axios.post('/api/entrada/guardarCalidad', data)
            .then(res => {
                props.terminarOF()
            }).catch(err => {
                Toast.fire({
                    icon: 'error',
                    title: 'Ocurrió un error al guardar la calidad'
                })
                console.log(err)
            })
        }
    }

    return (
        <Modal show={props.state.showModCalidad} onHide={() => props.dispatch({ type: "SET", payload: { key: "showModCalidad", value: false } })}>
            <Modal.Header>
                <Modal.Title>Calidad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <PiezasConformes state={props.state} />
                    {
                        props.state.reporteCalidad.map((valores, key) => {
                            return (
                                <EntradaCalidad key={key} defectos={props.state.defectos} valores={valores} handleChange={(e) => props.dispatch({ type: "CHANGE_REPORTE_CALIDAD", payload: { key: key, id: e.target.id, value: e.target.value } })} />
                            )
                        })
                    }
                    <div className="row">
                        <div className="col-md-12" style={{ textAlign: "center" }}>
                            <button className="btn btn-success width35" onClick={() => props.dispatch({ type: "REMOVE_FROM_REPORTE_CALIDAD", payload: props.state.reporteCalidad.length - 1 })} disabled={props.state.reporteCalidad.length <= 1}>-</button>
                            <span className="spacer"></span>
                            <button className="btn btn-success width35" onClick={() => props.dispatch({ type: "ADD_2_REPORTE_CALIDAD" })} disabled={props.state.reporteCalidad.length >= props.state.defectos.length}>+</button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.dispatch({ type: "SET", payload: { key: "showModCalidad", value: false } })}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={guardarCalidad}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalCalidad