'use client'
import { useState } from 'react'
import { generarReceta } from '../api/generar-receta' // Asegúrate de importar esta función
import { useTranslations } from 'next-intl'

// Definir las props correctamente
interface GeneradorRecetaProps {
    ingredientes: string // Aseguramos que 'ingredientes' sea un string
}

export default function GeneradorReceta({ ingredientes }: GeneradorRecetaProps) {
    const t = useTranslations('GeneradorRecetas') // Usamos el hook de traducciones

    const [inputIngredientes, setInputIngredientes] = useState(ingredientes) // Estado para los ingredientes que el usuario ingresa
    const [receta, setReceta] = useState('')
    const [cargando, setCargando] = useState(false)

    // Función para manejar la generación de la receta
    const handleGenerar = async () => {
        if (!inputIngredientes.trim()) return alert(t('emptyWarning'))

        setCargando(true)
        setReceta('Generando receta...')
        try {
            const result = await generarReceta(inputIngredientes) // Llamamos a la API de recetas
            setReceta(result) // Guardamos la receta generada en el estado
        } catch {
            setReceta(`❌ ${t('error')}`)
        }
        setCargando(false)
    }

    return (
        <div className='receta-box'>
            <h2>🍃 {t('title')}</h2>
            <textarea
                value={inputIngredientes} // Aquí mostramos lo que el usuario escribe
                onChange={e => setInputIngredientes(e.target.value)} // Actualizamos el estado cuando el usuario escribe
                placeholder={t('placeholder')}
            />
            <button onClick={handleGenerar} disabled={cargando}>
                {cargando ? t('generating') : t('generateButton')}
            </button>
            {/* Mostramos la receta generada */}
            <div
                className='receta-contenido'
                dangerouslySetInnerHTML={{ __html: receta }} // Esto inyecta el HTML generado
            />

            <style jsx>{`
                .receta-box {
                    margin: 2rem auto;
                    padding: 2rem;
                    max-width: 700px;
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    font-size: 26px;
                    color: rgb(0, 0, 0);
                    text-align: center;
                    margin-bottom: 20px;
                }
                textarea {
                    width: 100%;
                    height: 100px;
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    font-size: 16px;
                    margin-bottom: 15px;
                    resize: none;
                }
                button {
                    padding: 12px;
                    background-color: rgb(101, 234, 0);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 18px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                button:hover {
                    background-color: rgb(60, 179, 0);
                }
                .receta-contenido {
                    margin-top: 20px;
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    font-size: 16px;
                    line-height: 1.6;
                }
                .receta-contenido h3 {
                    font-size: 22px;
                    color: #6200ea;
                    margin-bottom: 10px;
                }
                .receta-contenido ul,
                .receta-contenido ol {
                    margin-left: 20px;
                    margin-bottom: 10px;
                }
                .receta-contenido li {
                    margin-bottom: 8px;
                }
                .receta-contenido p {
                    margin-bottom: 20px;
                    font-size: 18px;
                }
                .receta-contenido .ingrediente {
                    margin: 10px 0;
                    padding: 5px;
                    background-color: #e8f5e9;
                    border-radius: 8px;
                    font-weight: bold;
                }
            `}</style>
        </div>
    )
}
