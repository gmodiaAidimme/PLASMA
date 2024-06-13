import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import Loader from "../Comun/Loader";
import { UnidadesContext } from "../Context/UnidadesContext";

import { traducirUnidades, devolverUnidadesAOriginal } from "../../lib/cambioUnidades";
import SelectorImagen from "./SelectorImagen";
import { throwToast } from "../../lib/notifications";

function remove_underscore_capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/_/g, " ");
}

function ModFormElemento(props) {
    const [campos, setCampos] = useState([])
    const [isloading, setIsloading] = useState(true)

    const [form, setForm] = useState({})

    const [modified, setModified] = useState([])

    const { unidades } = useContext(UnidadesContext);

    useEffect(() => {
        setIsloading(true)
        setForm({})
        let url = '/api/current_data/' + props.modelo
        if (props.modo === "Modificar") {
            url = url + "?id=" + props.id
        }

        axios.get(url)
            .then((res) => {
                if (!props.showModal) return
                
                if (props.modo === "Modificar") {
                    let preForm = res.data.datos

                    for (let key in preForm) {
                        if (key == "tiempo_ciclo_defecto" || key == "rendimiento_teorico") {
                            preForm[key] = traducirUnidades(unidades, preForm[key])
                        }
                    }
                    setForm(preForm)
                }
                else{
                    setForm({})
                }
                setCampos(res.data.tipos)
                setIsloading(false)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [props.showModal])

    function submitForm() {
        if (Object.keys(form).length < campos.filter(campo => campo.tipo != "checkbox").length) {
            throwToast("Error", "Todos los campos son obligatorios", "error")
            return
        }

        for (let key in form) {
            if (form[key] === "") {
                throwToast("Error", "Todos los campos son obligatorios", "error")
                return
            }
        }

        if ("tiempo_ciclo_defecto" in form) {
            form["tiempo_ciclo_defecto"] = devolverUnidadesAOriginal(unidades, form["tiempo_ciclo_defecto"])
        }
        if ("rendimiento_teorico" in form) {
            form["rendimiento_teorico"] = devolverUnidadesAOriginal(unidades, form["rendimiento_teorico"])
        }
        
        let myForm = new FormData();


        if (props.modo == "Modificar") {
            for (let key in form) {
                if (modified.includes(key)) {
                    myForm.append(key, form[key])
                }
            }
            axios.post('/api/modelo/' + props.modelo + "/" + props.id, myForm, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }})
                .then(() => {
                    throwToast("¡Hecho!", "Se ha modificado el registro", "success")
                    props.actualizarRegistros()
                })
                .catch(function (error) {
                    throwToast("Ups", "Se ha producido un error al modificar el registro", "error")
                    console.log(error)
                })
        }
        else {
            for (let key in form) {
                myForm.append(key, form[key])
            }
            axios.post('/api/modelo/' + props.modelo, myForm, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }})
                .then(() => {
                    throwToast("¡Hecho!", "Se ha creado el registro", "success")
                    props.actualizarRegistros()
                })
                .catch(function (error) {
                    throwToast("Ups", "Se ha producido un error al crear el registro", "error")
                    console.log(error)
                })
        }
        props.hideModal();
        setForm({})
        setModified([])
    }

    function handleInputChange(value, name) {
        setForm({ ...form, [name]: value })
        if (!modified.includes(name)) {
            setModified([...modified, name])
        }
    }

    function crearInput(item) {
        switch (item.tipo) {
            case "checkbox":
                return <input type="checkbox" name={item.nombre} id={item.nombre} checked={form[item.nombre] === 1} onChange={() => {handleInputChange(form[item.nombre] === 1 ? 0 : 1, item.nombre)}} />
            case "password":
                return <input type="password" className="form-control col-12" name={item.nombre} id={item.nombre} />
            case "select":
                return <select className="form-control" name={item.nombre} id={item.nombre} defaultValue={item.valor} value={form[item.nombre]} onChange={() => handleInputChange(event.target.value, item.nombre)}>
                    <option value="" hidden>Seleccione una opción</option>
                    {item.opciones.map((opcion, index) => {
                        return <option key={index} value={opcion.id}>{opcion.nombre}</option>
                    })}
                </select>
            case "image":
                return <SelectorImagen imagen={form[item.nombre]} setForm={(imagen) => {setModified([...modified, item.nombre]);setForm({ ...form, [item.nombre]: imagen })}} />
            default:
                return <input type={item.tipo} className="form-control borrable col-12" name={item.nombre} required value={form[item.nombre]} onChange={() => {handleInputChange(event.target.value, item.nombre)} } />
        }
    }

    let formulario = []
    if (campos.length > 0) {
        formulario = campos.map((item, index) => {
            return (
                <div className="form-group" key={index}>
                    <label htmlFor={item.nombre} className="col-md-4 control-label" >{remove_underscore_capitalize(item.nombre)}</label>
                    {crearInput(item)}
                </div>
            )
        })
    }

    return (
        <Modal show={props.showModal} onHide={props.hideModal}>
            <Modal.Header>
                <Modal.Title>{(props.modo == "Nuevo" ? "Crear " : "Modificar ") + props.modelo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Loader isLoading={isloading}>
                    <form id={"form-nuevo_" + props.modelo} className="form-horizontal">
                        {formulario}
                    </form>
                </Loader>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={props.hideModal}>Cancelar</button>
                <button type="button" className={props.modo == "Nuevo" ? "btn btn-success" : "btn btn-warning"} onClick={submitForm}>{props.modo == "Nuevo" ? "Agregar" : "Guardar modificación"}</button>
            </Modal.Footer>
        </Modal>
    )

}

export default ModFormElemento;