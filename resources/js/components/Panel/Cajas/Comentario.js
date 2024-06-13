import React, { useContext, useState } from 'react';
import { UserContext } from '../../Context/UserContext';

function Comentario({ comentario, deleteComentario, editarComentario }) {

    const { user } = useContext(UserContext)

    const [confirmacion, setConfirmacion] = useState(false);
    const [editando, setEditando] = useState(false);
    const [comentarioEditado, setComentarioEditado] = useState(comentario.comentario);

    let propio = user == comentario.name
    let actual = comentario.fecha_hora.split(" ")[0] == new Date().toISOString().split("T")[0]

    return (
        <div className={`direct-chat-msg ${propio ? 'right' : ''}`}>
            <div className="direct-chat-infos clearfix">
                <span className={`direct-chat-name ${propio ? 'float-right' : 'float-left'}`}>{comentario.name}</span>
                <span className={`direct-chat-timestamp ${propio ? 'float-left' : 'float-right'}`}>{comentario.fecha_hora}</span>
            </div>
            <img className="direct-chat-img" src={comentario.avatar} alt="message user image" />


            {confirmacion &&
                <div className="comment-delete-confirmation direct-chat-text" style={{ backgroundColor: "#d63429", borderColor: "#d63429" }}>
                    ¿Eliminar esta anotación (no se puede deshacer)?
                    <button type="button" class="btn btn-outline-light btn-sm btn-conf-delete" onClick={() => deleteComentario(comentario.id)}>Sí, eliminar</button>
                    <button type="button" class="btn btn-outline-light btn-sm btn-conf-delete" onClick={() => setConfirmacion(false)}>No, volver</button>
                </div>
            }

            {editando &&
                <div className="direct-chat-text">
                    <div className="input-group">
                        <input type="text" name="message" className="form-control" value={comentarioEditado} onChange={(e) => setComentarioEditado(e.target.value)} />
                        <span className="input-group-append">
                            <button type="button" className="btn btn-primary" onClick={() => editarComentario(comentario.id, comentarioEditado)}>
                                <i className="far fa-paper-plane" aria-hidden="true"></i>
                                <span className="sr-only">Enviar</span>
                            </button>
                        </span>
                    </div>
                </div>
            }

            {!editando && !confirmacion &&
                <div className="direct-chat-text">
                    <div className="message-container">
                        {comentario.comentario}
                    </div>

                    {propio && actual ?
                        <>
                            <div className="icon-container" style={{ marginRight: "20px" }}>
                                <i class="fas fa-pen float-right eliminar-comentario" onClick={() => setEditando(true)}></i>
                            </div>
                            <div className="icon-container">
                                <i class="fas fa-trash float-right eliminar-comentario" onClick={() => setConfirmacion(true)}></i>
                            </div>
                        </>
                        : ""}
                </div>

            }

        </div >
    )
}

export default Comentario;