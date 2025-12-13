// src/app/components/modals/RegisterModal.tsx
'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

interface RegisterModalProps {
    onClose: () => void
    onSwitchToLogin: () => void
}

export default function RegisterModal({ onClose, onSwitchToLogin }: RegisterModalProps) {
    const t = useTranslations('RegisterModal')

    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false) // Estado de carga

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true) // Inicia la carga

        if (!nombre || !correo || !contrasena) {
            setError(t('errorRequired'))
            setIsLoading(false)
            return
        }

        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/usuarios`
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Nombre: nombre, Correo: correo, Contrasena: contrasena }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || t('registrationError'))
            }

            setSuccess(t('success'))
            setTimeout(() => {
                onSwitchToLogin() // Cambia al modal de login después del éxito
            }, 2000)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError(t('defaultError'))
            }
        } finally {
            setIsLoading(false) // Termina la carga
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

                {/* Mostramos el loader o los mensajes */}
                {isLoading ? (
                    <div className='text-center'>
                        <p>{t('loading')}</p>
                        {/* Aquí podrías poner un spinner animado */}
                    </div>
                ) : (
                    <>
                        {error && (
                            <p className='bg-red-100 text-red-700 p-3 rounded mb-4'>{error}</p>
                        )}
                        {success && (
                            <p className='bg-green-100 text-green-700 p-3 rounded mb-4'>
                                {success}
                            </p>
                        )}
                    </>
                )}

                <form onSubmit={handleSubmit} className={isLoading ? 'hidden' : ''}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor='nombre'>
                            {t('nameLabel')}
                        </label>
                        <input
                            className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                            type='text'
                            id='nombre'
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor='correo'>
                            {t('emailLabel')}
                        </label>
                        <input
                            className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                            type='email'
                            id='correo'
                            value={correo}
                            onChange={e => setCorreo(e.target.value)}
                        />
                    </div>
                    <div className='mb-6'>
                        <label className='block text-gray-700 mb-2' htmlFor='contrasena'>
                            {t('passwordLabel')}
                        </label>
                        <div className='relative'>
                            <input
                                className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                type={showPassword ? 'text' : 'password'}
                                id='contrasena'
                                value={contrasena}
                                onChange={e => setContrasena(e.target.value)}
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
                        className='w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors'
                    >
                        {t('submit')}
                    </button>
                </form>
                <p className={`text-center text-gray-600 mt-4 ${isLoading ? 'hidden' : ''}`}>
                    {t('alreadyAccount')}{' '}
                    <button onClick={onSwitchToLogin} className='text-green-600 hover:underline'>
                        {t('loginLink')}
                    </button>
                </p>
            </div>
        </div>
    )
}
