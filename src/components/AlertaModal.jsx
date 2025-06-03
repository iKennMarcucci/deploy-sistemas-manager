import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@heroui/react'
import Boton from './Boton'
import { motion } from 'framer-motion'

const AlertaModal = ({
  isOpen,
  onClose,
  message,
  type = 'success',
  titulo = 'Alerta'
}) => {
  const handleOpenChange = () => {
    onClose()
  }

  // Estilos y variantes para las animaciones
  const circleColor =
    type === 'success' ? 'bg-success' : 'bg-rojo-institucional'

  // Variantes de animación para el icono de éxito (check)
  const successIconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: [0, 1.2, 1],
      transition: {
        duration: 0.6,
        times: [0, 0.6, 1],
        ease: 'easeInOut'
      }
    }
  }

  // Variantes de animación para el icono de error (X)
  const errorIconVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      rotate: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5,
        ease: 'easeInOut'
      }
    }
  }

  // Componentes de iconos
  const SuccessIcon = () => (
    <div
      className={`flex items-center justify-center w-24 h-24 rounded-full ${circleColor} mx-auto mb-4`}
    >
      <motion.svg
        width='65'
        height='65'
        viewBox='0 0 32 32'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        variants={successIconVariants}
        initial='hidden'
        animate='visible'
      >
        <motion.path
          d='M6 16L13 23L26 9'
          stroke='white'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </motion.svg>
    </div>
  )

  const ErrorIcon = () => (
    <div
      className={`flex items-center justify-center w-24 h-24 rounded-full ${circleColor} mx-auto mb-4`}
    >
      <motion.svg
        width='65'
        height='65'
        viewBox='0 0 32 32'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        variants={errorIconVariants}
        initial='hidden'
        animate='visible'
      >
        <motion.path
          d='M8 8L24 24M8 24L24 8'
          stroke='white'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </motion.svg>
    </div>
  )

  return (
    <Modal size='xl' isOpen={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex text-center flex-col gap-1'>
              {titulo}
            </ModalHeader>
            <ModalBody className='text-center'>
              {type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
              {message}
            </ModalBody>
            <ModalFooter>
              <Boton color='primary' onClick={onClose}>
                Cerrar
              </Boton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default AlertaModal
