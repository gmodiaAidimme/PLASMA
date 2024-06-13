import React from "react";
import { Caja } from "../../generales";

function CajaOperarios({ operarios }) {

    return (
        <Caja titulo="Operarios">
            {
                operarios.map((operario, index) => (
                    <React.Fragment key={index}>
                        <div className="row enlargable pointer no-shadow no-margin">
                            <div className="col-md-3">
                                <img src={'/dist/img/operario' + operario.id + '.jpg' } alt={operario.nombre} className="img-fluid circleimg avatar-size" />
                            </div>
                            <div className="col-md-9">
                                <h6>{operario.nombre}</h6>
                                <div className="row">
                                    <div className="col-md-4">
                                        <p>OFs: {operario.ordenes}</p>
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
                        {index < operarios.length - 1 && <hr />}
                    </React.Fragment>
                ))
            }
        </Caja>
    )
}

export default CajaOperarios;