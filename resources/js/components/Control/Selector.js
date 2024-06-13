import React, { useEffect } from "react"
import Loader from "../Comun/Loader"
import ImagenModelo from "../Comun/ImagenModelo"

function SelectorPlaceholder() {
    return (
        <>
            <div className="info-box selector-placeholder" id="selector-placeholder-1">
            </div>
            <div className="info-box selector-placeholder" id="selector-placeholder-2" >
            </div>
            <div className="info-box selector-placeholder" id="selector-placeholder-3">
            </div>
            <div className="info-box selector-placeholder" id="selector-placeholder-4">
            </div>
        </>
    )
}

function Selector({ isLoading, elementos, seleccionado, setSeleccionado, multiple = false, bloqueado=false, mensajeBloqueado = () => { }, bloqueoIndividual = [], mensajeBloqueoIndividual = () => { }, modelo}) {

    // Si es multiple, seleccionado es una lista de ids
    const handleSelected = (id) => {
        if (bloqueado) {
            mensajeBloqueado()
            return
        }
        if (bloqueoIndividual.includes(id)) {
            mensajeBloqueoIndividual()
            return
        }
        if (multiple) {
            let lista = [...seleccionado]
            if (lista.includes(id)) {
                lista = lista.filter(item => item !== id)
            } else {
                lista.push(id)
            }
            setSeleccionado(lista)
        } else {
            setSeleccionado(id)
        }
    }

    const checkSelected = (id) => {
        if (multiple) {
            return seleccionado.includes(id)
        } else {
            return seleccionado === id
        }
    }

    return (
        <Loader isLoading={isLoading}>
            <div>
                {
                    elementos.length === 0 ?
                        <SelectorPlaceholder />
                        :
                        elementos.map((elemento, index) => {
                            let clase = "info-box"
                            let imagen
                            if (checkSelected(elemento.id)) {
                                clase += " bg-info"
                            }
                            (bloqueado || bloqueoIndividual.includes(elemento.id)) ? clase += " bloqueado" : clase += " simple-enlargable"
                            
                            try{
                                imagen = elemento.imagen.split('/')[0] + "/mini-" + elemento.imagen.split('/')[1] 
                            } catch {
                                imagen = modelo + "/default.png"
                            }

                            return (
                                <div className={clase} key={index} onClick={() => handleSelected(elemento.id)}>
                                    <ImagenModelo modelo={modelo} clase="info-box-icon" imagen={imagen}/>
                                    <div className="info-box-content">
                                        <span className="info-box-text">{elemento.nombre}</span>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
        </Loader>
    )
}

export default Selector