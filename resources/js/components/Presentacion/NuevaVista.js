import React, { useEffect, useReducer } from "react";
import { TituloSeccion, BoxHeader, Caja } from "../generales";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import Swal from "sweetalert2";
import axios from "axios";
import Loader from "../Comun/Loader";


var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

const initialState = {
    visuales: [],
    maquinas_disponibles: [],
    isLoading: false,
    tipo_visual: "",
    alto: "",
    ancho: "",
    maquina: "",
    x: "",
    y: "",
    nombre: "",
    descripcion: "",
    showModal: false,
    last_id: 0,
}

const checkCollision = (visual1, visual2) => {

    // Coincidencia horizontal
    if (!(
        visual1.x > visual2.x + visual2.ancho - 1 || //V1 completamente a la derecha de V2
        visual1.x + visual1.ancho - 1 < visual2.x)   //V1 completamente a la izquierda de V2
    ) {
        // coincidencia vertical
        if (!(
            visual1.y > visual2.y + visual2.alto - 1 || //V1 completamente abajo de V2
            visual1.y + visual1.alto - 1 < visual2.y)   //V1 completamente arriba de V2
        ) {
            return true
        }
    }
    return false
}

const reducer = (state, action) => {
    let error
    switch (action.type) {
        case "setMaquinasDisponibles":
            return { ...state, maquinas_disponibles: action.payload };
        case "setTipoVisual":
            return { ...state, tipo_visual: action.payload };
        case "setAlto":
            if (action.payload != "" && (action.payload < 1 || action.payload > 4)) {
                return state
            } else {
                return { ...state, alto: parseInt(action.payload) };
            }
        case "setAncho":
            if (action.payload != "" && (action.payload < 1 || action.payload > 6)) {
                return state
            } else {
                return { ...state, ancho: parseInt(action.payload) };
            }
        case "setMaquina":
            return { ...state, maquina: action.payload };
        case "setPosicion":
            return { ...state, x: parseInt(action.payload.x), y: parseInt(action.payload.y) };
        case "agregarVisual":
            error = ""
            if (state.tipo_visual === "") {
                error = "Debe seleccionar un tipo de visual"
            } else if (state.alto === "") {
                error = "Debe ingresar un alto"
            } else if (state.ancho === "") {
                error = "Debe ingresar un ancho"
            } else if (state.maquina === "") {
                error = "Debe seleccionar una máquina"
            } else if (state.x === "" || state.y === "") {
                error = "Debe ingresar una posición válida en la cuadrícula"
            }
            // Comprobar nuevo visual dentro de los margenes
            else if (
                state.x + parseInt(state.ancho) > 6 ||
                state.y + parseInt(state.alto) > 4
            ) {
                error = "El visual excede los márgenes de la cuadrícula"
            }

            // Comprobar nuevo visual no colisiona con los demás
            else {
                for (let i = 0; i < state.visuales.length; i++) {
                    if (checkCollision(state.visuales[i], { x: state.x, y: state.y, ancho: state.ancho, alto: state.alto })) {
                        error = "Los visuales no pueden solaparse entre si"
                        break;
                    }
                }
            }

            if (error === "") {
                let aux_visuales = state.visuales
                aux_visuales.push({
                    tipo_visual: state.tipo_visual,
                    alto: state.alto,
                    ancho: state.ancho,
                    maquina: parseInt(state.maquina),
                    x: state.x,
                    y: state.y,
                    id: state.last_id
                })
                return { ...state, tipo_visual: "", alto: "", ancho: "", maquina: "", x: "", y: "", visuales: aux_visuales, last_id: state.last_id + 1 };
            } else {
                Toast.fire({
                    icon: 'error',
                    title: error
                });
                return state;
            }
        case "eliminarVisual":
            return { ...state, visuales: state.visuales.filter(visual => visual.id !== action.payload) };
        case "setNombre":
            return { ...state, nombre: action.payload };
        case "setDescripcion":
            return { ...state, descripcion: action.payload };
        case "showModal":
            return { ...state, showModal: true };
        case "hideModal":
            return { ...state, showModal: false };
        case "resetState":
            return {
                visuales: [],
                maquinas_disponibles: [],
                isLoading: false,
                tipo_visual: "",
                alto: "",
                ancho: "",
                maquina: "",
                x: "",
                y: "",
                nombre: "",
                descripcion: "",
                showModal: false,
                last_id: 0
            }
        case "setVisuales":
            let aux_visuales = []
            let last_id = 0
            for (let i = 0; i < action.payload.length; i++) {
                aux_visuales.push({
                    tipo_visual: action.payload[i].tipo,
                    alto: action.payload[i].alto,
                    ancho: action.payload[i].ancho,
                    maquina: action.payload[i].maquina_id,
                    x: action.payload[i].x,
                    y: action.payload[i].y,
                    id: action.payload[i].id
                })
                if (action.payload[i].id > last_id) {
                    last_id = action.payload[i].id
                }
            }
            return { ...state, visuales: aux_visuales, last_id: last_id };
        case "startLoading":
            return { ...state, isLoading: true };
        case "stopLoading":
            return { ...state, isLoading: false };
        default:
            return state;
    }
}

function Casilla(props) {

    //Comprobar si ya está en un visual
    let esta_en_visual = false;
    let tipo_visual = "";
    let clase

    if (props.state.ancho === "" || props.state.alto === "") {
        clase = props.state.x === props.x && props.state.y === props.y ? "casilla-seleccionada" : "casilla-vacia";
    } else {
        if (props.state.x !== ""
            && props.state.y !== ""
            && props.state.x <= props.x
            && props.state.x + props.state.ancho > props.x
            && props.state.y <= props.y
            && props.state.y + props.state.alto > props.y) {
            clase = "casilla-seleccionada"
        } else {
            clase = "casilla-vacia";
        }
    }


    clase += " casilla"

    return (
        <div className={clase} onClick={() => props.dispatch({ type: "setPosicion", payload: { x: props.x, y: props.y } })}>
            {esta_en_visual ? <span className="icono-visual">{tipo_visual}</span> : null}
        </div>
    );
}

function CajaCuadricula(props) {

    let cuadricula = [];
    for (let i = 0; i < 4; i++) {
        let fila = [];
        for (let j = 0; j < 6; j++) {
            fila.push(
                <Casilla key={"cas_" + i + "_" + j} x={j} y={i} state={props.state} dispatch={props.dispatch} />
            );
        }
        cuadricula.push(
            <div key={"fil_" + i} className="fila">
                {fila}
            </div>
        );
    }

    // console.log(props.state.maquinas_disponibles.find( maq => maq.id === 2).abreviacion);

    return (
        <Caja titulo="Cuadrícula" emoji="🔲">
            <div className="row">
                <div className="col-12">
                    <Loader isLoading={props.state.isLoading} height="320px">
                        <div className="cuadricula">
                            {
                                props.state.visuales.map((visual, index) => {
                                    let maquina = props.state.maquinas_disponibles.find(maq => maq.id === visual.maquina)
                                    let n_maquina = maquina ? maquina.abreviacion : "General";
                                    return (
                                        <div key={"visual_" + index}
                                            onClick={() => props.dispatch({ type: "eliminarVisual", payload: visual.id })}
                                            className="visual"
                                            style={{ top: 80 * (visual.y), left: 80 * (visual.x), width: 80 * visual.ancho, height: 80 * visual.alto }}>
                                            <div className="outer">
                                                <div className="middle">
                                                    <div className="inner">
                                                        <span className="icono-visual"><b>{visual.tipo_visual}</b></span><br />
                                                        <span className="icono-visual">{n_maquina}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {cuadricula}
                        </div>
                    </Loader>
                </div>
            </div>
        </Caja>
    );
}

function CajaVisuales(props) {

    useEffect(() => {
        axios.get("/api/modelo/maquina")
            .then(res => {
                props.dispatch({ type: "setMaquinasDisponibles", payload: res.data.datos });
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    return (
        <div className="card">
            <BoxHeader titulo="Visuales" emoji="🎨" />
            <div className="card-body">
                <div className="row">
                    <div className="form-group col-12">
                        <label htmlFor="visuales">Tipo de visual</label>
                        <select value={props.state.tipo_visual} onChange={(e) => props.dispatch({ type: "setTipoVisual", payload: e.target.value })} className="form-control" id="visuales">
                            <option hidden>Seleccione una opción</option>
                            <option value={"oee"}>OEE</option>
                            <option value={"disponibilidad"}>Disponibilidad</option>
                            <option value={"rendimiento"}>Rendimiento</option>
                            <option value={"calidad"}>Calidad</option>
                            <option value={"productividad"}>Productividad</option>
                            <option value={"estado"}>Estado</option>
                            <option value={"temporizador"}>Temporizador</option>
                            <option value={"timeline"}>Timeline</option>
                        </select>

                    </div>
                    <div className="form-group col-6">
                        <label htmlFor="alto">Alto</label>
                        <input type="number" className="form-control" id="alto" placeholder="min 1 - max 4" value={props.state.alto} onChange={(e) => props.dispatch({ type: "setAlto", payload: e.target.value })} />
                    </div>
                    <div className="form-group col-6">
                        <label htmlFor="ancho">Ancho</label>
                        <input type="number" className="form-control" id="ancho" placeholder="min 1 - max 6" value={props.state.ancho} onChange={(e) => props.dispatch({ type: "setAncho", payload: e.target.value })} />
                    </div>
                    <div className="form-group col-12">
                        <label htmlFor="maquina">Máquina</label>
                        <select className="form-control" id="maquina" disabled={props.state.tipo_visual == ""} value={props.state.maquina} onChange={(e) => props.dispatch({ type: "setMaquina", payload: e.target.value })}>
                            <option value="" hidden>Seleccione una opción</option>
                            {
                                ["estado", "temporizador", "timeline"].includes(props.state.tipo_visual) ?
                                    null :
                                    <option value="0">General</option> 
                            }
                            {
                                props.state.maquinas_disponibles.map((maquina, index) => {
                                    return (
                                        <option key={"maquina_" + index} value={maquina.id}>{maquina.nombre} ({maquina.abreviacion})</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <button type="button" className="btn btn-primary floatright" onClick={() => props.dispatch({ type: "agregarVisual" })}>Agregar <i className="fas fa-arrow-right hspace"></i></button>
            </div>
        </div>
    );
}

function ModalGuardarVista(props) {

    let navigate = useNavigate();
    const location = useLocation();
    const { id_vista } = useParams();

    const handleGuardar = () => {
        if (props.state.nombre === "" || props.state.descripcion === "") {
            Toast.fire({
                icon: "error",
                title: "Debe ingresar un nombre y una descripción"
            });
        } else {
            if (location.pathname === "/nueva_vista") {
                axios.post("/api/presentacion/vista", { nombre: props.state.nombre, visuales: props.state.visuales, descripcion: props.state.descripcion })
                    .then(res => {
                        Toast.fire({
                            icon: "success",
                            title: "Vista guardada"
                        });
                        props.dispatch({ type: "resetState" });
                        navigate("/presentacion");
                    }
                    ).catch(err => {
                        Toast.fire({
                            icon: "error",
                            title: "Error al guardar la vista"
                        });
                    }
                    );
            } else {
                axios.put("/api/presentacion/vista", { id: id_vista, nombre: props.state.nombre, visuales: props.state.visuales, descripcion: props.state.descripcion })
                    .then(res => {
                        Toast.fire({
                            icon: "success",
                            title: "Vista guardada"
                        });
                        props.dispatch({ type: "resetState" });
                        navigate("/presentacion");
                    }
                    ).catch(err => {
                        Toast.fire({
                            icon: "error",
                            title: "Error al guardar la vista"
                        });
                    });
            }
        }
    }


    return (
        <Modal show={props.state.showModal} onHide={() => props.dispatch({ type: "hideModal" })}>
            <Modal.Header>
                <Modal.Title>Guardar vista</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="form-group">
                        <label htmlFor="nombre">¿Con qué nombre guardamos la vista?</label>
                        <input type="text" className="form-control" id="nombre" placeholder="Nombre de la vista" value={props.state.nombre} onChange={(e) => props.dispatch({ type: "setNombre", payload: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea className="form-control" id="descripcion" rows="3" value={props.state.descripcion} onChange={(e) => props.dispatch({ type: "setDescripcion", payload: e.target.value })}></textarea>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.dispatch({ type: "hideModal" })}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleGuardar}>
                    Guardar
                </Button>
            </Modal.Footer>

        </Modal>
    )
}

function NuevaVista() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const navigate = useNavigate();
    const { id_vista } = useParams();
    const location = useLocation();


    useEffect(() => {
        if (location.pathname === "/nueva_vista") {
            dispatch({ type: "resetState" });
        }
        else {
            dispatch({ type: "startLoading" });
            axios.get("/api/presentacion/vista/" + id_vista)
                .then(res => {
                    dispatch({ type: "setVisuales", payload: res.data.visuales });
                    dispatch({ type: "setNombre", payload: res.data.nombre });
                    dispatch({ type: "setDescripcion", payload: res.data.descripcion });
                    dispatch({ type: "stopLoading" });
                }
                ).catch(err => {
                    Toast.fire({
                        icon: "error",
                        title: "Error al cargar la vista"
                    });
                }
                );
        }
    }, [location, id_vista]);

    const handleCancelar = () => {
        dispatch({ type: "resetState" });
        navigate("/presentacion");
    }

    const handleGuardar = () => {
        if (state.visuales.length === 0) {
            Toast.fire({
                icon: "error",
                title: "No se puede guardar una vista vacía"
            });
        } else {
            dispatch({ type: "showModal" });
        }
    }

    return (
        <>
            <div className="content-wrapper" style={{ minHeight: "688.2px" }}>
                <TituloSeccion titulo="Nueva vista" />
                <section className="content">
                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                <CajaVisuales state={state} dispatch={dispatch} />
                            </div>
                            <div className="col-6">
                                <CajaCuadricula state={state} dispatch={dispatch} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <button type="button" onClick={handleCancelar} className="btn btn-danger floatright">Cancelar <i className="fas fa-times hspace"></i></button>
                            </div>
                            <div className="col-6">
                                <button className="btn btn-success" onClick={handleGuardar}>
                                    Guardar <i className="fas fa-save hspace"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <ModalGuardarVista state={state} dispatch={dispatch} />
                </section>
            </div>
        </>
    );
}

export default NuevaVista;