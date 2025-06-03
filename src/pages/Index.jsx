import React, { useState } from 'react'
import Boton from '../components/Boton'
import AlertaModal from '../components/AlertaModal'

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const openModal = (message) => {
    setModalMessage(message)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <div className='flex flex-col w-full h-screen items-center p-4'>
      <h1>Prueba de componentes</h1>
      <div className='flex flex-row w-full min-h-[50%]'>
        <div className='flex flex-col w-1/2'>
          <div className='flex flex-col items-center'>
            <div className='mt-4'>
              <Boton
                onClick={() =>
                  openModal('Este es un mensaje de alerta de ejemplo')
                }
                className='bg-red-500 hover:bg-red-600 text-white'
              >
                Abrir Alerta Modal
              </Boton>
            </div>
          </div>
        </div>
        <div className='flex flex-col w-1/2'></div>
      </div>

      <AlertaModal
        isOpen={modalOpen}
        onClose={closeModal}
        message={modalMessage}
        type='error'
        titulo='Alerta'
      />
    </div>
  )
}

export default Index
