import React from 'react'
import { Foro } from '../types/types'
import { useTranslations } from 'next-intl'

function ForoCard({ foro }: { foro: Foro }) {
    const t = useTranslations('ListaForo.ForoCard')
    return (
        <div className='bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all'>
            <img
                src={foro.ImagenURL}
                alt={`Imagen del foro ${foro.ForoID}`}
                className='w-full h-48 object-cover rounded-lg mb-4'
            />
            {/* <h3 className='text-xl font-semibold text-gray-800 mb-2'>{foro.Planta}</h3> */}
            <p className='text-gray-700 font-semibold text-sm mb-2'>{foro.Comentario}</p>
            <div className='text-xs text-gray-600 mb-1'>
                <span className='font-medium'>{t('postedBy')}</span> {foro.Usuario}
            </div>
            <div className='text-xs text-gray-600 mb-1'>
                <span className='font-medium'>{t('date')}</span>{' '}
                {new Date(foro.FechaPublicacion).toLocaleDateString('es-ES')}
            </div>
            {/* <div className='text-xs text-gray-600'>
                <span className='font-medium'>Ubicación:</span> {foro.Latitud}, {foro.Longitud}
            </div> */}
        </div>
    )
}

export default ForoCard
