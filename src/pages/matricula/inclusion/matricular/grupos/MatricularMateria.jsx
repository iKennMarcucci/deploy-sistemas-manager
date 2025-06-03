import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Check } from 'lucide-react'
import Tabla from '../../../../../components/Tabla'
import { useParams } from 'react-router-dom'
import AlertaModal from '../../../../../components/AlertaModal'

const MatricularMateria = () => {
  const { id } = useParams()
  const { codigo } = useParams()
  const [grupos, setGrupos] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Estados para AlertaModal
  const [alertaModalOpen, setAlertaModalOpen] = useState(false)
  const [alertaMessage, setAlertaMessage] = useState('')
  const [alertaType, setAlertaType] = useState('success')
  const [alertaTitulo, setAlertaTitulo] = useState('')

  const columnas = ['Código', 'Nombre', 'Profesor']

  // Función para mostrar alerta
  const showAlerta = (mensaje, tipo, titulo) => {
    setAlertaMessage(mensaje)
    setAlertaType(tipo)
    setAlertaTitulo(titulo || (tipo === 'success' ? 'Operación exitosa' : 'Error'))
    setAlertaModalOpen(true)
  }

  useEffect(() => {
    fetch(`${backendUrl}/matriculas/grupos/materia/${codigo}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los grupos')
        }
        return response.json()
      })
      .then((data) => {
        const gruposModificado = data.map((grupo) => ({
          ...grupo,
          Código: grupo.codigoMateria,
          Nombre: grupo.grupoNombre,
          Profesor: grupo.docenteNombre
        }))

        setGrupos(gruposModificado)
      })
      .catch((error) => {
        showAlerta(`Error al cargar los grupos: ${error.message}`, 'error', 'Error de conexión')
      })
  }, [])

  const matricular = (grupo) => {
    // Obtener el nombre del usuario del localStorage
    const userStorage = JSON.parse(localStorage.getItem('userInfo'));
    const nombreUsuario = userStorage && userStorage.nombre ? userStorage.nombre : "Usuario no identificado";

    const body = {
      estudianteId: id,
      grupoCohorteId: grupo.grupoCohorteId,
      nuevaMatricula: true
    }

    fetch(`${backendUrl}/matriculas/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Usuario': nombreUsuario
      },
      body: JSON.stringify(body)
    })
      .then((response) => {
        // Intentar obtener el mensaje del servidor independiente del estado de la respuesta
        return response.json().then(data => ({ ok: response.ok, data }))
          .catch(() => ({
            ok: response.ok,
            data: {
              mensaje: response.ok ? 'Matrícula creada correctamente' : 'Error al crear la matrícula'
            }
          }));
      })
      .then(({ ok, data }) => {
        if (ok) {
          showAlerta(data.mensaje || 'Matrícula creada correctamente', 'success', 'Matrícula exitosa')
          // Retrasar el regreso para que el usuario pueda ver el mensaje
          setTimeout(() => {
            window.history.back();
          }, 1500);
        } else {
          // Mostrar el mensaje de error que viene del backend
          showAlerta(data.mensaje || 'Error al crear la matrícula', 'error', 'Error de matrícula')
        }
      })
      .catch((error) => {
        showAlerta('Error en la conexión con el servidor', 'error', 'Error de sistema')
      })
  }

  const acciones = [
    {
      icono: <Check className='text-[25px]' />,
      tooltip: 'Matricular materia',
      accion: (grupo) => matricular(grupo)
    }
  ]

  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className='w-full flex flex-row justify-between'>
        <button
          className='w-[40px] h-[30px] text-[30px] bg-rojo-mate flex items-center justify-center rounded-md border border-rojo-mate text-white hover:bg-rojo-oscuro ease-in-out transition-all duration-300'
          onClick={() => window.history.back()}
        >
          <ArrowLeft />
        </button>
        <p className='text-titulos'>{grupos[0]?.materia}</p>
        <div className='w-[40px]'></div>
      </div>
      <p className='text-subtitulos my-4'>Grupos disponibles</p>
      <div className='w-[80%]'>
        <Tabla informacion={grupos} columnas={columnas} acciones={acciones} />
      </div>

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

export default MatricularMateria
