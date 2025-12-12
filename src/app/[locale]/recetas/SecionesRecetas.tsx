'use client'
import React from 'react'
import { Receta } from '../types/types'

function SecionesRecetas({ secciones }: { secciones: { nombre: string; recetas: Receta[] }[] }) {
    // const [recetaSeleccionada, setRecetaSeleccionada] = React.useState<Receta | null>(null)
    function seleccionarReceta(receta: Receta | null) {
        // setRecetaSeleccionada(receta)
        location.href = `/receta/${receta?.Nombre}`
    }
    return (
        <>
            {secciones.map((seccion, index) => (
                <section
                    className='recetas-seccion sm:shadow-lg sm:m-4 rounded-lg p-4  bg-gray-100'
                    key={index}
                >
                    <h2 className='font-bold text-xl text-center'>🌿 {seccion.nombre}</h2>
                    <div className='flex gap-4 m-2 py-4 justify-center'>
                        {seccion.recetas.map(receta => (
                            <div
                                className='receta-card max-w-sm p-4  rounded-lg shadow cursor-pointer hover:scale-105 transition-transform'
                                key={receta.RecetaID}
                                onClick={() => seleccionarReceta(receta)}
                            >
                                <h3>{receta.Nombre}</h3>
                                <div>
                                    <p>
                                        {receta.Descripcion.length > 100
                                            ? `${receta.Descripcion.substring(0, 100)}...`
                                            : receta.Descripcion}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </>
    )
}

export default SecionesRecetas
