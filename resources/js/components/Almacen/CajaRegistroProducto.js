import React, {useState} from "react";
import { Caja } from "../generales";
import Accordion from 'react-bootstrap/Accordion';
import DatePicker from "react-datepicker"
import Pagination from 'react-bootstrap/Pagination';

function CajaRegistroProducto({ registro, inicio, fin, setInicio, setFin }) {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(registro.length / itemsPerPage);

    const [currentPage, setCurrentPage] = useState(1);

    return (
        <Caja titulo="Registro de movimientos" emoji="📝">
            <div className="container" >
                <div className="row">

                    <div className="col-md-12 d-flex justify-content-center">
                        <DatePicker selected={inicio}
                            onChange={(date) => setInicio(date)}
                            dateFormat='dd/MM/yyyy'
                            locale='es'
                            className="form-control"
                        />
                        <span className="mx-2">-</span>
                        <DatePicker selected={fin}
                            onChange={(date) => setFin(date)}
                            dateFormat='dd/MM/yyyy'
                            locale='es'
                            className="form-control"
                        />
                    </div>
                </div>
            </div>
            {registro.length > 0 ?
                <Accordion className="mt-3">
                    {
                        registro.map((item, index) => (
                            <Accordion.Item eventKey={index} key={index}>
                                <Accordion.Header>{item.fechahora} <span className={`float-right badge ${item.cantidad >= 0 ? "bg-primary" : "bg-danger"}`} style={{ marginLeft: "10px" }}>{item.cantidad}</span> </Accordion.Header>
                                <Accordion.Body>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p>Usuario: {item.name}</p>
                                            <p>Tipo: {item.tipo}</p>
                                            <p>Notas: {item.notas}</p>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        )).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    }
                </Accordion>
                :
                <div className="alert alert-warning mt-3" role="alert">
                    No hay movimientos en el rango de fechas seleccionado
                </div>
            }
            {registro.length > itemsPerPage &&
                <div className="d-flex justify-content-center mt-3">
                    <Pagination>
                        <Pagination.Prev onClick={() => currentPage > 1 ? setCurrentPage(currentPage - 1) : null} />
                        {
                            Array.from({ length: totalPages }, (_, index) => (
                                <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                                    {index + 1}
                                </Pagination.Item>
                            ))
                        }
                        <Pagination.Next onClick={() => currentPage < totalPages ? setCurrentPage(currentPage + 1) : null} />
                    </Pagination>
                </div>
            }
        </Caja>
    );
}

export default CajaRegistroProducto;