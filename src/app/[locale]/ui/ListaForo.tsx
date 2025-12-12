import React from 'react'
import { getForos } from '../api/foro' // Usamos la función que ya tienes para traer todos los foros
import { Foro } from '../types/types'
import ForoCard from './ForoCard'
import { getTranslations } from 'next-intl/server'

// El componente recibe el nombre de la planta para poder filtrar
async function ListaForo({ nombrePlanta }: { nombrePlanta: string }) {
    const t = await getTranslations('ListaForo')
    // 1. Se obtienen TODOS los foros de la base de datos
    const todosLosForos: Foro[] = await getForos()

    // ✅ PASO DE DEPURACIÓN: Muestra en la consola qué nombre de planta se está buscando.
    // Abre la consola de tu navegador (F12) para ver este mensaje.

    // 2. Se filtran los foros con una comparación más robusta
    const forosFiltrados = todosLosForos.filter(foro => {
        // ✅ PASO DE DEPURACIÓN: Muestra los nombres que se están comparando.

        // Se convierten ambos textos a minúsculas y se quitan los espacios de los lados
        // antes de compararlos. Esto soluciona el problema.
        return foro.Planta?.trim().toLowerCase() === nombrePlanta?.trim().toLowerCase()
    })

    return (
        <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>{t('heading')}</h2>

            {forosFiltrados.length === 0 ? (
                <div className='text-center text-gray-600 bg-white/50 p-6 rounded-lg'>
                    <p>{t('noEntries')}</p>
                    <p className='text-sm mt-1'>{t('beFirst')}</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {/* 3. Se renderiza la lista ya filtrada */}
                    {forosFiltrados.map(foro => (
                        <ForoCard key={foro.ForoID} foro={foro} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ListaForo
