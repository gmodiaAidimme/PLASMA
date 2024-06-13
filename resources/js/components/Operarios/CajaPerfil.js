import React from "react";
import { Caja } from "../generales";
import Loader from "../Comun/Loader";
import { LazyLoadImage } from 'react-lazy-load-image-component';

function CajaPerfil({ operario }) {

    const default_image = "/images/empleado/default.png"

    const handleError = (event) => {
        event.target.src = default_image;
    };

    return (
        <Caja titulo="Datos personales" emoji="👷‍♂️">
            <Loader isLoading={operario.id === ""} height="200px">
                <div className="row">
                    <div className="col-lg-12 col-xl-4">

                        <div className="widget-user-image" style={{ textAlign: "center" }}>
                            <LazyLoadImage
                                placeholder={<p>Cargando...</p>}
                                className="img-circle elevation-2 avatar-operario"
                                alt="Avatar empleado"
                                effect="blur"
                                src={`/images/${operario.imagen}`} 
                                onError={handleError}
                                />
                        </div>
                        <div className="spaceup" style={{ textAlign: "center" }}>
                            <h3>{operario.nombre + " " + operario.apellido}</h3>
                            <h5>{operario.posicion}</h5>
                        </div>

                    </div>
                    <div className="col-lg-12 col-xl-8">
                        <span><i className="fas fa-id-badge"></i> <b>Id operario:</b> {operario.id}</span>
                        <br /><hr />
                        <span><i className="fas fa-envelope"></i> <b>Correo electrónico:</b> {operario.email}</span>
                        <br /><hr />
                        <span><i className="fas fa-phone"></i> <b>Teléfono:</b> {698754321}</span>
                        <br /><hr />
                        <span><i className="fas fa-map-marker-alt"></i> <b>Dirección:</b> Calle falsa 123</span>
                        <br /><hr />
                        <span><i className="fas fa-birthday-cake"></i> <b>Fecha de nacimiento:</b> 20/10/1990</span>
                        <br /><hr />
                        <span><i className="fas fa-venus-mars"></i> <b>Sexo:</b> Hombre</span>
                        <br /><hr />
                        <span><i className="fas fa-calendar-alt"></i> <b>Fecha de alta:</b> {operario.created_at.split("T")[0]}</span>
                    </div>
                </div>
            </Loader>
        </Caja>
    )
}

export default CajaPerfil;