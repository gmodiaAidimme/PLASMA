import React, { useEffect, useState } from "react"
import Box_identidad from "./BoxIdentidad"
import Box_informacion_empresa from "./BoxEmpresa"
import Box_licencia from "./BoxLicencia"
import CajaApiKey from "./CajaApiKey"
import { TituloSeccion } from "../generales"

function Perfil() {
    const [perfil, setPerfil] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        axios.get('/api/perfil')
            .then(res => {
                setIsLoading(false)
                setPerfil(res.data)
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err)
            })
    }, [])

    function setApiKey(apiKey) {
        setPerfil({ ...perfil, user: { ...perfil.user, api_key: apiKey } })
    }

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Perfil" />
            <section className="content">
                <div className="container">
                    <div className="container row">
                        <div className="col-md-6">
                            <Box_identidad perfil={perfil} />
                            <CajaApiKey perfil={perfil} isLoading={isLoading} setApiKey={setApiKey} />
                        </div>
                        <div className="col-md-6">
                            <Box_informacion_empresa perfil={perfil} />
                            <Box_licencia perfil={perfil} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Perfil