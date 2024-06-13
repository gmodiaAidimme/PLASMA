import React, { useState } from 'react';
import Login from './Login';
import RestorePassword from './RestorePassword';
import Register from './Register';
import NewPassword from './NewPassword';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function Credentials(props) {
    const [estado, setEstado] = useState("login");

    let location = useLocation()

    useEffect(() => {
        if (location.pathname == "/register") setEstado("register")
        if (location.pathname == "/restore") setEstado("restore")
        if (location.pathname == "/new_password") setEstado("new_password")
    }, [])

    return (
        <>
            <div className="login-box" style={{margin:"auto", paddingTop:"100px"}}>
                <div className="login-logo">
                    <b>Plasma</b>MES
                </div>
                <div className="card">
                    <div className="card-body login-card-body">
                        {estado === "login" && <Login setEstado={setEstado} />}
                        {estado === "restore" && <RestorePassword setEstado={setEstado} />}
                        {estado === "register" && <Register setEstado={setEstado} />}
                        {estado === "new_password" && <NewPassword setEstado={setEstado} />}
                    </div>
                </div>
            </div>
        </>


    );
}

export default Credentials;