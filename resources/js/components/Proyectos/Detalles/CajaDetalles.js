import React from "react";
import { Caja } from "../../generales";

function CajaDetalles({ proyecto }) {

    return (
        <Caja titulo="Detalles">
            <div className="row">
                <div className="col-md-12">
                    <h6>Nombre</h6>
                    <p>{proyecto.nombre}</p>
                    <h6>Descripción</h6>
                    <p>{proyecto.descripcion}</p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h6>Fecha de inicio</h6>
                    <p>{proyecto.fecha_inicio}</p>
                </div>
                <div className="col-md-6">
                    <h6>Fecha de fin</h6>
                    <p>{proyecto.fecha_fin}</p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h6>Estado</h6>
                    <p>{proyecto.estado}</p>
                </div>
                <div className="col-md-6">
                    <h6>Cliente</h6>
                    <p>{proyecto.cliente}</p>

                </div>
            </div>
        </Caja>
    )
}

export default CajaDetalles;