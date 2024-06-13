import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Comun/Loader';
import { UserContext } from '../Context/UserContext';

function ResultadoRegistro() {
    const [resultadoRegistro, setResultadoRegistro] = useState(null);
    const location = window.location;

    let navigate = useNavigate();

    const { setUser, setAvatar } = useContext(UserContext);

    useEffect(() => {
        if (location.search.includes("code")) {
            axios.get(`/api/registro/callback${location.search}`)
                .then((response) => {
                    setResultadoRegistro(response.data.resultado)

                    if (response.status === 200 && response.data.resultado === "login") {
                        localStorage.setItem("auth_token", response.data.token);
                        localStorage.setItem("auth_name", response.data.user.name);
                        setUser(response.data.user.name);
                        localStorage.setItem("auth_avatar", response.data.user.avatar);
                        setAvatar(response.data.user.avatar);
                        navigate("/");
                    }
                })
                .catch((error) => {
                    console.log(error)
                    setResultadoRegistro("error")
                })
            return;
        }
        setResultadoRegistro("nuevo_usuario_creado")
    }, [])

    return (
        <>
            <div className="login-box" style={{ margin: "auto", paddingTop: "100px" }}>
                <div className="login-logo">
                    <b>Plasma</b>MES
                </div>
                <div className="card">
                    <div className="card-body login-card-body">
                        {

                            resultadoRegistro === null && <Loader isLoading={true} height="100px" />
                        }
                        {
                            resultadoRegistro === "nuevo_usuario_creado" &&
                            <>
                                <h4 style={{ textAlign: "center" }}>Usuario creado con éxito</h4>
                                <p className="login-box-msg">Se ha solicitado al administrador que acepte su registro, cuando esto ocurra, recibirá un correo electrónico y podrá iniciar sesión normalmente.</p>
                            </>
                        }
                        {
                            resultadoRegistro === "login" &&
                            <>
                                <h4 style={{ textAlign: "center" }}>Inicio de sesión correcto</h4>
                                <p className="login-box-msg">Bienvenido a PLASMA</p>
                            </>
                        }
                        {
                            resultadoRegistro === "espera_activacion" &&
                            <>
                                <h4 style={{ textAlign: "center" }}>Esperando activación</h4>
                                <p className="login-box-msg">Tu usuario ya ha sido creado, pero necesita ser activado por un administrador. Contacta con el responsable de tu empresa en caso de no conseguir acceso.</p>
                            </>
                        }
                        {
                            !["nuevo_usuario_creado", "login", "espera_activacion", null].includes(resultadoRegistro) &&
                            <>
                                <h4 style={{ textAlign: "center" }}>Error</h4>
                                <p className="login-box-msg">Ha habido un error al iniciar sesión, comprueba tu conexión a internet y vuelve a intentarlo</p>
                            </>
                        }
                        <div style={{ textAlign: "center" }}>
                            <Link to="/login" >Volver al inicio</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>


    );
}

export default ResultadoRegistro;