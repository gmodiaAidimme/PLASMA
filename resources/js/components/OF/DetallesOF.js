import React, { useState, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { Caja, TituloSeccion } from "../generales";
import Loader from "../Comun/Loader";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import CajaTimeLine from "../Panel/Cajas/CajaTimeline";
import CajaProductividad from "../Panel/Cajas/CajaProductividad";
import CajaAcciones from "./CajaAcciones";



function dateTimeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' - ' + hour + ':' + min + ':' + sec;
    return time;
}

function timeConverter(seconds) {
    var sec_num = parseInt(seconds, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}

function diferenciaRel(a, b) {
    return Math.round(1000 * (a - b) / b) / 10;
}

function mayusculizar(palabra) {
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}

function CajaStat(props) {
    const [stat, setStat] = useState([]);
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const { of } = useParams();

    useEffect(() => {
        axios.get(`/api/of/${props.stat}/${of}`)
            .then(res => {
                setStat(res.data);
                let pretotal = 0
                res.data.forEach(element => {
                    pretotal += parseInt(element.cantidad);
                    //console.log(pretotal);
                });
                setTotal(pretotal);

                let data_aux = {
                    labels: res.data.map(a => a.nombre),
                    datasets: [
                        {
                            label: mayusculizar(props.stat),
                            data: res.data.map(a => a.cantidad),
                            backgroundColor: res.data.map(a => a.color)
                        }
                    ]
                }
                setData(data_aux);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
            })
    }, [of, props.actualizacion]);

    return (
        <Caja titulo={mayusculizar(props.stat)} emoji={props.emoji}>
            <div className="row">
                {
                    props.invertido ?
                        <div className="col-md-6">
                            <Loader isLoading={isLoading} height="240px">
                                <Bar data={data} options={{ maintainAspectRatio: false }} />
                            </Loader>
                        </div>
                        :
                        null
                }
                <div className="col-md-6">
                    <table className="table">
                        <tbody>
                            <tr>
                                <th>#</th>
                                <th>Estado</th>
                                <th>{props.temporal ? "Tiempo" : "Cantidad"}</th>
                                <th>Porcentaje</th>
                                <th>Color</th>
                            </tr>
                            {
                                stat.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.nombre}</td>
                                            <td>{props.temporal ? timeConverter(item.cantidad) : item.cantidad}</td>
                                            <td>{Math.round(1000 * parseInt(item.cantidad) / total) / 10}%</td>
                                            <td><span className="dot" style={{ backgroundColor: item.color }}></span></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                {
                    !props.invertido ?
                        <div className="col-md-6">
                            <Loader isLoading={isLoading} height="240px">
                                <Bar data={data} options={{ maintainAspectRatio: false }} />
                            </Loader>
                        </div>
                        :
                        null
                }
            </div>
        </Caja>
    )
}

function CajaEmpleados() {

    const [empleados, setEmpleados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { of } = useParams();

    useEffect(() => {
        axios.get(`/api/of/empleadosof/${of}`)
            .then(res => {
                // console.log(res.data);
                setEmpleados(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }, [of])


    return (
        <Caja titulo="Empleados en esta OF" emoji="👷‍♂️">
            <Loader isLoading={isLoading} height="250px">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Puesto</th>
                            <th>Email</th>
                            <th align="center">Estadisticas</th>
                        </tr>
                    </thead>
                    <tbody id="tb-empleados">
                        {
                            empleados.map((empleado, index) => {
                                return (
                                    <tr key={index}>
                                        <td><img src={"/images/" + empleado.opeario.imagen} className="avatar" alt="empleado" /></td>
                                        <td>{empleado.operario.nombre}</td>
                                        <td>{empleado.operario.apellido}</td>
                                        <td>{empleado.operario.posicion}</td>
                                        <td>{empleado.operario.email}</td>
                                        <td align="center">
                                            <Link className="btn btn-primary" to={`/operario/${empleado.operario.id}`}>
                                                <i className="fas fa-chart-bar"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </Loader>
        </Caja>
    )
}

function CajaInforme(props) {

    const [isLoading, setIsLoading] = useState(true);
    const [informe, setInforme] = useState({});
    const [vacio, setVacio] = useState(false);

    const { of } = useParams();

    useEffect(() => {
        axios.get(`/api/of/informe/${of}`)
            .then(res => {
                if (res.status === 204) {
                    setVacio(true);
                }
                else {
                    setInforme(res.data);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }, [of])

    return (
        <Caja titulo="Informe de OF" emoji="📝">

            <Loader isLoading={isLoading} height="481px">
                {
                    isLoading ?
                        null
                        :
                        vacio ?
                            <div className="alert alert-warning" role="alert">
                                <h4 className="alert-heading">No hay informe para esta OF</h4>
                                <p>No se han registrado datos para esta OF</p>
                            </div>
                            :
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th>#</th>
                                        <th>Resultado</th>
                                        <th>Real</th>
                                        <th>Planificado</th>
                                        <th>Diferencia</th>
                                    </tr>
                                    <tr>
                                        <td>1.</td>
                                        <td>Número de piezas</td>
                                        <td><span> {informe.piezas.real}</span></td>
                                        <td><span> {informe.piezas.plan}</span></td>
                                        <td><span className="badge badge-info">{informe.piezas.real - informe.piezas.plan} ({diferenciaRel(informe.piezas.real, informe.piezas.plan)} %)</span></td>
                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td>Inicio</td>
                                        <td>{dateTimeConverter(informe.inicio.plan)}</td>
                                        <td>{dateTimeConverter(informe.inicio.plan)}</td>
                                        <td><span className="badge badge-info">{timeConverter(informe.inicio.real - informe.inicio.plan)}</span></td>
                                    </tr>
                                    <tr>
                                        <td>3.</td>
                                        <td>Fin</td>
                                        <td>{dateTimeConverter(informe.fin.real)}</td>
                                        <td>{dateTimeConverter(informe.fin.plan)}</td>
                                        <td><span className="badge badge-info">{timeConverter(informe.fin.real - informe.fin.plan)}</span></td>
                                    </tr>
                                    <tr>
                                        <td>4.</td>
                                        <td>Tiempo total</td>
                                        <td><span> {timeConverter(informe.tiempo.real)}</span></td>
                                        <td><span> {timeConverter(informe.tiempo.plan)}</span></td>
                                        <td><span className="badge badge-info">{diferenciaRel(informe.tiempo.plan, informe.tiempo.real)} %</span></td>
                                    </tr>
                                    <tr>
                                        <td>5.</td>
                                        <td>Tiempo de parada</td>
                                        <td><span> {timeConverter(informe.tiempo_parado.real)}</span></td>
                                        <td><span> {timeConverter(informe.tiempo_parado.plan)}</span></td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>6.</td>
                                        <td>Tiempo efectivo</td>
                                        <td><span> {timeConverter(informe.tiempo_efectivo.real)}</span></td>
                                        <td><span> {timeConverter(informe.tiempo_efectivo.plan)}</span></td>
                                        <td><span className="badge badge-info">{diferenciaRel(informe.tiempo_efectivo.plan, informe.tiempo_efectivo.real)} %</span></td>
                                    </tr>
                                    <tr>
                                        <td>7.</td>
                                        <td>Tiempo de ciclo</td>
                                        <td>{Math.round(10 * informe.ciclo.real) / 10} segs</td>
                                        <td>{informe.ciclo.plan} segs</td>
                                        <td><span className="badge badge-info">{diferenciaRel(informe.ciclo.plan, informe.ciclo.real)} %</span></td>
                                    </tr>
                                    <tr>
                                        <td>8.</td>
                                        <td>Estado de la orden</td>
                                        <td>{informe.estado}</td>
                                        <td></td>
                                        <td><span className="badge badge-info"></span></td>
                                    </tr>
                                </tbody>
                            </table>
                }
            </Loader>
        </Caja>
    )
}

function DetallesOF() {

    const { of } = useParams();

    const [actualizacionCalidad, setActualizacionCalidad] = useState(0);

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Detalles OF" />
            <section className="content">

                <CajaStat stat="disponibilidad" emoji="🚧" temporal />
                <CajaStat stat="rendimiento" emoji="🏎" invertido temporal />
                <CajaStat stat="calidad" emoji="✨" actualizacion={actualizacionCalidad}/>

                <CajaTimeLine of={of} />

                <div className="row">
                    <div className="col-md-6">
                        <CajaInforme />
                        <CajaAcciones actCalidad={() => setActualizacionCalidad(actualizacionCalidad+1)}/>
                    </div>
                    <div className="col-md-6">
                        <CajaProductividad of={of} emoji="💪" />
                        <CajaEmpleados />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default DetallesOF;