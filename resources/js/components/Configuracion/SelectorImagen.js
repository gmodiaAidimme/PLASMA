import React, { useState } from "react";


function SelectorImagen({ imagen, setForm }) {

    const [uploadedImage, setUploadedImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target.result);
            };
            reader.readAsDataURL(file);

            setForm(file);
        }
    };


    return (
        <div className="row">
            {(imagen == null || imagen == "") && uploadedImage == null ?
                <div className="col-12">
                    <div className="form-group">
                        <input type="file" className="form-control col-12" name="imagen" id="imagen" accept="image/jpeg, image/png" onChange={handleImageChange}/>
                    </div>
                </div>
                :
                <>
                    <div className="col-10">
                        <div className="form-group">
                            <input type="file" className="form-control col-12" name="imagen" id="imagen" accept="image/jpeg, image/png" style={{ marginTop: "10px" }} onChange={handleImageChange} />
                        </div>
                    </div>
                    <div className="col-2">
                        {
                            uploadedImage ?
                                <img src={uploadedImage} className="img_form_modelo" /> :
                                <img src={"/images/" + imagen} className="img_form_modelo" />
                        }
                    </div>
                </>
            }
        </div>
    )
}

export default SelectorImagen;