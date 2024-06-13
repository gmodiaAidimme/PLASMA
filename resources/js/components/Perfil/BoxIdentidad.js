import React from "react"
import Avatar from "./Avatar"
import { Caja } from "../generales"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useContext } from "react"
import { UserContext } from "../Context/UserContext"

function Box_identidad({ perfil }) {
    const navigate = useNavigate()

    const { setUser, setAvatar } = useContext(UserContext)

    const handleCerrarSesion = () => {
        axios.post('/api/registro/logout')
            .then(res => {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_name')
                localStorage.removeItem('auth_avatar')
                localStorage.removeItem('auth_admin')
                setUser(null)
                setAvatar(null)
                navigate('/login')
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <Caja titulo="Usuario" emoji="🧑">
            <Avatar />

            <p className="text-center" style={{margin:0}}><b>Miembro desde</b> {perfil && perfil.user.created_at.split('T')[0]}</p>
            <p className="text-muted text-center"><b>Rol</b> {perfil && perfil.user.admin? "Administrador":"Usuario"}</p>

            <hr />
            <button type="button" className="btn btn-danger btn-block" onClick={handleCerrarSesion}><b>Cerrar sesión</b></button>
        </Caja>
    )
}

export default Box_identidad