import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import { Tooltip } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/hooks/useAuth'

const Topbar = () => {
  const Navigate = useNavigate()
  const { authType, logout, userLoggedSetter } = useAuth()

  const [nombre, setNombre] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')

  useEffect(() => {
    // Obtener datos del usuario según el tipo de autenticación
    const getUserInfo = () => {
      // Verificar si existe un usuario de Google
      const googleUser = localStorage.getItem('googleToken')
      // Verificar si existe un usuario administrador
      const adminUser = localStorage.getItem('userInfo')

      if (googleUser) {
        const user = userLoggedSetter(googleUser)
        setNombre(user.firstName + " " + user.lastName || '')
        setFotoUrl(user.picture || "https://placehold.co/250x250/4477ba/blue?text=User")
      } else if (adminUser) {
        const user = JSON.parse(adminUser)
        setNombre(user.nombre || '')
        setFotoUrl('') // Administradores no tienen foto por defecto
      } else {
        // Si no hay información de usuario, usar valores por defecto
        setNombre('')
        setFotoUrl('')
      }
    }

    getUserInfo()

    // Configurar un listener para actualizar si cambia el almacenamiento local
    const handleStorageChange = () => {
      getUserInfo()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const logOut = () => {
    // Usar la función de logout del hook useAuth para una limpieza completa
    logout()
    // Determinar a qué página redirigir según el tipo de autenticación
    if (authType === 'google') {
      Navigate('/login')
    } else {
      Navigate('/login-admin')
    }
  }

  return (
    <div className='min-w-full min-h-12 bg-rojo-mate flex items-center justify-end px-4'>
      <p className='text-blanco'>{nombre || ''}</p>
      <img
        src={
          fotoUrl !== ''
            ? fotoUrl
            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        }
        alt='foto de perfil'
        className='h-[35px] mx-6 rounded-full'
      />
      <a onClick={logOut} className='cursor-pointer'>
        <Tooltip
          content='Cerrar sesión'
          closeDelay={0}
          classNames={{
            content: 'bg-gris-claro'
          }}
        >
          <LogOut className='text-blanco' />
        </Tooltip>
      </a>
    </div>
  )
}

export default Topbar