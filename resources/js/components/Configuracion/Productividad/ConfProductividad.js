import React from "react";
import CajaConf from "../Modelos";
import { TituloSeccion } from '../../generales';

function ConfProductividad() {
    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Configuración de productividad" />
            <section className="content">
                <div className="container">
                    <CajaConf elemento="estado" emoji="📊" />
                    <CajaConf elemento="defecto" emoji="💔" />
                    <CajaConf elemento="entrada" emoji="✏️" />
                    <CajaConf elemento="sensor" emoji="🔍" />
                </div>
            </section>
        </div>
    )
}

export default ConfProductividad



