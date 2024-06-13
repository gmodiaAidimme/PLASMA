import React from "react";
import CajaConf from "../Modelos";
import { TituloSeccion } from '../../generales';

function ConfMaquinas() {
    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Configuración de máquinas" />
            <section className="content">
                <div className="container">
                    <CajaConf elemento="maquina" emoji="&#128295;" />
                    <CajaConf elemento="rendimiento_en_maquina_por_operario" emoji="📈" />
                </div>
            </section>
        </div>
    )
}

export default ConfMaquinas