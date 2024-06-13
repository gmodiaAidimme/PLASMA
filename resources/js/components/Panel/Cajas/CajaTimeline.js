import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import Loader from "../../Comun/Loader";
import { Caja } from "../../generales";


export function Timeline(props) {
    const [data, setData] = useState([])
    const [options, setOptions] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const [vacio, setVacio] = useState(false)

    const get_data = () => {
        const url = props.of?`/api/panel/timelineOF/${props.of}`:`/api/panel/timeline/${props.maquina}`

        axios.get(url)
            .then(res => {
                // console.log(res.data)
                if (res.status === 204) {
                    setVacio(true)
                }
                else {
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
                            dato.nombre,
                            new Date(0, 0, 0, dato.inicio.hora, dato.inicio.minuto, 0),
                            new Date(0, 0, 0, dato.fin.hora, dato.fin.minuto, 0),
                        ])
                    })
                    setData(aux_data)

                    setOptions({
                        timeline: { showRowLabels: false },
                        avoidOverlappingGridLines: false,
                        colors: [...new Set(res.data.map(a => a.color))]
                    })
                }
                setIsLoading(false)
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        get_data()
        const interval = setInterval(() => {
            get_data()
        }, 10000)
        return () => clearInterval(interval)
    }, [props.maquina])

    return (
        <Loader isLoading={isLoading}>
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
                    <Chart
                        chartType="Timeline"
                        data={data}
                        width="100%"
                        height="100px"
                        options={options}
                    />
            }
        </Loader>

    )

}

function CajaTimeLine(props) {

    return (
        <Caja titulo="Timeline">
            <div style={{ minHeight: "80px" }}>
                {props.of ? <Timeline of={props.of} /> : <Timeline maquina={props.maquina} />}
            </div>
        </Caja>
    )
}

export default CajaTimeLine