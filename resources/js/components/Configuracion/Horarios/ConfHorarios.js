import React from "react";
import CajaConf from "../Modelos";
import { TituloSeccion } from '../../generales';
import CajaConfHorario from "./Horario";

function ConfHorarios() {
    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Configuración" />
            <section className="content">
                <div className="container">
                <CajaConfHorario />
                <CajaConf elemento="parada" emoji="🍔" />
                </div>
            </section>
        </div>
    )
}

export default ConfHorarios