import React from "react";
import { Caja } from "../generales";
import Loader from "../Comun/Loader";

function PlaceholderCajaEntrada(props) {
    return (
        <Caja titulo="Entrada" emoji="📥">
            <Loader isLoading={true} height="296px">
            </Loader>
            <hr />
            <h4 id="estado_maquina"> Estado de la máquina: Cargando.. </h4>
        </Caja>
    )
}

export default PlaceholderCajaEntrada