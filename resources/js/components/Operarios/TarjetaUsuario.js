import React from "react";
import { useNavigate } from "react-router-dom";
import ImagenModelo from "../Comun/ImagenModelo";

export default function TarjetaUsuario(props) {

    const navigate = useNavigate()

    return (
        <div className="card card-widget widget-user-2 enlargable" style={{ cursor: "pointer" }} onClick={() => navigate('/operarios/' + props.id)}>
            <div className="widget-user-header">
                <div className="widget-user-image">
                    <ImagenModelo imagen={props.imagen} modelo="empleado" clase="img-circle elevation-2 avatar-operario"/>
                </div>
                <h3 className="widget-user-username">{props.nombre}</h3>
                <h5 className="widget-user-desc">{props.posicion}</h5>
            </div>
        </div>
    )

}