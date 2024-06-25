import React, { useState, useEffect, useContext } from "react";
import Switch from 'react-bootstrap-switch';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { Caja } from '../../generales';
import Loader from "../../Comun/Loader";
import Swal from "sweetalert2";
import { throwToast } from "../../../lib/notifications";
import { UnidadesContext } from "../../Context/UnidadesContext";
import axios from "axios";

var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

const helpMaxSecMicro = (
    <Popover id="popover-basic">
        <Popover.Header as="h3">Máximo de segundos en microparo</Popover.Header>
        <Popover.Body>
            <span> Indica a partir de qué momento un microparo deja de serlo y se considera como paro, y por tanto, se pedirá justificación. </span>
            <br />
            <span> <b>Ejemplo:</b> Si este valor está a 300s (5min) cualquier paro inferior a este tiempo no solicitará justificación y se clasificará como microparo, los que superen este umbral, sí pedirán justificación.</span>
        </Popover.Body>
    </Popover>
);

const helpMaxGap = (
    <Popover id="popover-basic">
        <Popover.Header as="h3">Máximo de segundos sin recibir datos</Popover.Header>
        <Popover.Body>
            <span> Indica los segundos que puede estar el sistema sin recibir información de la máquina. En caso de que se envíe información con un retraso superior a esta cantidad de tiempo entre datos, el sistema registrará el tiempo intermedio como vacío.</span>
        </Popover.Body>
    </Popover>
);

const helpMaxRegistro = (
    <Popover id="popover-basic">
        <Popover.Header as="h3">Máximo de segundos de un registro</Popover.Header>
        <Popover.Body>
            <span> Indica el espacio de tiempo máximo que puede resumir un registro en la base de datos. </span>
            <br />
            <span> Un número muy alto ofrecerá información con poca precisión, mientras que un número muy bajo requerirá de más espacio en la base de datos.</span>
        </Popover.Body>
    </Popover>
);

const helpModoManual = (
    <Popover id="popover-basic">
        <Popover.Header as="h3">Modo manual</Popover.Header>
        <Popover.Body>
            <span> Si el modo manual está activado, no se recogerán datos de las máquinas automáticamente. Cuando se de una orden de fabricación de alta, aparecerá un botón para notificar y justificar los paros. Cuando la órden de fabricación acabe, se añadirán al registro diario las piezas indicadas más las que se marquen como desperdicio.</span>
            <br />
            <span> El modo manual ofrece información de menos calidad que el modo normal, debería utilizarse únicamente en empresas en las que no hay posibilidad de incluir sensores.</span>
        </Popover.Body>
    </Popover>
);

const helpMaxProductividad = (
    <Popover id="popover-basic">
        <Popover.Header as="h3">Unidades de productividad</Popover.Header>
        <Popover.Body>
            <span> Indica las unidades de productividad que se utilizarán en el sistema. La selección no afectará en nada a los cálculos, únicamente mostrará los valores de productividad en las unidades elegidas.</span>
            <br />
            <span> <b>Ejemplo:</b> Independientemente de si selecciona minutos por pieza o piezas por hora, si el rendimiento es del 70%, este no se afectará. Sin embargo, en las cajas de información y en las entradas de datos, se utilizará esta unidad.</span>
        </Popover.Body>
    </Popover>
);

const helpGapAlarmas = (
    <Popover id="popover-basic">
        <Popover.Header as="h3">Gap entre alarmas</Popover.Header>
        <Popover.Body>
            <span> Indica el tiempo mínimo que debe pasar entre alarmas. Si se recibe una alarma y no ha pasado este tiempo desde la última, no se registrará.</span>
        </Popover.Body>
    </Popover>
);

const helpModoAutoencendido = (
    <Popover id="popover-basic">
        <Popover.Header as="h3">Modo autoencendido</Popover.Header>
        <Popover.Body>
            <span> Si este modo está activo, se iniciará la recolección de datos cuando se reciba el primer registro con fabricación, en lugar de cuando inicie el turno según el horario.</span>
        </Popover.Body>
    </Popover>
);



function RegistroVariable(props) {

    return (
        <div className="row g-3 align-items-center">
            <div className="col-7">
                <label className="col-form-label">{props.label}</label>
            </div>
            <div className="col-4">
                {props.modo === 'numero' && <input type="number" value={props.value} onChange={props.onChange} className="form-control form-variables" />}
                {props.modo === 'switch' && <Switch name='modoManual' value={props.value} onChange={props.onChange} />}
                {props.modo === 'select' && <select className="form-select form-variables" aria-label="Default select example" value={props.value} onChange={props.onChange}>
                    {props.options.map((option, index) => {
                        return <option key={index} value={option.value}>{option.label}</option>
                    })}
                </select>
                }
            </div>
            <div className="col-1">
                <span id="passwordHelpInline" className="form-text">
                    <OverlayTrigger trigger={["hover", "click", "focus"]} placement="left" overlay={props.popover}>
                        <i className="fas fa-question-circle"></i>
                    </OverlayTrigger>
                </span>
            </div>
        </div>
    )
}

function CajaVariables() {
    const [maxSecMicro, setMaxSecMicro] = useState("");
    const [maxGap, setMaxGap] = useState("");
    const [maxRegistro, setMaxRegistro] = useState("");
    const [gapAlarmas, setGapAlarmas] = useState("");
    const [modoManual, setModoManual] = useState(false);
    const [modoAutoencendido, setModoAutoencendido] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const { unidades, setUnidades } = useContext(UnidadesContext);

    useEffect(() => {
        axios.get('/api/configuracion/variables')
            .then(res => {
                setMaxSecMicro(res.data.limite_microparo);
                setMaxGap(res.data.tiempo_falta_datos);
                setMaxRegistro(res.data.limite_registro);
                setGapAlarmas(res.data.gap_alarmas);
                setUnidades(res.data.unidades_productividad)
                setModoManual(res.data.modo_manual);
                setModoAutoencendido(res.data.modo_autoencendido)
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                throwToast("Error", "No se han podido cargar las variables", "error");
                setIsLoading(false);
            });
    }, []);

    const handleGuardar = () => {
        const variables = {
            limite_microparo: maxSecMicro,
            tiempo_falta_datos: maxGap,
            gap_alarmas: gapAlarmas,
            limite_registro: maxRegistro,
            modo_manual: modoManual,
            modo_autoencendido: modoAutoencendido,
            unidades_productividad: parseInt(unidades)
        }
        setGuardando(true);
        axios.post('/api/configuracion/variables', variables)
            .then(res => {
                setGuardando(false);
                Toast.fire({
                    icon: 'success',
                    title: 'Variables guardadas correctamente'
                });
            }
            )
            .catch(err => {
                console.log(err);
                throwToast("Error", "No se han podido guardar las variables", "error");
                setGuardando(false);
            }
            );
    }

    return (
        <Caja titulo="Preferencias" emoji="🎛">
            <Loader isLoading={isLoading} height="205px" >
                <div className="row">
                    <div className="col-md-12 col-lg-6">
                        <RegistroVariable modo="numero" onChange={(e) => setMaxSecMicro(e.target.value)} value={maxSecMicro} label="Máx. segundos de microparo" popover={helpMaxSecMicro} />
                        <RegistroVariable modo="numero" onChange={(e) => setMaxGap(e.target.value)} value={maxGap} label="Máx. segundos sin recibir datos" popover={helpMaxGap} />
                        <RegistroVariable modo="numero" onChange={(e) => setMaxRegistro(e.target.value)} value={maxRegistro} label="Máx. segundos de un mismo registro" popover={helpMaxRegistro} />
                    </div>
                    <div className="col-md-12 col-lg-6">
                        <RegistroVariable modo="numero" onChange={(e) => setGapAlarmas(e.target.value)} value={gapAlarmas} label="Máx. segundos de alarma" popover={helpGapAlarmas} />
                        <RegistroVariable modo="select" onChange={(e) => setUnidades(parseInt(e.target.value))} value={unidades} label="Unidades de productividad" popover={helpMaxProductividad} options={[{ value: 0, label: "Segundos por pieza" }, { value: 1, label: "Minutos por pieza" }, { value: 2, label: "Horas por pieza" }, { value: 3, label: "Piezas por hora" }, { value: 4, label: "Piezas por minuto" }, { value: 5, label: "Piezas por segundo" }]} />
                        <RegistroVariable modo="switch" onChange={(elem, state) => setModoManual(state)} value={modoManual} label="Modo manual" popover={helpModoManual} />
                        <RegistroVariable modo="switch" onChange={(elem, state) => setModoAutoencendido(state)} value={modoAutoencendido} label="Modo autoencendido" popover={helpModoAutoencendido} />
                        <div className="row" style={{ marginTop: "15px" }}>
                            <div className="col-md-9"></div>
                            <div className="col-md-3">
                                {
                                    guardando ?
                                        <button style={{ width: "100%" }} className="btn btn-success" type="button" disabled>
                                            <span style={{ margintRight: "5px" }} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Guardando...
                                        </button>
                                        :
                                        <button className="btn btn-block btn-success" onClick={handleGuardar}> Guardar </button>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </Loader>
        </Caja >
    )
}

export default CajaVariables;