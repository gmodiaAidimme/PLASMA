import React, { useEffect, useState } from "react";
import { Caja, TituloSeccion } from "../generales";
import { Link } from "react-router-dom";
import Loader from "../Comun/Loader";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2';


var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

function ModalConfirmarBorrado(props) {
    
    const handleBorrar = () => {
        axios.delete('/api/presentacion/vista/' + props.id)
            .then(res => {
                Toast.fire({
                    icon: 'success',
                    title: 'Vista eliminada correctamente'
                });
                props.reload();
                props.setModalOpen(false);
            })
            .catch(err => {
                Toast.fire({
                    icon: 'error',
                    title: 'Error al borrar la vista'
                });
                console.log(err);
            });
    }
            
    return (
        <Modal show={props.modalOpen} onHide={() => props.setModalOpen(false)}>
            <Modal.Header>
                <Modal.Title>Confirmar borrado</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Está seguro que desea borrar la vista? Esta acción no se puede deshacer.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.setModalOpen(false)}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleBorrar}>
                    Borrar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

function Presentacion() {
    const [vistas, setVistas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [id, setId] = useState(0);

    const [reload, setReload] = useState(false);

    useEffect(() => {
        axios.get('/api/presentacion/vistas')
            .then(res => {
                setVistas(res.data);
                setIsLoading(false);
            }
            );
    }, [reload]);

    const handleBorrar = (id) => {
        setModalOpen(true);
        setId(id);
    }

    const handleReload = () => {
        setReload(!reload);
    }

    return (
        <>
            <div className="content-wrapper" style={{ minHeight: '688px' }}>
                <TituloSeccion titulo="Presentación" />
                <section className="content">
                    <div className="container">
                        <div className="row">
                            <div className="col-9">
                                <Caja titulo="Abrir vista existente" emoji="🖼">
                                    <Loader isLoading={isLoading} height="250px">
                                        <table className="table table-sm table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Nombre</th>
                                                    <th scope="col">Descripción</th>
                                                    <th scope="col">Visuales</th>
                                                    <th scope="col">Fecha creación</th>
                                                    <th scope="col" className="text-center">Abrir</th>
                                                    <th scope="col" className="text-center">Editar</th>
                                                    <th scope="col" className="text-center">Eliminar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    vistas.map((vista, index) => (
                                                        <tr key={index}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{vista.nombre}</td>
                                                            <td>{vista.descripcion}</td>
                                                            <td>{vista.visuales.length}</td>
                                                            <td>{vista.created_at.split("T")[0]}</td>
                                                            <td className="text-center"><a href={"/vista/" + vista.id} target="_blank" className="btn btn-primary btn-sm"><i className="fas fa-external-link-alt"></i></a></td>
                                                            <td className="text-center"><Link to={"/editarVista/" + vista.id} className="btn btn-warning btn-sm"><i className="fas fa-pencil-alt"></i></Link></td>
                                                            <td className="text-center"><button className="btn btn-danger btn-sm" onClick={() => handleBorrar(vista.id)}><i className="fas fa-trash"></i></button></td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </Loader>
                                </Caja>
                            </div>
                            <div className="col-3">
                                <Caja titulo="Crear vista nueva" emoji="👨‍🎨">
                                    <Link to="/nueva_vista" className="btn btn-primary btn-block">
                                        <i className="fas fa-plus"></i>
                                        <span style={{ marginLeft: "2px" }}>Nueva vista</span>
                                    </Link>
                                </Caja>
                            </div>
                        </div>
                    </div>
                    <ModalConfirmarBorrado id={id} modalOpen={modalOpen} setModalOpen={setModalOpen} reload={handleReload} />
                </section>
            </div>
        </>
    )
}

export default Presentacion;

