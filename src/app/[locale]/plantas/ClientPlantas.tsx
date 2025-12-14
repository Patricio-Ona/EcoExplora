'use client'
import React from 'react'
import { Foro, Planta } from '../types/types'
import Listado from './listado'
import Mapa from '../ui/Mapa'
import { useTranslations } from 'next-intl'

export default function ClientPlantas({ plantas, foros }: { plantas: Planta[]; foros: Foro[] }) {
    const t = useTranslations('PlantasPage')
    const [buscador, setBuscador] = React.useState('')
    const [mostrarMapa, setMostrarMapa] = React.useState(false)

    const forosFiltrados = foros.filter(
        foro =>
            foro.Planta.toLowerCase().includes(buscador.toLowerCase()) ||
            foro.Comentario.toLowerCase().includes(buscador.toLowerCase())
    )

    return (
        <div className='plantas-page-container'>
            {/* Header con búsqueda y botón */}
            <div className='plantas-search-header'>
                <div className='plantas-search-wrapper'>
                    {/* Botón Mostrar Mapa */}
                    <button
                        className={`plantas-toggle-btn ${mostrarMapa ? 'active' : ''}`}
                        onClick={() => setMostrarMapa(!mostrarMapa)}
                    >
                        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                            <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
                            <circle cx='12' cy='10' r='3'></circle>
                        </svg>
                        <span>{mostrarMapa ? t('toggleList') : t('toggleMap')}</span>
                    </button>

                    {/* Input de búsqueda */}
                    <div className='plantas-search-input-group'>
                        <svg className='plantas-search-icon' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                            <circle cx='11' cy='11' r='8'></circle>
                            <path d='m21 21-4.35-4.35'></path>
                        </svg>
                        <input
                            type='text'
                            placeholder={t('searchPlaceholder')}
                            value={buscador}
                            onChange={e => setBuscador(e.target.value)}
                            className='plantas-search-input'
                        />
                    </div>
                </div>
            </div>

            {/* Contenido */}
            <div className='plantas-content-wrapper'>
                {mostrarMapa ? (
                    <div className='plantas-mapa-container'>
                        <Mapa plantas={forosFiltrados}></Mapa>
                    </div>
                ) : (
                    <Listado plantas={plantas} buscador={buscador} />
                )}
            </div>
        </div>
    )
}
