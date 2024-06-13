import React from "react";
import { TituloSeccion } from '../generales';
import CajaConf from "./Modelos";
import CajaVariables from "./Preferencias/Variables";
import EnlaceSeccion from "./EnlaceSeccion";

function Configuracion() {

    let admin = localStorage.getItem("auth_admin");

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Configuración" />
            <section className="content">
                <div className="container">
                    <div className="row">
                        <EnlaceSeccion titulo="Usuarios y empleados" icono="fa fa-users" ruta="/configuracion/usuarios" />
                        <EnlaceSeccion titulo="Máquinas" icono="fas fa-tools" ruta="/configuracion/maquinas" />
                        <EnlaceSeccion titulo="Horarios" icono="fas fa-clock" ruta="/configuracion/horarios" />
                        <EnlaceSeccion titulo="Productividad" icono="fas fa-chart-pie" ruta="/configuracion/productividad" />
                        <EnlaceSeccion titulo="Alarmas" icono="fa fa-bell" ruta="/configuracion/alarmas" />
                        <EnlaceSeccion titulo="Preferencias" icono="fa fa-cog" ruta="/configuracion/preferencias" />
                        <div className="col-sm-12 col-md-6 col-lg-4"></div>
                        <EnlaceSeccion titulo="Stock" icono="fas fa-boxes" ruta="/configuracion/stock" />
                    </div>
                </div>
            </section>
        </div >
    )

}

export default Configuracion