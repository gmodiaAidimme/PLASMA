import React from "react";
import { Caja } from "../../generales";

function CajaMaquinas({ maquinas }) {
    return (
        <Caja titulo="Maquinas">
            {
                maquinas.map((maquina, index) => (
                    <React.Fragment key={index}>
                        <div className="row enlargable pointer no-shadow no-margin" >
                            <div className="col-md-3">
                                <img src={'/dist/img/maquina' + maquina.id + '.jpg' } alt={maquina.nombre} className="img-fluid circleimg avatar-size" />
                            </div>
                            <div className="col-md-9">
                                <h6>{maquina.nombre}</h6>
                                <div className="row">
                                    <div className="col-md-4">
                                        <p>OFs: {maquina.ordenes}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p>Horas: 25</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p>OEE: 25%</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {index < maquinas.length - 1 && <hr />}
                    </React.Fragment>
                ))
            }
        </Caja>
    )
}

export default CajaMaquinas;