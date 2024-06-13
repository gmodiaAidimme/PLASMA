import React from "react";
import { useNavigate } from "react-router-dom";
import "/css/gabo.css"


function TarjetaMaquina(props) {

    //let maq_background = "url(../dist/img/maquina" + props.id + ".jpg)";
    let maq_background = `url(images/${props.imagen})`

    let navigate = useNavigate();

    return (
        <div className="card card-widget widget-user enlargable pointer" onClick={() => navigate('/panel/' + props.id)}>
            <div className="widget-user-header text-white" style={{ backgroundImage: maq_background }}>
                <h3 className="widget-user-username text-right">{props.nombre}</h3>
                <h5 className="widget-user-desc text-right">{props.abreviacion}</h5>
            </div>
        </div>
    )
}

export default TarjetaMaquina;