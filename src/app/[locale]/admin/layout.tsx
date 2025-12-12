// src/app/admin/layout.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import Link from 'next/link'
import { Users, Sprout, LayoutGrid, LogOut } from 'lucide-react'

interface DecodedToken {
    nombre: string
    rol: string
    exp: number
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null) // Renombramos el estado para evitar conflictos
    const router = useRouter()
    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (token) {
            try {
                const decodedToken = jwtDecode<DecodedToken>(token)
                if (decodedToken.rol === 'Administrador' && decodedToken.exp * 1000 > Date.now()) {
                    setIsAuthorized(true)
                } else {
                    router.push('/') // Redirige si no es admin o el token expiró
                }
            } catch (error) {
                // Si el token es inválido, establecemos un error
                console.error('Error al decodificar el token:', error)
                setAuthError('Tu sesión es inválida. Por favor, inicia sesión de nuevo.')
                localStorage.removeItem('authToken')
            }
        } else {
            router.push('/') // Redirige si no hay token
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('authToken')
        window.location.href = '/'
        localStorage.clear()
    }

    // Lógica de renderizado mejorada
    if (authError) {
        return (
            <div className='flex flex-col items-center justify-center h-screen bg-gray-100 text-center'>
                <h2 className='text-2xl font-bold text-red-600 mb-4'>Error de Autenticación</h2>
                <p className='text-lg text-gray-700 mb-6'>{authError}</p>
                <button
                    onClick={() => router.push('/')}
                    className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600'
                >
                    Volver al Inicio
                </button>
            </div>
        )
    }

    if (!isAuthorized) {
        return (
            <div className='flex items-center justify-center h-screen bg-gray-100'>
                <p className='text-xl'>Verificando acceso...</p>
            </div>
        )
    }

    return (
        <div className='flex h-screen bg-gray-50'>
            {/* Sidebar */}
            <aside className='w-64 bg-gray-800 text-white flex flex-col'>
                <div className='p-4 text-2xl font-bold border-b border-gray-700'>Admin Panel</div>
                <nav className='flex-1 p-2 space-y-2'>
                    <Link
                        href='/admin/usuarios'
                        className='flex items-center p-2 rounded hover:bg-gray-700'
                    >
                        <Users className='mr-3 h-5 w-5' /> Gestionar Usuarios
                    </Link>
                    <Link
                        href='/admin/plantas'
                        className='flex items-center p-2 rounded hover:bg-gray-700'
                    >
                        <Sprout className='mr-3 h-5 w-5' /> Gestionar Plantas
                    </Link>
                    <Link
                        href='/admin/categorias'
                        className='flex items-center p-2 rounded hover:bg-gray-700'
                    >
                        <LayoutGrid className='mr-3 h-5 w-5' /> Gestionar Categorías
                    </Link>
                </nav>
                <div className='p-2 border-t border-gray-700'>
                    <button
                        onClick={handleLogout}
                        className='w-full flex items-center p-2 rounded hover:bg-red-500'
                    >
                        <LogOut className='mr-3 h-5 w-5' /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className='flex-1 p-8 overflow-y-auto'>{children}</main>
        </div>
    )
}
