import React from 'react'
import { getPlantas } from '../api/plantas'
import ClientPlantas from './ClientPlantas'
import { getForos } from '../api/foro'

export default async function Page() {
    const plantas = await getPlantas()
    const foros = await getForos()

    return (
        <>
            <ClientPlantas plantas={plantas} foros={foros} />
        </>
    )
}
