import React from 'react'
import { Receta } from '../types/types'
import { useTranslations } from 'next-intl'

// export interface Receta {
//     RecetaID: number
//     Nombre: string
//     Descripcion: string
//     Instrucciones: string
//     UsuarioID: number
//     FechaRegistro: Date
// }
function ModalReceta({ receta, onClose }: { receta: Receta; onClose: () => void }) {
    const t = useTranslations('RecetasPage.Modal') // Usamos el hook de traducciones

    const instrConSaltos = receta.Instrucciones.replace(/\\n/g, '\n')
    // 2) Divide en líneas
    // const lineas = conSaltos.split('\n')
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto'>
            <div className='absolute inset-0 bg-black opacity-50' onClick={onClose}></div>
            <div className='relative w-full max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-lg'>
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
                >
                    <svg
                        className='w-6 h-6'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                        />
                    </svg>
                </button>

                <div className='mb-6'>
                    <h2 className='text-2xl font-bold text-center text-green-600'>
                        {receta.Nombre}
                    </h2>
                </div>

                <div className='space-y-4'>
                    <div>
                        <h3 className='text-lg font-semibold text-green-700'>{t('description')}</h3>
                        <p className='mt-2 text-gray-700'>{receta.Descripcion}</p>
                    </div>

                    <div>
                        <h3 className='text-lg font-semibold text-green-700'>
                            {t('instructions')}
                        </h3>
                        <p
                            style={{ whiteSpace: 'pre-line', lineHeight: 1.4 }}
                            className='mt-2 text-gray-700 whitespace-pre-line'
                        >
                            {instrConSaltos}
                        </p>
                    </div>

                    <div className='flex flex-wrap gap-2 text-sm text-gray-500'>
                        <p>
                            {t('date')} {new Date(receta.FechaRegistro).toLocaleDateString()}
                        </p>
                        <p>
                            {t('user')} {receta.Usuario}
                        </p>
                    </div>
                </div>

                <div className='mt-6 text-center'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none'
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalReceta
