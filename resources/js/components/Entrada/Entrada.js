import React, { useReducer, useEffect } from "react"
import { TituloSeccion } from "../generales";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

import SelectorMaquina from "./SelectorMaquina";
import PlaceholderCajaEntrada from "./PlaceholderCajaEntrada";
import CajaEntrada from "./CajaEntrada";

var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

const initialState = {
    maquinas: [],
    maquinaSeleccionada: null,
    isLoading: true,
    modo_manual: false,
    empleados: [],
    proyectos: [],
    proyecto: 0, 
    estado: 0,
    of: "",
    piezas: "",
    ciclo: "",
    empleadosEnOF: [],
    parosVisible: false,
    defectos: [],
    loadingEstado: true,

    en_paro_manual: false,

    piezasEnOrden: 0,
    reporteCalidad: [{ defecto: "", piezas: 0 }],
    justificaciones: [],
    paros: [],

    showModEmpleados: false,
    showModCalidad: false,
    showModParos: false,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return { ...state, [action.payload.key]: action.payload.value }
        case 'SET_CONF_INICIAL':
            let maquinaSeleccionada
            if (action.payload.maquinas.length > 0) {
                if (action.payload.maquina != null && action.payload.maquina != undefined && action.payload.maquina != "") {
                    maquinaSeleccionada = parseInt(action.payload.maquina)
                }
                else {
                    maquinaSeleccionada = action.payload.maquinas[0].id
                }
                return {
                    ...state,
                    proyectos: action.payload.proyectos,
                    empleados: action.payload.empleados,
                    maquinas: action.payload.maquinas,
                    defectos: action.payload.defectos,
                    modo_manual: action.payload.modo_manual,
                    maquinaSeleccionada: maquinaSeleccionada,
                    isLoading: false,
                }
            }
            else {
                return {
                    ...state,
                    isLoading: false,
                }
            }
        case 'SET_ESTADO':
            return {
                ...state,
                estado: action.payload.estado,
                of: action.payload.of,
                piezas: action.payload.piezas,
                ciclo: action.payload.ciclo,
                proyecto: action.payload.proyecto,
                empleadosEnOF: action.payload.empleados,
                loadingEstado: false,
                en_paro_manual: action.payload.en_paro_manual,
            }
        case 'ADD_REMOVE_EMPLEADO':
            if (state.empleadosEnOF.includes(action.payload)) {
                return { ...state, empleadosEnOF: state.empleadosEnOF.filter(e => e !== action.payload) }
            } else {
                return { ...state, empleadosEnOF: [...state.empleadosEnOF, action.payload] }
            }
        case 'REINICIAR_RECOGIDA':
            return {
                ...state,
                estado: 0,
                of: "",
                piezas: "",
                ciclo: "",
                empleadosEnOF: [],
                showModCalidad: false,
                showModEmpleados: false,
                showModParos: false,
            }
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
        case "REMOVE_PARO":
            let aux_paros = state.paros.filter(paro => paro.id !== action.payload)
            let showModParos = state.showModParos
            if (aux_paros.length == 0) {
                showModParos = false
            }
            return {
                ...state,
                paros: aux_paros,
                showModParos: showModParos
            }
        case "UPDATE_PAROS":
            if (action.payload.paros.length > state.paros.length) {
                return {
                    ...state,
                    paros: action.payload.paros,
                    showModParos: true,
                    justificaciones: action.payload.justificaciones,
                }
            } else {
                return {
                    ...state,
                    justificaciones: action.payload.justificaciones,
                }
            }
        case "INICIAR_PARO_MANUAL":
            return {
                ...state,
                en_paro_manual: true,
                showModParos: true,
            }
        case "BORRAR_TODOS_LOS_PAROS":
            return {
                ...state,
                paros: [],
                showModParos: false,
            }
        default:
            return state
    }

}

function Entrada() {

    const [state, dispatch] = useReducer(reducer, initialState)

    const { maq } = useParams()

    useEffect(() => {
        axios.get('/api/entrada/conf_inicial').then(res => {
            dispatch({ type: 'SET_CONF_INICIAL', payload: { ...res.data, maquina: maq } })
        })
            .catch(err => {
                Toast.fire({
                    icon: 'error',
                    title: 'Error al cargar la configuración inicial'
                })
                console.log(err)
            })
    }, [maq])


    return (
        <>
            <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
                <TituloSeccion titulo="Detalles OF" />
                <section className="content">
                    <div className="row">
                        <div className="col-md-1"></div>
                        <div className="col-md-2">

                            <SelectorMaquina state={state} dispatch={dispatch} />
                        </div>
                        <div className="col-md-8">
                            {
                                state.isLoading ?
                                    <PlaceholderCajaEntrada />
                                    :
                                    <CajaEntrada state={state} dispatch={dispatch} />    
                            }
                        </div>
                        <div className="col-md-1"></div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Entrada