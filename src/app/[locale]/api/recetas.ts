import { Receta } from '../types/types'

export const getRecetas = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recetas`, {
            next: {
                revalidate: 3000, // Revalidar cada 60 segundos
            },
        })
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching recetas:', error)
        throw error
    }
}
export const getReceta = async (nombre: string) => {
    const api = `${process.env.NEXT_PUBLIC_API_URL}/recetas/nombre/${encodeURIComponent(nombre)}`
    const response = await fetch(api)
    if (!response.ok) {
        console.error('Error fetching receta:', response.statusText)
        return null
    }
    const receta: Receta = await response.json()
    if (!receta) {
        console.error('Receta not found for nombre:', nombre)
        return null
    }
    return receta
}
