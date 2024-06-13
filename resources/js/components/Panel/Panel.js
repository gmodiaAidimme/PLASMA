import React from "react";
import CajaDoughnuts from "./Cajas/CajaDoughnuts";
import CajaProductividad from "./Cajas/CajaProductividad";
import CajaTimeLine from "./Cajas/CajaTimeline";
import CajaComentarios from "./Cajas/CajaComentarios";
import CajaDiagrama from "./Cajas/CajaDiagrama";
import InfoBoxes from "./Cajas/InfoBoxes";
import CajaOF from "./Cajas/CajaOF";
import 'chart.js/auto';

function Panel(props) {

    return (
        <>
            <InfoBoxes maquina={props.maquina} desde={props.desde} hasta={props.hasta} />
            {
                props.maquina > 0 && !props.desde?
                    <CajaTimeLine maquina={props.maquina} fecha={props.fecha} />
                    :
                    null
            }
            <div className="row">
                <div className="col-md-6">
                    <CajaProductividad maquina={props.maquina} desde={props.desde} hasta={props.hasta}/>
                    <CajaComentarios maquina={props.maquina} desde={props.desde} hasta={props.hasta}/>
                    <CajaDiagrama maquina={props.maquina}/>
                </div>
                <div className="col-md-6">
                    <CajaDoughnuts maquina={props.maquina} desde={props.desde} hasta={props.hasta}/>
                    <CajaOF maquina={props.maquina} desde={props.desde} hasta={props.hasta}/>
                </div>
            </div>
        </>
    )

}

export default Panel;
