// src/app/admin/usuarios/page.tsx
import AdminUsuarios from '@/app/[locale]/components/admin/AdminUsuarios' // Crearemos este componente a continuación

export default function GestionUsuariosPage() {
    return (
        <div>
            <h1 className='text-3xl font-bold mb-6 text-gray-800'>Gestión de Usuarios</h1>
            <p className='mb-8 text-gray-600'>
                Aquí puedes ver, editar y eliminar los usuarios registrados en el sistema.
            </p>
            {/* Ahora este componente se renderizará correctamente */}
            <AdminUsuarios />
        </div>
    )
}
