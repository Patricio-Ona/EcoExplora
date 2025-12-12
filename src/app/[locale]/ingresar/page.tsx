'use client'; // Necesario para componentes de cliente en Next.js App Router

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

// --- Interfaces de Datos para Plant.id ---
// Nota: 'similar_images' en la respuesta de Plant.id es un array de objetos
interface SimilarImage {
    url: string; // URL de la imagen grande
    url_small: string; // URL de la imagen pequeña
    citation: string; // Citación de la fuente de la imagen
    // También puede haber propiedades como 'license_name', 'license_url', etc.
}

interface PlantIdSuggestion {
    id: string;
    name: string; // Nombre científico (ej. "Rosa gallica")
    probability: number; // Probabilidad de acierto
    similar_images: SimilarImage[]; // Aquí vienen las imágenes de ejemplo
}

interface PlantIdClassification {
    suggestions: PlantIdSuggestion[];
}

interface PlantIdResult {
    is_plant: {
        binary: boolean;
        probability: number;
    };
    classification: PlantIdClassification;
}

interface PlantIdResponse {
    result: PlantIdResult;
}

// --- Interfaz para un error genérico de Axios (para tipado seguro) ---
interface GenericAxiosError {
    response?: {
        data?: { detail?: string, message?: string };
        status: number;
        statusText: string;
    };
    message: string;
    isAxiosError: boolean;
}

const PlantIdFileUploader: React.FC = () => {
    // ⚠️ ¡Pega aquí tu clave real de Plant.id!
    const PLANT_ID_API_KEY = "sCwbRrbtZCgaBGQrnVuHaBs7wOm01f9RbKxPrJ0WuoQvvaVrp9"; 

    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [resultHtml, setResultHtml] = useState<string>(''); // Para almacenar el HTML del resultado

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Limpia la URL del objeto anterior para evitar fugas de memoria
            if (previewImageUrl) {
                URL.revokeObjectURL(previewImageUrl);
            }
            setSelectedImageFile(file);
            setPreviewImageUrl(URL.createObjectURL(file)); // Crea una URL para la previsualización
            setResultHtml(''); // Limpiar resultados anteriores
        } else {
            if (previewImageUrl) {
                URL.revokeObjectURL(previewImageUrl);
            }
            setSelectedImageFile(null);
            setPreviewImageUrl(null);
            setResultHtml('');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); // Prevenir el recarga de la página del formulario
        setResultHtml("Procesando imagen..."); // Mensaje inicial de carga

        if (!selectedImageFile) {
            setResultHtml(`<p style="color:red;">❌ Por favor, selecciona una imagen para enviar.</p>`);
            return;
        }

        setIsLoading(true);

        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64Image = (reader.result as string).split(',')[1]; // Extraer solo la parte Base64

            // --- Depuración para la cadena Base64 ---
            console.log("--- Depuración de Envío de Imagen ---");
            console.log("Longitud de la Cadena Base64:", base64Image.length, "bytes");
            console.log("Primeros 50 caracteres Base64:", base64Image.substring(0, 50) + "...");
            console.log("--- Fin Depuración ---");

            if (!base64Image || base64Image.length === 0) {
                setResultHtml(`<p style="color:red;">❌ Error: No se pudo leer la imagen Base64 o está vacía.</p>`);
                setIsLoading(false);
                return;
            }

            const headers = {
                "Api-Key": PLANT_ID_API_KEY,
                "Content-Type": "application/json",
            };

            const body = JSON.stringify({
                images: [base64Image],
                similar_images: true // Queremos que Plant.id devuelva imágenes similares
            });

            try {
                const response = await axios.post<PlantIdResponse>(
                    "https://plant.id/api/v3/identification",
                    body,
                    { headers: headers }
                );
                mostrarResultado(response.data); // Pasar directamente la data de Axios
            } catch (error: unknown) {
                console.error("Error durante la identificación:", error);
                let errorMessage = `<p style="color:red;">❌ Ocurrió un error inesperado al verificar la planta.</p>`;

                if (typeof error === 'object' && error !== null && 'isAxiosError' in error && (error as GenericAxiosError).isAxiosError && 'response' in error) {
                    const axiosError = error as GenericAxiosError;
                    const responseData = axiosError.response?.data;
                    
                    errorMessage = `<p style="color:red;">❌ Error API (${axiosError.response?.status}): ${responseData?.detail || responseData?.message || axiosError.response?.statusText || 'Error desconocido de la API'}</p>`;

                    if (axiosError.response?.status === 401) {
                        errorMessage += `<p style="color:red;">(Clave API inválida. Revisa tu \`PLANT_ID_API_KEY\`.)</p>`;
                    } else if (axiosError.response?.status === 400) {
                        errorMessage += `<p style="color:red;">(Solicitud incorrecta. La imagen puede ser inválida o demasiado grande.)</p>`;
                    } else if (axiosError.response?.status === 429) {
                        errorMessage += `<p style="color:red;">(Límite de peticiones excedido. Inténtalo más tarde.)</p>`;
                    }
                } else if (error instanceof Error) {
                    errorMessage = `<p style="color:red;">❌ Error: ${error.message}</p>`;
                } else {
                    errorMessage = `<p style="color:red;">❌ Error desconocido: ${String(error)}</p>`;
                }
                setResultHtml(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        // Leer el archivo como una URL de datos (Base64)
        reader.readAsDataURL(selectedImageFile);
    };

    // Esta función genera el HTML para mostrar los resultados
    const mostrarResultado = (data: PlantIdResponse) => {
        const { is_plant, classification } = data.result;

        let html = `<h2 class="text-xl font-semibold mb-3 text-green-700">Resultado de la Identificación:</h2>`;
        html += `<p class="mb-2"><strong>¿Es una planta?</strong> ${is_plant.binary ? "✅ Sí" : "❌ No"} (${(is_plant.probability * 100).toFixed(2)}%)</p>`;

        if (classification && classification.suggestions.length > 0) {
            html += `<h3 class="text-lg font-semibold mt-4 mb-2 text-green-700">Plantas Sugeridas:</h3>`;
            classification.suggestions.forEach((sugerencia, i) => {
                html += `
                    <div class="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                        <p class="font-bold text-gray-800">${i + 1}. Nombre científico: ${sugerencia.name}</p>
                        <p class="text-gray-600">Probabilidad: ${(sugerencia.probability * 100).toFixed(2)}%</p>
                        
                        ${sugerencia.similar_images && sugerencia.similar_images.length > 0 ? `
                            <p class="mt-3 font-medium text-gray-700">Imágenes similares:</p>
                            <div class="flex flex-wrap gap-2 mt-2">
                                ${sugerencia.similar_images.map(img => `
                                    <div class="flex flex-col items-center border border-gray-100 rounded p-1 bg-gray-50">
                                        <img src="${img.url_small}" alt="Imagen similar" class="w-20 h-20 object-cover rounded" />
                                        <p class="text-xs text-gray-500 text-center mt-1">
                                            <a href="${img.url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">Ver grande</a><br>
                                            Fuente: ${img.citation || 'N/A'}
                                        </p>
                                    </div>
                                `).join("")}
                            </div>
                        ` : '<p class="text-gray-500 text-sm mt-2">No hay imágenes similares disponibles.</p>'}
                    </div>
                `;
            });
        } else {
            html += `<p class="text-gray-600">No se encontraron coincidencias detalladas.</p>`;
        }

        setResultHtml(html); // Actualizar el estado con el HTML generado
    };

    return (
        <div className='container mx-auto p-4 my-4 sm:my-8 rounded-lg shadow-lg max-w-xl'>
            <h1 className='text-2xl font-bold my-6 text-green-800 text-center'>Identificación de Planta (Subir Imagen)</h1>

            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Input para seleccionar la imagen */}
                <div>
                    <label htmlFor='imagenInput' className='block font-medium mb-1'>Selecciona una imagen de la planta:</label>
                    <input
                        id='imagenInput'
                        type='file'
                        accept='image/*' // Solo acepta archivos de imagen
                        onChange={handleFileChange}
                        className='block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-green-50 file:text-green-700
                            hover:file:bg-green-100'
                        required
                    />
                </div>

                {/* Previsualización de la imagen */}
                {previewImageUrl && (
                    <div className='mt-4 flex justify-center'>
                        <img 
                            src={previewImageUrl} 
                            alt='Previsualización de la imagen' 
                            className='max-w-full h-auto max-h-64 rounded-lg shadow-md border border-gray-200' 
                        />
                    </div>
                )}
                
                {/* Botón para enviar */}
                <button
                    type='submit'
                    className='bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-md w-full text-lg font-bold shadow-lg transition-colors duration-200'
                    disabled={isLoading || !selectedImageFile}
                >
                    {isLoading ? 'Enviando y Verificando...' : 'Enviar Imagen para Identificar'}
                </button>
            </form>

            {/* Área para mostrar el resultado */}
            <div 
                id="resultado" 
                className='mt-8 p-4 bg-gray-50 rounded-lg shadow-inner'
                dangerouslySetInnerHTML={{ __html: resultHtml }} // Usamos dangerouslySetInnerHTML para renderizar el HTML
            />
        </div>
    );
};

export default PlantIdFileUploader;