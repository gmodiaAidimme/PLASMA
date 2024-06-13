import React, { useEffect, useReducer } from "react";
import ModalCalidad from "../Entrada/ModalCalidad";
import { useParams } from "react-router-dom";
import { Caja } from "../generales"

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return { ...state, [action.payload.key]: action.payload.value }
        case 'ADD_2_REPORTE_CALIDAD':
            return {
                ...state,
                reporteCalidad: [...state.reporteCalidad, { defecto: "", piezas: 0 }]
            }
        case 'REMOVE_FROM_REPORTE_CALIDAD':
            return {
                ...state,
                reporteCalidad: state.reporteCalidad.slice(0, -1)
            }
        case 'CHANGE_REPORTE_CALIDAD':
            let reporte = state.reporteCalidad
            reporte[action.payload.key][action.payload.id] = action.payload.value
            return {
                ...state,
                reporteCalidad: reporte
            }
        case 'SET_INITIAL':
            return {
                ...state,
                reporteCalidad: action.payload.reporte,
                defectos: action.payload.defectos,
                of: action.payload.of,
                proyecto: action.payload.proyecto,
                proyectos: action.payload.proyectos,
                isLoading: false
            }
    }
}

const initialState = {
    modo_manual: false,
    piezasEnOrden: 0,
    piezasConformes: 0,
    piezas: 0,
    reporteCalidad: [],
    of: "",
    showModCalidad: false,
    defectos: [],
    isLoading: true
}

function CajaAcciones(props) {

    const [state, dispatch] = useReducer(reducer, initialState);
    const { of } = useParams();

    useEffect(() => {

        axios.get(`/api/of/acciones/${of}`)
            .then(res => {
                console.log(res.data)
                dispatch({ type: "SET_INITIAL", payload: { ...res.data, of: of } })
            }).catch(err => {
                console.log(err)
            })
    }, [of]);

    const terminarOF = () => {
        props.actCalidad()
        dispatch({ type: "SET", payload: { key: "showModCalidad", value: false } })
    }

    const cambiar_proyecto = (e) => {
        dispatch({ type: "SET", payload: { key: "isLoading", value: true } })
        axios.put(`/api/of/cambiar_proyecto/${of}`, { proyecto: e.target.value })
            .then(res => {
                dispatch({ type: "SET", payload: { key: "proyecto", value: res.data.proyecto } })
                dispatch({ type: "SET", payload: { key: "isLoading", value: false } })
            }).catch(err => {
                console.log(err)
                dispatch({ type: "SET", payload: { key: "isLoading", value: false } })
            })
    }

    return (
        <>
            <Caja titulo="Acciones" emoji="🛠">
                <div className="row">
                    <div className="form-group col-6">
                        <label htmlFor="proyecto">Asignar a proyecto</label>
                        <select className="form-control" id="proyecto" disabled={state.isLoading} value={state.proyecto} onChange={cambiar_proyecto}>
                            <option value="0">Sin proyecto</option>
                            {
                                !state.isLoading && state.proyectos.map((proyecto, index) => {
                                    return <option key={index} value={proyecto.id}>{proyecto.nombre}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group col-6">
                        <button className="btn btn-primary" disabled={state.isLoading} onClick={() => dispatch({ type: "SET", payload: { key: "showModCalidad", value: true } })}> Modificar calidad</button>
                    </div>
                </div>
            </Caja>

            {
                state.isLoading ?
                    null
                    :
                    <ModalCalidad state={state} dispatch={dispatch} revision terminarOF={terminarOF} />
            }

        </>
    )
}

export default CajaAcciones;