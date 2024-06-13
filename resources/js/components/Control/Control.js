import React, { useEffect, useState } from "react";
import Selector from "./Selector";
import { TituloSeccion } from "../generales";
import axios from "axios";
import BarraOpciones from "./BarraOpciones";
import { throwToast } from "../../lib/notifications"

function Control(props) {

    const [isLoading, setIsLoading] = useState(true)

    const [maquinas, setMaquinas] = useState([])
    const [maquinaSeleccionada, setMaquinaSeleccionada] = useState(0)

    const [operarios, setOperarios] = useState([])
    const [operariosSeleccionado, setOperariosSeleccionados] = useState([])
    const [operariosNoDisponibles, setOperariosNoDisponibles] = useState([])

    const [productos, setProductos] = useState([])
    const [productoSeleccionado, setProductoSeleccionado] = useState(0)
    const [productosMaquina, setProductosMaquina] = useState([])

    const [registroActivo, setRegistroActivo] = useState(false)

    useEffect(() => {
        axios.get("/api/control/estado")
            .then(response => {
                setMaquinas(response.data.maquinas.filter(maq => maq.final == 1))
                setMaquinaSeleccionada(0)
                setOperarios(response.data.operarios)
                setProductos(response.data.productos)
                setProductosMaquina(response.data.producto_maquinas)
                setIsLoading(false)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])


    const handleMaquinaSeleccionada = (id) => {
        setMaquinaSeleccionada(id)
        axios.get("/api/control/estado/" + id)
            .then(response => {
                setRegistroActivo(response.data.registro_activo)
                if (response.data.registro_activo) {
                    setProductoSeleccionado(response.data.producto)
                    setOperariosSeleccionados(response.data.operarios.map(obj => obj.empleado_id))
                }
                else {
                    setProductoSeleccionado(0)
                    setOperariosSeleccionados([])
                    setOperariosNoDisponibles(response.data.trabajadores_no_disponibles.map(obj => obj.empleado_id))
                    setRegistroActivo(false)
                }
            }
            )
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Control maquinaria" />
            <section className="content">
                <div className="container">
                    <BarraOpciones
                        maquinaSeleccionada={maquinaSeleccionada}
                        registroActivo={registroActivo}
                        productoSeleccionado={productoSeleccionado}
                        operariosSeleccionados={operariosSeleccionado}
                        actualizarEstado={() => handleMaquinaSeleccionada(maquinaSeleccionada)}
                    />

                    <div className="row">
                        <div className="col-4">
                            <Selector isLoading={isLoading}
                                elementos={maquinas}
                                seleccionado={maquinaSeleccionada}
                                setSeleccionado={handleMaquinaSeleccionada}
                                modelo="maquina" />
                        </div>
                        <div className="col-4">
                            <Selector isLoading={isLoading}
                                elementos={productos.filter(producto => productosMaquina.filter(pm => pm.maquina_id == maquinaSeleccionada).map(obj => obj.producto_id).includes(producto.id))}
                                seleccionado={productoSeleccionado}
                                setSeleccionado={setProductoSeleccionado}
                                bloqueado={registroActivo}
                                mensajeBloqueado={() => throwToast("Maquina funcionando", "Esta máquina ya está fabricando un producto, si quieres modificarla, termina el registro e inicia uno nuevo", "warning")}
                                modelo="producto"
                            />
                        </div>
                        <div className="col-4">
                            <Selector isLoading={isLoading}
                                elementos={productoSeleccionado === 0 ? [] : operarios}
                                seleccionado={operariosSeleccionado}
                                setSeleccionado={setOperariosSeleccionados}
                                bloqueado={registroActivo}
                                mensajeBloqueado={() => throwToast("Maquina funcionando", "Esta máquina ya tiene operarios trabajando, si quieres modificarla, termina el registro e inicia uno nuevo", "warning")}
                                bloqueoIndividual={operariosNoDisponibles}
                                mensajeBloqueoIndividual={() => throwToast("Operario no disponible", "Este operario está trabajando en otra máquina", "warning")}
                                multiple
                                modelo="empleado"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div >

    )
}

export default Control;