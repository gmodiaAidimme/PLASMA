import React from "react";
import { TituloSeccion } from "../generales";
import { useParams } from "react-router-dom";
import 'chart.js/auto';
import Panel from "./Panel";

function HomePage() {

    const { maquina } = useParams();

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Panel general" />
            <section className="content">
                <Panel maquina={maquina} />
            </section>
        </div>
    )
}

export default HomePage