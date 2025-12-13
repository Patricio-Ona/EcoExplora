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

                <section className='nosotros-section'>
                    <h2>{t('collaboratorsTitle')}</h2>
                    <div className='equipo-grid'>
                        <div className='equipo-card'>
                            <a href="https://www.instagram.com/warmi_guia?utm_source=ig_web_button_share_sheet&igsh=MTI5Ymw2YWRrNGV2cA==">
                                <img src="https://res.cloudinary.com/dumz9tpvu/image/upload/v1753138232/Imagen_de_WhatsApp_2025-07-21_a_las_17.41.21_553e4846_iabirx.jpg" alt="WarmiGUía" />
                                <strong>WarmiGUía</strong>
                            </a>
                        </div>
                        <div className='equipo-card'>
                            <a href="https://www.instagram.com/sirma_puce?utm_source=ig_web_button_share_sheet&igsh=cGszeDd5OTFyZWU=">
                                <img src="https://res.cloudinary.com/dumz9tpvu/image/upload/v1753138232/Imagen_de_WhatsApp_2025-07-21_a_las_17.40.02_2ec3b6f5_bp0k7p.jpg" alt="SIRMA" />
                                <strong>SIRMA</strong>
                            </a>
                        </div>
                        <div className='equipo-card'>
                            <a href="https://www.instagram.com/nustakawsay?utm_source=ig_web_button_share_sheet&igsh=eDVncXp6OXFrcDkx">
                                <img src="https://res.cloudinary.com/dumz9tpvu/image/upload/v1753138232/Imagen_de_WhatsApp_2025-07-21_a_las_17.40.26_956a88f9_s4f38b.jpg" alt="ÑUSTA" />
                                <strong>ÑUSTA</strong>
                            </a>
                        </div>
                        <div className='equipo-card'>
                            <a href="https://www.instagram.com/tarpu_yachay?utm_source=ig_web_button_share_sheet&igsh=N2VnNmtweHd4cmRy">
                                <img src="https://res.cloudinary.com/dumz9tpvu/image/upload/v1753138232/Imagen_de_WhatsApp_2025-07-21_a_las_17.41.01_706ee7ec_d4rttz.jpg" alt="TarpuYachay" />
                                <strong>TarpuYachay</strong>
                            </a>
                        </div>
                        <div className='equipo-card'>
                            <a href="https://www.instagram.com/alliy.oficial?utm_source=ig_web_button_share_sheet&igsh=b24wdGZjMjZ6b2I4">
                                <img src="https://res.cloudinary.com/dumz9tpvu/image/upload/v1753138232/Imagen_de_WhatsApp_2025-07-21_a_las_17.39.25_b2ed67f1_l3ckuz.jpg" alt="Alliy" />
                                <strong>Alliy</strong>
                            </a>
                        </div>
                    </div>
                </section>

                <section className='nosotros-section nosotros-footer'>
                    <p>{t('footerThanks')}</p>
                </section>
            </div>
        </div>
    )
}

export default Nosotros
