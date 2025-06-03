import React from 'react'
import { Form } from '@heroui/form'
import { Input } from '@heroui/react'
import { useState } from 'react'
import { Mail } from 'lucide-react'
import { LockKeyhole } from 'lucide-react'
import { Eye } from 'lucide-react'
import { EyeOff } from 'lucide-react'
import Boton from '../../components/Boton'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import AlertaModal from '../../components/AlertaModal'
import Modal from '../../components/Modal'

const LoginAdmin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const Navigate = useNavigate()
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Estados para el AlertaModal 
  const [alertaOpen, setAlertaOpen] = useState(false)
  const [alertaMensaje, setAlertaMensaje] = useState('')
  const [alertaTitulo, setAlertaTitulo] = useState('')
  const [alertaTipo, setAlertaTipo] = useState('error')

  // Estados para el Modal de recuperación de contraseña
  const [recuperarPasswordOpen, setRecuperarPasswordOpen] = useState(false)
  const [emailRecuperacion, setEmailRecuperacion] = useState('')
  const [enviandoRecuperacion, setEnviandoRecuperacion] = useState(false)

  // Función para mostrar la alerta modal
  const mostrarAlerta = (mensaje, titulo = 'Alerta', tipo = 'error') => {
    setAlertaMensaje(mensaje)
    setAlertaTitulo(titulo)
    setAlertaTipo(tipo)
    setAlertaOpen(true)
  }

  // Función para mostrar la alerta modal de error
  const mostrarAlertaError = (mensaje, titulo = 'Error de autenticación') => {
    mostrarAlerta(mensaje, titulo, 'error')
  }

  // Función para enviar el correo de recuperación de contraseña
  const enviarSolicitudRecuperacion = async () => {
    if (!emailRecuperacion || !emailRecuperacion.trim()) {
      mostrarAlertaError('Debe ingresar un correo electrónico válido')
      return
    }

    setEnviandoRecuperacion(true)

    try {
      const response = await fetch(`${backendUrl}/auth/recuperar-password/${emailRecuperacion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || responseData.mensaje || 'Error al enviar la solicitud')
      }

      // Cerrar el modal de recuperación
      setRecuperarPasswordOpen(false)
      // Mostrar alerta de éxito
      mostrarAlerta(
        responseData.message || 'Se le ha enviado un correo con instrucciones para restablecer su contraseña',
        'Recuperación de contraseña',
        'success'
      )
      // Limpiar el campo de correo
      setEmailRecuperacion('')
    } catch (error) {
      mostrarAlertaError(error.message || 'Error al enviar la solicitud de recuperación')
    } finally {
      setEnviandoRecuperacion(false)
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    const data = {
      email: email,
      password: password
    }

    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || responseData.mensaje || 'Error al iniciar sesión')
      }

      // Almacenar los tokens
      localStorage.setItem('accessToken', responseData.accessToken)
      localStorage.setItem('refreshToken', responseData.refreshToken)

      // Decodificar el token para obtener información del usuario
      const decodedToken = jwtDecode(responseData.accessToken)

      const primerNombre = decodedToken.primerNombre || '';
      const segundoNombre = decodedToken.segundoNombre || '';
      const primerApellido = decodedToken.primerApellido || '';
      const segundoApellido = decodedToken.segundoApellido || '';

      const nombreCompleto = `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`.replace(/\s+/g, ' ').trim();

      // Guardar información del usuario en localStorage
      localStorage.setItem('userInfo', JSON.stringify({
        nombre: nombreCompleto,
        rol: decodedToken.role,
        email: decodedToken.sub
      }))

      // En caso de éxito, navegar directamente sin mostrar alerta
      Navigate('/academico/programas')

    } catch (error) {
      // Mostrar el mensaje de error en el AlertaModal
      mostrarAlertaError(error.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    await handleLogin()
  }

  // Contenido del modal de recuperación de contraseña
  const cuerpoModalRecuperacion = (
    <div className="flex flex-col space-y-4">
      <p className="text-center">
        Ingresa tu correo electrónico para recibir instrucciones sobre cómo restablecer tu contraseña.
      </p>
      <Input
        classNames={{
          inputWrapper: 'border border-gris-institucional rounded-[15px] w-full'
        }}
        isRequired
        placeholder="Ingrese su correo electrónico"
        type="email"
        value={emailRecuperacion}
        onValueChange={setEmailRecuperacion}
        endContent={<Mail />}
        disabled={enviandoRecuperacion}
      />
    </div>
  )

  const footerModalRecuperacion = (
    <Boton
      onClick={enviarSolicitudRecuperacion}
      disabled={enviandoRecuperacion}
    >
      {enviandoRecuperacion ? "Enviando..." : "Enviar"}
    </Boton>
  )

  return (
    <div className='flex items-center justify-center h-screen w-full bg-gris-intermedio'>
      <div className='w-1/2 h-3/5 bg-blanco rounded-[15px] flex flex-col items-center p-8'>
        <p className='text-titulos text-rojo-institucional'>Iniciar sesión</p>
        <Form
          onSubmit={onSubmit}
          className='flex flex-col w-full items-center my-4 space-y-10'
        >
          <Input
            classNames={{
              base: 'w-3/5',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full'
            }}
            isRequired
            label='Correo electrónico'
            labelPlacement='outside'
            name='email'
            type='email'
            value={email}
            onValueChange={setEmail}
            endContent={<Mail />}
            disabled={loading}
          />
          <Input
            classNames={{
              base: 'w-3/5',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full'
            }}
            isRequired
            label='Contraseña'
            labelPlacement='outside'
            name='password'
            value={password}
            onValueChange={setPassword}
            endContent={
              <button
                type='button'
                className='focus:outline-none'
                onClick={() => setVisible(!visible)}
              >
                {password ? visible ? <EyeOff /> : <Eye /> : <LockKeyhole />}
              </button>
            }
            type={visible ? 'text' : 'password'}
            disabled={loading}
          />

          {/* Contenedor que agrupa el botón de inicio y el enlace de recuperación */}
          <div className="flex flex-col items-center w-3/5 space-y-2">
            <Boton type='submit' w='100%' disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Boton>

            {/* Enlace para recuperar contraseña */}
            <button
              type="button"
              onClick={() => setRecuperarPasswordOpen(true)}
              className="text-rojo-institucional hover:underline text-sm mt-1"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </Form>
      </div>

      {/* Componente AlertaModal para mostrar mensajes */}
      <AlertaModal
        isOpen={alertaOpen}
        onClose={() => setAlertaOpen(false)}
        message={alertaMensaje}
        type={alertaTipo}
        titulo={alertaTitulo}
      />

      {/* Modal para recuperación de contraseña */}
      <Modal
        isOpen={recuperarPasswordOpen}
        onOpenChange={() => setRecuperarPasswordOpen(!recuperarPasswordOpen)}
        cabecera="Recuperar Contraseña"
        cuerpo={cuerpoModalRecuperacion}
        footer={footerModalRecuperacion}
        size="md"
      />
    </div>
  )
}

export default LoginAdmin