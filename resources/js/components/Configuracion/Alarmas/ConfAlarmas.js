import React from "react";
import CajaConf from "../Modelos";
import { TituloSeccion } from '../../generales';

function ConfAlarmas() {
    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Configuración de alarmas" />
            <section className="content">
                <div className="container">
                    <CajaConf elemento="alarma" emoji="🚨" />
                    <CajaConf elemento="receptor" emoji="📩" />
                </div>
            </section>
        </div>
    )
}

export default ConfAlarmas



