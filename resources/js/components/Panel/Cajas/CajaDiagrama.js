import React, { useState, useEffect } from 'react'
import { Caja } from '../../generales'
import Loader from '../../Comun/Loader'
import axios from 'axios'

function CajaDiagrama(props) {
    const [loaded, setLoaded] = useState(false)
    const [imagen, setImagen] = useState("")

    let remplazo = "/dist/img/maquina0.jpg"

    useEffect(() => {
        axios.get('/api/current_data/maquina?id=' + props.maquina)
            .then(res => {
                setImagen(res.data.datos.imagen)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        <Caja titulo="Diagrama">
            {
                loaded ?
                    null
                    :
                    <Loader isLoading={true} height="500px"></Loader>
            }
            <img src={"/images/" + imagen}
                className="img-diagrama"
                style={loaded ? { maxWidth: '100%', maxHeight: '100%', display: 'block', margin: 'auto' } : { maxWidth: '100%', maxHeight: '100%', display: 'block', margin: 'auto', display: 'none' }}
                onError={(e) => { e.target.onerror = null; e.target.src = remplazo }}
                alt="Diagrama de la máquina"
                onLoad={() => setLoaded(true)}
            />
        </Caja>
    )
}

export default CajaDiagrama