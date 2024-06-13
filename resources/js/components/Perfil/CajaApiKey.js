import React, { useState } from "react";
import { Caja } from "../generales";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import Loader from "../Comun/Loader";
import { throwToast } from "../../lib/notifications";
import axios from "axios";

function BotonTooltip({icono, texto, onClick}) {
    return (
        <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>{texto}</Tooltip>}
        >
            <button type="button" className="btn btn-primary" onClick={onClick}>
                <i className={icono}></i>
            </button>
        </OverlayTrigger>
    )
}

function CajaApiKey({ perfil, isLoading, setApiKey }) {

    const [apiKeyVisible, setApiKeyVisible] = useState(false)
    const [modalGenerarKey, setModalGenerarKey] = useState(false)
    const [modalRegenerarKey, setModalRegenerarKey] = useState(false)
    const [modalDestruirKey, setModalDestruirKey] = useState(false)

    function generarApiKey() {
        axios.post('/api/perfil/generar_api_key')
            .then(res => {
                throwToast('API Key generada', 'La API Key se ha generado correctamente', 'success')
                setModalGenerarKey(false)
                setModalRegenerarKey(false)
                setApiKey(res.data.api_key)
            })
            .catch(err => {
                throwToast('Error', 'Ha ocurrido un error al generar la API Key', 'error')
                console.log(err)
            })
    }

    function copiarApiKey() {
        navigator.clipboard.writeText(perfil?.user?.api_key)
        throwToast('API Key copiada', 'Ya está en tu portapapeles 📋', 'success')
    }

    function destruirApiKey() {
        axios.delete('/api/perfil/destruir_api_key')
            .then(res => {
                throwToast('API Key destruida', 'La API Key se ha destruido correctamente', 'success')
                setModalDestruirKey(false)
                setApiKey(null)
            })
            .catch(err => {
                throwToast('Error', 'Ha ocurrido un error al destruir la API Key', 'error')
                console.log(err)
            })
    }


    return (
        <>
            <Caja titulo="API Key" emoji="🔑" >
                <Loader isLoading={isLoading} height="40px">
                    {
                        perfil?.user?.api_key != null ?
                            <div className="row">
                                <div className="col-12">
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <p className="text-muted">
                                            {apiKeyVisible ? perfil?.user?.api_key : '****************'}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="btn-group col-12" role="group" >
                                        <BotonTooltip icono={apiKeyVisible? "fas fa-eye-slash":"fas fa-eye"} texto={apiKeyVisible ? "Ocultar" : "Mostrar"} onClick={() => setApiKeyVisible(!apiKeyVisible)} />
                                        <BotonTooltip icono="fas fa-copy" texto="Copiar" onClick={copiarApiKey} />
                                        <BotonTooltip icono="fas fa-sync-alt" texto="Regenerar" onClick={() => setModalRegenerarKey(true)} />
                                        <BotonTooltip icono="fas fa-trash-alt" texto="Destruir" onClick={() => setModalDestruirKey(true)} />
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="row">
                                <div className="col-md-12">
                                    <button className="btn btn-primary col-12" onClick={() => setModalGenerarKey(true)}>Generar</button>
                                </div>
                            </div>

                    }
                </Loader>
            </Caja>
            <Modal show={modalGenerarKey} onHide={() => setModalGenerarKey(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Generar API Key</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Al generar una API Key, permitirás el acceso a la aplicación a cualquier persona o programa que tenga tu clave, que podrá acceder a los datos, o modificarlos sin tener que solicitar permiso.</p>
                    <p>Genera la API Key únicamente si la vas a usar y compartela única y exclusivamente con aquellas personas o empresas en las que confíes plenamente.</p>
                    <p>Si crees que tu API Key ha sido comprometida, puedes regenerarla o destruirla en cualquier momento.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setModalGenerarKey(false)}>Cancelar</button>
                    <button className="btn btn-primary" onClick={generarApiKey}>Generar</button>
                </Modal.Footer>
            </Modal>
            <Modal show={modalRegenerarKey} onHide={() => setModalRegenerarKey(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Regenerar API Key</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Al regenerar una API Key, se destruirá la anterior y se creará una nueva. Esta acción no se puede deshacer.</p>
                    <p><span className="badge bg-danger">¡Muy importante!</span> Si regeneras la API Key, todas las personas y programas que tengan acceso actualmente lo perderán y no lo recuperarán hasta que les envies la nueva clave. Si hay algún proceso automático de un programa externo, este dejará de funcionar y dará error hasta que se aplique la API Key nueva.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setModalRegenerarKey(false)}>Cancelar</button>
                    <button className="btn btn-primary" onClick={generarApiKey}>Regenerar</button>
                </Modal.Footer>
            </Modal>
            <Modal show={modalDestruirKey} onHide={() => setModalDestruirKey(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Destruir API Key</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Al destruir una API Key, se eliminará y no se podrá recuperar. Esta acción no se puede deshacer.</p>
                    <p><span className="badge bg-danger">¡Muy importante!</span> Si destruyes la API Key, todas las personas y programas que tengan acceso actualmente lo perderán. Si hay algún proceso automático de un programa externo, este dejará de funcionar y dará error.</p>
                    <p>Solo deberías tener una API Key activa si se está utilizando (o se va a usar en el futuro). Si tu API Key no se va a usar más, destrúyela.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setModalDestruirKey(false)}>Cancelar</button>
                    <button className="btn btn-danger" onClick={destruirApiKey}>Destruir</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CajaApiKey