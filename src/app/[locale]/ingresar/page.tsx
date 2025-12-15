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
        <div className='plant-id-container'>
            <div className='plant-id-header'>
                <h1 className='plant-id-title'>Identificación de Planta</h1>
                <p className='plant-id-subtitle'>Sube una imagen para descubrir qué planta es</p>
            </div>

            <div className='plant-id-content'>
                <form onSubmit={handleSubmit} className='plant-id-form'>
                    {/* Upload Area */}
                    <div className='plant-id-upload-section'>
                        <label htmlFor='imagenInput' className='plant-id-upload-area'>
                            <div className='plant-id-upload-icon'>
                                <svg width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
                                    <polyline points='17 8 12 3 7 8'></polyline>
                                    <line x1='12' y1='3' x2='12' y2='15'></line>
                                </svg>
                            </div>
                            <p className='plant-id-upload-title'>Haz clic para subir tu imagen</p>
                            <p className='plant-id-upload-subtitle'>PNG, JPG, GIF hasta 10MB</p>
                            <input
                                id='imagenInput'
                                type='file'
                                accept='image/*'
                                onChange={handleFileChange}
                                className='plant-id-file-input'
                                required
                            />
                        </label>
                    </div>

                    {/* File Info Card */}
                    {selectedImageFile && (
                        <div className='plant-id-file-info'>
                            <div className='plant-id-file-name'>
                                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                    <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path>
                                    <polyline points='14 2 14 8 20 8'></polyline>
                                </svg>
                                <span>{selectedImageFile.name}</span>
                            </div>
                            <button 
                                type='button' 
                                onClick={() => {
                                    if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
                                    setSelectedImageFile(null);
                                    setPreviewImageUrl(null);
                                    setResultHtml('');
                                }}
                                className='plant-id-remove-btn'
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Preview Image */}
                    {previewImageUrl && (
                        <div className='plant-id-preview-container'>
                            <img 
                                src={previewImageUrl} 
                                alt='Previsualización de la imagen' 
                                className='plant-id-preview-image' 
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type='submit'
                        className={`plant-id-submit-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading || !selectedImageFile}
                    >
                        <span className='plant-id-btn-icon'>
                            {isLoading ? (
                                <svg className='plant-id-spinner' viewBox='0 0 24 24'>
                                    <circle cx='12' cy='12' r='10' fill='none' strokeWidth='2'></circle>
                                </svg>
                            ) : (
                                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                    <path d='M12 5v14M5 12h14'></path>
                                </svg>
                            )}
                        </span>
                        <span>{isLoading ? 'Identificando planta...' : 'Identificar Planta'}</span>
                    </button>
                </form>

                {/* Result Section */}
                <div className='plant-id-result-section'>
                    <div 
                        id="resultado"
                        className='plant-id-result-content'
                        dangerouslySetInnerHTML={{ __html: resultHtml }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PlantIdFileUploader;