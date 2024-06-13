import React, { useEffect, useState } from "react";
import { Caja } from "../../generales";
import { Doughnut } from 'react-chartjs-2';
import Loader from "../../Comun/Loader";

const date2str = (date) => {
    let mes = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    let dia = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    return date.getFullYear() + "-" + mes + "-" + dia
}

function PanelDoughnuts(props) {
    return (
        <>
            <div className="row">
                <div className="col-md-6">
                    <div className="simple-enlargable" onClick={() => props.setVista("oee")}>
                        <div style={{ textAlign: "center" }}>
                            <h3>OEE</h3>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '7vw' }}>
                            <span >{props.oee}%</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="simple-enlargable" onClick={() => props.setVista("disponibilidad")}>
                        <div style={{ textAlign: "center" }}>
                            <h3>Disponibilidad</h3>
                        </div>
                        <div style={{ minHeight: "250px" }}>
                            <Doughnut data={props.disponibilidad} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="simple-enlargable" onClick={() => props.setVista("rendimiento")}>
                        <div style={{ textAlign: "center" }}>
                            <h3>Rendimiento</h3>
                        </div>
                        <div style={{ minHeight: "250px" }}>
                            <Doughnut data={props.rendimiento} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="simple-enlargable" onClick={() => props.setVista("calidad")}>
                        <div style={{ textAlign: "center" }}>
                            <h3>Calidad</h3>
                        </div>
                        <div style={{ minHeight: "250px" }}>
                            <Doughnut data={props.calidad} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

function BotonVolver(props) {
    return (
        <div className="row">
            <div className="col-md-12">
                <button className="btn btn-outline-primary" onClick={() => props.setVista("doughnuts")}><i className="fas fa-arrow-left"></i> Volver </button>
            </div>
        </div>
    )
}

function secs2time(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }

    if (hours == 0) {
        return minutes + ':' + seconds;
    } else {
        return hours + ':' + minutes + ':' + seconds;
    }
}

function PanelDisponibilidad(props) {

    let total = props.reg_disponibilidad.reduce((a, b) => a + parseInt(b.cantidad), 0);

    return (
        <>
            <BotonVolver setVista={props.setVista} />
            <div className="row">
                <div className="col-md-6">
                    <div style={{ textAlign: "center" }}>
                        <h3>Disponibilidad</h3>
                    </div>
                    <div style={{ minHeight: "250px" }}>
                        <Doughnut data={props.disponibilidad} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="outer">
                        <div className="middle">
                            <div className="inner" style={{ textAlign: "center" }}>
                                {
                                    props.reg_disponibilidad.map((x, i) => {
                                        return (
                                            <div key={i}>
                                                <span className="dot" style={{ backgroundColor: x.color }}></span>
                                                <span style={{ fontSize: 20 }}> {x.nombre} - {secs2time(x.cantidad)} - {Math.round(1000 * x.cantidad / total) / 10}%</span>
                                                <hr />
                                            </div>

                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function PanelRendimiento(props) {
    return (
        <>
            <BotonVolver setVista={props.setVista} />
            <div className="row">
                <div className="col-md-6">
                    <div style={{ textAlign: "center" }}>
                        <h3>Rendimiento</h3>
                    </div>
                    <div style={{ minHeight: "250px" }}>
                        <Doughnut data={props.rendimiento} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="outer">
                        <div className="middle">
                            <div className="inner" style={{ textAlign: "center" }}>
                                <span style={{ fontSize: 20 }}>Tiempo teórico - {secs2time(props.reg_rendimiento.tiempo_plan)}</span>
                                <hr />
                                <span style={{ fontSize: 20 }}>Tiempo real - {secs2time(props.reg_rendimiento.tiempo_real)}</span>
                                <hr />
                                <span style={{ fontSize: 20 }}>Pérdida de rendimiento - {secs2time(props.reg_rendimiento.tiempo_real - props.reg_rendimiento.tiempo_plan)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function PanelCalidad(props) {

    return (
        <>
            <BotonVolver setVista={props.setVista} />
            <div className="row">
                <div className="col-md-6">
                    <div style={{ textAlign: "center" }}>
                        <h3>Calidad</h3>
                    </div>
                    <div style={{ minHeight: "250px" }}>
                        <Doughnut data={props.calidad} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="outer">
                        <div className="middle">
                            <div className="inner" style={{ textAlign: "center" }}>
                                {
                                    props.reg_calidad.map((x, i) => {
                                        return (
                                            <div key={i}>
                                                <span className="dot" style={{ backgroundColor: x.color }}></span>
                                                <span style={{ fontSize: 20 }}> {x.nombre} - {x.cantidad} pz - {Math.round(1000 * x.cantidad / props.reg_calidad.reduce((a, b) => a + parseInt(b.cantidad), 0)) / 10}%</span>
                                                <hr />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function PanelOEE(props) {

    return (
        <>
            <BotonVolver setVista={props.setVista} />
            <div className="row">
                <div className="col-md-6">
                    <div style={{ textAlign: "center" }}>
                        <h3>OEE</h3>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '7vw' }}>
                        <span >{props.oee}%</span>
                    </div>
                </div>
                <div className="col-md-6" >
                    <div className="outer">
                        <div className="middle">
                            <div className="inner" style={{ textAlign: "center" }}>
                                <span style={{ fontSize: 20 }}>Disponibilidad: {props.ratios.disponibilidad}%</span>
                                <br /><hr />
                                <span style={{ fontSize: 20 }}>Rendimiento: {props.ratios.rendimiento}%</span>
                                <br /><hr />
                                <span style={{ fontSize: 20 }}>Calidad: {props.ratios.calidad}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function CajaDoughnuts(props) {
    const [disponibilidad, setDisponibilidad] = useState({})
    const [rendimiento, setRendimiento] = useState({})
    const [calidad, setCalidad] = useState({})

    const [reg_disponibilidad, setReg_disponibilidad] = useState({})
    const [reg_rendimiento, setReg_rendimiento] = useState({})
    const [reg_calidad, setReg_calidad] = useState({})

    const [ratios, setRatios] = useState({ disponibilidad: 0, rendimiento: 0, calidad: 0 })
    const [oee, setOee] = useState(0)

    const [isLoading, setIsLoading] = useState(true)
    const [vista, setVista] = useState("doughnuts")

    const [vacio, setVacio] = useState(false)

    useEffect(() => {
        get_data()
        
        if (!props.desde) {
            const inteval = setInterval(() => {
                get_data()
            }, 10000)
            return () => clearInterval(inteval)
        }
    }, [props.maquina, props.desde, props.hasta])

    const get_data = () => {
        let url=''
        if(props.proyecto){
            url = `/api/proyectos/${props.proyecto}/diales`
        }
        else if(props.operario){
            url = `/api/operarios/${props.operario}/diales?desde=${props.desde}&hasta=${props.hasta}`
        }
        else{
            url = props.desde ? `/api/panel/diales/${props.maquina}?desde=${date2str(props.desde)}&hasta=${date2str(props.hasta)}`:`/api/panel/diales/${props.maquina}`
        }
        axios.get(url)
            .then(res => {

                if (res.status === 204) {
                    setVacio(true)
                } else {

                    let aux_oee = 1
                    let aux_ratios = { disponibilidad: 0, rendimiento: 0, calidad: 0 }

                    // DISPONIBILIDAD

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
                    setDisponibilidad(disp_aux)
                    setReg_disponibilidad(res.data.disponibilidad)

                    let buenas = parseInt(res.data.disponibilidad[0].cantidad)
                    let total = 0
                    for (let i = 0; i < res.data.disponibilidad.length; i++) {
                        total += parseInt(res.data.disponibilidad[i].cantidad)
                    }
                    aux_oee *= buenas / total
                    aux_ratios.disponibilidad = Math.round(buenas / total * 10000) / 100


                    // RENDIMIENTO
                    let porc_rend = 100 * res.data.rendimiento.tiempo_plan / res.data.rendimiento.tiempo_real
                    // console.log(res.data)
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
                    setRendimiento(rend_aux)
                    setReg_rendimiento(res.data.rendimiento)

                    aux_oee *= res.data.rendimiento.tiempo_plan / res.data.rendimiento.tiempo_real
                    aux_ratios.rendimiento = Math.round(porc_rend * 10) / 10

                    // CALIDAD
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
                    setCalidad(calidad_aux)
                    setReg_calidad(res.data.calidad)

                    let buenas_calidad = res.data.calidad[0].cantidad
                    let total_calidad = 0
                    for (let i = 0; i < res.data.calidad.length; i++) {
                        total_calidad += parseInt(res.data.calidad[i].cantidad)
                    }
                    aux_oee *= buenas_calidad / total_calidad
                    aux_ratios.calidad = Math.round(buenas_calidad / total_calidad * 10000) / 100

                    setRatios(aux_ratios)
                    setOee(Math.round(100 * aux_oee))
                    setVacio(false)
                }
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <Caja titulo="Estadísticas">
            <Loader isLoading={isLoading} height="500px" >
                {
                    vacio ?
                        <div style={{ height: "500px" }} >
                            <div className="outer">
                                <div className="middle">
                                    <div className="inner">
                                        <h3>No hay datos disponibles</h3>
                                        <p>Por favor, seleccione {props.operario ? "otro operario o cambie las fechas" : "otra máquina o cambie las fechas"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        (() => {
                            switch (vista) {
                                case "doughnuts": return <PanelDoughnuts setVista={setVista} disponibilidad={disponibilidad} rendimiento={rendimiento} calidad={calidad} oee={oee} />
                                case "disponibilidad": return <PanelDisponibilidad setVista={setVista} disponibilidad={disponibilidad} reg_disponibilidad={reg_disponibilidad} />
                                case "rendimiento": return <PanelRendimiento setVista={setVista} rendimiento={rendimiento} reg_rendimiento={reg_rendimiento} />
                                case "calidad": return <PanelCalidad setVista={setVista} calidad={calidad} reg_calidad={reg_calidad} />
                                case "oee": return <PanelOEE setVista={setVista} oee={oee} ratios={ratios} />
                                default: break;
                            }
                        })()
                }
            </Loader>
        </Caja >
    )
}

export default CajaDoughnuts;