// EcoExplora\src\app\api\generar-receta\route.ts
import { GoogleGenAI } from '@google/genai';

// 1. La clave de API se lee de la variable de entorno de Vercel (más seguro)
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY }); 

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ingredientes } = body;

        if (!ingredientes) {
            return Response.json({ error: "Faltan ingredientes" }, { status: 400 });
        }

  const prompt = `
    Genera una receta completa en español utilizando los siguientes ingredientes: ${ingredientes}.
    La respuesta debe estar **únicamente** en formato HTML puro y legible. No incluyas etiquetas markdown (como \`\`\`html).

    Estructura de la respuesta HTML (Sigue esta estructura estrictamente):
    - <h2>: Título del plato.
    - <ul> y <li>: Lista de ingredientes detallada, incluyendo las cantidades estimadas.
    - <ol> y <li>: Pasos detallados y numerados de la preparación.
    - **<p class="nota-nutricional">**: Esta será la única etiqueta <p> al final. Debe contener **solamente** la estimación nutricional. El texto debe comenzar con "Estimación Nutricional (por porción):" y debe incluir las calorías totales estimadas.
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        const receta = response.text;

        return Response.json({ receta });
        
    } catch (error) {
        console.error('Error en la API de la IA:', error);
        return Response.json(
            { error: 'Error interno del servidor al generar la receta.' },
            { status: 500 }
        );
    }
}