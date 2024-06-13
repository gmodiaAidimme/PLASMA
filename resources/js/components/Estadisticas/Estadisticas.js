import React from "react";
import { TituloSeccion } from "../generales";

function EstadisticasGenerales(props) {
    return (
        <div style={{ height: "300px"}}>
        </div>
    );
}

function EstadisticasPorMaquina(props) {
    return (
        <div style={{ height: "300px"}}>
        </div>
    );
}

function Estadisticas(){
    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Estadísticas generales" />
            <EstadisticasGenerales />
            <TituloSeccion titulo="Estadísticas por maquina" />
            <EstadisticasPorMaquina />
        </div>
    )
}

export default Estadisticas;