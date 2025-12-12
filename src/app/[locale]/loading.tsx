import React from 'react'
import './loading.css' // Asegúrate de tener este archivo CSS para los estilos

function loading() {
    return (
        <div className='loading-container'>
            <div className='leaf-spinner'></div>
            <p className='loading-text'>Cargando...</p>
        </div>
    )
}

export default loading
