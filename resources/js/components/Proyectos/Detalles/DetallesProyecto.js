import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { TituloSeccion } from "../../generales";
import CajaHoras from "./CajaHoras";
import CajaDetalles from "./CajaDetalles";
import Loader from "../../Comun/Loader";
import CajaMaquinas from "./CajaMaquinas";
import CajaOperarios from "./CajaOperarios";
import CajaDias from "./CajaDias";
import CajaDoughnuts from "../../Panel/Cajas/CajaDoughnuts";

function DetallesProyecto() {

    let { id } = useParams()

    const [proyecto, setProyecto] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [ordenes, setOrdenes] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [maquinas, setMaquinas] = useState([]);
    const [horas, setHoras] = useState({
        horasEstimadas: 0,
        horasTrabajadas: 0
    });
    const [dias, setDias] = useState([]);

    useEffect(() => {
        axios.get("/api/proyectos/" + id)
            .then(res => {
                setProyecto(res.data.proyecto);
                setOrdenes(res.data.ordenes);
                setRegistros(res.data.registros);
                setEmpleados(res.data.empleados);
                setMaquinas(res.data.maquinas);
                setHoras({
                    horasEstimadas: res.data.horasEstimadas,
                    horasTrabajadas: res.data.horasTrabajadas
                });
                setDias(res.data.dias);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Detalles proyecto" />
            <section className="content">
                <div className="container">
                    <Loader isLoading={isLoading} >
                    <div className="row">
                        <div className="col-md-12">
                            <CajaHoras horasEstimadas={horas.horasEstimadas} horasTrabajadas={horas.horasTrabajadas} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <CajaDias dias={dias} />
                            <CajaDetalles proyecto={proyecto}/>
                            <CajaOperarios operarios={empleados}/>
                        </div>
                        <div className="col-md-6"> 
                            <CajaDoughnuts proyecto={id} desde="estatico"/>
                            <CajaMaquinas maquinas={maquinas}/>
                        </div>
                    </div>
                    </Loader>
                </div>
            </section>
        </div>
    )
}

export default DetallesProyecto;