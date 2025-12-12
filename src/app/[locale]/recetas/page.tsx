'use client'
import React, { useState, useEffect } from 'react'
import { getRecetas } from '../api/recetas'
import { Receta } from '../types/types'
import ListaReceta from './ListaReceta'
import GeneradorReceta from '../ui/GeneradorRecetas'
import { useTranslations } from 'next-intl'

function Page() {
    const t = useTranslations('RecetasPage') // Usamos el hook de traducciones

    const [recetas, setRecetas] = useState<Receta[]>([])

    useEffect(() => {
        const fetchRecetas = async () => {
            const data = await getRecetas()
            setRecetas(data)
        }
        fetchRecetas()
    }, [])

    // Ingredientes que se pasan al generador
    const ingredientes = ''

    return (
        <>
            <section className='welcome welcome-recetas'>
                <h1>{t('title')}</h1>
            </section>

            {/* Aquí se pasa la lista de ingredientes al generador */}
            <GeneradorReceta ingredientes={ingredientes} />

            <ListaReceta recetas={recetas} />
        </>
    )
}

export default Page
