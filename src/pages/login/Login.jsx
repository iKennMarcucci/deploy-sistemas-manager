import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/hooks/useAuth'
import { FcGoogle } from 'react-icons/fc'

const Login = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, userLogged } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (userLogged.role.toLowerCase() === "docente") {
        navigate('/listado-proyectos')
        return
      }
      if (userLogged.role.toLowerCase() === "estudiante") {
        navigate('/estado-proyecto')
        return
      }
      navigate('/estado-proyecto')
    }
  }, [isAuthenticated, isLoading, navigate])

  const url = import.meta.env.VITE_LOGIN_URL

  return (
    <div className='h-screen w-full flex flex-row justify-center items-center'>
      <div className='h-1/2 w-3/4 flex flex-col justify-center items-center'>
        <p className='text-center text-[60px] text-rojo-mate'>
          Sistema de Información
        </p>
        <p className='text-center text-[60px] text-rojo-mate'>
          Académica Virtual
        </p>
      </div>
      <div className='h-5/6 w-[3px] border-2 border-l-gris-intermedio border-y-0 border-r-0'></div>
      <div className='h-5/6 w-1/4 flex flex-col justify-center items-center'>
        <p className='text-subtitulos mb-16 text-rojo-mate'>Inicia sesión</p>

        <a className='border-black/15 hover:bg-black/5 duration-150 border rounded-md py-2 px-4 w-fit flex justify-center items-center gap-2'
          href={url}>
          <FcGoogle className='text-[20px] mr-2' />
          Iniciar Sesión con Google
        </a>

      </div>
    </div>
  )
}

export default Login
