import React from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { throwToast } from "../../lib/notifications";

function ConfirmDelete(props) {

    function handleDelete() {
        axios.delete('/api/modelo/' + props.modelo + "/" + props.id)
            .then(() => {
                props.actualizarRegistros()
                throwToast("Eliminado", "Registro eliminado correctamente", "success")
            })
            .catch(function (error) {
                throwToast("Ups", "Se ha producido un error al eliminar el registro", "error")
                console.log(error);
            });
        props.hideModal();
    }

    return (
        <Modal show={props.showModal} onHide={props.hideModal}>
            <Modal.Header>
                <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer.</Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={props.hideModal}>Cancelar</button>
                <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmDelete;