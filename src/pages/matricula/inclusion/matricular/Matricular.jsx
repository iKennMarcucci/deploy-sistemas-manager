import { useEffect } from 'react'
import { useState } from 'react'
import Tabla from '../../../../components/Tabla'
import { ArrowRightFromLine, X, ArrowLeft, ClipboardList, Mail } from 'lucide-react'
import Boton from '../../../../components/Boton'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import Modal from '../../../../components/Modal'
import AlertaModal from '../../../../components/AlertaModal'



const Matricular = () => {
  const { id } = useParams()
  const [user, setUser] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const Navigate = useNavigate()
  const [materiasMatriculadas, setMateriasMatriculadas] = useState([])
  const [correoEnviado, setCorreoEnviado] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cambiosMatricula, setCambiosMatricula] = useState([])

  // Estado para modal de confirmación de reenvío
  const [isConfirmReenvioModalOpen, setIsConfirmReenvioModalOpen] = useState(false)
  const [enviandoCorreo, setEnviandoCorreo] = useState(false)

  // Estados para AlertaModal
  const [alertaModalOpen, setAlertaModalOpen] = useState(false)
  const [alertaMessage, setAlertaMessage] = useState('')
  const [alertaType, setAlertaType] = useState('success')
  const [alertaTitulo, setAlertaTitulo] = useState('')

  const [materiasPorEstado, setMateriasPorEstado] = useState({
    noMatriculadas: [],
    enCurso: []
  })

  // Función para mostrar alerta
  const showAlerta = (mensaje, tipo, titulo) => {
    setAlertaMessage(mensaje)
    setAlertaType(tipo)
    setAlertaTitulo(titulo || (tipo === 'success' ? 'Operación exitosa' : 'Error'))
    setAlertaModalOpen(true)
  }

  // Función para formatear valores en la tabla, especialmente las notas
  const formatearDatoTabla = (valor, columna, item) => {
    if (columna === 'Nota') {
      return <NotaColoreada nota={valor} />;
    }
    return valor;
  };

  //--------------Uso de los estados------------------
  useEffect(() => {
    fetch(`${backendUrl}/estudiantes/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const nombreUnido = [
          data.nombre,
          data.nombre2,
          data.apellido,
          data.apellido2
        ]
          .filter(Boolean)
          .join(' ')
        const estudianteFormateado = {
          Id: data.id,
          Nombre: nombreUnido
        }
        setUser(estudianteFormateado)
      })
      .catch((error) => {
        showAlerta('Error al obtener información del estudiante', 'error', 'Error de conexión')
      })
  }, [])

  useEffect(() => {
    cargarInformacion()
  }, [user])

  useEffect(() => {
    if (user && user.Id) {
      fetch(`${backendUrl}/matriculas/correo-enviado/${user.Id}`)
        .then((response) => response.json())
        .then((data) => {
          setCorreoEnviado(data)
        })
        .catch((error) => {
          showAlerta('Error al verificar estado de correo', 'error', 'Error de conexión')
        })
    }
  }, [user])

  //--------------Funciones------------------

  const cargarInformacion = () => {
    if (user && user.Id) {
      // Cargar pensum del estudiante
      fetch(`${backendUrl}/matriculas/pensum/estudiante/${user.Id}`)
        .then((response) => response.json())
        .then((data) => {
          const enCurso = []
          const noMatriculadas = []

          data.forEach((semestre) => {
            semestre.materias.forEach((materia) => {
              const materiaConSemestre = {
                Código: materia.codigo,
                Nombre: materia.nombre,
                Créditos: materia.creditos,
                semestreAprobado: semestre.semestreAprobado,
                estadoId: materia.estadoId,
                colorCard: materia.colorCard,
                estadoNombre: materia.estadoNombre,
                Semestre: semestre.semestrePensum
              }

              // Las materias del pensum ya no las usamos para la tabla de matriculadas
              if (materia.estadoNombre === 'No matriculada' || materia.estadoNombre === 'Anulada') {
                noMatriculadas.push(materiaConSemestre)
              }
            })
          })
        })
        .catch((error) => {
          showAlerta('Error al cargar el pensum del estudiante', 'error', 'Error de conexión')
        })

      // Cargar materias no matriculadas
      fetch(`${backendUrl}/matriculas/materias/nomatriculadas/${user.Id}`)
        .then((response) => response.json())
        .then((data) => {
          // Formatear los datos para que coincidan con la estructura esperada
          const noMatriculadasFormateadas = data.map((materia) => ({
            Id: materia.id,
            Código: materia.codigo,
            Nombre: materia.nombre,
            Créditos: materia.creditos,
            Semestre: materia.semestre
            // No incluimos campo Nota para materias no matriculadas
          }))

          // Actualizar el estado con las materias no matriculadas
          setMateriasPorEstado((prevState) => ({
            ...prevState,
            noMatriculadas: noMatriculadasFormateadas
          }))
        })
        .catch((error) => {
          showAlerta('Error al cargar materias no matriculadas', 'error', 'Error de conexión')
        })

      // Cargar materias matriculadas con sus notas
      fetch(`${backendUrl}/matriculas/estudiante/${user.Id}`)
        .then((response) => response.json())
        .then((data) => {
          // Guardar datos completos de matriculas
          setMateriasMatriculadas(data)

          // Procesar las materias para la tabla, incluyendo las notas
          const materiasEnCurso = data.map(materia => ({
            Id: materia.id, // Incluir ID para poder cancelar la matrícula
            Código: materia.codigoMateria,
            Nombre: materia.nombreMateria,
            Créditos: materia.creditos,
            Semestre: materia.semestreMateria,
            Nota: materia.nota // Incluir la nota de la matrícula
          }));

          // Actualizar el estado de las materias matriculadas con las notas
          setMateriasPorEstado(prevState => ({
            ...prevState,
            enCurso: materiasEnCurso
          }));
        })
        .catch((error) => {
          showAlerta('Error al cargar materias matriculadas', 'error', 'Error de conexión')
        })
    }
  }

  const verCambiosMatricula = () => {
    if (user && user.Id) {
      fetch(`${backendUrl}/matriculas/cambio/estudiante/${user.Id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('No se encontraron cambios para este estudiante');
          }
          return response.json();
        })
        .then(data => {
          setCambiosMatricula(data);
          setIsModalOpen(true);
        })
        .catch(error => {
          showAlerta(error.message, 'error', 'Error al obtener cambios');
        });
    }
  };

  // Función modificada para verificar si ya se envió un correo
  const enviarCorreo = () => {
    if (correoEnviado) {
      // Si ya se envió correo, mostrar modal de confirmación
      setIsConfirmReenvioModalOpen(true);
    } else {
      // Si no se ha enviado correo, proceder con el envío directo
      procesarEnvioCorreo();
    }
  }

  // Nueva función para procesar el envío de correo
  const procesarEnvioCorreo = () => {
    setEnviandoCorreo(true);
    const userStorage = JSON.parse(localStorage.getItem('userInfo'));
    const nombreUsuario = userStorage && userStorage.nombre ? userStorage.nombre : "Usuario no identificado";

    fetch(`${backendUrl}/matriculas/correo/estudiante/${user.Id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Usuario': nombreUsuario
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error al enviar el correo');
        }
      })
      .then((data) => {
        showAlerta(data.mensaje || 'Correo enviado correctamente', 'success', 'Correo enviado');
        setCorreoEnviado(true); // Actualizar el estado para reflejar que el correo fue enviado
        // Cerrar el modal de confirmación si estaba abierto
        if (isConfirmReenvioModalOpen) {
          setIsConfirmReenvioModalOpen(false);
        }
      })
      .catch((error) => {
        showAlerta(error.message, 'error', 'Error al enviar correo');
      })
      .finally(() => {
        setEnviandoCorreo(false);
      });
  }

  // Columnas diferentes para cada tabla
  const columnasMatriculadas = ['Código', 'Nombre', 'Créditos', 'Semestre', 'Nota']
  const columnasNoMatriculadas = ['Código', 'Nombre', 'Créditos', 'Semestre']
  const filtros = ['Código', 'Nombre']

  const accionesMatricular = [
    {
      icono: <ArrowRightFromLine className='text-[25px]' />,
      tooltip: 'Ver grupos',
      accion: (materia) => matricularMateria(materia)
    }
  ]

  const accionesCancelar = [
    {
      icono: <X className='text-[25px]' />,
      tooltip: 'Cancelar materia',
      accion: (materia) => anularMateria(materia)
    }
  ]

  const mostrarPensum = () => {
    Navigate(`/matricula/inclusion/matricular/pensum/${user.Id}`)
  }

  const matricularMateria = (materia) => {
    Navigate(
      `/matricula/inclusion/matricular/matricularMateria/${materia.Código}/${id}`
    )
  }

  const anularMateria = (materia) => {
    // Obtener el nombre del usuario del localStorage
    const userStorage = JSON.parse(localStorage.getItem('userInfo'));
    const nombreUsuario = userStorage && userStorage.nombre ? userStorage.nombre : "Usuario no identificado";

    materiasMatriculadas.forEach((materiaMatriculada) => {
      if (materiaMatriculada.codigoMateria === materia.Código) {
        const matriculaId = materiaMatriculada.id
        fetch(`${backendUrl}/matriculas/${matriculaId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Usuario': nombreUsuario
          }
        })
          .then((response) => {
            if (response.ok) {
              cargarInformacion()
              showAlerta('Matricula anulada correctamente', 'success', 'Operación exitosa')
            } else {
              response.json().then(data => {
                showAlerta(data.mensaje || 'Error al anular la materia', 'error', 'Error en la operación')
              }).catch(() => {
                showAlerta('Error al anular la materia', 'error', 'Error en la operación')
              })
            }
          })
          .catch((error) => {
            showAlerta('Error al procesar la solicitud', 'error', 'Error de conexión')
          })
      }
    })
  }

  //--------------Renderizado------------------

  return (
    <div className='p-4 flex flex-col w-full items-center space-y-8'>
      <div className='w-full flex flex-row justify-between'>
        <button
          className='w-[40px] h-[30px] text-[30px] bg-rojo-mate flex items-center justify-center rounded-md border border-rojo-mate text-white hover:bg-rojo-oscuro ease-in-out transition-all duration-300'
          onClick={() => window.history.back()}
        >
          <ArrowLeft />
        </button>
        <p className='text-titulos'>Matrícula de materias</p>
        <div className='w-[40px]'></div>
      </div>
      <div className='flex flex-row space-x-1'>
        <p className='text-normal font-bold'>Nombre:</p>
        <p className='text-normal'>{user?.Nombre}</p>
      </div>
      <div className='flex flex-col w-full items-center space-y-6'>
        <p className='text-titulos'>Materias matriculadas</p>
        <Tabla
          columnas={columnasMatriculadas}
          informacion={materiasPorEstado?.enCurso}
          acciones={accionesCancelar}
          elementosPorPagina={5}
          formatearDato={formatearDatoTabla}
        />
      </div>
      <div className='flex flex-col w-full items-center space-y-6 pt-4'>
        <p className='text-titulos'>Materias no matriculadas</p>
        <Tabla
          columnas={columnasNoMatriculadas}
          informacion={materiasPorEstado?.noMatriculadas}
          acciones={accionesMatricular}
          elementosPorPagina={5}
          filtros={filtros}
        />
      </div>
      <div className='flex flex-row justify-between pt-6 w-[90%]'>
        <Boton onClick={mostrarPensum}>Ver Pensum</Boton>
        <Boton onClick={verCambiosMatricula}>
          <div className='flex items-center gap-2'>
            <span>Cambios de matrícula</span>
          </div>
        </Boton>
        <Boton onClick={enviarCorreo} success={correoEnviado}>
          Reporte de materias
        </Boton>
      </div>

      {/* Modal de cambios de matrícula */}
      <Modal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        size="5xl"
        cabecera="Cambios de Matrícula"
        cuerpo={
          <div className="max-h-[60vh] overflow-y-auto">
            {cambiosMatricula.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materia</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modificado por</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cambiosMatricula.map((cambio) => {
                    const getEstadoColor = (estado) => {
                      switch (estado.toLowerCase()) {
                        case 'aprobada':
                          return 'bg-blue-100 text-blue-800';
                        case 'en curso':
                          return 'bg-green-100 text-green-800';
                        case 'cancelada':
                          return 'bg-orange-100 text-orange-800';
                        case 'reprobada':
                          return 'bg-red-100 text-red-800';
                        case 'anulada':
                          return 'bg-red-100 text-red-800';
                        case 'correo enviado':
                          return 'bg-indigo-100 text-indigo-800';
                        default:
                          return 'bg-gray-100 text-gray-800';
                      }
                    };

                    return (
                      <tr key={cambio.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cambio.materiaCodigo}</div>
                          <div className="text-sm text-gray-500">{cambio.materiaNombre}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cambio.grupoCodigo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(cambio.estadoMatriculaNombre)}`}>
                            {cambio.estadoMatriculaNombre}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(cambio.fechaCambioEstadoMatricula).toLocaleString('es-CO', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cambio.usuarioCambioEstadoMatricula}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-4">No hay cambios de matrícula registrados.</p>
            )}
          </div>
        }
        footer={null}
      />

      {/* Modal de confirmación para reenviar correo */}
      <Modal
        isOpen={isConfirmReenvioModalOpen}
        onOpenChange={(open) => !enviandoCorreo && setIsConfirmReenvioModalOpen(open)}
        size="md"
        cabecera="Confirmar reenvío de reporte"
        cuerpo={
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 bg-red-100 p-4 rounded-full">
              <Mail className="w-10 h-10 text-red-600" />
            </div>
            <p className="text-gray-500">Ya se ha enviado un reporte de materias para este estudiante</p>
            <p className="text-gray-900">¿Desea volver a enviar el reporte de materias al correo del estudiante?</p>
          </div>
        }
        footer={
          <Boton
            color="primary"
            onClick={procesarEnvioCorreo}
            disabled={enviandoCorreo}
          >
            {enviandoCorreo ? 'Enviando...' : 'Confirmar reenvío'}
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

export default Matricular
