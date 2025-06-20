import { useState, useEffect, useRef } from 'react'
import {
  Eye,
  Check,
  Pencil,
  Upload,
  FileText,
  X,
  CheckCircle,
  FileCheck
} from 'lucide-react'
import TablaEstados from '../../components/TablaEstados'
import Boton from '../../components/Boton'
import Modal from '../../components/Modal'
import AlertaModal from '../../components/AlertaModal'
import {
  Textarea,
  Divider,
  Form,
  Autocomplete,
  AutocompleteItem
} from '@heroui/react'
import { useNavigate } from 'react-router-dom'

const Reintegros = () => {
  const navigate = useNavigate()
  // Estados para manejar los datos y modales
  const [informacion, setInformacion] = useState([])
  const [cargandoReintegros, setCargandoReintegros] = useState(true)
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [currentSolicitud, setCurrentSolicitud] = useState(null)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Estados para archivo en modal de aprobación
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState(null)
  const [approving, setApproving] = useState(false)
  const fileInputRef = useRef(null)

  // Estados para el formulario de registro
  const [estudiantes, setEstudiantes] = useState([])
  const [estudianteId, setEstudianteId] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [creando, setCreando] = useState(false)

  // Estados para el formulario de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editSolicitudId, setEditSolicitudId] = useState(null)
  const [editDescripcion, setEditDescripcion] = useState('')
  const [editEstudianteId, setEditEstudianteId] = useState('')
  const [editando, setEditando] = useState(false)

  // Estados para AlertaModal
  const [alertaModalOpen, setAlertaModalOpen] = useState(false)
  const [alertaMessage, setAlertaMessage] = useState('')
  const [alertaType, setAlertaType] = useState('success')
  const [alertaTitulo, setAlertaTitulo] = useState('')

  // Función para mostrar alerta
  const showAlerta = (mensaje, tipo, titulo) => {
    setAlertaMessage(mensaje)
    setAlertaType(tipo)
    setAlertaTitulo(
      titulo || (tipo === 'success' ? 'Operación exitosa' : 'Error')
    )
    setAlertaModalOpen(true)
  }

  // Cargar las solicitudes al iniciar el componente
  useEffect(() => {
    fetchSolicitudes()
  }, [])

  // Función para obtener todas las solicitudes de reintegro
  const fetchSolicitudes = () => {
    setCargandoReintegros(true)
    fetch(`${backendUrl}/reintegro`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las solicitudes')
        }
        return response.json()
      })
      .then((data) => {
        const datosTabla = data.map((solicitud) => ({
          Id: solicitud.id,
          Estudiante: solicitud.estudianteNombre,
          'Semestre Reintegro': solicitud.semestreReintegro,
          Semestre: solicitud.semestre,
          'Fecha de Creación': new Date(
            solicitud.fechaCreacion
          ).toLocaleDateString(),
          Estado: solicitud.estaAprobado ? 'Aprobado' : 'Pendiente',
          // Guardamos el campo de estado booleano para usar con TablaEstados
          estaAprobado: solicitud.estaAprobado || false,
          // Guardamos otros campos que necesitaremos luego
          estudianteId: solicitud.estudianteId,
          descripcion: solicitud.descripcion,
          tipoSolicitudId: solicitud.tipoSolicitudId,
          fechaCreacion: solicitud.fechaCreacion,
          'Semestre Inicio Aplazamiento': solicitud.semestreAplazamiento
        }))
        setInformacion(datosTabla)
      })
      .catch(() => {
        showAlerta(
          'Error al cargar las solicitudes de reintegro',
          'error',
          'Error de conexión'
        )
      })
      .finally(() => {
        setCargandoReintegros(false)
      })
  }

  // Ver detalles de una solicitud
  const handleViewSolicitud = (solicitud) => {
    navigate(`/reintegros/${solicitud.Id}`)
  }

  // Editar una solicitud
  const handleEditSolicitud = (solicitud) => {
    setEditSolicitudId(solicitud.Id)
    setEditDescripcion(solicitud.descripcion || '')
    setEditEstudianteId(solicitud.estudianteId?.toString() || '')
    cargarEstudiantes()
    setIsEditModalOpen(true)
  }

  // Aprobar una solicitud
  const handleAprobarSolicitud = (solicitud) => {
    setCurrentSolicitud(solicitud)
    setIsApproveModalOpen(true)
  }

  // Abrir modal para registrar nueva solicitud
  const handleOpenRegisterModal = () => {
    cargarEstudiantes()
    setIsRegisterModalOpen(true)
  }

  // Función para manejar el cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFileError(null)

    // Validar tipo de archivo (PDF o DOCX)
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (!validTypes.includes(file.type)) {
      setFileError('Solo se permiten archivos PDF o DOCX')
      setSelectedFile(null)
      setFileName('')
      return
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setFileError('El archivo no debe exceder los 10MB')
      setSelectedFile(null)
      setFileName('')
      return
    }

    setSelectedFile(file)
    setFileName(file.name)
  }

  // Función para abrir el selector de archivos
  const openFileSelector = () => {
    fileInputRef.current.click()
  }

  // Función para previsualizar el archivo seleccionado
  const previewSelectedFile = () => {
    if (!selectedFile) return

    const fileUrl = URL.createObjectURL(selectedFile)

    window.open(fileUrl, '_blank')
  }

  // Función para enviar la aprobación al backend
  const submitAprobarReintegro = async () => {
    if (!selectedFile) {
      setFileError('Debe seleccionar un archivo para aprobar el reintegro')
      return
    }

    setApproving(true)
    setFileError(null)

    const formData = new FormData()
    formData.append('informe', selectedFile)
    const userStorage = JSON.parse(localStorage.getItem('userInfo'))
    const nombreUsuario =
      userStorage && userStorage.nombre
        ? userStorage.nombre
        : 'Usuario no identificado'

    try {
      const response = await fetch(
        `${backendUrl}/reintegro/aprobar/${currentSolicitud.Id}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'X-Usuario': nombreUsuario
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al aprobar el reintegro')
      }

      // Actualizar datos después de aprobar
      fetchSolicitudes()
      setIsApproveModalOpen(false)
      setSelectedFile(null)
      setFileName('')
      showAlerta(
        data.mensaje || 'Solicitud de reintegro aprobada con éxito',
        'success',
        'Reintegro aprobado'
      )
    } catch (err) {
      setFileError(err.message)
      showAlerta(err.message, 'error', 'Error al aprobar')
    } finally {
      setApproving(false)
    }
  }

  // Cargar estudiantes inactivos (estado 2 = 'Inactivo')
  const cargarEstudiantes = async () => {
    try {
      const response = await fetch(`${backendUrl}/estudiantes/listar/estado/2`)
      if (!response.ok) {
        throw new Error('Error al cargar estudiantes')
      }
      const data = await response.json()
      setEstudiantes(data)
    } catch (error) {
      showAlerta(
        'Error al cargar la lista de estudiantes',
        'error',
        'Error de conexión'
      )
    }
  }

  // Función para crear la solicitud de reintegro
  const crearSolicitudReintegro = async (e) => {
    e.preventDefault()

    if (!estudianteId) {
      showAlerta('Debe seleccionar un estudiante', 'error', 'Campo requerido')
      return
    }

    if (!descripcion.trim()) {
      showAlerta(
        'Debe ingresar una descripción o motivo',
        'error',
        'Campo requerido'
      )
      return
    }

    setCreando(true)

    const solicitudDTO = {
      descripcion: descripcion,
      estudianteId: parseInt(estudianteId)
    }

    try {
      const response = await fetch(`${backendUrl}/reintegro/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(solicitudDTO)
      })

      // Leemos la respuesta del servidor
      const data = await response.json().catch(() => ({
        mensaje: response.ok
          ? 'Solicitud de reintegro creada con éxito'
          : 'Error al crear la solicitud'
      }))

      if (!response.ok) {
        // Si la respuesta no es exitosa, extraemos el mensaje de error
        const errorMessage =
          data.mensaje ||
          data.message ||
          data.error ||
          'Error al crear la solicitud de reintegro'
        throw new Error(errorMessage)
      }

      // Limpiar formulario y cerrar modal
      limpiarFormularioRegistro()
      setIsRegisterModalOpen(false)
      fetchSolicitudes() // Actualizar tabla de solicitudes
      showAlerta(
        data.mensaje || 'Solicitud de reintegro creada con éxito',
        'success',
        'Reintegro registrado'
      )
    } catch (error) {
      // Mostrar el mensaje de error que viene del backend
      showAlerta(error.message, 'error', 'Error al crear reintegro')
    } finally {
      setCreando(false)
    }
  }

  // Función para limpiar el formulario
  const limpiarFormularioRegistro = () => {
    setEstudianteId('')
    setDescripcion('')
  }

  // Función para limpiar el formulario de edición
  const limpiarFormularioEdicion = () => {
    setEditSolicitudId(null)
    setEditDescripcion('')
    setEditEstudianteId('')
  }

  // Función para actualizar la solicitud de reintegro
  const actualizarSolicitudReintegro = async (e) => {
    e.preventDefault()

    if (!editEstudianteId) {
      showAlerta('Debe seleccionar un estudiante', 'error', 'Campo requerido')
      return
    }

    if (!editDescripcion.trim()) {
      showAlerta(
        'Debe ingresar una descripción o motivo',
        'error',
        'Campo requerido'
      )
      return
    }

    setEditando(true)

    const solicitudDTO = {
      id: editSolicitudId,
      descripcion: editDescripcion,
      estudianteId: parseInt(editEstudianteId)
    }

    try {
      const response = await fetch(
        `${backendUrl}/reintegro/actualizar/${editSolicitudId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(solicitudDTO)
        }
      )

      // Leemos la respuesta del servidor
      const data = await response.json().catch(() => ({
        mensaje: response.ok
          ? 'Solicitud de reintegro actualizada con éxito'
          : 'Error al actualizar la solicitud'
      }))

      if (!response.ok) {
        // Si la respuesta no es exitosa, extraemos el mensaje de error
        const errorMessage =
          data.mensaje ||
          data.message ||
          data.error ||
          'Error al actualizar la solicitud de reintegro'
        throw new Error(errorMessage)
      }

      // Limpiar formulario y cerrar modal
      limpiarFormularioEdicion()
      setIsEditModalOpen(false)
      fetchSolicitudes() // Actualizar tabla de solicitudes
      showAlerta(
        data.mensaje || 'Solicitud de reintegro actualizada con éxito',
        'success',
        'Reintegro actualizado'
      )
    } catch (error) {
      // Mostrar el mensaje de error que viene del backend en el AlertaModal en lugar de en el texto del formulario
      showAlerta(error.message, 'error', 'Error al actualizar reintegro')
    } finally {
      setEditando(false)
    }
  }

  // Columnas y filtros para la tabla
  const columnas = [
    'Id',
    'Estudiante',
    'Semestre Inicio Aplazamiento',
    'Fecha de Creación',
    'Semestre Reintegro',
    'Estado'
  ]
  const filtros = ['Estudiante', 'Semestre Reintegro', 'Estado']

  // Definir acciones según el estado de aprobación (true/false)
  const accionesPorEstado = {
    // No aprobado (false) - Ver, Editar y Aprobar
    false: [
      {
        icono: <Eye size={18} />,
        tooltip: 'Ver detalles',
        accion: handleViewSolicitud
      },
      {
        icono: <Pencil size={18} />,
        tooltip: 'Editar solicitud',
        accion: handleEditSolicitud
      },
      {
        icono: <Check size={18} />,
        tooltip: 'Aprobar solicitud',
        accion: handleAprobarSolicitud
      }
    ],
    // Aprobado (true) - Solo Ver
    true: [
      {
        icono: <Eye size={18} />,
        tooltip: 'Ver detalles',
        accion: handleViewSolicitud
      }
    ]
  }

  return (
    <div className='w-full p-4'>
      <div className='w-full flex items-center justify-between mb-8'>
        <p className='text-center text-titulos flex-1'>
          Reintegro de Estudiantes
        </p>
        <Boton onClick={handleOpenRegisterModal} color='danger'>
          Registrar Reintegro
        </Boton>
      </div>

      {/* Tabla de solicitudes con TablaEstados */}
      <TablaEstados
        informacion={informacion}
        columnas={columnas}
        filtros={filtros}
        accionesPorEstado={accionesPorEstado}
        campoEstado='estaAprobado'
        elementosPorPagina={10}
        cargandoContenido={cargandoReintegros}
      />

      {/* Modal para aprobar solicitud */}
      <Modal
        isOpen={isApproveModalOpen}
        onOpenChange={(open) => {
          if (!approving) setIsApproveModalOpen(open)
        }}
        cabecera=''
        size='xl'
        cuerpo={
          <div>
            <div className='flex flex-col gap-1 text-center mb-6'>
              <p className='text-2xl font-semibold text-titulos'>
                Aprobar Solicitud de Reintegro
              </p>
            </div>

            {currentSolicitud && (
              <p>
                ¿Está seguro que desea aprobar la solicitud de reintegro para el
                estudiante {currentSolicitud.Estudiante}?
              </p>
            )}
            <p className='mt-2 mb-1'>
              Esta acción aprobará el reintegro para el semestre{' '}
              {currentSolicitud?.['Semestre Reintegro']}, habilitará al
              estudiante para matricular materias y cambiará el estado del
              estudiante a En curso.
            </p>

            <p className='text-normal mt-6 mb-2'>
              Documento de Soporte (PDF o DOCX)
            </p>
            <Divider className='mb-4' />

            <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative'>
              <input
                type='file'
                ref={fileInputRef}
                className='hidden'
                onChange={handleFileChange}
                accept='.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              />

              {fileName ? (
                <div className='flex flex-col'>
                  <div className='flex items-center justify-center'>
                    <div className='flex-grow text-left'>
                      <div className='flex items-center'>
                        <FileText className='text-rojo-institucional mr-2' />
                        <p className='font-medium'>{fileName}</p>
                      </div>
                    </div>
                    <button
                      className='ml-2 p-1 bg-gray-200 rounded-full'
                      onClick={() => {
                        setSelectedFile(null)
                        setFileName('')
                      }}
                      disabled={approving}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className='flex justify-center mt-4'>
                    <Boton
                      onClick={previewSelectedFile}
                      variant='bordered'
                      color='primary'
                      startContent={<FileCheck size={18} />}
                      disabled={!selectedFile}
                    >
                      Previsualizar Documento
                    </Boton>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className='h-12 w-12 text-gray-400 mx-auto mb-2' />
                  <p className='text-sm text-gray-500 mb-1'>
                    Haga clic para cargar o arrastre y suelte
                  </p>
                  <p className='text-xs text-gray-400'>
                    PDF o DOCX (MÁX. 10MB)
                  </p>
                  <button
                    onClick={openFileSelector}
                    className='mt-4 py-1.5 px-4 border border-rojo-institucional text-rojo-institucional rounded-md hover:bg-rojo-institucional hover:text-white transition-colors'
                    disabled={approving}
                  >
                    Seleccionar archivo
                  </button>
                </>
              )}
            </div>

            {fileError && (
              <p className='text-red-600 mt-2 text-sm'>{fileError}</p>
            )}
          </div>
        }
        footer={
          <div className='flex justify-end w-full'>
            <Boton
              color='success'
              onClick={submitAprobarReintegro}
              disabled={approving || !selectedFile}
              startContent={approving ? null : <CheckCircle size={18} />}
            >
              {approving ? 'Aprobando...' : 'Aprobar'}
            </Boton>
          </div>
        }
      />

      {/* Modal para registrar nuevo reintegro */}
      <Modal
        isOpen={isRegisterModalOpen}
        onOpenChange={(open) => {
          setIsRegisterModalOpen(open)
          if (!open) {
            limpiarFormularioRegistro()
          }
        }}
        cabecera='Registrar Reintegro de Estudiante'
        size='xl'
        cuerpo={
          <Form
            className='flex flex-col gap-4'
            onSubmit={crearSolicitudReintegro}
          >
            <div className='w-full py-4'>
              <Autocomplete
                variant='bordered'
                className='w-full'
                defaultItems={estudiantes}
                selectedKey={estudianteId}
                label='Estudiante'
                size='md'
                placeholder='Selecciona el estudiante'
                labelPlacement='outside'
                isRequired
                onSelectionChange={(id) => {
                  setEstudianteId(id || '')
                }}
              >
                {(estudiante) => (
                  <AutocompleteItem key={estudiante.id.toString()}>
                    {`${estudiante.nombre || ''} ${estudiante.nombre2 || ''} ${estudiante.apellido || ''} ${estudiante.apellido2 || ''} - ${estudiante.codigo || ''}`}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <div className='w-full'>
              <p className='font-medium mb-2'>Motivo de la Solicitud</p>
              <Textarea
                classNames={{
                  inputWrapper:
                    'border border-gris-institucional rounded-[15px] w-full'
                }}
                placeholder='Ingrese el motivo detallado para el reintegro del estudiante'
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                minRows={4}
                isRequired
              />
            </div>

            <div className='w-full flex justify-end mb-[-20px]'>
              <Boton type={'submit'} disabled={creando}>
                {creando ? 'Creando...' : 'Registrar Reintegro'}
              </Boton>
            </div>
          </Form>
        }
      />

      {/* Modal para editar solicitud de reintegro */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) {
            limpiarFormularioEdicion()
          }
        }}
        cabecera='Editar Solicitud de Reintegro'
        size='xl'
        cuerpo={
          <Form
            className='flex flex-col gap-4'
            onSubmit={actualizarSolicitudReintegro}
          >
            <div className='w-full py-4'>
              <Autocomplete
                variant='bordered'
                className='w-full'
                defaultItems={estudiantes}
                selectedKey={editEstudianteId}
                label='Estudiante'
                size='md'
                placeholder='Selecciona el estudiante'
                labelPlacement='outside'
                isRequired
                onSelectionChange={(id) => {
                  setEditEstudianteId(id || '')
                }}
              >
                {(estudiante) => (
                  <AutocompleteItem key={estudiante.id.toString()}>
                    {`${estudiante.nombre || ''} ${estudiante.nombre2 || ''} ${estudiante.apellido || ''} ${estudiante.apellido2 || ''} - ${estudiante.codigo || ''}`}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <div className='w-full'>
              <p className='font-medium mb-2'>Motivo de la Solicitud</p>
              <Textarea
                classNames={{
                  inputWrapper:
                    'border border-gris-institucional rounded-[15px] w-full'
                }}
                placeholder='Ingrese el motivo detallado para el reintegro del estudiante'
                value={editDescripcion}
                onChange={(e) => setEditDescripcion(e.target.value)}
                minRows={4}
                isRequired
              />
            </div>

            <div className='w-full flex justify-end mb-[-20px]'>
              <Boton type='submit' color='success' disabled={editando}>
                {editando ? 'Actualizando...' : 'Actualizar Reintegro'}
              </Boton>
            </div>
          </Form>
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

export default Reintegros
