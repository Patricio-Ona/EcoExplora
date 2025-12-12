import { getTranslations } from 'next-intl/server'
import Buscador from './ui/Buscador'

export default async function HomePage() {
    const t = await getTranslations('HomePage')
    return (
        <>
            <section className='welcome '>
                <h1 className='text-shadow text-4xl font-bold text-green-800 px-4 py-6 rounded-xl text-center'>
                    {t('title')}
                </h1>
            </section>
            <section className='intro-ecoexplora px-6 py-8 bg-green-50 text-center max'>
                <div className='max-w-3xl mx-auto'>
                    <h2 className='text-2xl text-green-700 mb-4'>{t('aboutTitle')}</h2>
                    <p className='text-lg leading-relaxed text-gray-700'>
                        <strong>EcoExplora</strong> {t('aboutDescription')}
                        <br />
                        <br />
                        {t('ourMission')}
                    </p>
                </div>
            </section>
            <Buscador />
        </>
    )
}
