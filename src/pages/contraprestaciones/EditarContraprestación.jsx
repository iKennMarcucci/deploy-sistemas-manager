import React from 'react'
import {
  Form,
  Input,
  Divider,
  DatePicker,
  Autocomplete,
  AutocompleteItem
} from '@heroui/react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Boton from '../../components/Boton'
import { today, getLocalTimeZone, parseDate } from '@internationalized/date'
import AlertaModal from '../../components/AlertaModal'

const EditarContraprestacion = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  // Estados para los datos del formulario
  const [estudianteId, setEstudianteId] = useState(null)
  const [tipoContraprestacionId, setTipoContraprestacionId] = useState(null)
  const [actividades, setActividades] = useState('')
  const [fechaInicio, setFechaInicio] = useState(null)
  const [fechaFin, setFechaFin] = useState(null)
  const [porcentaje, setPorcentaje] = useState('')
  const [aprobada, setAprobada] = useState(false)

  // Estados para los datos dinámicos
  const [estudiantes, setEstudiantes] = useState([])
  const [tiposContraprestacion, setTiposContraprestacion] = useState([])

  // Estados para AlertaModal
  const [alertaModalOpen, setAlertaModalOpen] = useState(false)
  const [alertaMessage, setAlertaMessage] = useState('')
  const [alertaType, setAlertaType] = useState('success')
  const [alertaTitulo, setAlertaTitulo] = useState('')

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

  // Función para extraer mensaje de error de la respuesta del backend
  const extraerMensajeError = async (response) => {
    try {
      const data = await response.json()
      // El backend puede retornar un objeto HttpResponse con un campo 'message'
      // o un objeto de error con un campo 'mensaje'
      return data.message || data.mensaje || 'Error en la operación'
    } catch (error) {
      return 'Error en la comunicación con el servidor'
    }
  }

  // Configuración para el DatePicker
  const minDateInicio = today(getLocalTimeZone()).subtract({ years: 1 }) // Máximo 1 año atrás
  const maxDateFin = today(getLocalTimeZone()).add({ years: 1 }) // Máximo 1 año en el futuro

  // Función auxiliar para convertir fecha de string a objeto de fecha para DatePicker
  const stringToCalendarDate = (dateString) => {
    if (!dateString) return null

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return null

      const year = date.getFullYear()
      const month = date.getMonth() + 1 // getMonth() devuelve 0-11
      const day = date.getDate()

      // Usar formato ISO para evitar problemas de zona horaria
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      return parseDate(formattedDate)
    } catch (error) {
      // Eliminamos el console.error
      return null
    }
  }

  // Cargar datos de la contraprestación
  useEffect(() => {
    const fetchContraprestacion = async () => {
      setLoadingData(true)
      try {
        const response = await fetch(`${backendUrl}/contraprestaciones/${id}`)
        if (!response.ok) {
          const mensajeError = await extraerMensajeError(response)
          throw new Error(mensajeError)
        }
        const data = await response.json()

        // Cargar datos en el formulario
        setEstudianteId(data.estudianteId)
        setTipoContraprestacionId(data.tipoContraprestacionId)
        setActividades(data.actividades || '')
        setPorcentaje(data.porcentajeContraprestacion || '')
        setAprobada(data.aprobada || false)

        // Convertir fechas usando la función auxiliar
        setFechaInicio(stringToCalendarDate(data.fechaInicio))
        setFechaFin(stringToCalendarDate(data.fechaFin))

        setLoadingData(false)
      } catch (err) {
        // Eliminamos console.error y usamos AlertaModal
        showAlerta(
          err.message ||
            'No se pudo cargar la información de la contraprestación',
          'error',
          'Error al cargar'
        )
        setLoadingData(false)
      }
    }

    fetchContraprestacion()
  }, [id, backendUrl])

  // Cargar tipos de contraprestación y estudiantes activos
  useEffect(() => {
    // Cargar tipos de contraprestación
    fetch(`${backendUrl}/contraprestaciones/tipos`)
      .then(async (response) => {
        if (!response.ok) {
          const mensajeError = await extraerMensajeError(response)
          throw new Error(mensajeError)
        }
        return response.json()
      })
      .then((data) => {
        setTiposContraprestacion(data)
      })
      .catch((err) => {
        // Eliminamos console.error y usamos AlertaModal
        showAlerta(
          err.message || 'Error al cargar tipos de contraprestación',
          'error',
          'Error de conexión'
        )
      })

    // Cargar estudiantes activos (estado 1 = En curso)
    fetch(`${backendUrl}/estudiantes/listar/estado/1`)
      .then(async (response) => {
        if (!response.ok) {
          const mensajeError = await extraerMensajeError(response)
          throw new Error(mensajeError)
        }
        return response.json()
      })
      .then((data) => {
        setEstudiantes(data)
      })
      .catch((err) => {
        // Eliminamos console.error y usamos AlertaModal
        showAlerta(
          err.message || 'Error al cargar estudiantes',
          'error',
          'Error de conexión'
        )
      })
  }, [backendUrl])

  // Enviar formulario
  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validar campos requeridos
    if (
      !estudianteId ||
      !tipoContraprestacionId ||
      !actividades ||
      !fechaInicio
    ) {
      showAlerta(
        'Por favor complete todos los campos requeridos',
        'error',
        'Campos incompletos'
      )
      setLoading(false)
      return
    }

    actualizarContraprestacion()
  }

  const actualizarContraprestacion = async () => {
    // Formatear fechas
    const formattedFechaInicio = fechaInicio
      ? fechaInicio
          .toDate(getLocalTimeZone()) // Convertir a Date nativo
          .toISOString() // Convertir a formato ISO
          .split('T')[0] // Extraer solo la parte de la fecha (aaaa-mm-dd)
      : null

    const formattedFechaFin = fechaFin
      ? fechaFin.toDate(getLocalTimeZone()).toISOString().split('T')[0]
      : null

    // Preparar datos para enviar al backend
    const contraprestacionDTO = {
      id: parseInt(id),
      estudianteId,
      tipoContraprestacionId,
      actividades,
      fechaInicio: formattedFechaInicio,
      fechaFin: formattedFechaFin
    }

    try {
      const response = await fetch(
        `${backendUrl}/contraprestaciones/actualizar/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(contraprestacionDTO)
        }
      )

      // Comprobamos si la respuesta es exitosa o no
      if (response.ok) {
        // Si es exitosa, extraemos el mensaje del body de la respuesta
        const data = await response.json()

        // Mostramos el mensaje de éxito del backend
        showAlerta(
          data.message ||
            data.mensaje ||
            'Contraprestación actualizada con éxito',
          'success',
          'Actualización Exitosa'
        )

        // Navegar después de 1.5 segundos para dar tiempo a ver el mensaje
        setTimeout(() => {
          navigate('/contraprestaciones')
        }, 1500)
      } else {
        // Si hay un error, extraemos el mensaje de error
        const mensajeError = await extraerMensajeError(response)
        throw new Error(mensajeError)
      }
    } catch (err) {
      // Eliminamos console.error y mostramos el error con AlertaModal
      showAlerta(err.message, 'error', 'Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className='flex flex-col w-full items-center p-4'>
        <p className='text-lg text-center'>
          Cargando información de la contraprestación...
        </p>
      </div>
    )
  }

  // Si la contraprestación ya está aprobada, mostramos un mensaje y opción de volver
  if (aprobada) {
    return (
      <div className='flex flex-col w-full items-center p-4'>
        <AlertaModal
          isOpen={true}
          onClose={() => navigate('/contraprestaciones')}
          message='Esta contraprestación ya está aprobada y no puede ser editada.'
          type='error'
          titulo='Operación no permitida'
        />
        <div className='mt-4'>
          <Boton
            onClick={() => navigate(`/contraprestaciones`)}
            startContent={<ArrowLeft size={18} />}
          >
            Volver a contraprestaciones
          </Boton>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col w-full items-center p-4'>
      <div className='w-full flex flex-row justify-between'>
        <button
          className='w-[40px] h-[30px] text-[30px] bg-rojo-mate flex items-center justify-center rounded-md border border-rojo-mate text-white hover:bg-rojo-oscuro ease-in-out transition-all duration-300'
          onClick={() => navigate(`/contraprestaciones/`)}
        >
          <ArrowLeft />
        </button>
        <p className='text-center text-titulos'>Editar Contraprestación</p>
        <div className='w-[40px]'></div>
      </div>

      <Form className='w-full my-8 flex flex-col' onSubmit={onSubmit}>
        <p className='text-normal'>Información del estudiante</p>
        <Divider className='mb-4' />
        <div className='w-full flex flex-col'>
          <div className='w-full flex flex-row mb-4'>
            <div className='w-1/4 h-[40px] flex items-center'>
              <label className='font-medium'>Estudiante</label>
            </div>
            <div className='w-1/2'>
              <Autocomplete
                variant='bordered'
                className='w-full'
                defaultItems={estudiantes}
                selectedKey={estudianteId?.toString()}
                defaultSelectedKey={estudianteId?.toString()}
                label=''
                size='md'
                placeholder='Selecciona el estudiante'
                labelPlacement='outside'
                isRequired
                onSelectionChange={(id) => {
                  if (id) {
                    setEstudianteId(parseInt(id))
                  } else {
                    setEstudianteId(null)
                  }
                }}
              >
                {(estudiante) => (
                  <AutocompleteItem key={estudiante.id.toString()}>
                    {`${estudiante.nombre || ''} ${estudiante.nombre2 || ''} ${estudiante.apellido || ''} ${estudiante.apellido2 || ''} - ${estudiante.codigo || ''}`}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
          </div>
        </div>

        <p className='text-normal mt-8'>Información de la contraprestación</p>
        <Divider className='mb-4' />
        <div className='w-full flex flex-col'>
          {/* Primera fila: Tipo de contraprestación y Fecha de inicio */}
          <div className='w-full flex flex-row mb-4'>
            {/* Columna izquierda: Tipo de contraprestación */}
            <div className='w-1/2 flex flex-row'>
              <div className='w-1/2 h-[40px] flex items-center'>
                <label className='font-medium'>Tipo de Contraprestación</label>
              </div>
              <div className='w-1/2 pr-2'>
                <Autocomplete
                  variant='bordered'
                  className='w-full'
                  defaultItems={tiposContraprestacion}
                  selectedKey={tipoContraprestacionId?.toString()}
                  defaultSelectedKey={tipoContraprestacionId?.toString()}
                  label=''
                  size='md'
                  placeholder='Selecciona el tipo'
                  labelPlacement='outside'
                  isRequired
                  onSelectionChange={(id) => {
                    if (id) {
                      const tipoSeleccionado = tiposContraprestacion.find(
                        (tipo) => tipo.id.toString() === id
                      )
                      setTipoContraprestacionId(parseInt(id))
                      setPorcentaje(`${tipoSeleccionado.porcentaje}`)
                    } else {
                      setTipoContraprestacionId(null)
                      setPorcentaje('')
                    }
                  }}
                >
                  {(tipo) => (
                    <AutocompleteItem key={tipo.id.toString()}>
                      {`${tipo.nombre}`}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </div>

            {/* Columna derecha: Fecha de inicio */}
            <div className='w-1/2 flex flex-row'>
              <div className='w-1/3 h-[40px] flex items-center pl-2'>
                <label className='font-medium'>Fecha de inicio</label>
              </div>
              <div className='w-2/3'>
                <DatePicker
                  classNames={{
                    inputWrapper:
                      'border border-gris-institucional rounded-[15px] w-full max-h-[40px]'
                  }}
                  className='w-full'
                  labelPlacement='outside'
                  type='date'
                  isRequired
                  firstDayOfWeek='mon'
                  showMonthAndYearPickers
                  calendarProps={{
                    color: 'danger',
                    classNames: {
                      cellButton:
                        'data-[selected=true]:bg-rojo-institucional data-[selected=true]:data-[hover=true]:-bg-rojo-institucional '
                    }
                  }}
                  minValue={minDateInicio}
                  value={fechaInicio || undefined}
                  onChange={(value) => setFechaInicio(value)}
                />
              </div>
            </div>
          </div>

          {/* Segunda fila: Porcentaje y Fecha de finalización */}
          <div className='w-full flex flex-row mb-4'>
            {/* Columna izquierda: Porcentaje */}
            <div className='w-1/2 flex flex-row'>
              <div className='w-1/2 h-[40px] flex items-center'>
                <label className='font-medium'>Porcentaje</label>
              </div>
              <div className='w-1/2 pr-2'>
                <Input
                  classNames={{
                    inputWrapper:
                      'border border-gris-institucional rounded-[15px] w-full max-h-[40px]'
                  }}
                  type='text'
                  value={porcentaje}
                  readOnly
                />
              </div>
            </div>

            {/* Columna derecha: Fecha de finalización */}
            <div className='w-1/2 flex flex-row'>
              <div className='w-1/3 h-[40px] flex items-center pl-2'>
                <label className='font-medium'>Fecha de finalización</label>
              </div>
              <div className='w-2/3'>
                <DatePicker
                  classNames={{
                    inputWrapper:
                      'border border-gris-institucional rounded-[15px] w-full max-h-[40px]'
                  }}
                  className='w-full'
                  labelPlacement='outside'
                  type='date'
                  firstDayOfWeek='mon'
                  showMonthAndYearPickers
                  calendarProps={{
                    color: 'danger',
                    classNames: {
                      cellButton:
                        'data-[selected=true]:bg-rojo-institucional data-[selected=true]:data-[hover=true]:-bg-rojo-institucional '
                    }
                  }}
                  minValue={fechaInicio || minDateInicio}
                  maxValue={maxDateFin}
                  value={fechaFin || undefined}
                  onChange={(value) => setFechaFin(value)}
                />
              </div>
            </div>
          </div>
        </div>

        <p className='text-normal mt-8'>Actividades a realizar</p>
        <Divider className='mb-4' />
        <div className='w-full flex flex-col'>
          <div className='w-full flex flex-row'>
            <div className='w-1/4 flex items-start mt-3'>
              <label className='font-medium'>Descripción</label>
            </div>
            <div className='w-1/2'>
              <textarea
                className='w-full p-3 border border-gris-institucional rounded-[15px] min-h-[100px] resize-none'
                name='actividades'
                value={actividades}
                onChange={(e) => setActividades(e.target.value)}
                placeholder='Describa las actividades que realizará el estudiante'
                required
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className='mt-8 w-full flex justify-end gap-4'>
          <Boton
            variant='bordered'
            onClick={() => navigate(`/contraprestaciones/${id}`)}
          >
            Cancelar
          </Boton>
          <Boton type={'submit'} disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar contraprestación'}
          </Boton>
        </div>
      </Form>

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

export default EditarContraprestacion
