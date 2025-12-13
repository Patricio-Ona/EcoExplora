'use client'
import React, { useState } from 'react'
import { Receta } from '../types/types'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function ListaReceta({ recetas }: { recetas: Receta[] }) {
    const t = useTranslations('RecetasPage.Lista')

    const [buscador, setBuscador] = useState<string>('')
    const filteredRecetas = recetas.filter(
        receta =>
            receta.Nombre.toLowerCase().includes(buscador.toLowerCase()) ||
            receta.Descripcion.toLowerCase().includes(buscador.toLowerCase())
    )

    return (
        <div className='recetas-list-container'>
            {/* Search Section */}
            <div className='recetas-search-wrapper'>
                <div className='recetas-search-box'>
                    <div className='recetas-search-input-group'>
                        <svg className='recetas-search-icon' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                            <circle cx='11' cy='11' r='8'></circle>
                            <path d='m21 21-4.35-4.35'></path>
                        </svg>
                        <input
                            type='text'
                            placeholder={t('searchPlaceholder')}
                            value={buscador}
                            onChange={e => setBuscador(e.target.value)}
                            className='recetas-search-input'
                        />
                    </div>
                    <div className='recetas-results-count'>
                        {filteredRecetas.length} {filteredRecetas.length === 1 ? 'receta' : 'recetas'}
                    </div>
                </div>
            </div>

            {/* Recipes Grid */}
            <div className='recetas-grid-container'>
                {filteredRecetas.length > 0 ? (
                    <div className='recetas-grid'>
                        {filteredRecetas.map(receta => (
                            <Link
                                className='receta-card-link'
                                key={receta.RecetaID}
                                href={`/receta/${receta.Nombre}`}
                            >
                                <div className='receta-card-content'>
                                    <div className='receta-card-icon'>
                                        <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
                                            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'></path>
                                        </svg>
                                    </div>
                                    <h3 className='receta-card-title'>{receta.Nombre}</h3>
                                    <p className='receta-card-description'>
                                        {receta.Descripcion.length > 100
                                            ? `${receta.Descripcion.substring(0, 100)}...`
                                            : receta.Descripcion}
                                    </p>
                                    <div className='receta-card-footer'>
                                        <span className='receta-card-action'>Ver más →</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className='recetas-empty-state'>
                        <svg width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                            <circle cx='11' cy='11' r='8'></circle>
                            <path d='m21 21-4.35-4.35'></path>
                        </svg>
                        <p>No se encontraron recetas</p>
                        <span>Intenta con otros términos de búsqueda</span>
                    </div>
                )}
            </div>
        </div>
    )
}
