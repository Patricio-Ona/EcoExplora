import { Foro } from '../types/types'

export const getForos = async (): Promise<Foro[]> => {
    const api = `${process.env.NEXT_PUBLIC_API_URL}/foro`
    try {
        const response = await fetch(api, {
            next: {
                revalidate: 60, // Revalidar cada 60 segundos
            },
        })
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data: Foro[] = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching foros:', error)
        throw error
    }
}
export const postForo = async (foro: Foro): Promise<Foro> => {
    const api = `${process.env.NEXT_PUBLIC_API_URL}/foro`
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
    } catch (error) {
        console.error('Error posting foro:', error)
        throw error
    }
}
