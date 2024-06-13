import React from "react";
import CajaConf from "../Modelos";
import { TituloSeccion } from '../../generales';

function ConfStock() {
    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Configuración de productividad" />
            <section className="content">
                <div className="container">
                    <CajaConf elemento="producto" emoji="📦" />
                    <CajaConf elemento="producto_maquina" emoji="🕹" />
                </div>
            </section>
        </div>
    )
}

export default ConfStock

