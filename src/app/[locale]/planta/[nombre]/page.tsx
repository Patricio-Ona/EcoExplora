import React from 'react'
import { getPlanta } from '@/app/[locale]/api/plantas'
import { PlantaSola } from '@/app/[locale]/types/types'
import ListaForo from '@/app/[locale]/ui/ListaForo'
import PlantaDetailImage from '@/app/[locale]/components/PlantaDetailImage'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

async function page(props: { params: Promise<{ nombre: string }> }) {
    const t = await getTranslations('PlantaPage')

    const nombre: string = decodeURIComponent((await props.params).nombre)

    const planta: PlantaSola | null = await getPlanta(nombre)
    if (!planta) {
        return (
            <div className='planta-detail-error'>
                <div className='planta-detail-error-content'>
                    <svg width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <path d='M6 18L18 6M6 6l12 12'></path>
                    </svg>
                    <h2>{t('notFound')}</h2>
                    <Link href='/plantas' className='planta-detail-error-btn'>
                        Volver a plantas
                    </Link>
                </div>
            </div>
        )
    }

    const fechaFormato = new Date(planta.FechaRegistro).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className='planta-detail-container'>
            {/* Header con botón de regreso */}
            <div className='planta-detail-header'>
                <Link href='/plantas' className='planta-detail-back-btn'>
                    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <path d='M19 12H5M12 19l-7-7 7-7'></path>
                    </svg>
                    <span>Volver</span>
                </Link>
            </div>

            {/* Contenido principal */}
            <div className='planta-detail-content'>
                {/* Imagen Hero */}
                <PlantaDetailImage src={planta.ImagenURL} alt={planta.NombreComun} />

                {/* Información de la planta */}
                <div className='planta-detail-info-section'>
                    <div className='planta-detail-title-block'>
                        <h1 className='planta-detail-title'>{planta.NombreComun}</h1>
                        <p className='planta-detail-scientific'>{planta.NombreCientifico}</p>
                    </div>

                    {/* Descripción */}
                    <div className='planta-detail-section'>
                        <div className='planta-section-header'>
                            <div className='planta-section-icon'>
                                <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
                                    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'></path>
                                </svg>
                            </div>
                            <h2 className='planta-section-title'>Descripción</h2>
                        </div>
                        <p className='planta-section-content planta-description-text'>
                            {planta.Descripcion}
                        </p>
                    </div>

                    {/* Información de Categoría y Zona */}
                    <div className='planta-detail-metadata'>
                        <div className='planta-meta-card'>
                            <div className='planta-meta-icon'>
                                <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
                                    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'></path>
                                </svg>
                            </div>
                            <div className='planta-meta-content'>
                                <span className='planta-meta-label'>{t('category')}</span>
                                <p className='planta-meta-value'>{planta.Categoria}</p>
                            </div>
                        </div>

                        <div className='planta-meta-card'>
                            <div className='planta-meta-icon'>
                                <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
                                    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'></path>
                                </svg>
                            </div>
                            <div className='planta-meta-content'>
                                <span className='planta-meta-label'>{t('zone')}</span>
                                <p className='planta-meta-value'>{planta.Zona}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className='planta-detail-footer-info'>
                        <div className='planta-footer-item'>
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                                <circle cx='12' cy='7' r='4'></circle>
                            </svg>
                            <span>{planta.UsuarioRegistro}</span>
                        </div>
                        <div className='planta-footer-item'>
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
                                <line x1='16' y1='2' x2='16' y2='6'></line>
                                <line x1='8' y1='2' x2='8' y2='6'></line>
                                <line x1='3' y1='10' x2='21' y2='10'></line>
                            </svg>
                            <span>{fechaFormato}</span>
                        </div>
                    </div>
                </div>

                {/* Foro Section */}
                <div className='planta-detail-foro-section'>
                    <ListaForo nombrePlanta={planta.NombreComun} />
                </div>
            </div>
        </div>
    )
}

export default page
