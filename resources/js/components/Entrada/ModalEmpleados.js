
import React from "react"
import { Modal, Button } from "react-bootstrap"
import ImagenModelo from "../Comun/ImagenModelo"

function ModalEmpleados(props) {
    return (
        <Modal show={props.state.showModEmpleados} onHide={() => props.dispatch({ type: "SET", payload: { key: "showModEmpleados", value: false } })}>
            <Modal.Header>
                <Modal.Title>Empleados en OF</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    {
                        props.state.estado == 0 ?
                            props.state.empleados.map((empleado, key) => {
                                return (
                                    <div key={key} className="marginup">
                                        <input type="checkbox" id={empleado.id} checked={props.state.empleadosEnOF.includes(empleado.id)} onChange={() => props.dispatch({ type: "ADD_REMOVE_EMPLEADO", payload: empleado.id })} />
                                        <span className="spacer"></span>
                                        <ImagenModelo modelo="empleado" className="avatar" alt="empleado" imagen={"empleado/" + empleado.imagen} />
                                        {/* <img src={"/dist/img/operario" + empleado.id + ".jpg"} className="avatar" alt="empleado" /> */}
                                        <span className="spacer"></span>
                                        <label htmlFor={empleado.id}>{empleado.nombre} {empleado.apellido}</label>
                                    </div>
                                )
                            })
                            :
                            props.state.empleadosEnOF.map((empleado_id, key) => {
                                let empleado = props.state.empleados.find(e => e.id == empleado_id)
                                return (
                                    <div key={key} className="marginup">
                                        <span className="spacer"></span>
                                        <ImagenModelo modelo="empleado" className="avatar" alt="empleado" imagen={"empleado/" + empleado.imagen} />
                                        <span className="spacer"></span>
                                        <label>{empleado.nombre} {empleado.apellido}</label>
                                    </div>
                                )
                            })
                    }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => props.dispatch({ type: "SET", payload: { key: "showModEmpleados", value: false } })}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalEmpleados