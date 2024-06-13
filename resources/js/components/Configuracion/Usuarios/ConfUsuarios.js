import React from "react";
import CajaConf from "../Modelos";
import { TituloSeccion } from '../../generales';
import CajaUsuarios from "./CajaUsuarios";
import CajaRoles from "./CajaRoles";

function Confusuarios() {

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Usuarios y empleados" />
            <section className="content">
                <div className="container">
                    <CajaConf elemento="user" emoji="🧑"/>
                    {/* <CajaUsuarios /> */}
                    <CajaConf elemento="empleado" emoji="&#128119;" />
                    <CajaRoles />
                    <CajaConf elemento="motivos_presencia" emoji="📍"/>
                </div>
            </section>
        </div>
    )
}

export default Confusuarios