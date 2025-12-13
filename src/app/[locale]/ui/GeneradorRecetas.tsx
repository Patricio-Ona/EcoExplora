'use client'
import { useState } from 'react'
import { generarReceta } from '../api/generar-receta'
import { useTranslations } from 'next-intl'

interface GeneradorRecetaProps {
    ingredientes: string
}

export default function GeneradorReceta({ ingredientes }: GeneradorRecetaProps) {
    const t = useTranslations('GeneradorRecetas')

    const [inputIngredientes, setInputIngredientes] = useState(ingredientes)
    const [receta, setReceta] = useState('')
    const [cargando, setCargando] = useState(false)

    const handleGenerar = async () => {
        if (!inputIngredientes.trim()) return alert(t('emptyWarning'))

        setCargando(true)
        setReceta('Generando receta...')
        try {
            const result = await generarReceta(inputIngredientes)
            setReceta(result)
        } catch {
            setReceta(`❌ ${t('error')}`)
        }
        setCargando(false)
    }

    return (
        <div className='generador-receta-container'>
            <div className='generador-receta-header'>
                <div className='generador-receta-icon'>
                    <svg width='32' height='32' viewBox='0 0 24 24' fill='currentColor'>
                        <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'></path>
                    </svg>
                </div>
                <h2 className='generador-receta-title'>{t('title')}</h2>
            </div>

            <div className='generador-receta-content'>
                <div className='generador-receta-input-group'>
                    <label className='generador-receta-label'>{t('placeholder')}</label>
                    <textarea
                        value={inputIngredientes}
                        onChange={e => setInputIngredientes(e.target.value)}
                        placeholder={t('placeholder')}
                        className='generador-receta-textarea'
                        rows={4}
                    />
                    <p className='generador-receta-hint'>Ej: tomate, orégano, albahaca</p>
                </div>

                <button 
                    onClick={handleGenerar} 
                    disabled={cargando}
                    className={`generador-receta-btn ${cargando ? 'loading' : ''}`}
                >
                    <span className='generador-receta-btn-icon'>
                        {cargando ? (
                            <svg className='generador-receta-spinner' viewBox='0 0 24 24'>
                                <circle cx='12' cy='12' r='10' fill='none' strokeWidth='2'></circle>
                            </svg>
                        ) : (
                            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                <path d='M12 5v14M5 12h14'></path>
                            </svg>
                        )}
                    </span>
                    <span>{cargando ? t('generating') : t('generateButton')}</span>
                </button>
            </div>

            {receta && (
                <div className='generador-receta-result'>
                    <div 
                        className='generador-receta-resultado'
                        dangerouslySetInnerHTML={{ __html: receta }}
                    />
                </div>
            )}
        </div>
    )
}
