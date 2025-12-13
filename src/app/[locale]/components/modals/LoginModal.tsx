// src/app/components/modals/LoginModal.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation' // 1. Importar el router
import { useTranslations } from 'next-intl'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

// Definimos el tipo para los datos del usuario que la API devuelve
interface User {
    id: number
    nombre: string
    rol: string
}

// Actualizamos las props para aceptar la nueva función
interface LoginModalProps {
    onClose: () => void
    onSwitchToRegister: () => void
    onLoginSuccess: (user: User) => void // Nueva prop para notificar el éxito
}

export default function LoginModal({
    onClose,
    onSwitchToRegister,
    onLoginSuccess,
}: LoginModalProps) {
    const t = useTranslations('LoginModal') // Usamos el hook de traducciones

    const [correo, setCorreo] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter() // 2. Inicializar el router

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Correo: correo, Contrasena: contrasena }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Error al iniciar sesión.')
            }

            localStorage.setItem('authToken', data.token)
            localStorage.setItem('authUser', JSON.stringify(data.usuario))

            // --- CAMBIO PRINCIPAL ---
            // En lugar de recargar, llamamos a la función del padre (Navbar)
            // y le pasamos los datos del usuario que recibimos de la API.
            // 3. Lógica de redirección por rol

            // --- LÓGICA CORREGIDA ---
            // 1. Notifica al Navbar que el login fue exitoso y pasa los datos del usuario.
            onLoginSuccess(data.usuario)

            // 2. Si el usuario es Administrador, redirige al panel.
            if (data.usuario?.rol === 'Administrador') {
                router.push('/admin/usuarios')
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError(t('defaultError'))
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className='fixed inset-0 bg-black/50 z-50 flex justify-center items-center'
            onClick={onClose}
        >
            <div
                className='bg-white p-8 rounded-lg shadow-xl w-full max-w-md'
                onClick={e => e.stopPropagation()}
            >
                <h2 className='text-2xl font-bold text-green-700 mb-6 text-center'>{t('title')}</h2>
                {error && <p className='bg-red-100 text-red-700 p-3 rounded mb-4'>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor='correo-login'>
                            {t('emailLabel')}
                        </label>
                        <input
                            className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                            type='email'
                            id='correo-login'
                            value={correo}
                            onChange={e => setCorreo(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className='mb-6'>
                        <label className='block text-gray-700 mb-2' htmlFor='contrasena-login'>
                            {t('passwordLabel')}
                        </label>
                        <div className='relative'>
                            <input
                                className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                type={showPassword ? 'text' : 'password'}
                                id='contrasena-login'
                                value={contrasena}
                                onChange={e => setContrasena(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'
                            >
                                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400'
                        disabled={isLoading}
                    >
                        {isLoading ? t('loading') : t('submit')}
                    </button>
                </form>
                <p className='text-center text-gray-600 mt-4'>
                    {t('noAccount')}{' '}
                    <button onClick={onSwitchToRegister} className='text-green-600 hover:underline'>
                        {t('registerLink')}
                    </button>
                </p>
            </div>
        </div>
    )
}
