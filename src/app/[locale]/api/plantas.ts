import { PlantaSola } from '../types/types'
import { Planta } from '../types/types'

export const getPlantas = async (): Promise<Planta[]> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plantas`, {
            cache: 'no-store',
        })

        if (!response.ok) {
            console.error('API plantas respondió:', response.status)
            return []
        }

        const data = await response.json()
        return data
    } catch{
        console.error('Error fetching plantas')
        return []
    }
}

export const getPlanta = async (nombre: string) => {
    const api = `${process.env.NEXT_PUBLIC_API_URL}/plantas/nombre/${encodeURIComponent(nombre)}`
    const response = await fetch(api)

    if (!response.ok) {
        console.error('Error fetching planta:', response.statusText)
        return null
    }

    const planta: PlantaSola = await response.json()
    return planta
}

export const postPlanta = async (planta: Planta): Promise<Planta> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plantas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(planta),
        })

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const data = await response.json()
        return data
    } catch{
        console.error('Error posting planta')
        throw new Error('No se pudo crear la planta')
    }
}
