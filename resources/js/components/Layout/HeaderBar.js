import React, { useContext } from "react"
import ImagenUsuario from "../generales"
import { Link } from "react-router-dom"
import Alarmas from "./Alarmas"
import { UserContext } from "../Context/UserContext"
import { useLocation } from "react-router-dom"


function MenuUsuario(props) {
    return (
        <ul className="dropdown-menu">
            <li className="user-header">
                <ImagenUsuario usuario_id={props.usuario.id} clase="img-circle" />
                <p>
                    {props.usuario.first_name} - {props.usuario.rol.nombre}
                    <small>Miembro desde</small>
                </p>
            </li>
            <li className="user-footer">
                <div className="pull-left">
                    <button className="btn btn-default btn-flat" onClick={() => props.cambiarVista('Perfil')}>Perfil</button>
                </div>
                <div className="pull-right">
                    <form action="/logout" method="POST" >
                        <input type="hidden" name="_token" value={csrf_token} />
                        <input className="btn btn-default btn-flat" type="submit" value="Salir" />
                    </form>
                </div>
            </li>
        </ul>
    )
}


function MenuAlarmas() {
    return (
        <ul className="dropdown-menu">
            <li className="header">Han saltado <span className="num_alarmas_saltadas"></span> alarmas nuevas</li>
            <li>
                <ul className="menu" >
                    <div id="lista_alarmas_saltadas">
                    </div>
                </ul>
            </li>
            <li className="footer"><a href="/alarmas_activas">Ver todas</a></li>
        </ul>
    )
}

function DesplegableMenuAlarmas() {
    return (
        <li className="dropdown notifications-menu">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                <i className="fa fa-bell-o"></i>
                <span className='label label-warning num_alarmas_saltadas'></span>
            </a>
            <MenuAlarmas />
        </li>
    )
}

function HeaderBar() {

    const { permisos } = useContext(UserContext)

    const location = useLocation()

    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
                </li>
            </ul>

            <ul className="navbar-nav ml-auto">
                {permisos.map(p => p.name).includes("ayuda") &&
                    <li className="nav-item">

                        <Link className="nav-link" to="/ayuda">
                            <i className="fas fa-question-circle"></i>
                        </Link>

                    </li>
                }
                {permisos.map(p => p.name).includes("alarmas") &&
                    <li className="nav-item">
                        <Alarmas />
                    </li>
                }
                {permisos.map(p => p.name).includes("configuracion") &&
                    <li className="nav-item">
                            <Link className={"nav-link" + (location.pathname.includes("configuracion") ? " activo" : "")} to="/configuracion">
                                <i className="fas fa-cogs"></i>
                            </Link>
                    </li>
                }
            </ul>
        </nav>
    )
}

export default HeaderBar;