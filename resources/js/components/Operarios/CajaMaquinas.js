import React from "react";
import { Caja } from "../generales";
import { LazyLoadImage } from 'react-lazy-load-image-component';

function secondsToHms(d) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);

    let hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";

    return hDisplay + mDisplay + sDisplay;
}

function CajaMaquinas({ maquinas }) {
    return (
        <Caja titulo="Máquinas" emoji="🔩">

            <div className="row">
                <div className="col-3">
                    <p className="">Imagen</p>
                </div>
                <div className="col-3">
                    <p className="">Nombre</p>
                </div>
                <div className="col-3">
                    <p className="">Piezas</p>
                </div>
                <div className="col-3">
                    <p className="">Tiempo</p>
                </div>
            </div>
            <hr />
            {
                maquinas.length === 0 ?
                    <div className="alert alert-warning mt-3" role="alert">
                        No hay movimientos en el rango de fechas seleccionado
                    </div>
                    :
                    Object.values(maquinas).map((maquina, index) => {
                        return (
                            <React.Fragment key={index}>
                                <div className="row">
                                    <div className="col-3">
                                        <LazyLoadImage
                                            placeholder={<p>Cargando...</p>}
                                            className="img_configuracion"
                                            alt="Imagen"
                                            effect="blur"
                                            src={"/images/" + maquina.imagen} />
                                    </div>
                                    <div className="col-3">
                                        <p className="">{maquina.nombre}</p>
                                    </div>
                                    <div className="col-3">
                                        <p className="">{maquina.piezas}</p>
                                    </div>
                                    <div className="col-3">
                                        <p className="">{secondsToHms(maquina.tiempo)}</p>
                                    </div>
                                </div>
                                <hr />
                            </React.Fragment>
                        )
                    })
            }
        </Caja>
    )

}

export default CajaMaquinas;