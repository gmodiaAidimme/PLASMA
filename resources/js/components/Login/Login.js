import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { throwToast } from '../../lib/notifications';
import { UserContext } from '../Context/UserContext';

function Login(props) { 

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginUrl, setLoginUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const { setUser, setAvatar, setPermisos } = useContext(UserContext);

    useEffect(() => {
        axios.get('/api/registro/auth')
            .then((response) => setLoginUrl(response.data.url))
            .catch((error) => console.error(error));
    }, []);

    const navigate = useNavigate()

    const iniciar_sesion_google = () => {
        window.location.href = loginUrl;
    }

    const checkConditions = () => {
        if (email === "" || password === "") {
            throwToast("Ups..", "Debes rellenar todos los campos", "error")
            return false;
        }
        return true;
    }

    const iniciar_sesion = () => {
        if (checkConditions()) {
            setLoading(true);
            axios.get('/sanctum/csrf-cookie').then(response => {
                axios.post('/api/registro/login', {
                    email: email,
                    password: password
                }).then(response => {
                    if (response.status === 200) {
                        localStorage.setItem('auth_token', response.data.token);
                        localStorage.setItem('auth_name', response.data.name);



                        setUser(response.data.name);
                        setPermisos(response.data.permisos);
                        if (response.data.avatar)
                            localStorage.setItem('auth_avatar', response.data.avatar);
                            setAvatar(response.data.avatar);
                        if(response.data.admin){
                            localStorage.setItem('auth_admin', response.data.admin);
                        }
                        
                        navigate('/')
                    } else {
                        throwToast("Error", "Parece que ha habido un problema al iniciar sesión, por favor, inténtelo de nuevo.", "error")
                    }
                }).catch(error => {
                    console.log(error);
                    if (error.response.status === 401) {
                        throwToast("Error", "El correo electrónico o la contraseña son incorrectos", "error")
                    } else {
                        console.log(error);
                    }
                })
            })
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            iniciar_sesion();
        }
    }

    return (

        <div onKeyDown={handleKeyPress} >
            <p className="login-box-msg">Inicia sesión</p>

            <div className="input-group mb-3">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" placeholder="Correo electrónico" />
                <div className="input-group-append">
                    <div className="input-group-text">
                        <span className="fas fa-envelope"></span>
                    </div>
                </div>
            </div>
            <div className="input-group mb-3">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" placeholder="Contraseña" />
                <div className="input-group-append">
                    <div className="input-group-text">
                        <span className="fas fa-lock"></span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-8">
                    <div className="icheck-primary">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">
                            Recuérdame
                        </label>
                    </div>
                </div>
                <div className="col-4">
                    <button onClick={iniciar_sesion} className="btn btn-primary btn-block">Entrar</button>
                </div>
            </div>

            <div className="social-auth-links text-center mb-3">
                <p>- O también -</p>
                <button type="button" onClick={iniciar_sesion_google} className="login-with-google-btn" disabled={loginUrl === ""} >
                    Iniciar sesión con Google
                </button>
            </div>


            <p className="mb-1">
                <a className='pointer' onClick={() => props.setEstado("restore")} >He olvidado la contraseña</a>
            </p>
            <p className="mb-0">
                <a className="text-center pointer" onClick={() => props.setEstado("register")}>No tengo cuenta</a>
            </p>
        </div>
    );
}

export default Login;