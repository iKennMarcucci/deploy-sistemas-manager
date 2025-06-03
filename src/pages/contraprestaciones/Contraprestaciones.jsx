import { useState, useEffect, useRef } from 'react'
import TablaEstados from '../../components/TablaEstados'
import { Pencil, Eye, Check, FileCheck, Upload, X, FileText, CheckCircle, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Boton from '../../components/Boton'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Divider
} from '@heroui/react'
import AlertaModal from '../../components/AlertaModal'

const Contraprestaciones = () => {
    const [contraprestaciones, setContraprestaciones] = useState([])
    const [informacion, setInformacion] = useState([])
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    // Estados para el modal de aprobación
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [fileName, setFileName] = useState('')
    const [fileError, setFileError] = useState(null)
    const [approving, setApproving] = useState(false)
    const [currentContraprestacion, setCurrentContraprestacion] = useState(null)
    const fileInputRef = useRef(null)

    // Estado para controlar la generación del certificado
    const [generatingCertificate, setGeneratingCertificate] = useState(false)
    
    // Estados para AlertaModal
    const [alertaModalOpen, setAlertaModalOpen] = useState(false)
    const [alertaMessage, setAlertaMessage] = useState('')
    const [alertaType, setAlertaType] = useState('success')
    const [alertaTitulo, setAlertaTitulo] = useState('')

    // Función para mostrar alerta
    const showAlerta = (mensaje, tipo, titulo) => {
        setAlertaMessage(mensaje)
        setAlertaType(tipo)
        setAlertaTitulo(titulo || (tipo === 'success' ? 'Operación exitosa' : 'Error'))
        setAlertaModalOpen(true)
    }

    useEffect(() => {
        fetchContraprestaciones()
    }, [backendUrl])

    const fetchContraprestaciones = () => {
        fetch(`${backendUrl}/contraprestaciones`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener contraprestaciones')
                }
                return response.json()
            })
            .then((data) => {
                setContraprestaciones(data)
                const datosTablas = data.map((contraprestacion) => {
                    return {
                        Id: contraprestacion.id,
                        Estudiante: contraprestacion.estudianteNombre,
                        'Tipo de Contraprestación': contraprestacion.tipoContraprestacionNombre,
                        Porcentaje: contraprestacion.porcentajeContraprestacion,
                        Semestre: contraprestacion.semestre,
                        'Fecha de Creación': new Date(contraprestacion.fechaCreacion).toLocaleDateString(),
                        Estado: contraprestacion.aprobada ? 'Aprobado' : 'Pendiente',
                        aprobada: contraprestacion.aprobada // Campo oculto para lógica interna
                    }
                })
                setInformacion(datosTablas)
            })
            .catch((error) => {
                showAlerta(
                    `Error al cargar las contraprestaciones: ${error.message}`,
                    'error',
                    'Error de conexión'
                )
            })
    }

    // Función para ver una contraprestación
    const handleViewContraprestacion = (contraprestacion) => {
        navigate(`/contraprestaciones/${contraprestacion.Id}`)
    }

    // Función para aprobar contraprestación
    const handleAprobarContraprestacion = (contraprestacion) => {
        // Verificar si la contraprestación ya está aprobada
        if (contraprestacion.aprobada) {
            showAlerta(
                'Esta contraprestación ya ha sido aprobada anteriormente.',
                'error',
                'Operación no permitida'
            )
            return
        }

        // Preparar el modal de aprobación
        setCurrentContraprestacion(contraprestacion)
        setIsModalOpen(true)

        // Limpiar estados previos del modal
        setSelectedFile(null)
        setFileName('')
        setFileError(null)
    }

    // Función para editar contraprestación
    const handleEditContraprestacion = (contraprestacion) => {
        if (contraprestacion.aprobada) {
            showAlerta(
                'No se puede editar una contraprestación ya aprobada',
                'error',
                'Operación no permitida'
            )
            return
        }
        navigate(`/contraprestaciones/editar/${contraprestacion.Id}`)
    }

    // Función para manejar el cambio de archivo
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setFileError(null)

        // Validar tipo de archivo (PDF o DOCX)
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
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
        if (!selectedFile) return;

        const fileUrl = URL.createObjectURL(selectedFile);
        window.open(fileUrl, '_blank');
    };

    // Función para enviar la aprobación al backend
    const submitAprobarContraprestacion = async () => {
        if (!selectedFile) {
            setFileError('Debe seleccionar un archivo para aprobar la contraprestación')
            return
        }

        setApproving(true)
        setFileError(null)

        const formData = new FormData()
        formData.append('informe', selectedFile)

        try {
            const response = await fetch(`${backendUrl}/contraprestaciones/aprobar/${currentContraprestacion.Id}`, {
                method: 'POST',
                body: formData
            })

            // Intentar obtener la respuesta JSON incluso si hay error
            const data = await response.json().catch(() => ({ 
                mensaje: response.ok 
                    ? 'Contraprestación aprobada con éxito' 
                    : 'Error al aprobar la contraprestación'
            }));

            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al aprobar la contraprestación')
            }

            // Actualizar datos después de aprobar
            fetchContraprestaciones()
            setIsModalOpen(false)
            showAlerta(
                data.mensaje || 'Contraprestación aprobada con éxito',
                'success',
                'Aprobación exitosa'
            )
        } catch (err) {
            setFileError(err.message)
            showAlerta(
                err.message, 
                'error',
                'Error al aprobar'
            )
        } finally {
            setApproving(false)
        }
    }

    // Función actualizada para generar y descargar certificado
    const handleGenerarCertificado = async (contraprestacion) => {
        // Verificar si la contraprestación está aprobada
        if (!contraprestacion.aprobada) {
            showAlerta(
                'No se puede generar un certificado para una contraprestación no aprobada',
                'error',
                'Operación no permitida'
            )
            return
        }

        try {
            setGeneratingCertificate(true)

            // Realizar petición POST para generar el certificado
            const response = await fetch(`${backendUrl}/contraprestaciones/generar/certificado/${contraprestacion.Id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/pdf'
                }
            })

            // Manejar errores de la petición
            if (!response.ok) {
                // Si la respuesta no es Ok, intentamos extraer el mensaje de error
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    throw new Error(errorData.mensaje || 'Error al generar el certificado');
                } else {
                    throw new Error('Error al generar el certificado');
                }
            }

            // Obtener el blob del PDF y crear un objeto URL para descargarlo
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)

            // Extraer el nombre del archivo del header Content-Disposition si está disponible
            const contentDisposition = response.headers.get('Content-Disposition')
            let fileName = 'certificado_contraprestacion.pdf'

            if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
                fileName = contentDisposition.split('filename=')[1].replace(/"/g, '')
            }

            // Crear elemento <a> para la descarga
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)

            // Simular click para iniciar la descarga
            link.click()

            // Limpiar elementos del DOM y revocar URL
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            // Mostrar mensaje de éxito
            showAlerta(
                'Certificado generado y descargado correctamente',
                'success',
                'Certificado generado'
            )

            // Actualizar datos para reflejar cambios (si hay alguno, como marcar el certificado como generado)
            fetchContraprestaciones()

        } catch (error) {
            showAlerta(
                `Error al generar el certificado: ${error.message}`,
                'error',
                'Error de generación'
            )
        } finally {
            setGeneratingCertificate(false)
        }
    }


    const columnas = ['Id', 'Estudiante', 'Tipo de Contraprestación', 'Porcentaje', 'Semestre', 'Fecha de Creación', 'Estado']
    const filtros = ['Estudiante', 'Tipo de Contraprestación', 'Semestre' ]

    // Definir acciones por estado para la tabla
    const accionesPorEstado = {
        // Para contraprestaciones aprobadas (true)
        true: [
            {
                icono: <Eye size={18} />,
                tooltip: 'Ver',
                accion: handleViewContraprestacion
            },
            {
                icono: <FileCheck size={18} />,
                tooltip: 'Generar Certificado',
                accion: handleGenerarCertificado
            }
        ],
        // Para contraprestaciones no aprobadas (false)
        false: [
            {
                icono: <Eye size={18} />,
                tooltip: 'Ver',
                accion: handleViewContraprestacion
            },
            {
                icono: <Pencil size={18} />,
                tooltip: 'Editar',
                accion: handleEditContraprestacion
            },
            {
                icono: <Check size={18} />,
                tooltip: 'Aprobar',
                accion: handleAprobarContraprestacion
            }
        ]
    }

    return (
        <div className='w-full p-4 relative'>
            <p className='text-center text-titulos'>Lista de Contraprestaciones</p>
            <TablaEstados
                informacion={informacion}
                columnas={columnas}
                filtros={filtros}
                accionesPorEstado={accionesPorEstado}
                campoEstado="aprobada"
                elementosPorPagina={10}
            />

            {/* Botón para crear nueva contraprestación (en la esquina inferior derecha) */}
            <div className="mt-12 flex justify-end">
                <Boton
                    onClick={() => navigate('/contraprestaciones/crear')}
                >
                    Crear Contraprestación
                </Boton>
            </div>

            {/* Modal para aprobar contraprestación */}
            <Modal
                isOpen={isModalOpen}
                onOpenChange={(open) => {
                    if (!approving) setIsModalOpen(open)
                }}
                className="z-50"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-center">
                        <p className="text-titulos">Aprobar Contraprestación</p>
                    </ModalHeader>
                    <ModalBody>
                        {currentContraprestacion && (
                            <p>
                                ¿Estás seguro que quieres aprobar la contraprestación de {currentContraprestacion.Estudiante} realizada en el semestre {currentContraprestacion.Semestre}?
                            </p>
                        )}

                        <p className="text-normal mt-6 mb-2">Informe de Contraprestación (PDF o DOCX)</p>
                        <Divider className='mb-4' />

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            />

                            {fileName ? (
                                <div className="flex items-center justify-center">
                                    <div className="flex-grow text-left">
                                        <div className="flex items-center">
                                            <FileText className="text-rojo-institucional mr-2" />
                                            <p className="font-medium">{fileName}</p>
                                        </div>
                                    </div>
                                    <button
                                        className="ml-2 p-1 bg-gray-200 rounded-full"
                                        onClick={() => {
                                            setSelectedFile(null)
                                            setFileName('')
                                        }}
                                        disabled={approving}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500 mb-1">
                                        Haga clic para cargar o arrastre y suelte
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        PDF o DOCX (MÁX. 10MB)
                                    </p>
                                    <button
                                        onClick={openFileSelector}
                                        className="mt-4 py-1.5 px-4 border border-rojo-institucional text-rojo-institucional rounded-md hover:bg-rojo-institucional hover:text-white transition-colors"
                                        disabled={approving}
                                    >
                                        Seleccionar archivo
                                    </button>
                                </>
                            )}
                        </div>

                        {fileName && (
                            <div className="flex justify-center mt-4">
                                <Boton
                                    onClick={previewSelectedFile}
                                    variant="bordered"
                                    color="primary"
                                    startContent={<FileText size={18} />}
                                >
                                    Previsualizar Documento
                                </Boton>
                            </div>
                        )}

                        {fileError && (
                            <p className="text-red-600 mt-2 text-sm">{fileError}</p>
                        )}
                    </ModalBody>
                    <ModalFooter className="flex justify-between">
                        <Boton
                            variant="bordered"
                            onClick={() => setIsModalOpen(false)}
                            disabled={approving}
                        >
                            Cancelar
                        </Boton>
                        <Boton
                            onClick={submitAprobarContraprestacion}
                            disabled={approving || !selectedFile}
                            startContent={approving ? null : <CheckCircle size={18} />}
                        >
                            {approving ? 'Aprobando...' : 'Aprobar'}
                        </Boton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            
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

export default Contraprestaciones