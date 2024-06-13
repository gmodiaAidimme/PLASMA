import React, {useState, useContext} from 'react'
import { UserContext } from '../Context/UserContext'
import axios from 'axios'
import { throwToast } from '../../lib/notifications';
import ImagenModelo from '../Comun/ImagenModelo';



function Avatar() {

    const { user, avatar, setAvatar } = useContext(UserContext);

    const uploadNewAvatar = () => {
        document.getElementById('avatar').click()
    }

    const uploadAvatar = (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('avatar', file)
        axios.post('/api/perfil/change_avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            throwToast("¡Menudo fotón!", "Se ha cambiado la foto de perfil correctamente", "success")
            setAvatar(response.data.avatar)
            localStorage.setItem('auth_avatar', response.data.avatar)
            
        }).catch(error => {
            throwToast("¡Vaya!", "Ha ocurrido un error al cambiar la foto de perfil", "error")
            console.log(error)
        })
    }


    return (
        <div>
            <div style={{ textAlign: "center" }} className="avatar-selector" onClick={uploadNewAvatar}>
                <ImagenModelo modelo="user" clase="profile-user-img img-responsive img-circle text-center" style={{ width: "150px", height: "150px" }} alt="Foto de perfil" src={avatar ? "/images/" + avatar : '/images/user/generic.png'}/>
                <input type="file" id="avatar" name="avatar" style={{ display: "none" }} onChange={uploadAvatar} />
            </div>
            <h3 className="profile-username text-center">{user}</h3>
        </div>
    )
}

export default Avatar