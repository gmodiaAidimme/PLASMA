import React, { useReducer, useEffect } from "react"
import { Caja } from "../generales"
import Panel from "../Panel/Panel"
import DatePicker, { registerLocale } from "react-datepicker"
import es from "date-fns/locale/es"
import { TituloSeccion } from "../generales";

registerLocale('es', es)

import "react-datepicker/dist/react-datepicker.css";
import Loader from "../Comun/Loader"
import axios from "axios"

const initialState = {
    isLoadingFields: true,
    loaded: false,
    maquinas: [],
    maquina: "",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    fechasDisponibles: [],
}

const reducer = (state, action) => {
    switch (action.type) {
        case "SET":
            return {
                ...state,
                [action.name]: action.value
            }


    }
}

function CajaCalendario({dispatch, state}) {

    useEffect(() => {
        axios.get("/api/modelo/maquina")
            .then(res => {
                dispatch({ type: "SET", name: "maquinas", value: res.data.datos })
                dispatch({ type: "SET", name: "isLoadingFields", value: false })
            }).catch(err => {
                console.log(err)
            })
    }, []);

    const createDateAsLocal = (timeString) => {
        let date = new Date(timeString);
        let userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - userTimezoneOffset);
    }

    const handleMaquinaSeleccionada = (e) => {
        axios.get(`/api/historico/${e.target.value}/fechas_disponibles`)
            .then(res => {
                dispatch({ type: "SET", name: "fechasDisponibles", value: res.data.map(e => createDateAsLocal(e.fecha)) })
            })
            .catch(err => {
                console.log(err)
            })
        dispatch({ type: "SET", name: "maquina", value: e.target.value })
    }

    const filterDates = (date) => {
        for (let i = 0; i < state.fechasDisponibles.length; i++) {
            if (date.getFullYear() === state.fechasDisponibles[i].getFullYear() && date.getMonth() === state.fechasDisponibles[i].getMonth() && date.getDate() === state.fechasDisponibles[i].getDate()) {
                console.log(date, state.fechasDisponibles[i])
                return true
            }
        }
        return false
    }

    const ejecutarConsulta = () => {
        dispatch({ type: "SET", name: "loaded", value: true })
    }

    return (
        <div className="container">
            <Caja titulo="Datos a consultar" emoji="📅">
                <div className="row">
                    <Loader isLoading={state.isLoadingFields} height="70px" >
                        <div className="col-md-3">
                            <label className="form-label">Máquina</label>
                            <select className="form-select" value={state.maquina} onChange={handleMaquinaSeleccionada}>
                                <option hidden>Elegir máquina</option>
                                {
                                    state.maquinas.map(maq => {
                                        return <option key={maq.id} value={maq.id}>{maq.nombre}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Fecha inicio</label>
                            <DatePicker selected={state.fechaInicio}
                                onChange={(date) => dispatch({ type: "SET", name: "fechaInicio", value: date })}
                                dateFormat='dd/MM/yyyy'
                                locale='es'
                                className="form-control"
                                disabled={state.maquina === ""}
                                filterDate={filterDates}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Fecha fin</label>
                            <DatePicker selected={state.fechaFin}
                                onChange={(date) => dispatch({ type: "SET", name: "fechaFin", value: date })}
                                dateFormat='dd/MM/yyyy'
                                locale='es'
                                className="form-control"
                                disabled={state.maquina === ""}
                                filterDate={filterDates}
                            />
                        </div>
                        <div className="col-md-3">
                            <div className="outer">
                                <div className="middle">
                                    <div className="inner">
                                        <button className="btn btn-primary col-6" onClick={ejecutarConsulta}>Consultar<br />🔍</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Loader>
                </div>
            </Caja>
        </div>
    )
}

function Historico() {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Histórico" />
            <section className="content">
                <CajaCalendario state={state} dispatch={dispatch} />
                {
                    state.loaded ?
                        <Panel maquina={state.maquina} desde={state.fechaInicio} hasta={state.fechaFin} /> :
                        null
                }
            </section>
        </div>
    )
}

export default Historico