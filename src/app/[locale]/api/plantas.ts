import { PlantaSola } from '../types/types'
import { Planta } from '../types/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL no está definida en el .env.local')
}

export const getPlantas = async (): Promise<Planta[]> => {
    try {
        const response = await fetch(`${API_URL}/plantas`, {
            next: {
                revalidate: 60,
            },
        })

        if (!response.ok) {
            console.error('STATUS ERROR:', response.status)
            throw new Error('Network response was not ok')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching plantas:', error)
        throw error
    }
}

export const getPlanta = async (nombre: string) => {
    const api = `${API_URL}/plantas/nombre/${encodeURIComponent(nombre)}`
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
        const response = await fetch(`${API_URL}/plantas`, {
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
    } catch (error) {
        console.error('Error posting planta:', error)
        throw error
    }
}
