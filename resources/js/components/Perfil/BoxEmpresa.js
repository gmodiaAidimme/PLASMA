import React from 'react'
import { Caja } from '../generales'

function Box_informacion_empresa({ perfil }) {
    
    return (
        <Caja titulo="Empresa">
            <strong><i className="fa fa-industry margin-r-5"></i> Empresa</strong>
            <p className="text-muted">
                {perfil && perfil.empresa.nombre}
            </p>
            <hr />
            <strong><i className="fa fa-id-card margin-r-5"></i> CIF</strong>
            <p className="text-muted">
                {perfil && perfil.empresa.CIF}
            </p>
        </Caja>
    )
}

export default Box_informacion_empresa