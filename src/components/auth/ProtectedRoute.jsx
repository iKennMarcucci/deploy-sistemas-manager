import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/hooks/useAuth'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

// Rutas que solo pueden ser accedidas por administradores
const ADMIN_ONLY_ROUTES = [
  '/academico',
  '/matricula',
  '/usuarios',
  '/pregrado',
  '/posgrado',
  '/admin'
]

// Rutas que solo pueden ser accedidas por superadministradores
const SUPERADMIN_ONLY_ROUTES = ['/admin']

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, authType, user, token, userLoggedGetter } = useAuth()
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [hasValidToken, setHasValidToken] = useState(false)
  const [hasUserInfo, setHasUserInfo] = useState(false)
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  useEffect(() => {
    // Verificar si existe al menos uno de los tokens requeridos
    const accessToken = localStorage.getItem('accessToken')
    const googleToken = localStorage.getItem('googleToken')
    const userInfo = localStorage.getItem('userInfo')

    const tokenExists = !!(accessToken || googleToken)
    setHasValidToken(tokenExists)

    // Verificar si existe userInfo (solo se establece en login de admin)
    setHasUserInfo(!!userInfo)

    // Verificar si es usuario de Google (tiene googleToken, independientemente de accessToken)
    setIsGoogleUser(!!googleToken)

    // Solo verificar roles de admin si NO es usuario de Google y tiene accessToken + userInfo
    if (!googleToken && accessToken && userInfo) {
      try {
        const decodedToken = jwtDecode(accessToken)
        const role = decodedToken.role

        // Guardar el rol del usuario
        setUserRole(role)

        // Determinar si el usuario es admin o superadmin
        setIsAdmin(role === 'ROLE_ADMIN' || role === 'ROLE_SUPERADMIN')
      } catch (error) {
        console.error('Error al decodificar el accessToken:', error)
        setIsAdmin(false)
        setUserRole(null)
      }
    } else {
      setIsAdmin(false)
      setUserRole(null)
    }
  }, [isAuthenticated])

  // Función para imprimir la información del usuario
  useEffect(() => {
    if (isAuthenticated && user) {
      // Si hay un token, intentar decodificarlo y mostrar su contenido
      if (token) {
        try {
          // Dividir el token en sus partes (header, payload, signature)
          const tokenParts = token.split('.')
          if (tokenParts.length === 3) {
            // Decodificar la parte del payload (índice 1)
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

  // Si no hay tokens válidos, redirigir según la ruta que intenta acceder
  if (!hasValidToken) {
    // Si estaban intentando acceder a rutas de proyectos, redirigir a login de Google
    if (
      location.pathname.startsWith('/estado-proyecto') ||
      location.pathname.startsWith('/listado-informes') ||
      location.pathname.startsWith('/seguimiento') ||
      location.pathname.startsWith('/informes') ||
      location.pathname.startsWith('/pregrado/grupos')
    ) {
      return <Navigate to='/login' replace />
    }

    // Para otras rutas, redirigir al login de administrador
    return <Navigate to='/login-admin' replace />
  }

  // Verificar si la ruta actual requiere permisos de administrador o superadministrador
  const currentPath = location.pathname
  const requiresAdmin = ADMIN_ONLY_ROUTES.some((route) =>
    currentPath.startsWith(route)
  )
  const requiresSuperAdmin = SUPERADMIN_ONLY_ROUTES.some((route) =>
    currentPath.startsWith(route)
  )

  // VALIDACIÓN PRINCIPAL: Si es usuario de Google e intenta acceder a rutas administrativas, redirigir inmediatamente
  if (isGoogleUser && (requiresAdmin || requiresSuperAdmin)) {
    return (
      <Navigate
        to='/'
        replace
        state={{
          message:
            'Los usuarios de Google no tienen acceso a funcionalidades administrativas. Debe iniciar sesión con una cuenta de administrador.'
        }}
      />
    )
  }

  // VALIDACIÓN SECUNDARIA: Si intenta acceder a rutas administrativas sin las credenciales correctas
  if (requiresAdmin || requiresSuperAdmin) {
    const accessToken = localStorage.getItem('accessToken')
    const googleToken = localStorage.getItem('googleToken')

    // Si tiene googleToken, bloquear acceso
    if (googleToken) {
      return (
        <Navigate
          to='/'
          replace
          state={{
            message:
              'Acceso denegado. Los usuarios de Google no pueden acceder a funcionalidades administrativas.'
          }}
        />
      )
    }

    // Si no tiene accessToken O no tiene userInfo, bloquear acceso
    if (!accessToken || !hasUserInfo) {
      return (
        <Navigate
          to='/'
          replace
          state={{
            message:
              'No tienes permisos para acceder a esta página. Debes iniciar sesión como administrador.'
          }}
        />
      )
    }
  }

  // Si la ruta requiere permisos de superadmin y el usuario no es superadmin, redirigir
  if (requiresSuperAdmin && userRole !== 'ROLE_SUPERADMIN') {
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
  if (requiresAdmin && !isAdmin) {
    return (
      <Navigate
        to='/'
        replace
        state={{ message: 'No tienes permisos para acceder a esta página' }}
      />
    )
  }

  // Si tiene token válido, permitir el acceso
  return <Outlet />
}

export default ProtectedRoute
