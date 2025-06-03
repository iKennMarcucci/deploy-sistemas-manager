import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userLogged, setUserLogged] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [userName, setUserName] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authType, setAuthType] = useState(null) // 'admin' o 'google'

  useEffect(() => {
    const checkAuth = () => {
      // Verificar autenticación de administrador
      const accessToken = localStorage.getItem('accessToken')
      const userInfo = localStorage.getItem('userInfo')

      // Verificar autenticación de Google
      const googleToken = localStorage.getItem('googleToken')

      // Si no hay ningún token, el usuario no está autenticado
      if ((!accessToken || !userInfo) && (!googleToken)) {
        setIsAuthenticated(false)
        setUserRole(null)
        setUserName(null)
        setAuthType(null)
        setIsLoading(false)
        return
      }

      try {
        // Verificar primero la autenticación de administrador
        if (accessToken && userInfo) {
          // Verificar que el token no haya expirado
          const decodedToken = jwtDecode(accessToken)
          const currentTime = Date.now() / 1000

          if (decodedToken.exp > currentTime) {
            // Token válido
            const userData = JSON.parse(userInfo)
            setIsAuthenticated(true)
            setUserRole(userData.rol)
            setUserName(userData.nombre)
            setAuthType('admin')
            setIsLoading(false)
            return
          } else {
            // Token expirado, limpiar datos de admin
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('userInfo')
            localStorage.removeItem('googleToken')
          }
        }

        // Si la autenticación de administrador falló o no existe, verificar Google
        if (googleToken) {
          const user = userLoggedSetter(googleToken)
          setIsAuthenticated(true)
          setUserRole('ROLE_GOOGLE')
          setUserName(user?.firstName + "" + user?.lastName)
          setAuthType('google')
        } else {
          setIsAuthenticated(false)
          setUserRole(null)
          setUserName(null)
          setAuthType(null)
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const userLoggedSetter = (token) => {
    try {
      const decodedToken = jwtDecode(token)
      const userData = {
        id: decodedToken.sub,
        picture: decodedToken.picture ?? "https://placehold.co/250x250?text=User",
        role: decodedToken.role,
        email: decodedToken.sub,
        firstName: decodedToken.nombre,
        lastName: decodedToken.apellido,
        iat: decodedToken.iat,
        exp: decodedToken.exp
      }

      localStorage.setItem("googleToken", token)
      setUserLogged(userData)
      setIsAuthenticated(true)
      setAuthType("google")
      return userData
    } catch (error) {
      console.error('Error al decodificar el token:', error)
      return null
    }
  }

  const userLoggedGetter = () => { return userLogged }

  const refreshUserFromToken = () => {
    const googleToken = localStorage.getItem("googleToken")
    if (!googleToken) return null
    try {
      const decodedToken = jwtDecode(googleToken)
      const userData = {
        id: decodedToken.sub,
        picture: decodedToken.picture ?? "https://placehold.co/250x250?text=User",
        role: decodedToken.role,
        email: decodedToken.sub,
        firstName: decodedToken.nombre,
        lastName: decodedToken.apellido,
        iat: decodedToken.iat,
        exp: decodedToken.exp
      }
      setUserLogged(userData)
      setIsAuthenticated(true)
      setAuthType("google")
      return userData
    } catch (error) {
      console.error('Error al decodificar el token:', error)
      return null
    }
  }

  const logout = () => {
    // Limpiar datos de ambos tipos de autenticación
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
    localStorage.removeItem('googleToken')
    localStorage.removeItem('user')
    localStorage.removeItem('sidebarState')

    setIsAuthenticated(false)
    setUserRole(null)
    setUserName(null)
    setAuthType(null)
  }

  return { isAuthenticated, userRole, userName, isLoading, logout, authType, userLogged, userLoggedSetter, userLoggedGetter, refreshUserFromToken }
}
