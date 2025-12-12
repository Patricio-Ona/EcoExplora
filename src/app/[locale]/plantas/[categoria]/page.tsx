'use server'

import { getPlantas } from '@/app/[locale]/api/plantas'

import ListPlantas from '@/app/[locale]/ListPlantas'
import { Planta } from '@/app/[locale]/types/types'
import { getTranslations } from 'next-intl/server'

export default async function PlantasPage(props: { params: Promise<{ categoria: string }> }) {
    const t = await getTranslations('Nav.categories')

    const categoria: string = decodeURIComponent((await props.params).categoria.replace(/-/g, ' '))
    const plantas: Planta[] = await getPlantas()

    const plantasActuales = plantas.filter(planta => {
        return planta.Categoria === 'Plantas ' + categoria
    })

    const categoriaTraducida = t(`${categoria.toLowerCase()}`) || categoria
    console.log('Categoria traducida:', categoriaTraducida)
    return (
        <>
            <section className={`welcome welcome-${categoria.toLowerCase()} `}>
                <h1 className='py-6 px-10 rounded-xl '>{categoriaTraducida}</h1>
            </section>
            <div className='p-8'>
                <ListPlantas plantas={plantasActuales} />
            </div>
        </>
    )
}
