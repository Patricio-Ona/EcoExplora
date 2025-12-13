import React from 'react'
import { getPlanta } from '@/app/[locale]/api/plantas'
import { PlantaSola } from '@/app/[locale]/types/types'
import ListaForo from '@/app/[locale]/ui/ListaForo'
import { getTranslations } from 'next-intl/server'

async function page(props: { params: Promise<{ nombre: string }> }) {
    const t = await getTranslations('PlantaPage')

    const nombre: string = decodeURIComponent((await props.params).nombre)

    const planta: PlantaSola | null = await getPlanta(nombre)
    if (!planta) {
        return <div className='p-8'>{t('notFound')}</div>
    }
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <div className='mx-auto w-full mt-10 md:m-12 p-2  bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-4xl '>
                <div className='p-4'>
                    <img
                        src={planta.ImagenURL}
                        alt={planta.NombreComun}
                        className='w-full h-64 object-cover rounded-xl mb-4'
                    />
                    <div className='mb-4'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-1'>
                            {planta.NombreComun}
                        </h1>
                        <p className='text-lg italic text-green-700'>{planta.NombreCientifico}</p>
                    </div>
                    <div className='my-6 ms-4 '>
                        <p className='text-justify'>{planta.Descripcion}</p>
                    </div>

                    <div className='grid grid-cols-2 gap-4 my-6 sm:mx-6 text-sm text-gray-700  bg-green-50 p-4 rounded-lg'>
                        <div>
                            <span className='font-semibold'>{t('category')}</span>{' '}
                            {planta.Categoria}
                        </div>
                        <div>
                            <span className='font-semibold'>{t('zone')}</span> {planta.Zona}
                        </div>
                        <div className='col-span-2'></div>
                    </div>

                    <div className='flex gap-6 w-full justify-end text-sm text-gray-500 '>
                        <div>
                            <span className='hidden sm:inline font-semibold'>
                                {t('registeredBy')}
                            </span>{' '}
                            {planta.UsuarioRegistro}
                        </div>
                        <div>
                            <span className='hidden sm:inline font-semibold'>
                                {t('registrationDate')}
                            </span>{' '}
                            {new Date(planta.FechaRegistro).toLocaleDateString('es-ES')}
                        </div>
                    </div>
                </div>
                <div className='mt-6  p-4 sm:p-6 rounded bg-green-100'>
                    <ListaForo nombrePlanta={planta.NombreComun} />
                </div>
            </div>
        </div>
    )
}

export default page
