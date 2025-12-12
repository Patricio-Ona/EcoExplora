import React from 'react'
import { Foro } from '../types/types'
import { getForos } from '../api/foro'
// import { getPlantas } from '../api/plantas'
// import SeccionPlantas from '../SeccionPlantas'
import Mapa from './Mapa'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function Buscador() {
    const foros: Foro[] = await getForos()
    const t = await getTranslations('DiscoverSection')

    return (
        <div className=''>
            <section
                suppressHydrationWarning
                className='sm:p-8 rounded-lg shadow-md my-8 border border-green-500 mx-10 bg-gray-100'
            >
                <Mapa plantas={foros} />
            </section>
            <section className='text-center p-8 my-8 mx-10 bg-white rounded-lg shadow-md border border-green-500'>
                <h2 className='text-3xl font-bold text-green-700 mb-4'>{t('heading')}</h2>
                <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>{t('description')}</p>
                <Link
                    href='/plantas'
                    className='inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200'
                >
                    {t('cta')}
                </Link>
            </section>

            {/* <>
                {!cargando ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-10 bg-gray-100  my-4 sm:m-6'>
                        {Object.entries(plantasPorCategoria).map(([categoria, plantas]) => (
                            <SeccionPlantas titulo={categoria} key={categoria} plantas={plantas} />
                            // <div>categoria</div>
                        ))}
                    </div>
                ) : (
                    <p>Cargando plantas...</p>
                )}
            </> */}
        </div>
    )
}
