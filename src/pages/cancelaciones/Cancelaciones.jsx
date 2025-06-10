import { useState, useEffect, useRef } from 'react'
import {
  Eye,
  Check,
  Pencil,
  Upload,
  FileText,
  X,
  CheckCircle
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

const Cancelaciones = () => {
  const navigate = useNavigate()
  // Estados para manejar los datos y modales
  const [informacion, setInformacion] = useState([])
  const [cargandoCancelaciones, setCargandoCancelaciones] = useState(true)
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [currentSolicitud, setCurrentSolicitud] = useState(null)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Estados para el registro y edición de solicitudes
  const [estudiantes, setEstudiantes] = useState([])
  const [estudianteId, setEstudianteId] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [creando, setCreando] = useState(false)
  const [materias, setMaterias] = useState([])
  const [materiaId, setMateriaId] = useState('')

  // Estados para el formulario de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editSolicitudId, setEditSolicitudId] = useState(null)
  const [editDescripcion, setEditDescripcion] = useState('')
  const [editEstudianteId, setEditEstudianteId] = useState('')
  const [editMateriaId, setEditMateriaId] = useState('')
  const [editando, setEditando] = useState(false)

  // Estado para manejar la aprobación
  const [approving, setApproving] = useState(false)

  // Estados para manejo de archivos en el componente
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState(null)
  const fileInputRef = useRef(null)

  // Estados para el AlertaModal
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

  // Función para obtener todas las solicitudes de cancelación
  const fetchSolicitudes = () => {
    setCargandoCancelaciones(true)
    fetch(`${backendUrl}/cancelacion`)
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
          Materia: solicitud.grupoNombre?.split(' - ')[0] || 'No especificado',
          Grupo: solicitud.grupoCodigo || 'No especificado',
          Semestre: solicitud.semestre,
          'Fecha de Creación': new Date(
            solicitud.fechaCreacion
          ).toLocaleDateString(),
          Estado: solicitud.estaAprobado ? 'Aprobado' : 'Pendiente',
          // Guardamos el campo de estado booleano para usar con TablaEstados
          estaAprobado: solicitud.estaAprobado || false,
          // Guardamos otros campos que necesitaremos luego
          estudianteId: solicitud.estudianteId,
          grupoCohorteId: solicitud.grupoCohorteId,
          grupoId: solicitud.grupoId,
          descripcion: solicitud.descripcion,
          tipoSolicitudId: solicitud.tipoSolicitudId
        }))
        setInformacion(datosTabla)
      })
      .catch(() => {
        showAlerta(
          'Error al cargar las solicitudes de cancelación',
          'error',
          'Error de conexión'
        )
      })
      .finally(() => {
        setCargandoCancelaciones(false)
      })
  }

  // Ver detalles de una solicitud
  const handleViewSolicitud = (solicitud) => {
    navigate(`/cancelaciones/${solicitud.Id}`)
  }

  // Modificar la función handleEditSolicitud para que cargue correctamente la materia inicial
  const handleEditSolicitud = async (solicitud) => {
    setEditSolicitudId(solicitud.Id)
    setEditDescripcion(solicitud.descripcion || '')

    try {
      // Primero cargamos la lista de estudiantes
      await cargarEstudiantes()

      // Establecemos el ID del estudiante
      setEditEstudianteId(solicitud.estudianteId?.toString() || '')

      // Si hay un ID de estudiante en la solicitud
      if (solicitud.estudianteId) {
        // Cargar las materias de este estudiante y esperar a que se complete
        const materiasDelEstudiante = await cargarMateriasPorEstudiante(
          solicitud.estudianteId
        )

        // Establecer la materia seleccionada después de cargar las materias
        if (solicitud.grupoCohorteId && materiasDelEstudiante.length > 0) {
          // Buscar la materia correspondiente usando diferentes campos posibles
          const materiaEncontrada = materiasDelEstudiante.find((m) => {
            // Intentar con diferentes campos que podrían coincidir
            return (
              m.grupoCohorteId === solicitud.grupoCohorteId ||
              m.id === solicitud.grupoCohorteId ||
              m.grupoId === solicitud.grupoCohorteId ||
              m.matriculaId === solicitud.grupoCohorteId
            )
          })

          if (materiaEncontrada) {
            setEditMateriaId(materiaEncontrada.id?.toString() || '')
          } else {
            setEditMateriaId('')
          }
        } else {
          setEditMateriaId('')
        }
      }

      // Abrir el modal de edición después de haber cargado los datos
      setIsEditModalOpen(true)
    } catch (error) {
      showAlerta(
        'Error al preparar el formulario de edición',
        'error',
        'Error de conexión'
      )
    }
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

  // Cargar estudiantes activos (estado 1 = 'En curso')
  const cargarEstudiantes = async () => {
    try {
      const response = await fetch(`${backendUrl}/estudiantes/listar/estado/1`)
      if (!response.ok) {
        throw new Error('Error al cargar estudiantes')
      }
      const data = await response.json()
      setEstudiantes(data)
      return data
    } catch (error) {
      showAlerta(
        'Error al cargar la lista de estudiantes',
        'error',
        'Error de conexión'
      )
      return []
    }
  }

  // Modificar la función cargarMateriasPorEstudiante para asegurarnos de que retorne las materias
  const cargarMateriasPorEstudiante = async (estudianteId) => {
    try {
      const response = await fetch(
        `${backendUrl}/matriculas/estudiante/${estudianteId}`
      )
      if (!response.ok) {
        throw new Error('Error al cargar materias del estudiante')
      }
      const data = await response.json()
      // Solo considerar materias que estén en estado "En curso"
      const materiasEnCurso = data.filter(
        (matricula) => matricula.estadoMatriculaNombre === 'En curso'
      )
      // Actualizar el estado
      setMaterias(materiasEnCurso)
      return materiasEnCurso
    } catch (error) {
      showAlerta(
        'Error al cargar las materias del estudiante',
        'error',
        'Error de conexión'
      )
      setMaterias([])
      return []
    }
  }

  // Handle estudiante seleccionado (para cargar sus materias)
  const handleEstudianteChange = (id) => {
    setEstudianteId(id || '')
    if (id) {
      cargarMateriasPorEstudiante(id)
    } else {
      setMaterias([])
    }
    setMateriaId('')
  }

  // Modificar también el handleEditEstudianteChange para manejar el cambio de estudiante en edición
  const handleEditEstudianteChange = async (id) => {
    setEditEstudianteId(id || '')

    if (id) {
      try {
        // Cargar las materias del estudiante seleccionado
        const materiasDelEstudiante = await cargarMateriasPorEstudiante(id)

        // Si estamos en modo edición y el estudiante no ha cambiado, mantener la materia seleccionada
        if (editSolicitudId && informacion) {
          const solicitudActual = informacion.find(
            (sol) => sol.Id === editSolicitudId
          )
          if (
            solicitudActual &&
            solicitudActual.estudianteId.toString() === id
          ) {
            // Buscar la materia en la nueva lista cargada con múltiples criterios
            const materiaExiste = materiasDelEstudiante.find(
              (mat) =>
                mat.grupoCohorteId === solicitudActual.grupoCohorteId ||
                mat.id === solicitudActual.grupoCohorteId ||
                mat.grupoId === solicitudActual.grupoCohorteId ||
                mat.matriculaId === solicitudActual.grupoCohorteId
            )

            if (materiaExiste) {
              setEditMateriaId(materiaExiste.id?.toString() || '')
            } else {
              setEditMateriaId('')
            }
          } else {
            // Si cambió el estudiante, resetear la materia
            setEditMateriaId('')
          }
        }
      } catch (error) {
        // El error ya se maneja en cargarMateriasPorEstudiante
        setEditMateriaId('')
      }
    } else {
      setMaterias([])
      setEditMateriaId('')
    }
  }

  // Función para crear la solicitud de cancelación
  const crearSolicitudCancelacion = async (e) => {
    e.preventDefault()

    if (!estudianteId) {
      showAlerta('Debe seleccionar un estudiante', 'error', 'Campo requerido')
      return
    }

    if (!materiaId) {
      showAlerta('Debe seleccionar una materia', 'error', 'Campo requerido')
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
      estudianteId: parseInt(estudianteId),
      matriculaId: parseInt(materiaId)
    }

    try {
      const response = await fetch(`${backendUrl}/cancelacion/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(solicitudDTO)
      })

      // Leemos la respuesta del servidor
      const data = await response.json()

      if (!response.ok) {
        // Si la respuesta no es exitosa, extraemos el mensaje de error
        const errorMessage =
          data.mensaje ||
          data.message ||
          data.error ||
          'Error al crear la solicitud de cancelación'
        throw new Error(errorMessage)
      }

      // Limpiar formulario y cerrar modal
      limpiarFormularioRegistro()
      setIsRegisterModalOpen(false)
      fetchSolicitudes() // Actualizar tabla de solicitudes
      showAlerta(
        data.mensaje || 'Solicitud de cancelación creada con éxito',
        'success',
        'Solicitud registrada'
      )
    } catch (error) {
      // Mostrar el mensaje de error que viene del backend
      showAlerta(error.message, 'error', 'Error de validación')
    } finally {
      setCreando(false)
    }
  }

  // Función para limpiar el formulario
  const limpiarFormularioRegistro = () => {
    setEstudianteId('')
    setMateriaId('')
    setDescripcion('')
  }

  // Función para limpiar el formulario de edición
  const limpiarFormularioEdicion = () => {
    setEditSolicitudId(null)
    setEditDescripcion('')
    setEditEstudianteId('')
    setEditMateriaId('')
  }

  // Función para actualizar la solicitud de cancelación
  const actualizarSolicitudCancelacion = async (e) => {
    e.preventDefault()

    if (!editEstudianteId) {
      showAlerta('Debe seleccionar un estudiante', 'error', 'Campo requerido')
      return
    }

    if (!editMateriaId) {
      showAlerta('Debe seleccionar una materia', 'error', 'Campo requerido')
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
      estudianteId: parseInt(editEstudianteId),
      matriculaId: parseInt(editMateriaId)
    }

    try {
      const response = await fetch(
        `${backendUrl}/cancelacion/actualizar/${editSolicitudId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(solicitudDTO)
        }
      )

      // Leemos la respuesta del servidor
      const data = await response.json()

      if (!response.ok) {
        // Si la respuesta no es exitosa, extraemos el mensaje de error
        const errorMessage =
          data.mensaje ||
          data.message ||
          data.error ||
          'Error al actualizar la solicitud de cancelación'
        throw new Error(errorMessage)
      }

      // Limpiar formulario y cerrar modal
      limpiarFormularioEdicion()
      setIsEditModalOpen(false)
      fetchSolicitudes() // Actualizar tabla de solicitudes
      showAlerta(
        data.mensaje || 'Solicitud de cancelación actualizada con éxito',
        'success',
        'Solicitud actualizada'
      )
    } catch (error) {
      // Mostrar el mensaje de error en el AlertaModal en lugar de en el texto del formulario
      showAlerta(error.message, 'error', 'Error de validación')
    } finally {
      setEditando(false)
    }
  }

  // Función para enviar la aprobación al backend
  const submitAprobarCancelacion = async () => {
    if (!selectedFile) {
      setFileError('Debe seleccionar un archivo para aprobar la cancelación')
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
        `${backendUrl}/cancelacion/aprobar/${currentSolicitud.Id}`,
        {
          method: 'POST',
          headers: {
            'X-Usuario': nombreUsuario
          },
          body: formData
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.mensaje || 'Error al aprobar la cancelación')
      }

      const data = await response.json()

      // Actualizar datos después de aprobar
      fetchSolicitudes()
      setIsApproveModalOpen(false)
      setSelectedFile(null)
      setFileName('')
      showAlerta(
        data.mensaje || 'Solicitud de cancelación aprobada con éxito',
        'success',
        'Solicitud aprobada'
      )
    } catch (err) {
      setFileError(err.message)
      showAlerta(err.message, 'error', 'Error al aprobar')
    } finally {
      setApproving(false)
    }
  }

  // Función para previsualizar el archivo
  const previewSelectedFile = () => {
    if (!selectedFile) return
    const fileUrl = URL.createObjectURL(selectedFile)
    window.open(fileUrl, '_blank')
  }

  // función para manejar cambios en el archivo seleccionado
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

  // Columnas y filtros para la tabla
  const columnas = [
    'Id',
    'Estudiante',
    'Materia',
    'Grupo',
    'Semestre',
    'Fecha de Creación',
    'Estado'
  ]
  const filtros = ['Estudiante', 'Materia', 'Grupo', 'Semestre', 'Estado']

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
          Cancelación de Materias
        </p>
        <Boton onClick={handleOpenRegisterModal} color='danger'>
          Registrar Cancelación
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
        cargandoContenido={cargandoCancelaciones}
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
                Aprobar Solicitud de Cancelación
              </p>
            </div>

            {currentSolicitud && (
              <p>
                ¿Está seguro que desea aprobar la solicitud de cancelación de la
                materia <strong>{currentSolicitud.Materia}</strong> para el
                estudiante <strong>{currentSolicitud.Estudiante}</strong>?
              </p>
            )}
            <p className='mt-2 mb-1'>
              Esta acción cancelará la materia {currentSolicitud?.Materia} del
              grupo {currentSolicitud?.Grupo} para el semestre{' '}
              {currentSolicitud?.Semestre}.
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
                      startContent={<FileText size={18} />}
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
              onClick={submitAprobarCancelacion}
              disabled={approving || !selectedFile}
              startContent={approving ? null : <CheckCircle size={18} />}
            >
              {approving ? 'Aprobando...' : 'Aprobar'}
            </Boton>
          </div>
        }
      />

      {/* Modal para registrar nueva cancelación */}
      <Modal
        isOpen={isRegisterModalOpen}
        onOpenChange={(open) => {
          setIsRegisterModalOpen(open)
          if (!open) {
            limpiarFormularioRegistro()
          }
        }}
        cabecera='Registrar Cancelación de Materia'
        size='xl'
        cuerpo={
          <Form
            className='flex flex-col gap-4'
            onSubmit={crearSolicitudCancelacion}
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
                onSelectionChange={handleEstudianteChange}
              >
                {(estudiante) => (
                  <AutocompleteItem key={estudiante.id.toString()}>
                    {`${estudiante.nombre || ''} ${estudiante.nombre2 || ''} ${estudiante.apellido || ''} ${estudiante.apellido2 || ''} - ${estudiante.codigo || ''}`}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <div className='w-full py-4'>
              <Autocomplete
                variant='bordered'
                className='w-full'
                defaultItems={materias}
                selectedKey={materiaId}
                label='Materia a Cancelar'
                size='md'
                placeholder='Selecciona la materia'
                labelPlacement='outside'
                isRequired
                isDisabled={!estudianteId}
                onSelectionChange={(id) => setMateriaId(id || '')}
              >
                {(materia) => (
                  <AutocompleteItem key={materia.id.toString()}>
                    {`${materia.nombreMateria || ''} - ${materia.grupoNombre?.split(' - ')[1] || 'Sin grupo'} (${materia.codigoMateria || ''})`}
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
                placeholder='Ingrese el motivo detallado para la cancelación de la materia'
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                minRows={4}
                isRequired
              />
            </div>

            <div className='w-full flex justify-end mb-[-20px]'>
              <Boton type={'submit'} disabled={creando}>
                {creando ? 'Creando...' : 'Registrar Cancelación'}
              </Boton>
            </div>
          </Form>
        }
      />

      {/* Modal para editar solicitud de cancelación */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) {
            limpiarFormularioEdicion()
          }
        }}
        cabecera='Editar Solicitud de Cancelación'
        size='xl'
        cuerpo={
          <Form
            className='flex flex-col gap-4'
            onSubmit={actualizarSolicitudCancelacion}
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
                onSelectionChange={handleEditEstudianteChange}
              >
                {(estudiante) => (
                  <AutocompleteItem key={estudiante.id.toString()}>
                    {`${estudiante.nombre || ''} ${estudiante.nombre2 || ''} ${estudiante.apellido || ''} ${estudiante.apellido2 || ''} - ${estudiante.codigo || ''}`}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <div className='w-full py-4'>
              <Autocomplete
                variant='bordered'
                className='w-full'
                defaultItems={materias}
                selectedKey={editMateriaId}
                label='Materia a Cancelar'
                size='md'
                placeholder='Selecciona la materia'
                labelPlacement='outside'
                isRequired
                isDisabled={!editEstudianteId}
                onSelectionChange={(id) => setEditMateriaId(id || '')}
              >
                {(materia) => (
                  <AutocompleteItem key={materia.id.toString()}>
                    {`${materia.nombreMateria || ''} - ${materia.grupoNombre?.split(' - ')[1] || 'Sin grupo'} (${materia.codigoMateria || ''})`}
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
                placeholder='Ingrese el motivo detallado para la cancelación de la materia'
                value={editDescripcion}
                onChange={(e) => setEditDescripcion(e.target.value)}
                minRows={4}
                isRequired
              />
            </div>

            <div className='w-full flex justify-end mb-[-20px]'>
              <Boton type='submit' color='success' disabled={editando}>
                {editando ? 'Actualizando...' : 'Actualizar Cancelación'}
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

export default Cancelaciones
