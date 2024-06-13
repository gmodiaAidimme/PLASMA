import React from "react";
import { useNavigate } from "react-router-dom";

function EnlaceSeccion({ titulo, icono, ruta }) {

    const navigate = useNavigate()

    return (
        <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="info-box simple-enlargable" onClick={() => navigate(ruta)}>
                <span className="info-box-icon bg-info">
                    <i className={icono}></i>
                </span>
                <div className="info-box-content">
                    <span className="info-box-text">{titulo}</span>
                </div>
            </div>
        </div>
    )
}

export default EnlaceSeccion