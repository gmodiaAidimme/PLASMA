import React, { useEffect, useState } from "react";
import { TituloSeccion } from "../../generales";
import Loader from "../../Comun/Loader";
import axios from "axios";
import TarjetaProyecto from "./TarjetaProyecto";
import ModalNuevoProyecto from "./ModalNuevoProyecto";


function Proyectos() {

    const [proyectos, setProyectos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [proyectosVisibles, setProyectosVisibles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nuevosDatos, setNuevosDatos] = useState(0);

    useEffect(() => {
        axios.get("/api/proyectos")
            .then(res => {
                setProyectos(res.data.proyectos);
                setProyectosVisibles(res.data.proyectos);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            })
    }, [nuevosDatos])

    const filtrarProyectos = (e) => {
        const busqueda = e.target.value;
        if (busqueda === "") {
            setProyectosVisibles(proyectos);
        } else {
            const proyectosFiltrados = proyectos.filter(proyecto => {
                let prostring = proyecto.nombre + " " + proyecto.descripcion + " " + proyecto.fecha_inicio + " " + proyecto.fecha_fin;
                return prostring.toLowerCase().includes(busqueda.toLowerCase());
            })
            setProyectosVisibles(proyectosFiltrados);
        }
    }

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Proyectos" />
            <section className="content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <input type="text" className="form-control" placeholder="Buscar proyecto..." onChange={filtrarProyectos} />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <div className="card enlargable pointer newproject" onClick={() => setShowModal(true)}>
                                <i className="fas fa-plus plusproject"></i>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <Loader isLoading={isLoading} >
                            {
                                proyectosVisibles.map(
                                    proyecto => {
                                        return (
                                            <div className="col-md-4" key={proyecto.id}>
                                                <TarjetaProyecto
                                                    nombre={proyecto.nombre}
                                                    descripcion={proyecto.descripcion}
                                                    id={proyecto.id}
                                                    cliente={proyecto.cliente} />
                                            </div>
                                        )
                                    })
                            }

                        </Loader>
                    </div>
                </div>
                <ModalNuevoProyecto
                    show={showModal}
                    closeModal={() => setShowModal(false)}
                    nuevosDatos={nuevosDatos}
                    setNuevosDatos={setNuevosDatos}
                />
            </section>
        </div>

    )
}

export default Proyectos