import React, {useState} from "react";


function FormFacturacion(props){
    const opciones = ["permanente", "mensual", "trimestral", "anual"]
    const listOpciones = opciones.map((opcion) => <option value={opcion} key={opcion}>{opcion}</option>)


    const handleChange = (event) => {
    }

    return (
        <form action="/perfil/tipo_facturacion" method="POST">
            <select className="form-control" name="tipo_facturacion" defaultValue={this.state.value} onChange={this.handleChange}>
                {listOpciones}
            </select>
            {/* <input className="btn btn-primary" type="submit" value="Cambiar" /> */}
        </form>
    )
}

export default FormFacturacion