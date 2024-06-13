import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Loader from "../../Comun/Loader";
import { Caja } from "../../generales";
import 'chartjs-adapter-date-fns';
import axios from "axios";

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

const date2str = (date) => {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

export function MiniCajaProductividad(props) {
    const [data, setData] = useState({
        datasets: [{
            label: 'Piezas fabricadas',
            data: [],
            fill: false,
            borderColor: "#14a3ba",
            cubicInterpolationMode: 'monotone'
        }]
    });

    const [isLoading, setIsLoading] = useState(true);
    const [vacio, setVacio] = useState(false);

    useEffect(() => {
        get_data();
        if (!props.desde) {
            const interval = setInterval(() => {
                get_data();
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [props.maquina, props.of, props.desde, props.hasta]);

    const get_data = () => {
        let url = props.of ? `/api/panel/productividadOF/${props.of}` : `/api/panel/productividad/${props.maquina}`

        if (props.desde) {
            url += `?desde=${date2str(props.desde)}&hasta=${date2str(props.hasta)}`
        }

        axios.get(url)
            .then(res => {
                if (res.status === 204) {
                    setVacio(true);
                } else {
                    let aux_data = {
                        datasets: [{
                            label: 'Piezas fabricadas',
                            data: [],
                            fill: false,
                            borderColor: "#14a3ba",
                            cubicInterpolationMode: 'monotone'
                        },{
                            label: 'Óptimo',
                            data: [],
                            fill: false,
                            borderColor: "#c94242",
                            cubicInterpolationMode: 'monotone'
                        }]
                    }
                    res.data.productividad.forEach(element => {
                        aux_data.datasets[0].data.push({ x: element.datetime, y: element.cantidad });
                        aux_data.datasets[1].data.push({ x: element.datetime, y: element.optimo });
                    });
                    setData(aux_data);
                    setVacio(false);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            xAxes: {
                type: 'time',
                time: {
                    unit: 'minute',
                }
            }
        },
    };

    let titulo = "Productividad";
    if (props.nombre_maquina) {
        titulo = "Productividad - " + props.nombre_maquina;
    }

    return (

        <Loader isLoading={isLoading} height="385px">
            {
                vacio ?
                    <div className="outer" style={{ marginTop: "20px" }}>
                        <div className="middle">
                            <div className="inner">
                                <h3>No hay datos disponibles</h3>
                                <p>Por favor, seleccione otra máquina</p>
                            </div>
                        </div>
                    </div>
                    :
                    <Line options={options} data={data} />
            }
        </Loader>
    )
}

function CajaProductividad(props) {
    let titulo = "Productividad";
    if (props.nombre_maquina) {
        titulo = "Productividad - " + props.nombre_maquina;
    }

    return (
        <Caja titulo={titulo} emoji={props.emoji}>
            <div style={{ minHeight: '385px' }}>
                <MiniCajaProductividad {...props} />
            </div>
        </Caja >
    )
}


export default CajaProductividad;