import { Foro } from '../types/types'

export const getForos = async (): Promise<Foro[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL

    // ✅ ARREGLO: validar que exista la variable en producción
    if (!baseUrl) {
        console.error('NEXT_PUBLIC_API_URL no está definida')
        return []
    }

    const api = `${baseUrl}/foro`

    try {
        const response = await fetch(api, {
            next: {
                revalidate: 60,
            },
        })

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const data: Foro[] = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching foros:', error)
        return [] // ✅ no romper render del servidor
    }
}

export const postForo = async (foro: Foro): Promise<Foro> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL

    if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_API_URL no está definida')
    }

    const api = `${baseUrl}/foro`

    try {
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(foro),
        })

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const data: Foro = await response.json()
        return data
    } catch (_) {
        console.error('Error posting planta')
        throw new Error('No se pudo crear la planta')
    }
}
