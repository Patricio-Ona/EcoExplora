'use client'

import React from 'react'
import './nosotros.css'
import { FaLaptopCode, FaPaintBrush } from 'react-icons/fa'
import { useTranslations } from 'next-intl'

const Nosotros = () => {
    const t = useTranslations('Nosotros')
    return (
        <div className='nosotros-container'>
            <div className='nosotros-card'>
                <div className='nosotros-header'>
                    <img
                        src='https://res.cloudinary.com/dzj2zgmgq/image/upload/v1752335485/logoPUCE_edthxt.png'
                        alt='Logo PUCE'
                        className='nosotros-logo'
                    />
                    <h1 className='titulo-nosotros'>{t('title')}</h1>
                    <p className='nosotros-subtitle'>{t('subtitle')}</p>
                </div>

                <section className='nosotros-section'>
                    <h2>{t('whatIsTitle')}</h2>
                    <p>
                        <strong>EcoExplora</strong> {t('whatIsDescription')}
                    </p>
                </section>

                <section className='nosotros-section'>
                    <h2>{t('teamTitle')}</h2>
                    <div className='equipo-grid'>
                        <div className='equipo-card'>
                            <FaLaptopCode className='equipo-icon' />
                            <strong>Fausto Chancusig</strong>
                            <p>{t('roles.fausto')}</p>
                        </div>
                        <div className='equipo-card'>
                            <FaLaptopCode className='equipo-icon' />
                            <strong>Patricio Oña</strong>
                            <p>Desarrollador Frontend</p>
                        </div>
                        <div className='equipo-card'>
                            <FaPaintBrush className='equipo-icon' />
                            <strong>Danahé Andrade</strong>
                            <p>Diseñadora de Interfaz</p>
                        </div>
                        <div className='equipo-card'>
                            <FaPaintBrush className='equipo-icon' />
                            <strong>Alam Rovalino</strong>
                            <p>{t('roles.alam')}</p>
                        </div>
                    </div>
                </section>

                <section className='nosotros-section'>
                    <h2>{t('technologiesTitle')}</h2>
                    <ul className='tech-list'>
                        <li>Next.js (React)</li>
                        <li>Node.js</li>
                        <li>API Spoonacular</li>
                        <li>Git & GitHub</li>
                        <li>Hostinger (para despliegue)</li>
                    </ul>
                </section>

                <section className='nosotros-section nosotros-footer'>
                    <p>{t('footerThanks')}</p>
                </section>
            </div>
        </div>
    )
}

export default Nosotros
