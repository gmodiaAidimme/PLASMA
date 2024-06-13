import axios from "axios";
import React, { useState, useEffect } from "react";
import { TituloSeccion } from "../generales";
import { useParams } from "react-router-dom";

import CajaPerfil from "./CajaPerfil";
import CajaMaquinas from "./CajaMaquinas";
import CajaFechas from "./CajaFechas";
import CajaProductos from "./CajaProductos";
import CajaDoughnuts from "../Panel/Cajas/CajaDoughnuts";
import CajaPresencia from "./CajaPresencia";

function getCurrentWeeksMonday() {
    var d = new Date();
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff)).toISOString().slice(0, 10);
}


function DetallesOperario() {
    const [datos, setDatos] = useState({
        operario: {
            imagen: "",
            id: "",
            nombre: "",
            apellido: "",
            posicion: "",
            email: "",
            created_at: "",
        },
        registro_actividads: [],
        maquinas: [],
        productos: [],
        presencia: []
    });
    const [inicio, setInicio] = useState(getCurrentWeeksMonday());
    const [fin, setFin] = useState(new Date().toISOString().slice(0, 10));

    const { id } = useParams();

    useEffect(() => {
        axios.post(`/api/operarios/${id}/info_operario`, { inicio, fin })
            .then((res) => {
                setDatos(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [id, inicio, fin]);

    return (
        <>
            <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
                <TituloSeccion titulo="Cocacola" />
                <section className="content">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <CajaPerfil operario={datos.operario} />
                                <CajaDoughnuts operario={id} desde={inicio} hasta={fin} />
                            </div>
                            <div className="col-md-6">
                                <CajaFechas inicio={inicio} fin={fin} setInicio={setInicio} setFin={setFin} />
                                <CajaPresencia presencia={datos.presencia} operario={id}/>
                                <CajaMaquinas maquinas={datos.maquinas} />
                                <CajaProductos productos={datos.productos} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                            </div>
                        </div>
                    </div>


                </section>
            </div>
        </>
    )
}

export default DetallesOperario;