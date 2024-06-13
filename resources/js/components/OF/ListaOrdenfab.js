import React, { useState, useEffect } from "react";
import { Caja, TituloSeccion } from "../generales";
import Loader from "../Comun/Loader";
import { Link } from "react-router-dom";

function ListaOrdenFab() {

    const [ordenes, setOrdenes] = useState([]);
    const [isloading, setIsloading] = useState(true);

    useEffect(() => {
        actualizarRegistros();
    }, []);

    function actualizarRegistros() {
        axios.get('/api/modelo/of')
            .then(res => {
                $('#tb-of').DataTable().destroy()
                if (res.data.datos.length > 0) {
                    setOrdenes(res.data.datos)
                    setIsloading(false);
                    $('#tb-of').DataTable()
                }
                else {
                    setOrdenes([]);
                    setIsloading(false);
                }
            })
            .catch(err => {
                console.log("Se ha producido un error al obtener las ordenes de fabricación");
            })
    }
    
    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Órdenes de fabricación" />
            <section className="content">
                <div className="container">
                    <Caja titulo="Lista de Ordenes de Fabricación" emoji="📓">
                        <Loader isLoading={isloading} height="360px">
                            <table className="display" id="tb-of">
                                <thead>
                                    <tr>
                                        <th>Ord. fabricación</th>
                                        <th>Maquina</th>
                                        <th>Total piezas</th>
                                        <th>Tiempo ciclo teórico (s)</th>
                                        <th className="derecha">Detalles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ordenes.map(orden => {
                                            return (
                                                <tr key={orden.id}>
                                                    <td>{orden.of}</td>
                                                    <td>{orden.maquina_id}</td>
                                                    <td>{orden.total_piezas}</td>
                                                    <td>{orden.tiempo_ciclo_teorico}</td>
                                                    <td className="derecha">
                                                        <Link to={`/of/${orden.id}`}>
                                                            <button className="btn btn-primary btn-sm">
                                                                <i className="fa fa-eye"></i> Ver detalles
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </Loader>
                    </Caja>
                </div>
            </section>
        </div>
    )
}

export default ListaOrdenFab;