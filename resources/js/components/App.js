import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import LeftPanel from './Layout/LeftPanel';
import HeaderBar from './Layout/HeaderBar';
import Principal from './Layout/principal';
import Footer from './Layout/Footer';
import Vista from './Presentacion/Vista';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../../css/app.css";
import "../../css/cuadricula.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import ResultadoRegistro from './Login/ResultadoRegistro';
import { UserContext } from './Context/UserContext';
import { UnidadesContext } from './Context/UnidadesContext';

import Credentials from './Login/Credentials';
import PrivateRoute from './PrivateRoute';
import PermitedRoute from './PermitedRoute';

axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


function Dashboard() {
    return (
        <>
            <LeftPanel />
            <HeaderBar />
            <Principal />
            <Footer />
        </>
    )
}


function App() {
    let url = window.location.href;

    if (url.includes("/vista")) return <Vista vista_id={url.split("/")[4]} />

    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [unidades, setUnidades] = useState(null);
    const [permisos, setPermisos] = useState([]);

    useEffect(() => {

        if (window.innerWidth < 992) {
            document.body.classList.add("sidebar-closed");
            document.body.classList.add("sidebar-collapse");
        }

        axios.get("/api/perfil")
            .then((response) => {
                setUser(response.data.user.name);
                setAvatar(response.data.user.avatar);
                setPermisos(response.data.permisos);
            })
            .catch((error) => {
                console.log(error)
            })

        axios.get("/api/configuracion/variables")
            .then((response) => {
                setUnidades(response.data.unidades_productividad);
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const login_urls = ['/login', '/register', '/restore', '/new_password'];

    return (
        <UserContext.Provider value={{ user, setUser, avatar, setAvatar, permisos, setPermisos }}>
            <UnidadesContext.Provider value={{ unidades: unidades, setUnidades: setUnidades }}>
                <BrowserRouter>
                    <Routes>
                        {login_urls.map((url, index) => {
                            return <Route key={index} path={url} element={<Credentials />} />
                        })}
                        <Route path="/resultado_registro" element={<ResultadoRegistro />} />
                        <Route element={<PrivateRoute />}>
                            <Route element={<PermitedRoute />} >
                                <Route path="*" element={<Dashboard />} />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </UnidadesContext.Provider>
        </UserContext.Provider>
    )
}

ReactDOM.render(React.createElement(App), document.querySelector('#app'))