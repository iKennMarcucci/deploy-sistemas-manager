import React from 'react'
import { Form, Input, Divider } from '@heroui/react'
import { useState } from 'react'
import Boton from '../../components/Boton'

const CrearUsuario = () => {
  const [primerNombre, setPrimerNombre] = useState('')
  const [segundoNombre, setSegundoNombre] = useState('')
  const [primerApellido, setPrimerApellido] = useState('')
  const [segundoApellido, setSegundoApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

    alert(
      'Usuario creado correctamente' +
        '\n' +
        JSON.stringify({
          primerNombre,
          segundoNombre,
          primerApellido,
          segundoApellido,
          correo,
          telefono,
          direccion
        })
    )
  }

  return (
    <div className='flex flex-col w-full items-center p-4'>
      <p className='text-center text-titulos'>Creación del usuario</p>
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
        <p className='text-normal mt-8'>Información de contacto</p>
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
              label='Teléfono'
              labelPlacement='outside-left'
              name='telefono'
              placeholder='Ingresa tu número telefónico'
              type='text'
              value={telefono}
              onValueChange={(value) => setTelefono(value)}
              required
            />
          </div>
          <div className='w-1/2 flex flex-row'>
            <Input
              classNames={{
                label: `w-1/5 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-1/2 '
              }}
              isRequired
              label='Dirección de residencia'
              labelPlacement='outside-left'
              name='direccion'
              placeholder='Ingresa la dirección de residencia'
              type='text'
              value={direccion}
              onValueChange={(value) => setDireccion(value)}
            />
          </div>
        </div>
        <div className='mt-4 w-full flex justify-end'>
          <Boton type={'submit'}>Crear usuario</Boton>
        </div>
      </Form>
    </div>
  )
}

export default CrearUsuario
