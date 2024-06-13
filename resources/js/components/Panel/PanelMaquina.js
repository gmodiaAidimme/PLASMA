import React, { useState, useEffect } from "react";
import { TituloSeccion } from "../generales";
import TarjetaMaquina from "./TarjetaMaquina";
import axios from "axios";
import Loader from "../Comun/Loader";

function PanelMaquina() {
    const [maquinas, setMaquinas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [maquinasVisibles, setMaquinasVisibles] = useState([]);

    useEffect(() => {
        axios.get("/api/modelo/maquina")
            .then(res => {
                setMaquinas(res.data.datos);
                setMaquinasVisibles(res.data.datos);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            })
    }, [])

    const filtrarMaquinas = (e) => {
        const busqueda = e.target.value;
        if (busqueda === "") {
            setMaquinasVisibles(maquinas);
        } else {
            const maquinasFiltradas = maquinas.filter(maquina => {
                let maqstring = maquina.nombre + " " + maquina.modelo + " " + maquina.marca + " " + maquina.numero_serie;
                return maqstring.toLowerCase().includes(busqueda.toLowerCase());
            })
            setMaquinasVisibles(maquinasFiltradas);
        }
    }

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Maquinas" />
            <section className="content">
                <div className="container" >
                    <div className="row">
                        <div className="col-md-12">
                            <input type="text" className="form-control" placeholder="Buscar máquina..." onChange={filtrarMaquinas} />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <Loader isLoading={isLoading} >
                            {
                                maquinasVisibles.map(
                                    maquina => {
                                        return (
                                            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={maquina.id}>
                                                <TarjetaMaquina nombre={maquina.nombre} abreviacion={maquina.abreviacion} id={maquina.id} imagen={maquina.imagen} />
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

export default PanelMaquina;
