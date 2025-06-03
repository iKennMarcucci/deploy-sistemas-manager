import { Form, Input, Divider } from '@heroui/react'
import Boton from '../../components/Boton'
import { useState } from 'react'
import AlertaModal from '../../components/AlertaModal'

const CrearAdmin = () => {
  const [primerNombre, setPrimerNombre] = useState('')
  const [segundoNombre, setSegundoNombre] = useState('')
  const [primerApellido, setPrimerApellido] = useState('')
  const [segundoApellido, setSegundoApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Estados para el AlertaModal
  const [alertaOpen, setAlertaOpen] = useState(false)
  const [alertaMensaje, setAlertaMensaje] = useState('')
  const [alertaTipo, setAlertaTipo] = useState('success')
  const [alertaTitulo, setAlertaTitulo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const mostrarAlerta = (mensaje, tipo, titulo) => {
    setAlertaMensaje(mensaje)
    setAlertaTipo(tipo)
    setAlertaTitulo(titulo || (tipo === 'success' ? 'Operación exitosa' : 'Error'))
    setAlertaOpen(true)
  }

  const crearAdmin = async () => {
    setIsLoading(true)

    const data = {
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      email: correo,
      password: contrasena,
      esSuperAdmin: false
    }

    try {
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const responseData = await response.json()

      if (!response.ok) {
       
        throw new Error(responseData.mensaje || responseData.message || 'Error al crear el administrador')
      }

     
      mostrarAlerta(responseData.mensaje || ' Administrador registrado con exito', 'success', 'Registro exitoso')

     
      limpiarFormulario()

    } catch (error) {
     
      mostrarAlerta(error.message, 'error', 'Error de registro')
    } finally {
      setIsLoading(false)
    }
  }

  const limpiarFormulario = () => {
    setPrimerNombre('')
    setSegundoNombre('')
    setPrimerApellido('')
    setSegundoApellido('')
    setCorreo('')
    setContrasena('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    await crearAdmin()
  }

  return (
    <div className='w-full flex flex-col items-center'>
      <p className='text-titulos text-rojo-institucional'>
        Crear administrador
      </p>
      <Form className='w-full my-8 flex flex-col' onSubmit={onSubmit}>
        <p className='text-normal'>Información personal</p>
        <Divider className='mb-4' />
        <div className='w-full flex flex-col'>
          <div className='w-full flex flex-row'>
            <Input
              classNames={{
                label: `w-1/5 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-1/2 '
              }}
              className='mb-4'
              isRequired
              label='Primer nombre'
              labelPlacement='outside-left'
              name='primerNombre'
              placeholder='Ingresa tu primer nombre'
              type='text'
              value={primerNombre}
              onValueChange={(value) => setPrimerNombre(value)}
            />
            <Input
              classNames={{
                label: `w-1/5 h-[40px] flex items-center`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-1/2 '
              }}
              className='mb-4'
              label='Segundo nombre'
              labelPlacement='outside-left'
              name='segundoNombre'
              placeholder='Ingresa tu segundo nombre'
              type='text'
              value={segundoNombre}
              onValueChange={(value) => setSegundoNombre(value)}
            />
          </div>
          <div className='w-full flex flex-row'>
            <Input
              classNames={{
                label: `w-1/5 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-1/2 '
              }}
              isRequired
              label='Primer apellido'
              labelPlacement='outside-left'
              name='primerApellido'
              placeholder='Ingresa tu primer apellido'
              type='text'
              value={primerApellido}
              onValueChange={(value) => setPrimerApellido(value)}
            />

            <Input
              classNames={{
                label: `w-1/5 h-[40px] flex items-center`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-1/2 '
              }}
              label='Segundo apellido'
              labelPlacement='outside-left'
              name='segundoApellido'
              placeholder='Ingresa tu segundo apellido'
              type='text'
              value={segundoApellido}
              onValueChange={(value) => setSegundoApellido(value)}
            />
          </div>
        </div>
        <div className='w-full flex flex-row'>
          <Input
            classNames={{
              label: `w-1/5 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            className='mb-4'
            isRequired
            label='Correo electrónico'
            labelPlacement='outside-left'
            name='correo'
            placeholder='Ingresa tu correo electrónico'
            type='email'
            value={correo}
            onValueChange={(value) => setCorreo(value)}
          />
          <Input
            classNames={{
              label: `w-1/5 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            className='mb-4'
            label='Contraseña'
            labelPlacement='outside-left'
            name='contrasena'
            placeholder='Ingresa tu contraseña'
            type='password'
            value={contrasena}
            onValueChange={(value) => setContrasena(value)}
            required
          />
        </div>
        <div className='mt-4 pr-8 w-full flex justify-end'>
          <Boton
            type={'submit'}
            disabled={isLoading}
          >
            {isLoading ? 'Creando...' : 'Crear administrador'}
          </Boton>
        </div>
      </Form>

      
      <AlertaModal
        isOpen={alertaOpen}
        onClose={() => setAlertaOpen(false)}
        message={alertaMensaje}
        type={alertaTipo}
        titulo={alertaTitulo}
      />
    </div>
  )
}

export default CrearAdmin
