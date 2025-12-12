'use client'
import React, { useState } from 'react'
import { Receta } from '../types/types'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function ListaReceta({ recetas }: { recetas: Receta[] }) {
    const t = useTranslations('RecetasPage.Lista') // Usamos el hook de traducciones

    const [buscador, setBuscador] = useState<string>('')
    const filteredRecetas = recetas.filter(
        receta =>
            receta.Nombre.toLowerCase().includes(buscador.toLowerCase()) ||
            receta.Descripcion.toLowerCase().includes(buscador.toLowerCase())
    )

    return (
        <div className='min-h-screen'>
            <div className='flex sticky top-20 z-10 justify-center gap-4 items-center m-4 p-4 z-2 bg-white shadow-md'>
                <p className='hidden sm:inline'>{t('searchLabel')}</p>
                <input
                    type='text'
                    placeholder={t('searchPlaceholder')}
                    value={buscador}
                    onChange={e => setBuscador(e.target.value)}
                    className='p-2 border border-green-500 rounded-lg w-60'
                />
            </div>

            <div className='flex flex-wrap gap-4 m-6 py-4 justify-center'>
                {filteredRecetas.map(receta => (
                    <Link
                        className='receta-card max-w-sm p-4  rounded-lg shadow cursor-pointer hover:scale-105 transition-transform'
                        key={receta.RecetaID}
                        href={`/receta/${receta.Nombre}`}
                        // onClick={() => seleccionarReceta(receta)}
                    >
                        <h3>{receta.Nombre}</h3>
                        <div>
                            <p>
                                {receta.Descripcion.length > 100
                                    ? `${receta.Descripcion.substring(0, 100)}...`
                                    : receta.Descripcion}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
