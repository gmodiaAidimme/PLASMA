import React from "react";
import FormFacturacion from "./FormFacturacion";
import FormLicencia from "./FormLicencia";

function DatosLicencia(props) {
    if (!props.online) {
        return (
            <div>
                <hr />
                <strong>
                    <i className="fa fa-calendar margin-r-5"></i> Tipo de facturación
                </strong>

                <FormFacturacion licencia={props.licencia} />

                <hr />
                <strong>
                    <i className="fa fa-key margin-r-5"></i>Clave de licencia
                </strong>

                <FormLicencia licencia={props.licencia} />
            </div>
        )
    }
    else return null
}

export default DatosLicencia