import React, { useState, useEffect } from "react";
import { Caja } from "../../generales";
import Loader from "../../Comun/Loader";
import { throwToast } from "../../../lib/notifications";
import { Modal } from "react-bootstrap";
import Switch from 'react-bootstrap-switch';
import axios from "axios";

function CajaRoles() {
    const [isloading, setisloading] = useState(true);
    const [roles, setRoles] = useState([]);
    const [rolActual, setRolActual] = useState({
        id: 0,
        name: "",
        description: "",
        permisos: []
    });
    const [show, setShow] = useState(false);
    const [showBorrar, setShowBorrar] = useState(false);
    const [permisos, setPermisos] = useState([]);
    const [crearNuevo, setCrearNuevo] = useState(false);

    useEffect(() => {
        actualizarRegistros();
    }, [])

    const actualizarRegistros = () => {
        axios.get("/api/configuracion/roles")
            .then(res => {
                setRoles(res.data.roles);
                setPermisos(res.data.permisos);
                setisloading(false);
                $('#tb-roles').DataTable()
            })
    }

    const abrirModalEliminarRol = (id) => {
        setRolActual(roles.find(rol => rol.id == id))
        setShowBorrar(true);
    }

    const eliminar_rol = () => {
        axios.delete("/api/configuracion/roles/" + rolActual.id)
            .then(() => {
                throwToast("Correcto", "Se ha eliminado el rol", "success")
                actualizarRegistros();
            })
            .catch(err => {
                if (err.response.status == 422) {
                    throwToast("No se puede eliminar", err.response.data.error, "warning")
                }
                else {
                    console.log(err)
                    throwToast("Error", "No se ha podido eliminar el rol", "error")
                }
            })
            .finally(() => {
                cerrarModal();
            })
    }

    const checkErrores = () => {
        if (rolActual.name == "") {
            throwToast("No se puede crear", "El nombre del rol no puede estar vacío", "warning")
            return false;
        }

        if (rolActual.description == "") {
            throwToast("No se puede crear", "La descripción del rol no puede estar vacía", "warning")
            return false;
        }

        if (rolActual.permisos.length == 0) {
            throwToast("No se puede crear", "El rol debe tener al menos un permiso", "warning")
            return false;
        }

        return true;
    }

    const modificar_rol = () => {
        if (!checkErrores()) {
            return;
        }

        axios.put("/api/configuracion/roles/" + rolActual.id, rolActual)
            .then(() => {
                throwToast("¡Hecho!", "Se ha modificado el rol", "success")
                actualizarRegistros();
            })
            .catch(err => {
                if (err.response.status == 422) {
                    throwToast("No se puede modificar", err.response.data.error, "warning")
                }
                else {
                    console.log(err)
                    throwToast("Error", "No se ha podido modificar el rol", "error")
                }
            })
            .finally(() => {
                cerrarModal();
            })
    }

    const crear_rol = () => {
        if (!checkErrores()) {
            return;
        }

        axios.post("/api/configuracion/roles", rolActual)
            .then(() => {
                throwToast("¡Hecho!", "Se ha creado el rol", "success")
                actualizarRegistros();
            })
            .catch(err => {
                if (err.response.status == 422) {
                    throwToast("No se puede crear", err.response.data.error, "warning")
                }
                else {
                    console.log(err)
                    throwToast("Error", "No se ha podido crear el rol", "error")
                }
            })
            .finally(() => {
                cerrarModal();
            })
    }


    const abrirModalModificarRol = (nuevo, rol) => {
        setCrearNuevo(nuevo)
        if (nuevo) {
            setRolActual({
                name: "",
                description: "",
                permisos: []
            })
        }
        else {
            setRolActual(roles.find(item => item.id == rol))
        }
        setShow(true);
    }

    const cerrarModal = () => {
        setShow(false);
        setShowBorrar(false);
        setRolActual({
            name: "",
            description: "",
            permisos: []
        })

    }

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <>
            <Caja titulo="roles" emoji="👥">
                <Loader isLoading={isloading} height="300px">
                    <table className="display" id={"tb-roles"}>
                        <thead>
                            <tr>
                                <th>Rol</th>
                                <th>Descripción</th>
                                <th>Permisos</th>
                                <th>Modificar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.permisos.map((item, index) => {
                                            return (
                                                <span key={index} className="badge badge-primary badge-permisos"><i className={item.icon}></i> {capitalize(item.name)}</span>
                                            )
                                        })}</td>

                                        <td>
                                            {item.id != 1 && <button className="btn btn-warning btn-block" onClick={() => abrirModalModificarRol(false, item.id)}>
                                                Modificar
                                            </button>}
                                        </td>
                                        <td>
                                            {item.id != 1 && <button className="btn btn-danger btn-block" onClick={() => abrirModalEliminarRol(item.id)}>
                                                Eliminar
                                            </button>}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div className="row" style={{ marginTop: "10px" }}>
                        <div className="col-md-10">
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-success btn-block" onClick={() => abrirModalModificarRol(true, null)}>
                                Crear rol
                            </button>
                        </div>
                    </div>
                </Loader>
            </Caja>
            <Modal show={show} onHide={cerrarModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Modificar rol</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" className="form-control" name="name" value={rolActual.name} onChange={e => setRolActual({ ...rolActual, [e.target.name]: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea className="form-control" name="description" value={rolActual.description} onChange={e => setRolActual({ ...rolActual, [e.target.name]: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Permisos</label>
                        <div className="row">
                            {permisos.map((item, index) => {
                                return (
                                    <div key={index} className="col-md-6 gestion-permisos">
                                        <label className="form-check-label">
                                            <span key={index} className="badge badge-primary badge-permisos" style={{ fontSize: "15px" }}><i className={item.icon}></i> {capitalize(item.name)}</span>
                                        </label>
                                        <Switch
                                            onText="Sí"
                                            offText="No"
                                            onColor="success"
                                            offColor="danger"
                                            value={rolActual.permisos.map(item => item.id).includes(item.id)}
                                            onChange={(el, state) => {
                                                if (state) {
                                                    setRolActual({
                                                        ...rolActual,
                                                        permisos: [...rolActual.permisos, item]
                                                    })
                                                } else {
                                                    setRolActual({
                                                        ...rolActual,
                                                        permisos: rolActual.permisos.filter(permiso => permiso.id !== item.id)
                                                    })
                                                }
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className={"btn btn-" + (crearNuevo ? "success": "warning")} onClick={crearNuevo ? crear_rol : modificar_rol}>{crearNuevo ? "Crear" : "Modificar"} rol</button>
                </Modal.Footer>
            </Modal>
            <Modal show={showBorrar} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar rol</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Seguro que deseas eliminar el rol <strong>{rolActual.name}</strong>? Asegúrate de que no haya usuarios con este rol antes de eliminarlo.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
                    <button className="btn btn-danger" onClick={eliminar_rol}>Eliminar</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CajaRoles