import React, { useState, useEffect } from "react";
import { VisualDonut, VisualOEE, VisualProductividad, VisualEstado, VisualTemporizador, VisualTimeline } from "./Visuales";
import axios from "axios";
import Loader from "../Comun/Loader";
import VistaVacia from "./VistaVacia";

function Visual(props) {

    switch (props.datos.tipo) {
        case "oee":
            return <VisualOEE datos={props.datos} />
        case "disponibilidad":
        case "rendimiento":
        case "calidad":
            return <VisualDonut datos={props.datos} />
        case "productividad":
            return <VisualProductividad datos={props.datos} />
        case "estado":
            return <VisualEstado datos={props.datos} />
        case "temporizador":
            return <VisualTemporizador datos={props.datos} />
        case "timeline":
            return <VisualTimeline datos={props.datos} />
        default:
            return <div>No se encontro el tipo de visual</div>
    }
}

function Vista(props) {

    const [isLoading, setIsLoading] = useState(true);
    const [visuales, setVisuales] = useState([]);
    const [vacia, setVacia] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        setVacia(false)
        axios.get(`/api/presentacion/vista/${props.vista_id}`)
            .then(res => {
                setVisuales(res.data.visuales);
            }).catch(err => {
                setVisuales([])
                setVacia(true)
                console.log(err);
            }).finally(() => setIsLoading(false))
    }, []);

    return (
        <div >
            <Loader isLoading={isLoading} >
                {vacia &&<VistaVacia/>
                    // <>
                    //     <div className="container text-center" style={{ marginTop: '50px' }}>
                    //         <div className="row">
                    //             <div className="col">
                    //                 <h3 className="text-danger mb-4">Esta vista no existe</h3>
                    //                 <p className="mb-4">Por favor, accede al panel de vistas y carga otra.</p>
                    //                 <button className="btn btn-primary" onClick={() => window.location = '/presentacion'}>
                    //                     Ir al Panel de Vistas
                    //                 </button>
                    //             </div>
                    //         </div>
                    //     </div>
                    // </>

                }
                {
                    visuales.map((visual, index) => {
                        return (
                            <div key={index} style={{
                                position: "fixed",
                                height: (visual.alto * 25) + "vh",
                                width: (visual.ancho * 16.66) + "vw",
                                // backgroundColor: "#f5f5f5",
                                borderStyle: "solid",
                                borderRadius: "15px",
                                borderColor: "#666666",
                                borderWidth: "1px",
                                top: (visual.y * 25) + "vh",
                                left: (visual.x * 16.66) + "vw"
                            }}>
                                <Visual datos={visual} />
                            </div>
                        )
                    })
                }
            </Loader>
        </div>
    );
}

export default Vista;