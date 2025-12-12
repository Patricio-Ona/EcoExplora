// src/app/components/admin/UserFormModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { UsuarioFormData, Rol } from '@/app/[locale]/typesa/admin-types'

// 1. Definimos la forma de un Rol

// 2. Actualizamos la prop userData para que incluya el RolID
interface UserFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (formData: UsuarioFormData, id?: number) => void
    userData: { UsuarioID: number; Nombre: string; Correo: string; RolID: number } | null
}

export default function UserFormModal({ isOpen, onClose, onSave, userData }: UserFormModalProps) {
    const [formData, setFormData] = useState<UsuarioFormData>({
        Nombre: '',
        Correo: '',
        RolID: 2, // Por defecto, rol de 'Usuario'
        Contrasena: '',
    })

    // 3. Nuevo estado para guardar la lista de roles
    const [roles, setRoles] = useState<Rol[]>([])

    // 4. useEffect para obtener los roles de la API cuando el modal se abre
    useEffect(() => {
        if (isOpen) {
            const fetchRoles = async () => {
                try {
                    const token = localStorage.getItem('authToken')
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    if (!res.ok) throw new Error('No se pudieron cargar los roles.')
                    const data = await res.json()
                    setRoles(data)
                } catch (error) {
                    console.error(error)
                    alert('No se pudieron cargar los roles.')
                }
            }
            fetchRoles()
        }
    }, [isOpen])

    // useEffect para rellenar el formulario cuando se edita un usuario
    useEffect(() => {
        if (userData) {
            // Ahora usamos el RolID que viene directamente de la API.
            setFormData({
                Nombre: userData.Nombre,
                Correo: userData.Correo,
                RolID: userData.RolID,
                Contrasena: '',
            })
        } else {
            // Resetea el formulario si es para crear uno nuevo
            setFormData({ Nombre: '', Correo: '', RolID: 2, Contrasena: '' })
        }
    }, [userData, isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        // Nos aseguramos de que el RolID se guarde como número
        const finalValue = name === 'RolID' ? parseInt(value, 10) : value
        setFormData(prev => ({ ...prev, [name]: finalValue }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!userData && !formData.Contrasena) {
            alert('La contraseña es obligatoria para nuevos usuarios.')
            return
        }
        onSave(formData, userData?.UsuarioID)
    }

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'>
            <div className='bg-white p-8 rounded-lg shadow-xl w-full max-w-lg'>
                <h2 className='text-2xl font-bold mb-6'>
                    {userData ? 'Editar Usuario' : 'Crear Usuario'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor='Nombre'>
                            Nombre
                        </label>
                        <input
                            type='text'
                            name='Nombre'
                            id='Nombre'
                            value={formData.Nombre}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border rounded-lg'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor='Correo'>
                            Correo Electrónico
                        </label>
                        <input
                            type='email'
                            name='Correo'
                            id='Correo'
                            value={formData.Correo}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border rounded-lg'
                            required
                        />
                    </div>
                    {/* 5. Reemplazamos el input de Rol por un select (combobox) */}
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor='RolID'>
                            Rol
                        </label>
                        <select
                            name='RolID'
                            id='RolID'
                            value={formData.RolID}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border rounded-lg bg-white'
                        >
                            {roles.map(rol => (
                                <option key={rol.RolID} value={rol.RolID}>
                                    {rol.NombreRol}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2' htmlFor='Contrasena'>
                            Contraseña
                        </label>
                        <input
                            type='password'
                            name='Contrasena'
                            id='Contrasena'
                            value={formData.Contrasena || ''}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border rounded-lg'
                            placeholder={userData ? 'Dejar en blanco para no cambiar' : ''}
                        />
                    </div>
                    <div className='flex justify-end gap-4 mt-8'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400'
                        >
                            Cancelar
                        </button>
                        <button
                            type='submit'
                            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
