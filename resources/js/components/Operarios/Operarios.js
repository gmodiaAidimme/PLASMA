import React, { useEffect, useState } from "react";
import TarjetaUsuario from "./TarjetaUsuario";
import { TituloSeccion } from "../generales";
import Loader from "../Comun/Loader";
import axios from "axios";

export default function Operarios() {
    const [operarios, setOperarios] = useState([]);
    const [operariosVisibles, setOperariosVisibles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/operarios")
            .then(res => {
                setOperarios(res.data);
                setOperariosVisibles(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            })
    }, [])

    const filtrarOperarios = (e) => {
        const busqueda = e.target.value;
        if (busqueda === "") {
            setOperariosVisibles(operarios);
        } else {
            const operariosFiltrados = operarios.filter(operario => {
                let opstring = operario.nombre + " " + operario.apellido + " " + operario.email + " " + operario.posicion;
                return opstring.toLowerCase().includes(busqueda.toLowerCase());
            })
            setOperariosVisibles(operariosFiltrados);
        }
    }

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Operarios" />
            <section className="content">
                <div className="container" >
                    <div className="row">
                        <div className="col-md-12">
                            <input type="text" className="form-control" placeholder="Buscar operario" onChange={filtrarOperarios} />
                        </div>
                    </div>
                    <div className="row mt-3" >
                        <Loader isLoading={isLoading} height="360px">

                            {
                                operariosVisibles.map(operario => {
                                    return (
                                        <div className="col-md-4" key={operario.id}>
                                            <TarjetaUsuario nombre={operario.nombre + " " + operario.apellido} posicion={operario.posicion} id={operario.id} email={operario.email} imagen={operario.imagen} />
                                        </div>
                                    )
                                })
                            }

                        </Loader>
                    </div>
                </div>
            </section>
        </div>
    )
}