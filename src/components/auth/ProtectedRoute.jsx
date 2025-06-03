import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/hooks/useAuth'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

// Rutas que solo pueden ser accedidas por administradores
const ADMIN_ONLY_ROUTES = [
  '/administrador',
  '/materias',
  '/pensum',
  '/programas',
  '/reintegros',
  '/cancelaciones',
  '/aplazamientos',
  '/contraprestaciones',
  '/posgrado',
  '/pregrado',
  '/profesores',
  '/estudiantes'
]

// Rutas que solo pueden ser accedidas por superadministradores
const SUPERADMIN_ONLY_ROUTES = ['/admin', '/terminar-semestre', '/crear-admin']

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, authType, user, token, userLoggedGetter } = useAuth()
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    // Verificar si el usuario es administrador comprobando la existencia del accessToken
    const accessToken = localStorage.getItem('accessToken')

    // Decodificar el accessToken para obtener los roles
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken)
        const role = decodedToken.role
        console.log('Rol del usuario (role):', role)

        // Guardar el rol del usuario
        setUserRole(role)

        // Determinar si el usuario es admin o superadmin
        setIsAdmin(role === 'ROLE_ADMIN' || role === 'ROLE_SUPERADMIN')
      } catch (error) {
        console.error('Error al decodificar el accessToken:', error)
      }
    } else {
      setIsAdmin(false)
      setUserRole(null)
    }
  }, [isAuthenticated])

  // Función para imprimir la información del usuario
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Información del usuario autenticado:', {
        usuario: user,
        token: token,
        tipoAutenticacion: authType,
        rol: user.rol || 'No especificado'
      })

      // Si hay un token, intentar decodificarlo y mostrar su contenido
      if (token) {
        try {
          // Dividir el token en sus partes (header, payload, signature)
          const tokenParts = token.split('.')
          if (tokenParts.length === 3) {
            // Decodificar la parte del payload (índice 1)
            const payload = JSON.parse(atob(tokenParts[1]))
            console.log('Contenido del token decodificado:', payload)
          }
        } catch (error) {
          console.error('Error al decodificar el token:', error)
        }
      }
    }
  }, [isAuthenticated, user, token, authType])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rojo-institucional'></div>
      </div>
    )
  }

  // Verificar si la ruta actual requiere permisos de administrador o superadministrador
  const currentPath = location.pathname
  const requiresAdmin = ADMIN_ONLY_ROUTES.some((route) =>
    currentPath.startsWith(route)
  )
  const requiresSuperAdmin = SUPERADMIN_ONLY_ROUTES.some((route) =>
    currentPath.startsWith(route)
  )

  // Si la ruta requiere permisos de superadmin y el usuario no es superadmin, redirigir
  if (isAuthenticated && requiresSuperAdmin && userRole !== 'ROLE_SUPERADMIN') {
    return (
      <Navigate
        to='/'
        replace
        state={{
          message: 'Solo los Super Administradores pueden acceder a esta página'
        }}
      />
    )
  }

  // Si la ruta requiere permisos de administrador y el usuario no es admin ni superadmin, redirigir
  if (isAuthenticated && requiresAdmin && !isAdmin) {
    return (
      <Navigate
        to='/'
        replace
        state={{ message: 'No tienes permisos para acceder a esta página' }}
      />
    )
  }

  // Si está autenticado, permitir el acceso
  if (isAuthenticated || !!userLoggedGetter) {
    return <Outlet />
  }

  console.log(!!userLoggedGetter)

  // Si no está autenticado, redirigir a la página de login correspondiente
  // Si estaban intentando acceder a rutas de proyectos, redirigir a login de Google
  if (location.pathname.startsWith('/estado-proyecto') ||
    location.pathname.startsWith('/listado-informes') ||
    location.pathname.startsWith('/seguimiento') ||
    location.pathname.startsWith('/informes') ||
    location.pathname.startsWith('/pregrado/grupos')) {
    return <Navigate to='/login' replace />
  }

  // Para otras rutas, redirigir al login de administrador
  return <Navigate to='/login-admin' replace />
}

export default ProtectedRoute
