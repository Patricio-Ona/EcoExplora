'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useState, useRef, useEffect } from 'react'

const LOCALES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'qu', label: 'Qechua' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
] as const

export default function LocaleSwitcher() {
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Cambia la localización y cierra el dropdown
    const handleLocaleChange = (newLocale: string) => {
        setOpen(false)
        router.replace(pathname, { locale: newLocale })
    }

    // Cierra al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div
            ref={dropdownRef}
            className='relative text-left text-green-700 flex  justify-center items-center gap-4 mx-6
             gap-2'
        >
            <div className='text-white'>Idioma:</div>
            <button
                type='button'
                onClick={() => setOpen(prev => !prev)}
                className='inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none'
            >
                <span className='mr-2'>{locale.toUpperCase()}</span>
                <svg
                    className={`h-5 w-5 transform transition-transform duration-200 ${
                        open ? 'rotate-180' : 'rotate-0'
                    }`}
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                    />
                </svg>
            </button>
            {open && (
                <ul className='absolute top-10 right-0 mt-2 pl-0  bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                    {LOCALES.map(({ code, label }) =>
                        code !== locale ? (
                            <li key={code}>
                                <button
                                    className='w-full mx-2 px-4 py-2 text-left text-sm hover:bg-gray-100'
                                    onClick={() => handleLocaleChange(code)}
                                >
                                    {label}
                                </button>
                            </li>
                        ) : null
                    )}
                </ul>
            )}
        </div>
    )
}
