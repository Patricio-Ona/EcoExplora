import { Receta } from '@/app/[locale]/types/types'

// Datos mockeados - reemplaza con tu base de datos después
const recetasMock: Receta[] = [
    {
        RecetaID: 1,
        Nombre: 'Ensalada de Quinoa',
        Descripcion: 'Una ensalada nutritiva y deliciosa con quinoa y vegetales frescos',
        Instrucciones: '1. Cocina la quinoa\n2. Pica los vegetales\n3. Mezcla todo\n4. Aliña con limón y aceite de oliva',
        FechaRegistro: new Date(),
        Usuario: 'Chef María'
    },
    {
        RecetaID: 2,
        Nombre: 'Té de Moringa',
        Descripcion: 'Una infusión saludable con hojas de moringa',
        Instrucciones: '1. Calienta agua\n2. Añade hojas de moringa\n3. Deja reposar 5 minutos\n4. Cuela y sirve',
        FechaRegistro: new Date(),
        Usuario: 'Chef Juan'
    }
]

export async function GET(request: Request) {
    try {
        // Si la URL incluye /nombre/, es una búsqueda por nombre
        const url = new URL(request.url)
        const nombre = url.searchParams.get('nombre')

        if (nombre) {
            const receta = recetasMock.find(r => r.Nombre.toLowerCase() === nombre.toLowerCase())
            if (!receta) {
                return new Response(JSON.stringify(null), { status: 404 })
            }
            return Response.json(receta, { status: 200 })
        }

        return Response.json(recetasMock, { status: 200 })
    } catch (error) {
        return Response.json({ error: 'Error fetching recetas' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as Receta

        if (!body.Nombre || !body.Descripcion || !body.Instrucciones) {
            return Response.json({ error: 'Faltan campos requeridos' }, { status: 400 })
        }

        const nuevaReceta: Receta = {
            RecetaID: recetasMock.length + 1,
            Nombre: body.Nombre,
            Descripcion: body.Descripcion,
            Instrucciones: body.Instrucciones,
            FechaRegistro: new Date(),
            Usuario: body.Usuario || 'Usuario'
        }

        recetasMock.push(nuevaReceta)
        return Response.json(nuevaReceta, { status: 201 })
    } catch (error) {
        return Response.json({ error: 'Error creating receta' }, { status: 500 })
    }
}
