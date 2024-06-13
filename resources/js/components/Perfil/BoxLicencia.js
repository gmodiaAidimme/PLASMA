import React, { useState } from 'react'
import { Caja } from '../generales'
import axios from 'axios'
import DatosLicencia from './DatosLicencia'

function Box_licencia({ perfil }) {

    return (
        <Caja titulo="Licencia" >
            <strong><i className="fas fa-stamp"></i> Tipo de licencia</strong>

            <p> { perfil && perfil.empresa.licencia } </p>
            {/* <button className="btn btn-primary" >Cambiar</button>
            <DatosLicencia online={true} licencia={"asdfasdf"} /> */}
        </Caja>
    )
}

export default Box_licencia