// src/app/admin/usuarios/page.tsx
import AdminCategorias from '@/app/[locale]/components/admin/AdminCategorias' // Crearemos este componente a continuación

export default function GestionPlantasPage() {
    return (
        <div>
            <h1 className='text-3xl font-bold mb-6 text-gray-800'>
                Gestión de Categorias de Plantas
            </h1>
            <p className='mb-8 text-gray-600'>
                Aquí puedes ver, editar y eliminar las categorias de las plantas registradss en el
                sistema.
            </p>
            {/* Ahora este componente se renderizará correctamente */}
            <AdminCategorias />
        </div>
    )
}
