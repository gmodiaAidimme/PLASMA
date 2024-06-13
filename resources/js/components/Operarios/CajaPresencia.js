import React, { useDebugValue, useState } from "react";
import { Caja } from "../generales";
import Loader from "../Comun/Loader";
import { Pie } from "react-chartjs-2";
import { Button } from "bootstrap";
import { Modal, Spinner } from "react-bootstrap";
import axios from "axios";
import { Chart } from "react-google-charts";

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

function CajaPresencia({ presencia, operario }) {

    const [showModal, setShowModal] = useState();
    const [dia, setDia] = useState();
    const [retrievingData, setRetrievingData] = useState();
    const [options, setOptions] = useState({});
    const [dataTimeline, setDataTimeline] = useState([]);

    let total = presencia.reduce((a, b) => a + parseInt(b.tiempo), 0);

    const data = {
        labels: presencia.map(item => item.motivo),
        datasets: [
            {
                data: presencia.map(item => item.tiempo),
                backgroundColor: presencia.map(item => item.color),
            },
        ],
    };

    const retrieveTimeLine = (dia) => {
        setDia(dia)
        setRetrievingData(true)

        axios.get(`/api/operarios/${operario}/presencia_dia?fecha=${dia}`)
            .then((res) => {
                if (res.status === 204) {
                    setDataTimeline({})
                    return
                }

                let aux_data = [
                    [
                        { type: "string", id: "Room" },
                        { type: "string", id: "Name" },
                        { type: "date", id: "Start" },
                        { type: "date", id: "End" },
                    ]
                ]
                res.data.forEach(dato => {
                    aux_data.push([
                        '1',
                        dato.motivo,
                        new Date(0, 0, 0, dato.inicio.split(':')[0], dato.inicio.split(':')[1], 0),
                        new Date(0, 0, 0, dato.fin.split(':')[0], dato.fin.split(':')[1], 0),
                    ])
                })
                setDataTimeline(aux_data)

                setOptions({
                    timeline: { showRowLabels: false },
                    avoidOverlappingGridLines: false,
                    colors: [...new Set(res.data.map(a => a.color))]
                })
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => setRetrievingData(false))

    }

    let boton_timeline = <button type="button" className="btn btn-primary btn-sm" title="Línea de tiempo" onClick={() => setShowModal(true)}>
        Ver detalle diario
    </button>

    return (
        <>
            <Caja titulo="Presencia" emoji="📍" tools={boton_timeline}>
                <Loader isLoading={false} height="200px">
                    <div className="row">
                        <div className="col-md-6">
                            <div style={{ minHeight: "250px" }}>
                                <Pie data={data} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="outer">
                                <div className="middle">
                                    <div className="inner" style={{ textAlign: "center" }}>
                                        {
                                            presencia.map((x, i) => {
                                                return (
                                                    <div key={i}>
                                                        <span className="dot" style={{ backgroundColor: x.color }}></span>
                                                        <span style={{ fontSize: 20 }}> {x.motivo} - {secs2time(x.tiempo)} - {Math.round(1000 * x.tiempo / total) / 10}%</span>
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
                </Loader>
            </Caja>
            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Línea de tiempo de presencia</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="form-group">
                            <label htmlFor="inicio">Desde</label>
                            <input type="date" className="form-control" value={dia} onChange={(e) => retrieveTimeLine(e.target.value)} disabled={retrievingData} />
                        </div>
                    </div>
                    {!retrievingData && Object.keys(dataTimeline).length !== 0 ?
                        < Chart
                            chartType="Timeline"
                            data={dataTimeline}
                            width="100%"
                            height="100px"
                            options={options}
                        /> :
                        !retrievingData ?
                            <p>Sin datos para este día.</p> :
                            <><Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner></>

                    }
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CajaPresencia