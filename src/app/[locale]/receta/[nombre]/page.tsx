import { getReceta } from '@/app/[locale]/api/recetas'
import { Receta } from '@/app/[locale]/types/types'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

import React from 'react'

async function page(props: { params: Promise<{ nombre: string }> }) {
    const t = await getTranslations('RecetaPage')

    const nombreReceta = decodeURIComponent((await props.params).nombre)
    const receta: Receta | null = await getReceta(nombreReceta)
    if (!receta) {
        return (
            <div className='receta-detail-error'>
                <div className='receta-detail-error-content'>
                    <svg width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <path d='M6 18L18 6M6 6l12 12'></path>
                    </svg>
                    <h2>{t('notFound')}</h2>
                    <Link href='/recetas' className='receta-detail-error-btn'>
                        Volver a recetas
                    </Link>
                </div>
            </div>
        )
    }
    const instrConSaltos = receta.Instrucciones.replace(/\\n/g, '\n')
    const fechaFormato = new Date(receta.FechaRegistro).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className='receta-detail-container'>
            {/* Header con botón de regreso */}
            <div className='receta-detail-header'>
                <Link href='/recetas' className='receta-detail-back-btn'>
                    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <path d='M19 12H5M12 19l-7-7 7-7'></path>
                    </svg>
                    <span>Volver</span>
                </Link>
            </div>

            {/* Contenido principal */}
            <div className='receta-detail-content'>
                {/* Título y meta información */}
                <div className='receta-detail-header-section'>
                    <h1 className='receta-detail-title'>{receta.Nombre}</h1>
                    
                    <div className='receta-detail-meta'>
                        <div className='receta-meta-item'>
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
                                <line x1='16' y1='2' x2='16' y2='6'></line>
                                <line x1='8' y1='2' x2='8' y2='6'></line>
                                <line x1='3' y1='10' x2='21' y2='10'></line>
                            </svg>
                            <span>{fechaFormato}</span>
                        </div>
                        <div className='receta-meta-item'>
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                                <circle cx='12' cy='7' r='4'></circle>
                            </svg>
                            <span>{receta.Usuario}</span>
                        </div>
                    </div>
                </div>

                {/* Secciones de contenido */}
                <div className='receta-detail-sections'>
                    {/* Descripción */}
                    <div className='receta-detail-section'>
                        <div className='receta-section-header'>
                            <div className='receta-section-icon'>
                                <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
                                    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'></path>
                                </svg>
                            </div>
                            <h2 className='receta-section-title'>{t('description')}</h2>
                        </div>
                        <p className='receta-section-content receta-description-text'>
                            {receta.Descripcion}
                        </p>
                    </div>

                    {/* Instrucciones */}
                    <div className='receta-detail-section'>
                        <div className='receta-section-header'>
                            <div className='receta-section-icon'>
                                <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
                                    <path d='M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3'></path>
                                </svg>
                            </div>
                            <h2 className='receta-section-title'>{t('instructions')}</h2>
                        </div>
                        <div className='receta-instructions-box'>
                            <div className='receta-instructions-text'>
                                {instrConSaltos.split('\n').map((linea, idx) => (
                                    <p key={idx} className='receta-instruction-line'>
                                        {linea.trim() && (
                                            <>
                                                <span className='receta-instruction-number'>
                                                    {linea.trim().match(/^\d+/) ? '' : '•'}
                                                </span>
                                                {linea}
                                            </>
                                        )}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='receta-detail-footer'>
                    <Link href='/recetas' className='receta-detail-footer-btn'>
                        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                            <path d='M19 12H5M12 19l-7-7 7-7'></path>
                        </svg>
                        Ver más recetas
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default page
