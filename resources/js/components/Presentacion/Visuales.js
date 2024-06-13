import React, { useState, useEffect } from "react";
import { Doughnut, Line } from 'react-chartjs-2';
import Loader from "../Comun/Loader";
import { MiniCajaProductividad } from "../Panel/Cajas/CajaProductividad";
import { Timeline } from "../Panel/Cajas/CajaTimeline";

export function VisualOEE(props) {

    const [oee, setOee] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [vacio, setVacio] = useState(false);

    const get_data = () => {
        axios.get("/api/panel/diales/" + props.datos.maquina_id)
        .then(res => {
            if (res.status === 204) {
                setVacio(true)
            } else {

                let aux_oee = 1

                //DISPONIBILIDAD
                let buenas = parseInt(res.data.disponibilidad[0].cantidad)
                let total = 0
                for (let i = 0; i < res.data.disponibilidad.length; i++) {
                    total += parseInt(res.data.disponibilidad[i].cantidad)
                }
                aux_oee *= buenas / total

                //RENDIMIENTO
                aux_oee *= res.data.rendimiento.tiempo_plan / res.data.rendimiento.tiempo_real

                //CALIDAD
                let buenas_calidad = res.data.calidad[0].cantidad
                let total_calidad = 0
                for (let i = 0; i < res.data.calidad.length; i++) {
                    total_calidad += parseInt(res.data.calidad[i].cantidad)
                }
                aux_oee *= buenas_calidad / total_calidad

                setOee(Math.round(1000 * aux_oee) / 10)
                setVacio(false)
            }
            setIsLoading(false)
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        get_data()
        const interval = setInterval(() => {
            get_data()
        }, 15000)
        return () => clearInterval(interval)
    }, [])

    let minimo = Math.min(props.datos.alto, props.datos.ancho)


    return (
        <>
            <div style={{ textAlign: "center" }}>
                <h3>OEE - {props.datos.abreviacion_maquina}</h3>
            </div>
            <Loader isLoading={isLoading}>
                {
                    vacio ?
                        <div className="alert alert-warning" style={{ textAlign: "center" }} role="alert">
                            No hay datos disponibles
                        </div>
                        :
                        <div className="outer">
                            <div className="middle">
                                <div className="inner">
                                    <div style={{ textAlign: 'center', fontSize: minimo * 6 + (minimo === props.datos.ancho ? "vw" : "vh") }}>
                                        <span >{oee}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </Loader>
        </>
    )

}

export function VisualDonut(props) {

    const [isLoading, setIsLoading] = useState(true);
    const [vacio, setVacio] = useState(false);
    const [datos, setDatos] = useState([]);

    const get_disponibilidad = () => {
        axios.get("/api/panel/diales/" + props.datos.maquina_id)
            .then(res => {

                if (res.status === 204) {
                    setVacio(true)
                } else {
                    let disp_aux = {
                        labels: res.data.disponibilidad.map(a => a.nombre),
                        datasets: [
                            {
                                label: 'Disponibilidad',
                                data: res.data.disponibilidad.map(a => a.cantidad),
                                backgroundColor: res.data.disponibilidad.map(a => a.color)
                            }
                        ]
                    }
                    setDatos(disp_aux)
                    setVacio(false)
                }
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const get_rendimiento = () => {
        axios.get("/api/panel/diales/" + props.datos.maquina_id)
            .then(res => {

                if (res.status === 204) {
                    setVacio(true)
                } else {

                    let porc_rend = 100 * res.data.rendimiento.tiempo_plan / res.data.rendimiento.tiempo_real

                    let rend_aux = {
                        labels: ["Funcionamiento óptimo", "Rendimiento bajo"],
                        datasets: [
                            {
                                label: 'Rendimiento',
                                data: [porc_rend, 100 - porc_rend],
                                backgroundColor: ["#009933", "#990000"]
                            }
                        ]
                    }
                    setDatos(rend_aux)
                    setVacio(false)
                }
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const get_calidad = () => {
        axios.get("/api/panel/diales/" + props.datos.maquina_id)
            .then(res => {

                if (res.status === 204) {
                    setVacio(true)
                } else {

                    let calidad_aux = {
                        labels: res.data.calidad.map(a => a.nombre),
                        datasets: [
                            {
                                label: 'Calidad',
                                data: res.data.calidad.map(a => a.cantidad),
                                backgroundColor: res.data.calidad.map(a => a.color)
                            }
                        ]
                    }
                    setDatos(calidad_aux)

                    setVacio(false)
                }
                setIsLoading(false)
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        let get_data
        switch (props.datos.tipo) {
            case "disponibilidad":
                get_data = get_disponibilidad
                break;
            case "rendimiento":
                get_data = get_rendimiento
                break;
            case "calidad":
                get_data = get_calidad
                break;
            default:
                get_data = () => { }
                break;
        }
        get_data()
        const interval = setInterval(() => {
            get_data()
        } , 15000)
        return () => clearInterval(interval)
    }, [props.datos.maquina_id, props.tipo])


    let stilo
    if (props.datos.ancho < props.datos.alto) {
        stilo = {
            width: props.datos.ancho * 20 + "vw"
        }
    }
    else {
        stilo = {
            height: props.datos.alto * 20 + "vh"
        }
    }

    let nombre
    switch (props.datos.tipo) {
        case "disponibilidad":
            nombre = "DISP"
            break;
        case "rendimiento":
            nombre = "REND"
            break;
        case "calidad":
            nombre = "CALI"
            break;
        default:
            nombre = "Error"
            break;
    }


    return (
        <>
            <div style={{ textAlign: "center" }}>
                <h3>{nombre} - {props.datos.abreviacion_maquina}</h3>
            </div>
            <Loader isLoading={isLoading}>
                {
                    vacio ?
                        <div className="alert alert-warning" style={{ textAlign: "center" }} role="alert">
                            No hay datos disponibles
                        </div>
                        :
                        <div className="outer">
                            <div className="middle">
                                <div className="inner">
                                    <div style={stilo}>
                                        <Doughnut data={datos} options={{ maintainAspectRatio: false }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </Loader>
        </>
    )

}

export function VisualEstado(props) {

    const [isLoading, setIsLoading] = useState(true);
    const [vacio, setVacio] = useState(false);
    const [estado, setEstado] = useState("");
    const [color, setColor] = useState("#ffffff");

    const get_estado = () => {
        axios.get("/api/panel/estado/" + props.datos.maquina_id)
            .then(res => {
                if (res.status === 204) {
                    setVacio(true)
                } else {
                    setVacio(false)
                    setEstado(res.data.estado)
                    setColor(res.data.color)
                }
                setIsLoading(false)
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        get_estado()
        const interval = setInterval(() => {
            get_estado()
        }, 10000)
        return () => clearInterval(interval)
    }, [props.datos.maquina_id])

    return (
        <>
            <div style={{ textAlign: "center" }}>
                <h3>ESTADO - {props.datos.abreviacion_maquina}</h3>
            </div>
            <Loader isLoading={isLoading}>
                {
                    vacio ?
                        <div className="alert alert-warning" style={{ textAlign: "center" }} role="alert">
                            No hay datos disponibles
                        </div>
                        :
                        <div className="outer">
                            <div className="middle">
                                <div className="inner">
                                    <div style={{ backgroundColor: color, width: "100%", height: "100%" }}>
                                        <div style={{ textAlign: "center", color: "white", fontSize: "2rem" }}>{estado}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </Loader>
        </>
    )
}

export function VisualProductividad(props) {
    return (
        <>
            <div style={{ textAlign: "center" }}>
                <h3>Productividad - {props.datos.abreviacion_maquina}</h3>
            </div>
            <div className="outer">
                <div className="middle">
                    <div className="inner">
                        <MiniCajaProductividad maquina={props.datos.maquina_id} nombre_maquina={props.datos.abreviacion_maquina} />
                    </div>
                </div>
            </div>
        </>
    )

}

export function SubVisualTemporizador(props) {

    useEffect(() => {
        const substractInterval = setInterval(() => {
            props.setTiempo(props.tiempo - 1)
        }, 1000)
        return () => {
            clearInterval(substractInterval)
        }

    }, [props.tiempo])

    const time2clock = (time) => {
        if (time < 0) {
            time *= -1
        }
        let horas = Math.floor(time / 3600)
        let minutos = Math.floor((time - (horas * 3600)) / 60)
        let segundos = time - (horas * 3600) - (minutos * 60)

        if (horas < 10) {
            horas = "0" + horas
        }
        if (minutos < 10) {
            minutos = "0" + minutos
        }
        if (segundos < 10) {
            segundos = "0" + segundos
        }

        if (horas === "00") {
            return minutos + ":" + segundos
        }
        return horas + ":" + minutos + ":" + segundos
    }

    return (
        <>
            <div style={{ textAlign: "center" }}>
                <h3>TEMPORIZADOR - {props.nombre}</h3>
            </div>
            <div className="outer">
                <div className="middle">
                    <div className="inner">
                        <div style={{ textAlign: "center", fontSize: props.fontsize, backgroundColor: props.tiempo > 0 ? "#ffffff" : "#e83333" }}>
                            <span>{time2clock(props.tiempo)}</span>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export function VisualTemporizador(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [vacio, setVacio] = useState(false);
    const [tiempo, setTiempo] = useState(0);

    const get_temporizador = () => {
        axios.get("/api/panel/infoTemporizador/" + props.datos.maquina_id)
            .then(res => {
                console.log(res.data)
                if (res.status === 204) {
                    setVacio(true)
                } else {
                    setVacio(false)
                    setTiempo(res.data.ciclo - res.data.ultima_pieza)
                }
                setIsLoading(false)
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        get_temporizador()
        const interval = setInterval(() => {
            get_temporizador()
        }, 10000)
        return () => clearInterval(interval)
    }, [props.datos.maquina_id])

    const minimo = Math.min(props.datos.ancho, props.datos.alto)
    const fontsize = minimo * 10 + (minimo === props.datos.ancho ? "vw" : "vh")

    return (
        <Loader isLoading={isLoading}>
            {
                vacio ?
                    <div className="alert alert-warning" style={{ textAlign: "center" }} role="alert">
                        No hay datos disponibles
                    </div>
                    :
                    <SubVisualTemporizador nombre={props.datos.abreviacion_maquina} tiempo={tiempo} setTiempo={setTiempo} fontsize={fontsize}/>
            }
        </Loader>
    )


}

export function VisualTimeline(props) {

    return (
        <>
            <div style={{ textAlign: "center" }}>
                <h3>TIMELINE - {props.datos.abreviacion_maquina}</h3>
            </div>
            <div className="outer">
                <div className="middle">
                    <div className="inner">
                        <Timeline maquina={props.datos.maquina_id} />
                    </div>
                </div>
            </div>
        </>
    )
}