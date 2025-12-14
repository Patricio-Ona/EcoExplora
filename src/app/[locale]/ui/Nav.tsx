'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    Menu,
    X,
    Camera,
    User,
    ChevronDown,
    Home,
    BookOpen,
    Leaf,
    Info,
    UserCircle,
    LogOut,
    Plus,
} from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import LoginModal from '../components/modals/LoginModal'
import RegisterModal from '../components/modals/RegisterModal'
import LocaleSwitcher from './LocaleSwitcher'
import { useTranslations } from 'next-intl'

// --- Interfaces para tipado ---
interface User {
    id: number
    nombre: string
    rol: string
}

interface DecodedToken extends User {
    iat: number
    exp: number
}

export default function Navbar() {
    const t = useTranslations('Nav')
    // const categorias = ['Medicinales', 'Ornamentales', 'Frutales', 'Aromáticas']
    // const categoriasTraducidas = [
    //     t('categories.medicinales'),
    //     t('categories.ornamentales'),
    //     t('categories.frutales'),
    //     t('categories.aromaticas'),
    // ]
    const categorias = [
        { code: 'Medicinales', label: t('categories.medicinales') },
        { code: 'Ornamentales', label: t('categories.ornamentales') },
        { code: 'Frutales', label: t('categories.frutales') },
        { code: 'Aromáticas', label: t('categories.aromáticas') },
    ]

    const navItems = [
        { label: t('home'), href: '/', icon: Home },
        { label: t('recipes'), href: '/recetas', icon: BookOpen },
    ]

    // Estados
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isPlantsMenuOpen, setIsPlantsMenuOpen] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement>(null)
    const userMenuRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()

    // Efecto para comprobar el token
    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (token) {
            try {
                const decodedToken = jwtDecode<DecodedToken>(token)
                if (decodedToken.exp * 1000 > Date.now()) {
                    setUser({
                        id: decodedToken.id,
                        nombre: decodedToken.nombre,
                        rol: decodedToken.rol,
                    })
                } else {
                    localStorage.removeItem('authToken')
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error)
                localStorage.removeItem('authToken')
            }
        }
    }, [])

    // Efecto para cerrar menús al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsPlantsMenuOpen(false)
            }
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setIsUserMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('authToken')
        setUser(null)
        router.push('/')
    }

    const openLogin = () => {
        setShowRegisterModal(false)
        setShowLoginModal(true)
        setIsUserMenuOpen(false)
    }

    const openRegister = () => {
        setShowLoginModal(false)
        setShowRegisterModal(true)
        setIsUserMenuOpen(false)
    }

    const handleLoginSuccess = (userData: User) => {
        if (userData) {
            setUser(userData)
        }
        setShowLoginModal(false)
    }

    const closeAllMenus = () => {
        console.log('Closing all menus')
        setIsMenuOpen(false)
        setIsUserMenuOpen(false)
        setIsPlantsMenuOpen(false)
    }

    const isAdminPage = pathname.startsWith('/admin')
    if (user?.rol === 'Administrador' && isAdminPage) {
        return null
    }

    return (
        <>
            <nav
                className={`bg-gradient-to-r from-green-700 to-green-600 backdrop-blur-md shadow-lg z-40 ${
                    pathname !== '/' ? 'sticky top-0' : ''
                }`}
            >
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-20'>
                        {/* Logo y Links principales */}
                        <div className='flex items-center space-x-8'>
                            <div className='flex-shrink-0'>
                                <Link
                                    href='/'
                                    className='text-white text-xl font-bold flex items-center'
                                >
                                    <Leaf className='w-6 h-6 mr-2' />
                                    EcoExplora
                                </Link>
                            </div>

                            {/* Desktop Navigation */}
                            <div className='hidden lg:flex items-center    lg:mx-8 lg:space-x-4 '>
                                {navItems.map(item => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`text-white hover:text-green-200 transition-colors duration-200 flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-600/30 ${
                                            pathname === item.href ? 'bg-green-600/50' : ''
                                        }`}
                                    >
                                        <item.icon className='w-4 h-4' />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}

                                {/* Dropdown de Plantas */}
                                <div className='relative' ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsPlantsMenuOpen(!isPlantsMenuOpen)}
                                        className='text-white hover:text-green-200 transition-colors duration-200 flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-600/30'
                                    >
                                        <Leaf className='w-4 h-4' />
                                        <span>{t('plants')}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${
                                                isPlantsMenuOpen ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>

                                    {isPlantsMenuOpen && (
                                        <div className='absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50'>
                                            <Link
                                                href='/plantas'
                                                className='block bg-red-100 px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200'
                                                onClick={() => setIsPlantsMenuOpen(false)}
                                            >
                                                {t('categories.all')}
                                            </Link>
                                            {categorias.map(cat => (
                                                <Link
                                                    key={cat.code}
                                                    href={`/plantas/${cat.code}`}
                                                    className='block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200'
                                                    onClick={() => setIsPlantsMenuOpen(false)}
                                                >
                                                    {cat.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href='/nosotros'
                                    className={`text-white hover:text-green-200 transition-colors duration-200 flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-600/30 ${
                                        pathname === '/nosotros' ? 'bg-green-600/50' : ''
                                    }`}
                                >
                                    <Info className='w-4 h-4' />
                                    <span>{t('aboutUs')}</span>
                                </Link>
                            </div>
                        </div>

                        {/* Acciones principales */}
                        <div className='flex items-center space-x-2 sm:space-x-4'>
                            {/* Botón Identify Plant - Destacado */}
                            <Link
                                href='/ingresar'
                                className='bg-white text-green-600 hover:bg-green-50 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-1 sm:space-x-2 shadow-md text-sm sm:text-base'
                            >
                                <Camera className='w-4 h-4 flex-shrink-0' />
                                <span className='hidden sm:inline'>{t('recognizePlant')}</span>
                            </Link>

                            {/* Botón Crear Foro (solo si está logueado) */}
                            {user && (
                                <Link
                                    href='/crear-foro'
                                    className='bg-green-500 text-white hover:bg-green-600 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-1 sm:space-x-2 shadow-md text-sm sm:text-base'
                                >
                                    <Plus className='w-4 h-4 flex-shrink-0' />
                                    <span className='hidden sm:inline'>Foro</span>
                                </Link>
                            )}

                            {/* Menú de Usuario */}
                            <div className='relative' ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className='text-white hover:text-green-200 flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md hover:bg-green-600/30 transition-colors duration-200'
                                >
                                    <User className='w-4 h-4 flex-shrink-0' />
                                    <span className='hidden sm:inline text-sm'>
                                        {user ? user.nombre : t('account')}
                                    </span>
                                    <ChevronDown className='w-3 h-3 sm:w-4 sm:h-4' />
                                </button>

                                {/* Dropdown del Usuario */}
                                {isUserMenuOpen && (
                                    <div className='absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg py-2 z-50'>
                                        {user ? (
                                            <>
                                                <div className='px-4 py-2 text-sm text-gray-500 border-b border-gray-200'>
                                                    <div className='flex items-center'>
                                                        <UserCircle className='w-4 h-4 mr-2' />
                                                        {user.nombre}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        handleLogout()
                                                        setIsUserMenuOpen(false)
                                                    }}
                                                    className='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 text-sm flex items-center'
                                                >
                                                    <LogOut className='w-4 h-4 mr-2' />
                                                    {t('logout')}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={openLogin}
                                                    className='w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 text-sm'
                                                >
                                                    {t('login')}
                                                </button>
                                                <button
                                                    onClick={openRegister}
                                                    className='w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 text-sm'
                                                >
                                                    {t('register')}
                                                </button>
                                            </>
                                        )}
                                        <div className='border-t border-gray-200 mt-2 pt-2'>
                                            <div className='px-4 py-2'>
                                                <LocaleSwitcher />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Botón menú móvil */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className='lg:hidden text-white hover:text-green-200 p-2 rounded-md hover:bg-green-600/30 transition-colors duration-200'
                            >
                                {isMenuOpen ? (
                                    <X className='w-5 h-5' />
                                ) : (
                                    <Menu className='w-5 h-5' />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Menú móvil */}
                    {isMenuOpen && (
                        <div className='md:hidden'>
                            <div className='bg-green-600 rounded-lg mx-4 mb-4 shadow-lg'>
                                <div className='px-4 py-3 space-y-1'>
                                    {navItems.map(item => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeAllMenus}
                                            className={`block text-white hover:text-green-200 py-2 px-3 rounded-md hover:bg-green-700/30 transition-colors duration-200 flex items-center space-x-2 text-sm ${
                                                pathname === item.href ? 'bg-green-700/50' : ''
                                            }`}
                                        >
                                            <item.icon className='w-4 h-4' />
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}

                                    {/* Plantas dropdown móvil */}
                                    <div className=''>
                                        <button
                                            onClick={() => setIsPlantsMenuOpen(!isPlantsMenuOpen)}
                                            className='w-full text-left text-white hover:text-green-200 py-2 px-3 rounded-md hover:bg-green-700/30 transition-colors duration-200 flex items-center justify-between text-sm'
                                        >
                                            <div className='flex items-center space-x-2'>
                                                <Leaf className='w-4 h-4' />
                                                <span>{t('plants')}</span>
                                            </div>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform ${
                                                    isPlantsMenuOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>

                                        {isPlantsMenuOpen && (
                                            <div className='pl-6 mt-1 space-y-1'>
                                                <Link
                                                    href='/plantas'
                                                    onClick={closeAllMenus}
                                                    className='block text-white hover:text-green-200 py-1 px-3 rounded-md hover:bg-green-700/30 transition-colors duration-200 text-sm'
                                                >
                                                    {t('categories.all')}
                                                </Link>
                                                {categorias.map(cat => (
                                                    <Link
                                                        key={cat.code}
                                                        href={`/plantas/${cat.code}`}
                                                        onClick={closeAllMenus}
                                                        className='block text-white hover:text-green-200 py-1 px-3 rounded-md hover:bg-green-700/30 transition-colors duration-200 text-sm'
                                                    >
                                                        {cat.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href='/nosotros'
                                        onClick={closeAllMenus}
                                        className={`block text-white hover:text-green-200 py-2 px-3 rounded-md hover:bg-green-700/30 transition-colors duration-200 flex items-center space-x-2 text-sm ${
                                            pathname === '/nosotros' ? 'bg-green-700/50' : ''
                                        }`}
                                    >
                                        <Info className='w-4 h-4' />
                                        <span>{t('aboutUs')}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Renderizado de modales */}
            {showLoginModal && (
                <LoginModal
                    onLoginSuccess={handleLoginSuccess}
                    onClose={() => setShowLoginModal(false)}
                    onSwitchToRegister={openRegister}
                />
            )}
            {showRegisterModal && (
                <RegisterModal
                    onClose={() => setShowRegisterModal(false)}
                    onSwitchToLogin={openLogin}
                />
            )}
        </>
    )
}
