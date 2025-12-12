import { Foro } from '@/app/[locale]/types/types'
import maplibregl from 'maplibre-gl'

export function addPlantMarkers(
    map: maplibregl.Map,
    plantas: Foro[],
    setPlantaSeleccionada: (planta: Foro) => void,
    markersRef: React.MutableRefObject<maplibregl.Marker[]>
) {
    plantas.forEach(planta => {
        const longlat: [number, number] = [Number(planta.Longitud), Number(planta.Latitud)]

        //     const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        //   <div style="
        //     background: white;
        //     padding: 6px 10px;
        //     border-radius: 6px;
        //     border: 1px solid #888;
        //     font-size: 13px;
        //     font-family: sans-serif;
        //     box-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        //   ">
        //     🌿 <strong>${planta.Planta}</strong>
        //   </div>
        // `)

        const el = document.createElement('div')
        el.className = 'custom-marker'
        el.innerHTML = `
      <div style="
        background: white;
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px solid #888;
        font-size: 12px;
        font-family: sans-serif;
        box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
        display: inline-block;
      ">
        🌿 ${planta.Planta}
      </div>
    `
        el.addEventListener('click', () => {
            setPlantaSeleccionada(planta)
        })
        const marker = new maplibregl.Marker({ element: el })
        marker.setLngLat(longlat).addTo(map)
        markersRef.current.push(marker)
    })
}

export function addTerrainLayers(map: maplibregl.Map) {
    map.addSource('dem', {
        type: 'raster-dem',
        encoding: 'terrarium',
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        tileSize: 256,
        maxzoom: 13,
    })

    map.setTerrain({ source: 'dem', exaggeration: 1.4 })

    map.addLayer({
        id: 'hillshade',
        type: 'hillshade',
        source: 'dem',
        paint: {
            'hillshade-illumination-direction': 335,
            'hillshade-exaggeration': 0.1,
        },
    })
}
export function addMapControls(map: maplibregl.Map) {
    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.addControl(
        new maplibregl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
        }),
        'top-right'
    )
}
export function highlightReferencePoint(map: maplibregl.Map) {
    new maplibregl.Marker({ color: '#d00' }).setLngLat([-78.8814, -1.0461]).addTo(map)
}
export function styleRoadsIfPresent(map: maplibregl.Map) {
    ;['road-primary', 'road-secondary', 'road-tertiary'].forEach(layerId => {
        if (map.getLayer(layerId)) {
            map.setPaintProperty(layerId, 'line-color', '#ffffff')
            map.setPaintProperty(layerId, 'line-width', 2)
        }
    })
}
