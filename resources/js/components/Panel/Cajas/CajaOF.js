import React, { useState, useEffect } from 'react'
import { Caja } from '../../generales'
import Loader from '../../Comun/Loader'
import axios from 'axios'
import { Link } from 'react-router-dom'


const date2str = (date) => {
    let mes = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    let dia = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    return date.getFullYear() + "-" + mes + "-" + dia
}

function CajaOF(props) {

    const [ofs, setOfs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [vacio, setVacio] = useState(false)

    useEffect(() => {
        $('#tb-ofs').DataTable().destroy()
        setIsLoading(true)
        getOfs()
        if (!props.desde) {
            const interval = setInterval(
                () => getOfs(),
                10000
            );
            return () => clearInterval(interval)
        }
    }, [props.maquina, props.desde, props.hasta])

    const getOfs = () => {
        let url = props.desde ?
            `/api/panel/ofs/${props.maquina}?desde=${date2str(props.desde)}&hasta=${date2str(props.hasta)}`
            :
            `/api/panel/ofs/${props.maquina}`
        axios.get(url)
            .then(res => {
                if (res.status === 200) {
                    setOfs(res.data)
                    setIsLoading(false)
                    setVacio(false)
                    $('#tb-ofs').DataTable()
                }
                else if (res.status === 204) {
                    setVacio(true)
                    setIsLoading(false)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <Caja titulo="Ofs de hoy">
            <div style={{ minHeight: '200px' }}>
                <Loader isLoading={isLoading}>
                    {
                        vacio ?
                            <div className="outer">
                                <div className="middle">
                                    <div className="inner">
                                        <h3>No hay OF disponibles</h3>
                                        <p>Puede dar de alta una nueva en la sección de entrada manual</p>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="table-responsive">
                                <table id="tb-ofs" >
                                    <thead>
                                        <tr>
                                            <th>Órden</th>
                                            <th>T. de ciclo </th>
                                            <th>Piezas</th>
                                            <th>Estado</th>
                                            <th>Inicio</th>
                                            <th>Fin</th>
                                            <th>Detalles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            ofs.map((of, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{of.of}</td>
                                                        <td>{of.tiempo_ciclo_teorico}</td>
                                                        <td>{of.total_piezas}</td>
                                                        <td>{of.estado}</td>
                                                        <td>{of.inicio.split(' ')[1]}</td>
                                                        <td>{of.fin.split(' ')[1]}</td>
                                                        <td><Link className="btn btn-info" to={"/of/" + of.id}>Detalles</Link></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                    }
                </Loader>
            </div>
        </Caja>
    )
}

export default CajaOF