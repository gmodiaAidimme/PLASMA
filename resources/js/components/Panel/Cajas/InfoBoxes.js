import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { throwToast } from '../../../lib/notifications'
import Loader from '../../Comun/Loader'
import Modal from 'react-bootstrap/Modal'
import { traducirUnidades } from '../../../lib/cambioUnidades'
import { UnidadesContext } from '../../Context/UnidadesContext'

const date2str = (date) => {
    let mes = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    let dia = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    return date.getFullYear() + "-" + mes + "-" + dia
}

function CajaInicial({ tipo, valor, titulo, color, icono, isLoading, onClick }) {
    let valor_calc

    if (tipo === "tiempo" && valor !== "-") {
        //changes valor from seconds to a string with hours, minutes and seconds
        let horas = Math.floor(valor / 3600)
        let minutos = Math.floor((valor - (horas * 3600)) / 60)
        let segundos = valor - (horas * 3600) - (minutos * 60)
        if (minutos < 10) {
            minutos = "0" + minutos
        }
        if (segundos < 10) {
            segundos = "0" + segundos
        }
        valor_calc = horas + ":" + minutos + ":" + segundos
    } else {
        valor_calc = valor
    }

    return (
        <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12" style={{ cursor: "pointer" }} onClick={onClick}>
            <div className="info-box">
                <span className={"info-box-icon bg-" + color}><i className={"fas fa-" + icono}></i></span>
                <div className="info-box-content">
                    <Loader isLoading={isLoading} height="74px">
                        <span className="info-box-text">{titulo}</span>
                        <span style={{ marginTop: 0 }} className="info-box-number cajainicial-valor">{valor_calc}</span>
                    </Loader>
                </div>
            </div>
        </div>
    )
}

function SelectorOperarios({ show, onHide, maquina }) {
    const [isLoading, setIsLoading] = useState(true)
    const [selected, setSelected] = useState(0)
    const [posibilidades, setPosibilidades] = useState([])

    const { unidades } = useContext(UnidadesContext)

    useEffect(() => {
        if (show) {
            setIsLoading(true)
            axios.get("/api/panel/operarios_en_maquina/" + maquina)
                .then(res => {
                    setPosibilidades(res.data.rendimientos)
                    setSelected(res.data.operarios)
                    setIsLoading(false)
                })
                .catch(err => {
                    setIsLoading(false)
                    throwToast("Error", "No se pudo obtener el número de operarios", "error")
                    console.log(err)
                })
        }
    }, [maquina, show])

    const guardarOperarios = () => {
        setIsLoading(true)
        axios.post("/api/panel/operarios_en_maquina/" + maquina, { operarios: selected })
            .then(res => {
                setIsLoading(false)
                onHide()
            })
    }


    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Operarios trabajando</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-12">
                        <p>Selecciona el número de operarios que están trabajando en la máquina. Este dato se utiliza para calcular el rendimiento teórico y la productividad en las máquinas que tienen seleccionado el cálculo de rendimiento por operarios. Si no encuentras el número de operarios que buscas, deberás primero incluir los datos de productividad teórica en la sección de configuración.</p>
                    </div>
                    <div className="col-12">
                        <Loader isLoading={isLoading}>
                            {posibilidades.length === 0 ? <p>No hay datos de productividad teórica para esta máquina. Debes incluirlos en la sección de configuración.</p>
                                :
                                <div className="form-group">
                                    <label htmlFor="operarios">Operarios</label>
                                    <select className="form-control" id="operarios" value={selected} onChange={e => setSelected(e.target.value)}>
                                        {
                                            posibilidades.map((p, i) => {
                                                return (
                                                    <option key={i} value={p.numero_operarios}>{p.numero_operarios} operarios - {traducirUnidades(unidades, p.rendimiento_teorico)} segundos por pieza </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            }
                        </Loader>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={onHide}>Cancelar</button>
                <button type='button' className='btn btn-primary' style={{ disabled: isLoading }} onClick={guardarOperarios}>Guardar</button>
            </Modal.Footer>
        </Modal>
    )
}



function InfoBoxes(props) {
    const [estado, setEstado] = useState({
        fabricadas: '-',
        defectuosas: '-',
        funcionando: '-',
        parado: '-',
        operarios: '-',
        rendimiento: '-'
    })
    const [rendimiento_por_operarios, setRendimiento_por_operarios] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [seleccionandoOperarios, setSeleccionandoOperarios] = useState(false)

    const { unidades } = useContext(UnidadesContext)

    const stats_info = {
        fabricadas: {
            titulo: "Piezas fabricadas",
            descripcion: "Total de piezas fabricadas por la máquina en el día de hoy o en el rango de fechas seleccionado si estás en histórico. Si estás en el panel general, se muestra la suma de todas las piezas fabricadas por las máquinas.",
        },
        defectuosas: {
            titulo: "Piezas defectuosas",
            descripcion: "Total de piezas defectuosas fabricadas por la máquina en el día de hoy o en el rango de fechas seleccionado si estás en histórico. Para que esta estadística arroje un valor real, debe haber un control de calidad mediante el uso de órdenes de fabricación.",
        },
        funcionando: {
            titulo: "Tiempo funcionando",
            descripcion: "Tiempo total que la máquina ha estado funcionando en el día de hoy o en el rango de fechas seleccionado si estás en histórico. Si estás en el panel general, se muestra la suma de todas las horas de trabajo de las máquinas.",
        },
        parado: {
            titulo: "Tiempo paradas",
            descripcion: "Tiempo total que la máquina ha estado parada en el día de hoy o en el rango de fechas seleccionado si estás en histórico. Si estás en el panel general, se muestra la suma de todas las horas de parada de las máquinas.",
        },
        produccion: {
            titulo: "Producción media",
            descripcion: "Producción media de la máquina en el día de hoy o en el rango de fechas seleccionado si estás en histórico. Las unidades son las seleccionadas en el panel de configuración.",
        },
    }


    const abrirSelectorOperarios = () => {
        setSeleccionandoOperarios(true)
    }

    useEffect(() => {
        setIsLoading(true)
        getValue(props.maquina)
        if (!props.desde) {
            const refreshValue = setInterval(
                () => getValue(props.maquina),
                10000
            );
            return () => clearInterval(refreshValue)
        }
    }, [props.maquina, props.desde, props.hasta])

    function getValue(maquina) {
        let url = "/api/panel/indicadores/" + maquina
        if (props.desde) {
            url += `?desde=${date2str(props.desde)}&hasta=${date2str(props.hasta)}`
        }
        axios.get(url)
            .then(res => {
                if (res.status===200){
                    setEstado({
                        fabricadas: res.data.fabricadas,
                        defectuosas: res.data.defectuosas,
                        funcionando: res.data.funcionando,
                        parado: res.data.parado,
                        operarios: res.data.operarios,
                        rendimiento: res.data.rendimiento
                    })
                }
                else{
                    setEstado({
                        fabricadas: '-',
                        defectuosas: '-',
                        funcionando: '-',
                        parado: '-',
                        operarios: '-',
                        rendimiento: '-'
                    })
                }

                setRendimiento_por_operarios(res.data.rendimiento_por_operarios)
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                setEstado({
                    fabricadas: '-',
                    defectuosas: '-',
                    funcionando: '-',
                    parado: '-'
                })
                throwToast("Error", "No se pudo obtener el valor de los indicadores", "error")
                console.log(err)
            })
    }

    return (
        <div className="row">
            <CajaInicial isLoading={isLoading} titulo="Piezas fabricadas" color="info" icono="cubes" valor={estado.fabricadas} tipo="numero" onClick={() => throwToast(stats_info.fabricadas.titulo, stats_info.fabricadas.descripcion, "info")} />
            <CajaInicial isLoading={isLoading} titulo="Piezas defectuosas" color="red" icono="exclamation-triangle" valor={estado.defectuosas} tipo="numero" onClick={() => throwToast(stats_info.defectuosas.titulo, stats_info.defectuosas.descripcion, "info")} />
            <CajaInicial isLoading={isLoading} titulo="Tiempo funcionando" color="green" icono="stopwatch" valor={estado.funcionando} tipo="tiempo" onClick={() => throwToast(stats_info.funcionando.titulo, stats_info.funcionando.descripcion, "info")} />
            <CajaInicial isLoading={isLoading} titulo="Tiempo paradas" color="yellow" icono="pause-circle" valor={estado.parado} tipo="tiempo" onClick={() => throwToast(stats_info.parado.titulo, stats_info.parado.descripcion, "info")} />
            <CajaInicial isLoading={isLoading} titulo="Producción" color="blue" icono="chart-line" valor={traducirUnidades(unidades, estado.rendimiento)} tipo="numero" onClick={() => throwToast(stats_info.produccion.titulo, stats_info.produccion.descripcion, "info")} />
            <CajaInicial isLoading={isLoading} titulo="Operarios trabajando" color="purple" icono="users" valor={rendimiento_por_operarios ? estado.operarios : "Básico"} tipo="numero" onClick={abrirSelectorOperarios} />
            <SelectorOperarios show={seleccionandoOperarios} onHide={() => setSeleccionandoOperarios(false)} maquina={props.maquina} />
        </div>
    )
}

export default InfoBoxes