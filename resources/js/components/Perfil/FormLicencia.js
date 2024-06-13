import React from "react";

function FormLicencia(props) {
    return (
        <form>
            <div className="form-group">
                <label>Clave</label>
                <input className="form-control" type="text"  />
            </div>
            <div className="form-group">
                <label> Fecha de renovación</label>
                <input className="form-control" type="text"  />
            </div>
            <input className="btn btn-primary"  type="submit" value="Cambiar" />
        </form>
    )
}

export default FormLicencia