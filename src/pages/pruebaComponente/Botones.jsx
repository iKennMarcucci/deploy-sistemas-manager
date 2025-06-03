import React from 'react'
import Boton from '../../components/Boton'
import { User } from 'lucide-react'

const Botones = () => {
  return (
    <div className='flex flex-row w-2/5 mx-auto'>
      {/* Botones Primarios (Rojos) */}
      <div className='flex items-center flex-col justify-center h-screen w-1/2'>
        <div className='flex flex-col items-center space-y-1'>
          <p>Botón normal</p>
          <Boton>Prueba</Boton>
        </div>
        <div className='flex flex-col items-center mt-4 space-y-1'>
          <p>Botón con icono al principio</p>
          <Boton startContent={<User />}>Prueba</Boton>
        </div>
        <div className='flex flex-col items-center mt-4 space-y-1'>
          <p>Botón con icono al final</p>
          <Boton endContent={<User />}>Prueba</Boton>
        </div>
        <div className='flex flex-col items-center mt-4 space-y-1'>
          <p>Botón con sólo ícono</p>
          <Boton isIconOnly>
            <User />
          </Boton>
        </div>
        <div className='flex flex-col items-center mt-4 space-y-1'>
          <p>Botón deshabilitado</p>
          <Boton disabled>Prueba</Boton>
        </div>
        <div className='flex flex-col items-center mt-4 space-y-1'>
          <p>Botón variante light</p>
          <Boton variant={'light'}>Prueba</Boton>
        </div>
        <div className='flex flex-col items-center mt-4 space-y-1'>
          <p>Botón variante bordered</p>
          <Boton variant={'bordered'}>Prueba</Boton>
        </div>
      </div>
      {/* Botones confirmados (verdes) */}
      <div className='flex items-center flex-col justify-center h-screen w-1/2'>
        <div className='flex flex-col items-center space-y-1'>
          <p>Botón normal</p>
          <Boton success>Prueba</Boton>
        </div>
        <div className='flex flex-col items-center mt-4 space-y-1'>
          <p>Botón con icono al principio</p>
          <Boton startContent={<User />} success>
            Prueba
          </Boton>
        </div>
        <div className='flex flex-col items-center mt-4 space-y-1'>
          <p>Botón con icono al final</p>
          <Boton endContent={<User />} success>
            Prueba
          </Boton>
        </div>
        <div className='flex flex-col items-center mt-4 space-y-1'>
          <p>Botón con sólo ícono</p>
          <Boton isIconOnly success>
            <User />
          </Boton>
        </div>
        <div className='flex flex-col items-center mt-4 space-y-1'>
          <p>Botón deshabilitado</p>
          <Boton disabled success>
            Prueba
          </Boton>
        </div>
        <div className='flex flex-col items-center mt-4 space-y-1'>
          <p>Botón variante light</p>
          <Boton variant={'light'} success>
            Prueba
          </Boton>
        </div>
        <div className='flex flex-col items-center mt-4 space-y-1'>
          <p>Botón variante bordered</p>
          <Boton variant={'bordered'} success>
            Prueba
          </Boton>
        </div>
      </div>
    </div>
  )
}

export default Botones
