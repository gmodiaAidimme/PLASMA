import React, {useState} from "react";
import { Modal } from "react-bootstrap";
import { throwToast } from "../../../lib/notifications";
import axios from "axios";

function ModalNuevoProyecto({ show, closeModal, nuevosDatos, setNuevosDatos }) {
    const [proyecto, setProyecto] = useState({
        nombre: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        horas_estimadas: "",
        cliente: "",
    });
    
    const guardarProyecto = () => {
        if (proyecto.nombre === "" || proyecto.descripcion === "" || proyecto.fecha_inicio === "" || proyecto.fecha_fin === "" || proyecto.horas_estimadas === "") {
            throwToast("Error", "Todos los campos son obligatorios", "error");
            return;
        }
        axios.post('/api/proyectos', proyecto)
            .then(res => {
                throwToast("Proyecto creado", "El proyecto ha sido creado correctamente", "success");
                setNuevosDatos(nuevosDatos + 1);
                closeModal();
                })
            .catch(err => {
                console.log(err);
                throwToast("Error", "Ha ocurrido un error al crear el proyecto", "error");
            })
    }

    return (
        <Modal show={show} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Crear nuevo proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" className="form-control" onChange={(e)=>setProyecto({...proyecto, nombre:e.target.value})} id="nombre" placeholder="Nombre del proyecto" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea className="form-control" onChange={(e)=>setProyecto({...proyecto, descripcion:e.target.value})} id="descripcion" rows="3"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha_inicio">Fecha de inicio</label>
                        <input type="date" className="form-control" onChange={(e)=>setProyecto({...proyecto, fecha_inicio:e.target.value})} id="fecha_inicio" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha_fin">Fecha de fin</label>
                        <input type="date" className="form-control" onChange={(e)=>setProyecto({...proyecto, fecha_fin:e.target.value})} id="fecha_fin" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="estado">Horas estimadas</label>
                        <input type="number" className="form-control" onChange={(e)=>setProyecto({...proyecto, horas_estimadas:e.target.value})} id="horas_estimadas" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cliente">Cliente</label>
                        <input type="text" className="form-control" onChange={(e)=>setProyecto({...proyecto, cliente:e.target.value})} id="cliente" placeholder="Cliente del proyecto" />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                <button type="button" className="btn btn-primary" onClick={guardarProyecto}>Crear</button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalNuevoProyecto;