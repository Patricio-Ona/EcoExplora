// EcoExplora\src\app\api\generar-receta\route.ts
import { GoogleGenAI } from '@google/genai';

// 1. La clave de API se lee de la variable de entorno de Vercel (más seguro)
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY }); 

/**
 * Función que usa la IA para verificar si la lista de ingredientes es válida (comestible).
 * @param ingredientes Lista de ingredientes ingresados por el usuario.
 * @returns true si la lista es válida, false si contiene elementos irrelevantes/no comestibles.
 */
async function validarIngredientes(ingredientes: string): Promise<boolean> {
    const validacionPrompt = `
        Analiza la siguiente lista de elementos: "${ingredientes}". 
        Tu tarea es determinar si la mayoría de los elementos son ingredientes alimenticios comestibles o si son objetos, nombres propios, tecnología, o temas irrelevantes (libros, televisión, personas, etc.).
        
        Responde **SOLAMENTE** con la palabra "OK" si es una lista válida de ingredientes alimenticios.
        Responde **SOLAMENTE** con la palabra "RECHAZO" si la lista contiene elementos no comestibles o irrelevantes.
    `;

    try {
        const validacionResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: validacionPrompt }] }],
        });

        // 🚨 CORRECCIÓN DEL ERROR DE TIPADO AQUÍ 🚨
        // Usamos ?. (encadenamiento opcional) y ?? (coalescencia nula) para asegurar que el valor no sea null/undefined.
        const respuesta = validacionResponse.text?.trim().toUpperCase() ?? "RECHAZO_FALLO";
        
        // Si la respuesta es nula o vacía, la tratamos como RECHAZO por seguridad.
        return respuesta === "OK";
        
    } catch (error) {
        // En caso de un fallo en la llamada de la API de validación, por seguridad, devolvemos false.
        console.error("Fallo al validar ingredientes con IA:", error);
        return false;
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ingredientes } = body;

        if (!ingredientes) {
            return Response.json({ error: "Faltan ingredientes" }, { status: 400 });
        }

        // --- 🚨 PASO DE VALIDACIÓN DE SEGURIDAD 🚨 ---
        const esValido = await validarIngredientes(ingredientes);
        
        if (!esValido) {
            // Devolver un mensaje HTML amigable si la validación falla
            const mensajeError = `
                <div class="alerta-receta">
                    <h2>🚫 Entrada No Válida</h2>
                    <p>Lo sentimos, los elementos ingresados ("${ingredientes}") parecen no ser ingredientes alimenticios. Por favor, asegúrate de ingresar únicamente ingredientes comestibles para generar una receta.</p>
                    <p>¡Inténtalo de nuevo!</p>
                </div>
            `;
            // Devolvemos status 200 para que el frontend pueda renderizar el HTML del error
            return Response.json({ receta: mensajeError }, { status: 200 }); 
        }
        // ----------------------------------------


        // Si es válido, se procede con el prompt de generación de la receta
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