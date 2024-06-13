import React from "react";
import { useNavigate } from "react-router-dom";


function TarjetaProyecto({ nombre, descripcion, id, cliente }) {

    let navigate = useNavigate();

    return (
        <div className="card enlargable pointer" onClick={() => navigate('/proyectos/' + id)}>
            <div className="card-header">
                <h3 className="card-title">{nombre}</h3>
            </div>
            <div className="card-body">
                <p>{descripcion}</p>
                <p><b>Cliente: </b> {cliente}</p>
            </div>
        </div>
    )
}

export default TarjetaProyecto;

