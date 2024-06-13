import React from "react";
import { Caja } from "../generales";

function CajaFechas({inicio, fin, setInicio, setFin}) {
    return (
        <Caja titulo="Fechas" emoji="📅">
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="inicio">Desde</label>
                        <input type="date" className="form-control" value={inicio} onChange={(e) => setInicio(e.target.value)} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="fin">Hasta</label>
                        <input type="date" className="form-control" value={fin} onChange={(e) => setFin(e.target.value)} />
                    </div>
                </div>
            </div>
        </Caja>
    )

}

export default CajaFechas;