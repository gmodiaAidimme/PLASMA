import React from "react";


function ImagenModelo({ imagen, modelo, clase, ...restprops }) {

    const default_image = "/images/" + modelo + "/default.png"

    const handleError = (event) => {
        event.target.src = default_image;
    };

    return (
        <img className={clase}
                src={`/images/${imagen}`}
                onError={handleError} 
                {...restprops}/>
    )
}

export default ImagenModelo