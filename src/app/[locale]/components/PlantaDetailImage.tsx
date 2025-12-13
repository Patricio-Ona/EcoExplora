'use client'
import { useState } from 'react'

interface PlantaDetailImageProps {
    src: string
    alt: string
}

export default function PlantaDetailImage({ src, alt }: PlantaDetailImageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <div className='planta-detail-image-section' onClick={() => setIsModalOpen(true)}>
                <img
                    src={src}
                    alt={alt}
                    className='planta-detail-image'
                />
                <div className='planta-image-overlay'>
                    <svg width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <circle cx='12' cy='12' r='10'></circle>
                        <line x1='12' y1='8' x2='12' y2='16'></line>
                        <line x1='8' y1='12' x2='16' y2='12'></line>
                    </svg>
                    <span>Ampliar imagen</span>
                </div>
            </div>

            {isModalOpen && (
                <div className='planta-image-modal-overlay' onClick={() => setIsModalOpen(false)}>
                    <div className='planta-image-modal-content' onClick={e => e.stopPropagation()}>
                        <button 
                            className='planta-modal-close-btn'
                            onClick={() => setIsModalOpen(false)}
                            aria-label='Cerrar'
                        >
                            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                <line x1='18' y1='6' x2='6' y2='18'></line>
                                <line x1='6' y1='6' x2='18' y2='18'></line>
                            </svg>
                        </button>
                        <img
                            src={src}
                            alt={alt}
                            className='planta-modal-image'
                        />
                    </div>
                </div>
            )}
        </>
    )
}
