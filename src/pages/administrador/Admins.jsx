import { useState, useEffect } from 'react'
import Tabla from '../../components/Tabla'
import { Button, Tooltip } from '@heroui/react'
import { Check, X } from 'lucide-react'
import AlertaModal from '../../components/AlertaModal'

const Admins = () => {
  const [admins, setAdmins] = useState([])
  const [cargandoAdmins, setCargandoAdmins] = useState(true)
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [datos, setDatos] = useState([])
  // Estados para el modal de alerta
  const [alertaOpen, setAlertaOpen] = useState(false)
  const [alertaMensaje, setAlertaMensaje] = useState('')
  const [alertaTipo, setAlertaTipo] = useState('success')
  const [refreshData, setRefreshData] = useState(false)

  // Función para mostrar alerta
  const mostrarAlerta = (mensaje, tipo = 'success') => {
    setAlertaMensaje(mensaje)
    setAlertaTipo(tipo)
    setAlertaOpen(true)
  }

  // Cargar administradores
  useEffect(() => {
    const fetchAdmins = async () => {
      setCargandoAdmins(true)
      try {
        const accessToken = localStorage.getItem('accessToken')
        const response = await fetch(`${backendUrl}/auth/admins`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (!response.ok) {
          throw new Error('Error al obtener los administradores')
        }

        const data = await response.json()
        setAdmins(data)
      } catch (error) {
        console.error(error)
        mostrarAlerta(
          error.message || 'Error al cargar los administradores',
          'error'
        )
      } finally {
        setCargandoAdmins(false)
      }
    }

    fetchAdmins()
  }, [refreshData])

  // Función para activar un administrador
  const activarAdmin = async (id) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await fetch(`${backendUrl}/auth/admins/${id}/activar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al activar administrador')
      }

      mostrarAlerta(data.message || 'Administrador activado con éxito')
      setRefreshData(!refreshData)
    } catch (error) {
      console.error(error)
      mostrarAlerta(error.message || 'Error al activar administrador', 'error')
    }
  }

  // Función para desactivar un administrador
  const desactivarAdmin = async (id) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await fetch(
        `${backendUrl}/auth/admins/${id}/desactivar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al desactivar administrador')
      }

      mostrarAlerta(data.message || 'Administrador desactivado con éxito')
      setRefreshData(!refreshData)
    } catch (error) {
      console.error(error)
      mostrarAlerta(
        error.message || 'Error al desactivar administrador',
        'error'
      )
    }
  }

  useEffect(() => {
    if (admins && admins.length > 0) {
      const respuesta = admins.map((admin) => ({
        Id: admin.id,
        Nombre:
          `${admin.primerNombre || ''} ${admin.segundoNombre || ''} ${admin.primerApellido || ''} ${admin.segundoApellido || ''}`.trim(),
        Correo: admin.email,
        Superadmin: admin.esSuperAdmin ? 'SÍ' : 'NO',
        Estado: admin.activo ? 'Activo' : 'Inactivo',
        Acciones: (
          <div className='flex space-x-2 justify-center'>
            {admin.activo ? (
              <Tooltip content='Desactivar'>
                <Button
                  isDisabled={admin.esSuperAdmin} // No permitir desactivar superadmin
                  isIconOnly
                  color='danger'
                  className='bg-rojo-institucional text-white hover:bg-rojo-mate'
                  onClick={() => desactivarAdmin(admin.id)}
                  aria-label='Desactivar'
                >
                  <X size={20} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip content='Activar'>
                <Button
                  isIconOnly
                  color='danger'
                  className='bg-rojo-institucional text-white hover:bg-rojo-mate'
                  onClick={() => activarAdmin(admin.id)}
                  aria-label='Activar'
                >
                  <Check size={20} />
                </Button>
              </Tooltip>
            )}
          </div>
        )
      }))

      setDatos(respuesta)
    }
  }, [admins])

  const columnas = [
    'Id',
    'Nombre',
    'Correo',
    'Superadmin',
    'Estado',
    'Acciones'
  ]

  return (
    <div className='flex flex-col items-center w-full p-4'>
      <p className='text-titulos my-4'>Lista de administradores</p>
      <div className='w-full my-8'>
        <Tabla
          informacion={datos}
          columnas={columnas}
          cargandoContenido={cargandoAdmins}
        />
      </div>

      <AlertaModal
        isOpen={alertaOpen}
        onClose={() => setAlertaOpen(false)}
        message={alertaMensaje}
        type={alertaTipo}
        titulo={alertaTipo === 'success' ? 'Operación Exitosa' : 'Error'}
      />
    </div>
  )
}

export default Admins
