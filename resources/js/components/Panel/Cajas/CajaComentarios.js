import React, { useState, useEffect } from "react";
import Loader from "../../Comun/Loader";
import axios from "axios";
import { throwToast } from "../../../lib/notifications";
import Comentario from "./Comentario";

const date2str = (date) => {
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;

    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function CajaComentarios({ maquina, desde, hasta }) {

    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [nuevoComentarioEnviado, setNuevoComentarioEnviado] = useState(0);

    useEffect(() => {
        let url = `/api/panel/comentarios?maquina_id=${maquina}`;

        if (desde) {
            url += `&desde=${date2str(desde)}&hasta=${date2str(hasta)}`
        }

        axios.get(url)
            .then(response => {
                setComentarios(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
                throwToast("Error", "No se han podido cargar los comentarios", "error")
                setIsLoading(false);
            });
    }, [nuevoComentarioEnviado, desde, hasta, maquina]);

    const postComentario = () => {
        if (nuevoComentario.length > 0) {
            axios.post('/api/panel/comentarios', { comentario: nuevoComentario, maquina_id: maquina })
                .then(response => {
                    setNuevoComentarioEnviado(nuevoComentarioEnviado + 1);
                    setNuevoComentario("");
                    throwToast("¡Bien!", "Anotación enviada", "success")
                })
                .catch(error => {
                    console.log(error);
                    throwToast("Error", "No se ha podido enviar la anotación", "error")
                });
        }
        else {
            throwToast("¡Ups!", "La anotación no puede estar vacía", "warning")
        }
    }

    const deleteComentario = (id) => {
        axios.delete(`/api/panel/comentarios/${id}`)
            .then(response => {
                setIsLoading(true);
                setComentarios([])
                setNuevoComentarioEnviado(nuevoComentarioEnviado + 1);
                throwToast("Hecho", "Anotación eliminada", "success")
            })
            .catch(error => {
                console.log(error);
                throwToast("Error", "No se ha podido eliminar la anotación", "error")
            }
            );
    }

    const editarComentario = (id, comentario) => {
        if(comentario.length==0){
            throwToast("¡Ups!", "La anotación no puede estar vacía", "warning")
            return;
        }

        setIsLoading(true);
        axios.put(`/api/panel/comentarios/${id}`, { mensaje:comentario })
            .then(response => {
                setComentarios([])
                setNuevoComentarioEnviado(nuevoComentarioEnviado + 1);
                throwToast("Hecho", "Anotación editada", "success")
            })
            .catch(error => {
                console.log(error);
                throwToast("Error", "No se ha podido editar la anotación", "error")
                setIsLoading(false);
            }
            );
    }

    const handleInputChange = (e) => {
        console.log(e.target.value.length)
        if (e.target.value.length >= 1024) {
            throwToast("Qué anotación tan larga...", "La anotación excede el límite establecido, por favor, envía el resto en otra anotación ", "warning")
        }
        else {
            setNuevoComentario(e.target.value);
        }
    }

    return (
        <div className="card direct-chat direct-chat-primary" style={{ position: "relative", left: "0px", top: "0px" }}>

            <div className="card-header ui-sortable-handle">
                <h3 className="card-title">Anotaciones</h3>
            </div>

            <div className="card-body">
                <Loader isLoading={isLoading} height="200px">
                    <div className="direct-chat-messages">

                        {
                            comentarios.length == 0 ? (
                                <div style={{ height: "200px" }} >
                                    <div className="outer">
                                        <div className="middle">
                                            <div className="inner">
                                                <h3>No hay anotaciones</h3>
                                                <p>Escriba la primera</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) :
                                comentarios.map((comentario, index) => (
                                    <Comentario
                                        key={index}
                                        comentario={comentario}
                                        deleteComentario={deleteComentario}
                                        editarComentario={editarComentario}
                                    />
                                ))
                        }

                    </div>
                </Loader>
            </div>
            {desde || maquina==0 ? "" :
                <div className="card-footer">
                    <div className="input-group">
                        <input type="text" name="message" placeholder="Nueva anotación ..." className="form-control" value={nuevoComentario} onChange={handleInputChange} />
                        <span className="input-group-append">
                            <button type="button" className="btn btn-primary" onClick={postComentario}>
                                <i className="far fa-paper-plane" aria-hidden="true"></i>
                                <span className="sr-only">Enviar</span>
                            </button>
                        </span>
                    </div>
                </div>
            }

        </div>

    )

}

export default CajaComentarios;