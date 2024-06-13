import React, { useEffect, useState, useContext } from "react"
import { Caja } from "../generales"
import Loader from "../Comun/Loader";
import axios from "axios";
import ConfirmDelete from "./ConfirmDelete";
import ModFormElemento from "./ModFormElemento";
import { traducirUnidades } from "../../lib/cambioUnidades";
import { UnidadesContext } from "../Context/UnidadesContext";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const cols_excluidas = ["id", "created_at", "updated_at", "preparacion", "email_verified_at"]

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function pluralizar(string) {
    if(string =="User"){
        return "Usuarios"
    }
    if (string.substr(-1) == 'a' || string.substr(-1) == 'e' || string.substr(-1) == 'o' || string.substr(-1) == 'u') {
        return string + 's';
    }
    else {
        return string + 'es';
    }
}

function addSpaces(word) {
    return word.replace(/_/g, ' ').trim();
}

function TablaElemento(props) {

    const { unidades } = useContext(UnidadesContext);

    function mostrar_elem(item, col) {
        if (['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].includes(col)) {
            return item[col] ? <p>&#9989;</p> : <p>&#10060;</p>
        }
        else if (col == "color") {
            return <div style={{ backgroundColor: item[col], width: "50px", height: "25px", borderRadius: "5px" }} className="color-box"></div>
        }
        else if (col == "rendimiento_teorico" || col == "tiempo_ciclo_defecto") {
            return traducirUnidades(unidades, item[col])
        }
        else if (col == "imagen" || col == "avatar") {
            if (item[col] == null || item[col] == "") {
                return <p>No hay imagen</p>
            }
            return <div>
                <LazyLoadImage
                    placeholder={<p>Cargando...</p>}
                    className="img_configuracion"
                    alt="Imagen"
                    effect="blur"
                    src={"/images/" + item[col]} />
            </div>
        }
        else {
            return item[col]
        }
    }

    let tabla

    if (props.datos.length > 0) {
        let thColumn = props.columnas.map((col) => <th key={col}>{addSpaces(capitalizeFirstLetter(col))}</th>)
        let rows = props.datos.map((item, index) => {
            return <tr key={index}>{props.columnas.map((col) => {
                if (col == "Modificar") {
                    return <td key={"mod_" + index}><button className="btn btn-block btn-warning" onClick={() => props.seleccionarUpdate(item.id)}>Modificar</button></td>
                } else if (col == "Eliminar") {
                    return <td key={"del_" + index}><button className="btn btn-block btn-danger" onClick={() => props.seleccionarBorrado(item.id)}>Eliminar</button></td>
                } else {
                    return <td key={col + "_" + index} style={{ textAlign: 'center' }}>{mostrar_elem(item, col)}</td>
                }
            })}</tr>
        });

        tabla = (
            <table className="display" id={"tb-" + props.elemento}>
                <thead>
                    <tr>
                        {thColumn}
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }
    else {
        tabla = (
            <div style={{ textAlign: 'center' }}>
                <p>No existen registros, cree uno nuevo</p>
            </div>
        )
    }
    return (
        <div>
            {tabla}
        </div>
    )
}

function CajaConf(props) {
    const [columnas, setColumnas] = useState([]);
    const [datos, setDatos] = useState([]);
    const [borrado_id, setBorrado_id] = useState(null);
    const [update_id, setUpdate_id] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalNuevo, setModalNuevo] = useState(false);
    const [modoModal, setModoModal] = useState("Nuevo");
    const [isloading, setIsloading] = useState(true);

    useEffect(() => {
        actualizarRegistros();
    }, [])

    function seleccionarBorrado(id) {
        setBorrado_id(id);
        setShowModal(true);
    }

    function seleccionarUpdate(id) {
        setUpdate_id(id);
        setModalNuevo(true);
        setModoModal("Modificar");
    }

    function hideModal() {
        setShowModal(false);
        setModalNuevo(false);
    }

    function actualizarRegistros() {
        axios.get('/api/modelo/' + props.elemento)
            .then(res => {
                let cols = []
                $('#tb-' + props.elemento).DataTable().destroy()
                if (res.data.datos.length > 0) {
                    cols = Object.keys(res.data.datos[0]).filter(item => !cols_excluidas.includes(item))
                    cols.push("Modificar")
                    cols.push("Eliminar")
                    setColumnas(cols)
                    setDatos(res.data.datos)
                    setIsloading(false);
                    $('#tb-' + props.elemento).DataTable()
                }
                else {
                    setColumnas([]);
                    setDatos([]);
                    setIsloading(false);
                }
            })
            .catch(err => {
                console.log("Se ha producido un error al obtener los datos de " + props.elemento)
            })
    }

    return (
        <>
            <Caja titulo={addSpaces(pluralizar(capitalizeFirstLetter(props.elemento)))} emoji={props.emoji}>
                <Loader isLoading={isloading} height="300px">
                    <TablaElemento
                        elemento={props.elemento}
                        columnas={columnas}
                        datos={datos}
                        seleccionarBorrado={seleccionarBorrado}
                        seleccionarUpdate={seleccionarUpdate}
                    />
                </Loader>
                <div className="row" style={{ marginTop: "15px" }}>
                    <div className="col-md-10"></div>
                    <div className="col-md-2">
                        <button className="btn btn-block btn-success" onClick={() => { setModoModal("Nuevo"); setModalNuevo(true) }}>Crear {addSpaces(props.elemento)}</button>
                    </div>
                </div>
            </Caja>
            <ConfirmDelete
                showModal={showModal}
                hideModal={hideModal}
                modelo={props.elemento}
                id={borrado_id}
                actualizarRegistros={actualizarRegistros}
            />
            <ModFormElemento
                showModal={modalNuevo}
                hideModal={hideModal}
                modelo={props.elemento}
                modo={modoModal}
                id={update_id}
                actualizarRegistros={actualizarRegistros}
            />
        </>
    )
}

export default CajaConf