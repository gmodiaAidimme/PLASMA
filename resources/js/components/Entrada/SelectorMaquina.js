import React from "react"
import Loader from "../Comun/Loader"
import ImagenModelo from "../Comun/ImagenModelo"

function SelectorMaquina(props) {

    return (
        <Loader isLoading={props.state.isLoading}>
            {

                props.state.maquinas.map((maquina, index) => {
                    let clase = "info-box simple-enlargable"
                    let imagen
                    if (maquina.id === props.state.maquinaSeleccionada) {
                        clase += " bg-info"
                    }

                    try{
                        imagen = "maquina/" + maquina.imagen.split("/")[0] + "/mini-" + maquina.imagen.split("/")[1]
                    } catch {
                        imagen = "maquina/default.png"
                    }

                    return (
                        
                        <div className={clase} key={index} onClick={() => props.dispatch({ type: "SET", payload: { key: "maquinaSeleccionada", value: maquina.id } })}>
                            <ImagenModelo modelo="maquina" clase="info-box-icon" imagen={imagen}/>
                            <div className="info-box-content">
                                <span className="info-box-text">{maquina.nombre}</span>
                            </div>
                        </div>
                    )
                })
            }
        </Loader>
    )
}

export default SelectorMaquina