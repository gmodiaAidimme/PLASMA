import React, { useState } from "react";
import axios from "axios";
import { throwToast } from "../../lib/notifications";
import Loader from "../Comun/Loader";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Register(props) {

    const [datosRegistro, setDatosRegistro] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    })
    const [condiciones, setCondiciones] = useState({
        terminos: false,
        politicas: false
    })
    const [isLoading, setIsLoading] = useState(false)
    const [loginUrl, setLoginUrl] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:8000/api/registro/auth')
            .then((response) => setLoginUrl(response.data.url))
            .catch((error) => console.error(error));
    }, []);


    const changeCondiciones = (condicion) => {
        if (condicion === "terminos") setCondiciones({ ...condiciones, terminos: !condiciones.terminos })
        if (condicion === "politicas") setCondiciones({ ...condiciones, politicas: !condiciones.politicas })
    }

    const checkDatos = () => {
        let errores = []
        if (datosRegistro.name === "") errores.push("name")
        if (datosRegistro.email === "") errores.push("email")
        if (datosRegistro.password === "") errores.push("password")
        if (datosRegistro.password_confirmation === "") errores.push("password_confirmation")

        if (errores.length > 0) {
            throwToast("Error", "Debes completar todos los campos", "error")
            return false
        }

        if (datosRegistro.password !== datosRegistro.password_confirmation) {
            throwToast("Error", "Las contraseñas no coinciden", "error")
            return false
        }
        return true
    }

    const checkConditions = () => {
        if (!condiciones.terminos) {
            throwToast("Error", "Debes aceptar los términos y condiciones", "error")
            return false
        }
        if (!condiciones.politicas) {
            throwToast("Error", "Debes aceptar la política de privacidad", "error")
            return false
        }
        return true
    }

    const registrar_usuario = () => {
        if (checkConditions()) {
            if (checkDatos()) {
                setIsLoading(true)
                axios.get('/sanctum/csrf-cookie').then(response => {
                    axios.post('/api/registro/register', datosRegistro)
                        .then((response) => {
                            if (response.status === 201) {
                                localStorage.setItem('auth_token', response.data.token)
                                localStorage.setItem('auth_user', JSON.stringify(response.data.user))
                                navigate('/resultado_registro')
                            }
                            else {
                                throwToast("Error", "Al parecer el email ya está registrado", "error")
                            }
                        })
                        .catch((error) => console.log(error))
                        .finally(() => setIsLoading(false))
                })
            }
        }
    }

    const registrar_usuario_google = () => {
        if (checkConditions()) {
            window.location.href = loginUrl
        }
    }

    return (
        <>
            <p className="login-box-msg">Nuevo usuario</p>

            <div className="input-group mb-3">
                <input type="text" value={datosRegistro.name} onChange={e => setDatosRegistro({ ...datosRegistro, name: e.target.value })} className="form-control" placeholder="Nombre completo" />
                <div className="input-group-append">
                    <div className="input-group-text">
                        <span className="fas fa-user"></span>
                    </div>
                </div>
            </div>
            <div className="input-group mb-3">
                <input type="email" value={datosRegistro.email} onChange={e => setDatosRegistro({ ...datosRegistro, email: e.target.value })} className="form-control" placeholder="Email" />
                <div className="input-group-append">
                    <div className="input-group-text">
                        <span className="fas fa-envelope"></span>
                    </div>
                </div>
            </div>
            <div className="input-group mb-3">
                <input type="password" value={datosRegistro.password} onChange={e => setDatosRegistro({ ...datosRegistro, password: e.target.value })} className="form-control" placeholder="Contraseña" />
                <div className="input-group-append">
                    <div className="input-group-text">
                        <span className="fas fa-lock"></span>
                    </div>
                </div>
            </div>
            <div className="input-group mb-3">
                <input type="password" value={datosRegistro.password_confirmation} onChange={e => setDatosRegistro({ ...datosRegistro, password_confirmation: e.target.value })} className="form-control" placeholder="Repetir contraseña" />
                <div className="input-group-append">
                    <div className="input-group-text">
                        <span className="fas fa-lock"></span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="icheck-primary">
                        <input type="checkbox" checked={condiciones.terminos} onChange={() => changeCondiciones("terminos")} id="agreeTerms" name="terms" />
                        <label htmlFor="agreeTerms">
                            Acepto los <a href="#">términos y condiciones.</a>
                        </label>
                    </div>
                    <div className="icheck-primary">
                        <input type="checkbox" checked={condiciones.politicas} onChange={() => changeCondiciones("politicas")} id="agreePrivacy" name="privacy" />
                        <label htmlFor="agreePrivacy">
                            Acepto la <a href="#">política de privacidad.</a>
                        </label>
                    </div>
                </div>
                <div className="col-3" />
                <div className="col-6">
                    <Loader isLoading={isLoading} >
                        <button className="btn btn-primary btn-block" onClick={registrar_usuario}>Crear usuario</button>
                    </Loader>
                    {
                        isLoading &&
                        <div style={{ marginTop: "25px" }} />
                    }
                </div>
                <div className="col-3" />
            </div>


            <div className="social-auth-links text-center mb-3">
                <p>- O también -</p>
                <button type="button" onClick={registrar_usuario_google} className="login-with-google-btn" disabled={loginUrl === ""}>
                    Crear usuario con Google
                </button>
                {/* {
                    condiciones.politicas && condiciones.terminos ?
                        null
                        :
                        <a onClick={registrar_usuario_google} className="btn btn-block btn-light pointer">
                            <i className="fab fa-google"></i> Iniciar sesión con Google
                        </a>
                }
                <div id="google-signin" hidden={condiciones.politicas && condiciones.terminos ? false : true} /> */}
            </div>

            <a className="text-center pointer" onClick={() => props.setEstado("login")}>Ya tengo usuario</a>
        </>
    );
}

export default Register;