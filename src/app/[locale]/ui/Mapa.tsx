'use client'

import React, { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Foro } from '../types/types'
import {
    addMapControls,
    addPlantMarkers,
    addTerrainLayers,
    styleRoadsIfPresent,
} from './mapa/funciones'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
const styleLight = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
// const styleLight = 'https://demotiles.maplibre.org/style.json' // Estilo de ejemplo de MapLibre
const styleUrl = styleLight
const center: [number, number] = [-78.52495, -0.22985] // [longitud, latitud] - Quito
const zoom = 10 // Nivel de zoom inicial
const Mapa = ({ plantas }: { plantas: Foro[] }) => {
    const t = useTranslations('Mapa')

    const mapContainer = useRef(null)
    const markersRef = useRef<maplibregl.Marker[]>([])
    const mapRef = useRef<maplibregl.Map | null>(null)

    const [plantaSeleccionada, setPlantaSeleccionada] = useState<Foro | null>(null)
    const [plantaFiltrada, setPlantaFiltrada] = useState('')
    const forosFiltrados = plantaFiltrada
        ? plantas.filter(f => f.Planta === plantaFiltrada)
        : plantas

    const plantasUnicas = Array.from(new Set(forosFiltrados.map(f => f.Planta))).sort()
    function clearMarkers() {
        markersRef.current.forEach(marker => marker.remove())
        markersRef.current = []
    }
    useEffect(() => {
        if (!mapContainer.current) return
        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: styleUrl,
            center,
            zoom,
        })
        mapRef.current = map // Guardar referencia al mapa

        map.on('load', () => {
            addPlantMarkers(map, plantas, setPlantaSeleccionada, markersRef)
            addMapControls(map)
            addTerrainLayers(map)
            styleRoadsIfPresent(map)
            // new maplibregl.Marker({ color: '#d00' }).setLngLat([-78.8814, -1.0461]).addTo(map)
        })

        return () => map.remove() // Limpieza al desmontar
    }, [plantas])
    useEffect(() => {
        console.log('rendering mapa con plantas filtradas:', plantaFiltrada)
        if (!mapContainer.current || !mapRef.current) return
        const forosFiltrados = plantaFiltrada
            ? plantas.filter(f => f.Planta === plantaFiltrada)
            : plantas
        clearMarkers() // Limpiar marcadores anteriores
        addPlantMarkers(mapRef.current, forosFiltrados, setPlantaSeleccionada, markersRef)
    }, [plantaFiltrada, plantas])
    // return <div></div>
    return (
        <div className='relative h-full w-full bg-red-500 z-1'>
            <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
            <div className='absolute top-0 max-w-sm mb-4 bg-gray-200 p-5 rounded-xl shadow-md z-2 '>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                    {t('filterLabel')}
                </label>
                <select
                    value={plantaFiltrada}
                    onChange={e => setPlantaFiltrada(e.target.value)}
                    className='w-full px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm text-gray-800'
                >
                    <option value=''>{t('allPlantsOption')}</option>
                    {plantasUnicas.map(planta => (
                        <option key={planta} value={planta}>
                            🌿 {planta}
                        </option>
                    ))}
                </select>
            </div>
            <div className='absolute top-0 right-0 pointer z-2'>
                {plantaSeleccionada && (
                    <div className='bg-white rounded-2xl shadow-md p-4 border border-gray-200 w-full max-w-sm'>
                        <button
                            onClick={() => setPlantaSeleccionada(null)}
                            className='bg-white absolute top-2 left-2 p-2 text-green-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1'
                            aria-label={t('closeSelection')}
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-6 w-6'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M6 18L18 6M6 6l12 12'
                                />
                            </svg>
                        </button>
                        {/* Imagen */}
                        {plantaSeleccionada.ImagenURL && (
                            <img
                                src={plantaSeleccionada.ImagenURL}
                                alt='Imagen del plantaSeleccionada'
                                className='w-full h-48 object-cover rounded-xl mb-4'
                            />
                        )}

                        {/* Encabezado */}
                        <div className='flex justify-between items-center mb-2'>
                            <span className='text-sm font-medium text-green-700'>
                                🌿 {plantaSeleccionada.Planta}
                            </span>
                            <span className='text-xs text-gray-400'>
                                {dayjs(plantaSeleccionada.FechaPublicacion).format('DD/MM/YYYY')}
                            </span>
                        </div>

                        {/* Comentario */}
                        <p className='text-gray-800 text-sm mb-3 line-clamp-3'>
                            {plantaSeleccionada.Comentario}
                        </p>

                        {/* Usuario y ubicación */}
                        <div className='text-xs text-gray-500 flex justify-between items-center'>
                            <span>👤 {plantaSeleccionada.Usuario}</span>
                            <span>
                                📍 {parseFloat(plantaSeleccionada.Latitud).toFixed(4)},{' '}
                                {parseFloat(plantaSeleccionada.Longitud).toFixed(4)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Mapa
