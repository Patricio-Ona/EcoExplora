import React from 'react'
import ListPlantas from '../ListPlantas'
import { Planta } from '../types/types'
import { useTranslations } from 'next-intl'

export default function Listado({ plantas, buscador }: { plantas: Planta[]; buscador: string }) {
    const t = useTranslations('PlantasPage.Listado')

    const plantasFiltradas = plantas.filter(
        planta =>
            planta.NombreCientifico.toLowerCase().includes(buscador.toLowerCase()) ||
            planta.NombreComun.toLowerCase().includes(buscador.toLowerCase()) ||
            planta.Categoria.toLowerCase().includes(buscador.toLowerCase()) ||
            planta.Zona.toLowerCase().includes(buscador.toLowerCase())
    )

    const [nPagina, setNPagina] = React.useState(1)
    const plantasPorPagina = 10 // Número de plantas por página
    const plantasPaginadas = plantasFiltradas.slice(
        (nPagina - 1) * plantasPorPagina,
        nPagina * plantasPorPagina
    )
    return (
        <div className='sm:p-8 rounded-lg shadow-md my-8 border border-green-500 mx-10 bg-gray-100'>
            <div className='m-10'>
                <ListPlantas plantas={plantasPaginadas} />
            </div>
            <div className='flex justify-center items-center gap-2 pb-4'>
                <button
                    className='px-3 py-1 rounded bg-green-600 text-white disabled:bg-gray-300'
                    onClick={() => setNPagina(prev => prev - 1)}
                    disabled={nPagina === 1}
                >
                    {t('previous')}
                </button>
                <span className='px-2'>
                    {t('pageIndicator', {
                        page: nPagina,
                        total: Math.ceil(plantas.length / plantasPorPagina),
                    })}
                </span>
                <button
                    className='px-3 py-1 rounded bg-green-600 text-white disabled:bg-gray-300'
                    onClick={() => setNPagina(prev => prev + 1)}
                    disabled={nPagina === Math.ceil(plantas.length / plantasPorPagina)}
                >
                    {t('next')}
                </button>
            </div>
        </div>
    )
}
