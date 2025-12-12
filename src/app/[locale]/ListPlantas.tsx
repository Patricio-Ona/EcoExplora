'use client'
import React from 'react'
import { Planta } from './types/types'
import Image from 'next/image'
import Link from 'next/link' // 1. Importamos el componente Link

function ListPlantas({ plantas }: { plantas: Planta[] }) {
    // 2. Ya no necesitamos la función seleccionarPlanta

    return (
        <>
            <div className='flex flex-wrap justify-center gap-4 w-full'>
                {plantas.map(planta => (
                    // 3. Envolvemos toda la tarjeta en el componente Link
                    <Link
                        href={`/planta/${encodeURIComponent(planta.NombreComun)}`}
                        key={planta.PlantaID}
                        className='flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 min-w-[200px] max-w-[300px] no-underline' // Añadimos no-underline para que no se subraye el texto
                    >
                        {/* 4. El div ya no necesita el onClick ni el cursor-pointer */}
                        <div className='flex flex-col h-full'>
                            <div style={{ position: 'relative', width: '100%', height: '192px' }}>
                                <Image
                                    src={planta.ImagenURL}
                                    alt={planta.NombreComun}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    quality={75}
                                    priority={false}
                                />
                            </div>
                            <div className='p-4 flex-1 flex flex-col'>
                                <p className='text-xl font-bold text-green-700 mb-2'>
                                    {planta.NombreComun}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default ListPlantas