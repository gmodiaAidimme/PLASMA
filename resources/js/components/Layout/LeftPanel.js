import React, { useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import ImagenModelo from '../Comun/ImagenModelo';


function EnlaceFinal({ url, icono, nombre, permiso }) {
    const { pathname } = useLocation();
    const { permisos } = useContext(UserContext);

    let activa = pathname.includes(url);
    let hasAccess = permisos.map(p => p.name).includes(permiso);

    if (!hasAccess) {
        return null;
    }

    return (
        <li className="nav-item">
            <Link to={url} className={activa ? "nav-link active" : "nav-link"}>
                <i className={icono + " nav-icon"}></i>
                <p>{nombre}</p>
            </Link>
        </li>
    );
}

function MenuLateral() {
    return (
        <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <EnlaceFinal url="/panel/0" icono="fas fa-industry" nombre="Panel general" permiso="panel general" />
                <EnlaceFinal url="/panel_maquina" icono="fas fa-tachometer-alt" nombre="Panel máquina" permiso="panel maquina" />
                <EnlaceFinal url="/entrada" icono="fa fa-edit" nombre="Entrada manual" permiso="entrada manual" />
                <EnlaceFinal url="/ofs" icono="fa fa-rocket" nombre="Ord. fabricacion" permiso="ordenes de fabricacion" />
                <EnlaceFinal url="/proyectos" icono="fas fa-project-diagram" nombre="Proyectos" permiso="proyectos" />
                <EnlaceFinal url="/historico" icono="fas fa-calendar-day" nombre="Histórico" permiso="historico" />
                <EnlaceFinal url="/almacen" icono="fas fa-warehouse" nombre="Almacén" permiso="almacen" />
                <EnlaceFinal url="/operarios" icono="fa fa-hard-hat" nombre="Operarios" permiso="operarios" />
                <EnlaceFinal url="/control" icono="fa fa-tasks" nombre="Control trabajo" permiso="control" />
                <EnlaceFinal url="/presentacion" icono="fa fa-tv" nombre="Presentación" permiso="presentacion" />
            </ul>
        </nav >
    )
}

function PanelUsuario() {

    const { user, avatar, permisos, setAvatar, setUser, setPermisos } = useContext(UserContext)

    const navigate = useNavigate()

    const handleCerrarSesion = () => {
        axios.post('/api/registro/logout')
            .then(res => {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_name')
                localStorage.removeItem('auth_avatar')
                localStorage.removeItem('auth_admin')
                setUser(null)
                setAvatar(null)
                setPermisos([])
                navigate('/login')
            })
            .catch(err => {
                console.log(err)
            })
    }

    if (!permisos.map(p => p.name).includes("perfil")) return (
        <button type="button" className="btn btn-danger btn-block cerrar-sesion" onClick={handleCerrarSesion}><b>Cerrar sesión</b></button>
    )

    return (
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
                <ImagenModelo imagen={avatar ? avatar : '/images/user/generic.png'} modelo="user" clase="img-circle elevation-2" alt="Imagen de usuario"/>
            </div>
            <div className="info">
                <Link to="/perfil" className="d-block">{user}</Link>
            </div>
        </div>
    )
}

function LogoPlasma() {
    return (
        <>
            <Link to="/" className="brand-link">
                <img src="/dist/img/loguito.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" />
                <span className="brand-text font-weight-light">Leñas Legua</span>
            </Link>
            {/* <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-arrow-left" style={{color:"white"}}></i></a> */}
        </>
    )
}

function LeftPanel() {
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <LogoPlasma />
            <div className="sidebar">
                <PanelUsuario />
                <MenuLateral />
            </div>
        </aside>
    )
}


export default LeftPanel