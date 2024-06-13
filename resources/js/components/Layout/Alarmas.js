import React, { useContext, useEffect, useState } from "react"
import { Modal, Spinner, Button } from "react-bootstrap";
import { MiniLoader } from "../Comun/Loader";
import AlarmasContext from "../Contexto/AlarmasContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


function ModalAlarmas(props) {

    const navigate = useNavigate();

    const handleAccion = (alarma) => {
        navigate(alarma.pagina);
        props.onHide();
    }

    const handleBorrar = (alarma) => {
        // axios.delete(`/api/alarmas/${alarma.id}`)
    }


    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header>
                <Modal.Title>Alarmas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.alarmas.map(alarma =>
                    <div key={alarma.id}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-8">
                                        <h3 className="card-title"><b>{alarma.nombre}</b></h3>
                                        <p className="card-text">{alarma.descripcion}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <button onClick={() => handleAccion(alarma) } className="btn btn-primary" >{alarma.accion}</button>
                                        {/* <span className="hspace"></span> */}
                                        {/* <button onClick={() => handleBorrar(alarma)} className="btn btn-danger" ><i fontSize="1px" className="fa fa-trash"></i></button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Cerrar
                </Button>
                <Button variant="danger" onClick={props.onHide}>
                    Descartar todo
                </Button>
            </Modal.Footer>
        </Modal>
    );
}


function Alarmas() {
    const [isLoading, setIsLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [alarmas, setAlarmas] = useState([]);
    
    useEffect(() => {
        getData();
        const interval = setInterval(() => {
            getData();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    function getData() {
        axios.get("/api/notificaciones")
            .then(res => {
                setIsLoading(false);
                setAlarmas(res.data.paros);
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
            });
    }

    return (
        <>
            {
                isLoading ?
                    <div style={{ marginTop: 9 }}>
                        <Spinner animation="border" variant="primary" size="sm" />
                    </div>
                    :
                    <a onClick={() => setShow(true)} className="nav-link" href="#">
                        <i className="fas fa-bell"></i>
                        {
                            alarmas.length > 0 ?
                                <span className="badge badge-warning navbar-badge">{alarmas.length}</span>
                                :
                                null
                        }
                    </a>
            }
            <ModalAlarmas show={show} onHide={() => setShow(false)} alarmas={alarmas}/>
        </>
    )
}

export default Alarmas