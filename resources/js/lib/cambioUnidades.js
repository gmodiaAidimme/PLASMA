export function traducirUnidades(unidad, cantidad){
    if("cantidad" === "-"){
        return "-"
    }

    let traduccion = "";
    
    switch(unidad){

        case 0: // segundos por pieza
            traduccion = cantidad
            break
        case 1: // minutos por pieza
            traduccion = cantidad/60
            break
        case 2: // horas por pieza
            traduccion = cantidad/3600
            break
        case 3: // piezas por hora
            traduccion = 3600/cantidad
            break
        case 4: // piezas por minuto
            traduccion = 60/cantidad
            break
        case 5: // piezas por segundo
            traduccion = 1/cantidad
            break
        default:
            traduccion = cantidad;
            break
    }

    // Redondear a 2 decimales
    traduccion = Math.round(traduccion * 100) / 100
    return traduccion
}

export function devolverUnidadesAOriginal(unidad, cantidad){
    switch(unidad){
            
            case 0: // segundos por pieza
                return cantidad
            case 1: // minutos por pieza
                return cantidad*60
            case 2: // horas por pieza
                return cantidad*3600
            case 3: // piezas por hora
                return 3600/cantidad
            case 4: // piezas por minuto
                return 60/cantidad
            case 5: // piezas por segundo
                return 1/cantidad
            default:
                return cantidad;
        }
}