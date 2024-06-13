import React from "react";
import CajaVariables from "./Variables";
import { TituloSeccion } from '../../generales';

function ConfPreferencias() {
    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Configuración de productividad" />
            <section className="content">
                <div className="container">
                    <CajaVariables />
                </div>
            </section>
        </div>
    )
}

export default ConfPreferencias



