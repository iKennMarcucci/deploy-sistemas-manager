import { useState, useEffect } from 'react'
import Tabla from '../../components/Tabla'
import { Pencil, Eye } from 'lucide-react'
import Modal from '../../components/Modal'
import Boton from '../../components/Boton'
import AlertaModal from '../../components/AlertaModal'
import { Input } from '@heroui/react'

const Cohortes = () => {
  const [informacion, setInformacion] = useState([])
  const [selectedCohorte, setSelectedCohorte] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({ nombre: '' })
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [cohorteDetails, setCohorteDetails] = useState(null)
  // Nuevos estados para la creación de cohorte
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createFormData, setCreateFormData] = useState({ nombre: '' })

  // Estados para AlertaModal
  const [alertaModalOpen, setAlertaModalOpen] = useState(false)
  const [alertaMessage, setAlertaMessage] = useState('')
  const [alertaType, setAlertaType] = useState('success')
  const [alertaTitulo, setAlertaTitulo] = useState('')

  const [cargandoCohortes, setCargandoCohortes] = useState(true)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Función para mostrar alerta
  const showAlerta = (mensaje, tipo, titulo) => {
    setAlertaMessage(mensaje)
    setAlertaType(tipo)
    setAlertaTitulo(
      titulo || (tipo === 'success' ? 'Operación exitosa' : 'Error')
    )
    setAlertaModalOpen(true)
  }

  // Obtener todas las cohortes
  useEffect(() => {
    fetchCohortes()
  }, [])

  const fetchCohortes = () => {
    setCargandoCohortes(true)
    fetch(`${backendUrl}/cohortes/listar`)
      .then((response) => response.json())
      .then((data) => {
        const datosTabla = data.map((cohorte) => ({
          ...cohorte,
          Id: cohorte.id,
          Nombre: cohorte.nombre,
          'Fecha de creación': new Date(
            cohorte.fechaCreacion
          ).toLocaleDateString()
        }))
        setInformacion(datosTabla)
      })
      .catch(() => {
        showAlerta(
          'Error al cargar la lista de cohortes',
          'error',
          'Error de conexión'
        )
      })
      .finally(() => {
        setCargandoCohortes(false)
      })
  }

  // Ver detalles de una cohorte por ID
  const handleViewCohorte = (cohorte) => {
    fetch(`${backendUrl}/cohortes/${cohorte.id}`)
      .then((response) => response.json())
      .then((data) => {
        setCohorteDetails(data)
        setIsViewModalOpen(true)
      })
      .catch(() => {
        showAlerta(
          'Error al obtener los detalles de la cohorte',
          'error',
          'Error de conexión'
        )
      })
  }

  // Editar cohorte
  const handleEditCohorte = (cohorte) => {
    setSelectedCohorte(cohorte)
    setEditFormData({ nombre: cohorte.nombre })
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = (e) => {
    // Verificar si hay un evento y si tiene el método preventDefault
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    // Crear el objeto CohorteDTO que será enviado al backend
    const cohorteDTO = {
      nombre: editFormData.nombre, // Nombre actualizado
      fechaCreacion: selectedCohorte.fechaCreacion // Mantener la fecha de creación original
    }

    fetch(`${backendUrl}/cohortes/${selectedCohorte.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cohorteDTO) // Enviar el objeto como JSON
    })
      .then((response) => {
        if (response.ok) {
          return response.json() // Parsear la respuesta si es exitosa
        } else {
          return response.json().then((data) => {
            throw new Error(data.mensaje || 'Error al actualizar la cohorte')
          })
        }
      })
      .then((data) => {
        setIsEditModalOpen(false) // Cerrar el modal de edición
        fetchCohortes() // Refrescar la lista de cohortes
        showAlerta(
          data.mensaje || 'Cohorte actualizada exitosamente',
          'success',
          'Cohorte actualizada'
        )
      })
      .catch((error) => {
        showAlerta(error.message, 'error', 'Error al actualizar')
      })
  }

  // Crear cohorte - Nueva función
  const handleCreateSubmit = () => {
    // Validar que el nombre no esté vacío
    if (!createFormData.nombre.trim()) {
      showAlerta(
        'El nombre de la cohorte es requerido',
        'error',
        'Campos incompletos'
      )
      return
    }

    // Crear el objeto CohorteDTO que será enviado al backend
    const cohorteDTO = {
      nombre: createFormData.nombre
    }

    fetch(`${backendUrl}/cohortes/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cohorteDTO)
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return response.json().then((data) => {
            throw new Error(data.mensaje || 'Error al crear la cohorte')
          })
        }
      })
      .then((data) => {
        setIsCreateModalOpen(false) // Cerrar el modal de creación
        setCreateFormData({ nombre: '' }) // Resetear el formulario
        fetchCohortes() // Refrescar la lista de cohortes
        showAlerta(
          data.mensaje || 'Cohorte creada exitosamente',
          'success',
          'Cohorte creada'
        )
      })
      .catch((error) => {
        showAlerta(error.message, 'error', 'Error al crear')
      })
  }

  // Columnas, filtros y acciones
  const columnas = ['Id', 'Nombre', 'Fecha de creación']
  const filtros = ['Nombre']
  const acciones = [
    {
      icono: <Eye size={18} />,
      tooltip: 'Ver detalles',
      accion: handleViewCohorte
    },
    {
      icono: <Pencil size={18} />,
      tooltip: 'Editar',
      accion: handleEditCohorte
    }
  ]

  return (
    <div className='w-full p-4'>
      <div className='w-full flex items-center justify-between mb-8'>
        <p className='text-center text-titulos flex-1'>Lista de Cohortes</p>
        <Boton onClick={() => setIsCreateModalOpen(true)} color='danger'>
          Crear cohorte
        </Boton>
      </div>

      {/* Tabla principal */}
      <Tabla
        informacion={informacion}
        columnas={columnas}
        filtros={filtros}
        acciones={acciones}
        elementosPorPagina={10}
        cargandoContenido={cargandoCohortes}
      />

      {/* Modal para ver detalles */}
      <Modal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        cabecera={`Detalles de la Cohorte`}
        size='5xl'
        cuerpo={
          cohorteDetails && (
            <div className='w-full flex flex-col'>
              {/* Nombre y Fecha de Creación en dos columnas */}
              <div className='w-full grid grid-cols-2 gap-4 mb-4'>
                <div>
                  <Input
                    classNames={{
                      label: `w-1/3 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                      base: 'flex items-start',
                      inputWrapper:
                        'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                      mainWrapper: 'w-full'
                    }}
                    label='Nombre'
                    labelPlacement='outside-left'
                    name='nombre'
                    type='text'
                    readOnly
                    value={cohorteDetails.nombre || ''}
                  />
                </div>
                <div>
                  <Input
                    classNames={{
                      label: `w-1/3 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                      base: 'flex items-start',
                      inputWrapper:
                        'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                      mainWrapper: 'w-full'
                    }}
                    label='Fecha de Creación'
                    labelPlacement='outside-left'
                    name='fechaCreacion'
                    type='text'
                    readOnly
                    value={new Date(
                      cohorteDetails.fechaCreacion
                    ).toLocaleDateString()}
                  />
                </div>
              </div>

              <div className='w-full mb-4'>
                <p className='font-medium mb-2'>Grupos asociados</p>
                {cohorteDetails.cohortesGrupos &&
                cohorteDetails.cohortesGrupos.length > 0 ? (
                  <div className='flex flex-row gap-4'>
                    {/* Primer grupo */}
                    <div className='w-1/2'>
                      <Input
                        classNames={{
                          label: `mb-2`,
                          base: 'flex flex-col w-full',
                          inputWrapper:
                            'border border-gris-institucional rounded-[15px] w-full max-h-[40px]'
                        }}
                        label={`Grupo A`}
                        labelPlacement='outside'
                        name='grupoA'
                        type='text'
                        readOnly
                        value={
                          cohorteDetails.cohortesGrupos[0]?.nombre ||
                          'No asignado'
                        }
                      />
                    </div>
                    {/* Segundo grupo (si existe) */}
                    <div className='w-1/2'>
                      {cohorteDetails.cohortesGrupos.length > 1 ? (
                        <Input
                          classNames={{
                            label: `mb-2`,
                            base: 'flex flex-col w-full',
                            inputWrapper:
                              'border border-gris-institucional rounded-[15px] w-full max-h-[40px]'
                          }}
                          label={`Grupo B`}
                          labelPlacement='outside'
                          name='grupoB'
                          type='text'
                          readOnly
                          value={
                            cohorteDetails.cohortesGrupos[1]?.nombre ||
                            'No asignado'
                          }
                        />
                      ) : (
                        <Input
                          classNames={{
                            label: `mb-2`,
                            base: 'flex flex-col w-full',
                            inputWrapper:
                              'border border-gris-institucional rounded-[15px] w-full max-h-[40px]'
                          }}
                          label='Grupo B'
                          labelPlacement='outside'
                          name='grupoB'
                          type='text'
                          readOnly
                          value='No asignado'
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='text-center p-4 border border-gris-institucional rounded-[15px] text-gray-500'>
                    No hay grupos asociados a esta cohorte
                  </div>
                )}
              </div>
            </div>
          )
        }
      />

      {/* Modal para editar */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        cabecera={`Editar cohorte: ${selectedCohorte?.nombre || ''}`}
        size='md'
        cuerpo={
          <form className='space-y-4'>
            <Input
              label='Nombre del cohorte'
              value={editFormData.nombre}
              onChange={(e) =>
                setEditFormData({ ...editFormData, nombre: e.target.value })
              }
              isRequired
              className='w-full'
            />
          </form>
        }
        footer={
          <Boton onClick={handleEditSubmit} color='danger'>
            Guardar cambios
          </Boton>
        }
      />

      {/* Modal para crear nueva cohorte */}
      <Modal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        cabecera='Crear nuevo cohorte'
        size='md'
        cuerpo={
          <form className='space-y-4'>
            <Input
              label='Nombre del cohorte'
              value={createFormData.nombre}
              onChange={(e) =>
                setCreateFormData({ ...createFormData, nombre: e.target.value })
              }
              placeholder='Ej: 2025-I'
              isRequired
              className='w-full'
            />
          </form>
        }
        footer={
          <Boton onClick={handleCreateSubmit} color='danger'>
            Crear cohorte
          </Boton>
        }
      />

      {/* AlertaModal para mostrar mensajes de éxito o error */}
      <AlertaModal
        isOpen={alertaModalOpen}
        onClose={() => setAlertaModalOpen(false)}
        message={alertaMessage}
        type={alertaType}
        titulo={alertaTitulo}
      />
    </div>
  )
}

export default Cohortes
