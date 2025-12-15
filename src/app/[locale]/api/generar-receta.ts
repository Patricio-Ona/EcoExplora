// EcoExplora\src\app\[locale]\api\generar-receta.ts
export const generarReceta = async (ingredientes: string): Promise<string> => {
    // La llamada ahora es a la API interna de Next.js, no al servidor Python externo
    const response = await fetch('/api/generar-receta', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredientes }),
    });

    if (!response.ok) {
        throw new Error('Error al conectar con la API interna para la receta.');
    }

    const data = await response.json();
    return data.receta;
};