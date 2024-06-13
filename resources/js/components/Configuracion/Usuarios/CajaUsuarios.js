import React, { useState, useEffect } from "react";
import { Caja } from "../../generales";
import Loader from "../../Comun/Loader";
import Swal from "sweetalert2";
import { throwToast } from "../../../lib/notifications";

function CajaUsuarios() {
    const [isloading, setisloading] = useState(true);
    const [usuarios, setusuarios] = useState([]);

    useEffect(() => {
        actualizarRegistros();
    }, [])

    const actualizarRegistros = () => {
        // $('#tb-usuarios').DataTable().destroy()
        axios.get("/api/admin/usuarios")
            .then(res => {

                setusuarios(res.data);
                setisloading(false);
                $('#tb-usuarios').DataTable()
            })
    }

    const act_des_usuario = (id, estado) => {
        let url = estado == "Activo" ? "/api/admin/desactivar_usuario" : "/api/admin/activar_usuario";
        let mensaje = estado == "Activo" ? "desactivado" : "activado";
        axios.put(url + "/" + id)
            .then(res => {
                throwToast("Correcto", "Se ha " + mensaje + " el usuario", "success")
                actualizarRegistros();

            })
            .catch(err => {
                console.log(err);
                throwToast("Error", "No se ha podido " + mensaje + " el usuario", "error")
            })
    }

    const eliminar_usuario = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete("/api/admin/eliminar_usuario/" + id)
                    .then(res => {
                        throwToast("Correcto", "Se ha eliminado el usuario", "success")
                        actualizarRegistros();
                    })
                    .catch(err => {
                        console.log(err);
                        throwToast("Error", "No se ha podido eliminar el usuario", "error")
                    })
            }
        });
    }


    return (
        <>
            <Caja titulo="Usuarios" emoji="🧑">
                <Loader isLoading={isloading} height="300px">
                    <table className="display" id={"tb-usuarios"}>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Correo</th>
                                <th>Tipo de registro</th>
                                <th>Fecha de registro</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Cambiar estado</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td><img src={item.avatar || "/dist/img/generic_user.png"} alt="Avatar" className="img-circle img-size-32 mr-2" /> {item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.tipo_registro}</td>
                                        <td>{item.fecha_registro}</td>
                                        <td>{item.rol}</td>
                                        <td>{item.estado}</td>
                                        <td>
                                            <button className="btn btn-primary btn-block" onClick={() => act_des_usuario(item.id, item.estado)}>
                                                <i className="fas fa-edit"></i> {item.estado == "Activo" ? "Desactivar" : "Activar"}
                                            </button>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger btn-block" onClick={() => eliminar_usuario(item.id)}>
                                                <i className="fas fa-trash"></i> Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Loader>
            </Caja>
        </>
    )
}

export default CajaUsuarios