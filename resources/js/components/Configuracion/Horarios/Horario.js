import axios from "axios"
import React, { useState, useEffect } from "react"
import { Caja } from "../../generales"
import Loader from "../../Comun/Loader"

const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]

function HorarioDia(props) {

    const [inicio, setInicio] = useState(props.inicio)
    const [fin, setFin] = useState(props.fin)

    const checkInicioFin = () => {
        let error = ""
        if (inicio === "") {
            error = "Debe ingresar una hora de inicio"
        }
        else if (fin === "") {
            error = "Debe ingresar una hora de fin"
        }
        else if (inicio > fin) {
            error = "La hora de inicio debe ser menor a la hora de fin"
        }
        props.updateTurno(props.dia, inicio, fin, error)
    }

    return (
        <div className="form-group" style={{ textAlign: "center" }}>
            <label>{dias[props.dia]}</label><br />
            <div className="row">
                <div style={{ margin: "auto" }}>
                    <input type="time" name="eta" value={inicio} onChange={(e) => setInicio(e.target.value)} onBlur={checkInicioFin} />
                    -
                    <input type="time" name="eta" value={fin} onChange={(e) => setFin(e.target.value)} onBlur={checkInicioFin} />
                </div>
            </div>
        </div>
    )
}

function Turno(props) {
    const updateTurno = (dia, inicio, fin, error) => {
        props.updateHorario(props.numero, dia, inicio, fin, error)
    }

    let horarioDias = [];
    for (let i = 0; i < 7; i++) {
        let dato = null
        let inicio = ""
        let fin = ""
        if (props.datos) {
            dato = props.datos.find(d => d.dia === i)
            if (dato) {
                inicio = dato.hora_inicio
                fin = dato.hora_fin
            }
        }
        horarioDias.push(<HorarioDia key={"hd" + props.numero + dias[i]} dia={i} inicio={inicio} fin={fin} updateTurno={updateTurno} />)
    }

    return (
        <div>
            <h4 style={{ textAlign: "center" }}>Turno {props.numero}</h4>
            {horarioDias}
        </div>
    )
}

function CajaConfHorario() {
    const [turnos, setTurnos] = useState([]);
    const [error, setError] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [isloading, setIsloading] = useState(true);

    useEffect(() => {
        axios.get("/api/turnos").then(res => {
            setTurnos(res.data)
            setIsloading(false)
        })
    }, [])

    const existenSolapes = (turnos_aux, turno, dia, inicio, fin) => {
        let hermano
        for (let i = 0; i < turnos_aux.length; i++) {
            if (i !== turno - 1) {
                hermano = turnos_aux[i].find(d => d.dia === dia)
                if (hermano) {
                    if (inicio < hermano.hora_fin && fin > hermano.hora_inicio) {
                        return true
                    }
                }
            }
        }
        return false
    }

    const updateHorario = (turno, dia, inicio, fin, nuevo_error) => {
        let turnos_aux = turnos.slice()
        let dato = turnos_aux[turno - 1].find(d => d.dia === dia)

        if (dato) {
            dato.hora_inicio = inicio
            dato.hora_fin = fin
        } else {
            turnos_aux[turno - 1].push({ dia: dia, hora_inicio: inicio, hora_fin: fin, turno: turno })
        }

        setTurnos(turnos_aux)

        //Buscar si ya existe un error
        let error_aux = error.slice()
        let error_dia = error_aux.find(d => d.dia === dia && d.turno === turno && d.tipo === "hora")
        if (error_dia) {
            if (nuevo_error === "") {
                error_aux.splice(error_aux.indexOf(error_dia), 1)
            } else {
                error_dia.error = nuevo_error
            }
        } else {
            if (nuevo_error !== "") {
                error_aux.push({ dia: dia, turno: turno, error: nuevo_error, tipo: "hora" })
            }
        }
        let error_solape = error_aux.find(d => d.dia === dia && d.turno === turno && d.tipo === "solape")
        let hay_solape = existenSolapes(turnos_aux, turno, dia, inicio, fin)
        if (error_solape) {
            if (!hay_solape) {
                error_aux.splice(error_aux.indexOf(error_solape), 1)
            }
        } else {
            if (hay_solape) {
                error_aux.push({ dia: dia, turno: turno, error: "Los turnos no pueden solaparse entre si", tipo: "solape" })
            }
        }
        setError(error_aux)

        setMensaje("")
    }

    const guardarHorario = () => {
        let datos = []
        turnos.forEach(t => {
            t.forEach(d => {
                datos.push(d)
            })
        })
        axios.put("/api/turnos", { elementos: datos }).then(res => {
            setMensaje("Horario guardado correctamente")
        }).catch(err => {
            setError("Error al guardar el horario")
            console.log(err)
        })
    }

    const msg_error = (error) => {
        let msg = ""
        if (error.length > 0) {
            msg = error[0].error
            if (error.length > 1) {
                if (error.length === 2) {
                    msg += " (1 error más)"
                } else {
                    msg += " (" + (error.length - 1).toString() + " errores más)"
                }
            }
        }
        return msg
    }

    return (
        <Caja titulo="Horario" emoji="⌚">
            <Loader isLoading={isloading} height="582px">
                <div className="row">
                    <div className="col-md-4">
                        <Turno numero={1} datos={turnos[0]} updateHorario={updateHorario} />
                    </div>
                    <div className="col-md-4">
                        <Turno numero={2} datos={turnos[1]} updateHorario={updateHorario} />
                    </div>
                    <div className="col-md-4">
                        <Turno numero={3} datos={turnos[2]} updateHorario={updateHorario} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-8">
                        <span style={{ color: "red", display: "table", margin: "0 auto" }}>{msg_error(error)}</span>
                        <span style={{ color: "green", display: "table", margin: "0 auto" }}>{mensaje}</span>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-block btn-success" onClick={() => guardarHorario()} disabled={error.length > 0}> Guardar horario</button>
                    </div>
                </div>
            </Loader>
        </Caja >
    )
}

export default CajaConfHorario