import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    FileText,
    ArrowLeft,
    CheckCircle,
    Download,
    Upload,
    X,
    FileCheck
} from 'lucide-react'
import {
    Input,
    Divider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from '@heroui/react'
import Boton from '../../components/Boton'
import AlertaModal from '../../components/AlertaModal'

const VerContraprestacion = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [contraprestacion, setContraprestacion] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // Estados para el modal de aprobación
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [fileName, setFileName] = useState('')
    const [fileError, setFileError] = useState(null)
    const [approving, setApproving] = useState(false)
    const fileInputRef = useRef(null)

    // Estado para controlar la generación del certificado
    const [generatingCertificate, setGeneratingCertificate] = useState(false)

    // Estado para controlar la descarga del informe
    const [downloadingReport, setDownloadingReport] = useState(false)
    
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

    // Función para extraer mensaje de error de la respuesta del backend
    const extraerMensajeError = async (response) => {
        try {
            const data = await response.json();
            // El backend puede retornar un objeto HttpResponse con un campo 'message' 
            // o un objeto de error con un campo 'mensaje'
            return data.message || data.mensaje || 'Error en la operación';
        } catch (error) {
            return 'Error en la comunicación con el servidor';
        }
    };

    useEffect(() => {
        fetchContraprestacionData()
    }, [id, backendUrl])

    const fetchContraprestacionData = () => {
        setLoading(true)
        fetch(`${backendUrl}/contraprestaciones/${id}`)
            .then(async response => {
                if (!response.ok) {
                    const mensajeError = await extraerMensajeError(response);
                    throw new Error(mensajeError);
                }
                return response.json()
            })
            .then(data => {
                setContraprestacion(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
                showAlerta(err.message, 'error', 'Error de conexión')
            })
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible'
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setFileError(null)

        // Validar tipo de archivo (PDF o DOCX)
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if (!validTypes.includes(file.type)) {
            setFileError('Solo se permiten archivos PDF o DOCX')
            showAlerta('Solo se permiten archivos PDF o DOCX', 'error', 'Formato no válido')
            setSelectedFile(null)
            setFileName('')
            return
        }

        // Validar tamaño (máximo 10MB)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
            setFileError('El archivo no debe exceder los 10MB')
            showAlerta('El archivo no debe exceder los 10MB', 'error', 'Tamaño excedido')
            setSelectedFile(null)
            setFileName('')
            return
        }

        setSelectedFile(file)
        setFileName(file.name)
    }

    const handleApproveContraprestacion = async () => {
        if (!selectedFile) {
            setFileError('Debe seleccionar un archivo para aprobar la contraprestación')
            showAlerta('Debe seleccionar un archivo para aprobar la contraprestación', 'error', 'Archivo requerido')
            return
        }

        setApproving(true)
        setFileError(null)

        const formData = new FormData()
        formData.append('informe', selectedFile)

        try {
            const response = await fetch(`${backendUrl}/contraprestaciones/aprobar/${id}`, {
                method: 'POST',
                body: formData
            })

            // Intentamos obtener la respuesta JSON incluso si hay un error
            const data = await response.json().catch(() => ({
                mensaje: response.ok 
                    ? 'Contraprestación aprobada con éxito' 
                    : 'Error al aprobar la contraprestación'
            }));

            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al aprobar la contraprestación')
            }

            // Actualizar datos después de aprobar
            fetchContraprestacionData()
            setIsModalOpen(false)
            showAlerta(data.mensaje || 'Contraprestación aprobada con éxito', 'success', 'Solicitud aprobada')
        } catch (err) {
            setFileError(err.message)
            showAlerta(err.message, 'error', 'Error al aprobar')
        } finally {
            setApproving(false)
        }
    }

    const openFileSelector = () => {
        fileInputRef.current.click()
    }

    // Función para generar y descargar certificado
    const handleGenerateCertificate = async () => {
        if (!contraprestacion.aprobada) {
            showAlerta('La contraprestación debe estar aprobada para generar el certificado', 'error', 'Operación no permitida')
            return
        }

        try {
            setGeneratingCertificate(true)

            // Realizar petición POST para generar el certificado
            const response = await fetch(`${backendUrl}/contraprestaciones/generar/certificado/${contraprestacion.id}`, {
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

            // Obtener el blob del PDF
            const blob = await response.blob()

            // Extraer el nombre del archivo del header Content-Disposition si está disponible
            const contentDisposition = response.headers.get('Content-Disposition')
            let fileName = 'certificado_contraprestacion.pdf'

            if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
                fileName = contentDisposition.split('filename=')[1].replace(/"/g, '')
            }

            // Crear URL para descarga
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)

            // Agregar al DOM y simular clic para iniciar la descarga
            document.body.appendChild(link)
            link.click()

            // Limpiar elementos del DOM y revocar URL
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            // Actualizar datos para reflejar cambios (como la fecha de certificado)
            fetchContraprestacionData()
            
            // Mostrar mensaje de éxito
            showAlerta('Certificado generado y descargado correctamente', 'success', 'Descarga completada')

        } catch (error) {
            showAlerta(error.message, 'error', 'Error al generar certificado')
        } finally {
            setGeneratingCertificate(false)
        }
    }

    // Nueva función para descargar el informe usando el endpoint específico
    const handleDownloadReport = async () => {
        if (!contraprestacion.soporte || !contraprestacion.soporte.id) {
            showAlerta('No hay informe disponible para descargar', 'error', 'Error de descarga')
            return
        }

        const soporteId = contraprestacion.soporte.id

        try {
            setDownloadingReport(true)

            // Hacer la solicitud al nuevo endpoint con responseType blob para manejar archivos
            const response = await fetch(`${backendUrl}/api/s3/download/${soporteId}`, {
                method: 'GET',
                headers: {
                    'Accept': '*/*'
                }
            })

            if (!response.ok) {
                throw new Error('Error al descargar el archivo')
            }

            // Obtener el blob del archivo
            const blob = await response.blob()

            // Extraer el nombre del archivo del header Content-Disposition si está disponible
            const contentDisposition = response.headers.get('Content-Disposition')
            let fileName = contraprestacion.soporte.nombre_archivo || 'informe.pdf'

            if (contentDisposition) {
                // Intentar extraer el nombre del archivo del header
                const filenameRegex = /filename\*=UTF-8''([^;]+)/
                const matches = filenameRegex.exec(contentDisposition)
                if (matches && matches.length > 1) {
                    fileName = decodeURIComponent(matches[1])
                }
            }

            // Crear URL para descarga
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)

            // Agregar al DOM y simular clic para iniciar la descarga
            document.body.appendChild(link)
            link.click()

            // Limpiar elementos del DOM y revocar URL
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            
            // Mostrar mensaje de éxito
            showAlerta('Documento descargado correctamente', 'success', 'Descarga completada')

        } catch (error) {
            showAlerta(`Error al descargar el informe: ${error.message}`, 'error', 'Error de descarga')
        } finally {
            setDownloadingReport(false)
        }
    }

    // Función para previsualizar el archivo seleccionado
    const previewSelectedFile = () => {
        if (!selectedFile) return;

        const fileUrl = URL.createObjectURL(selectedFile);
        window.open(fileUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-medium">Cargando información...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-lg text-red-600 mb-4">Error: {error}</p>
                <Boton onClick={() => navigate('/contraprestaciones')} startContent={<ArrowLeft size={18} />}>
                    Volver a Contraprestaciones
                </Boton>
            </div>
        )
    }

    return (
        <div className='flex flex-col w-full items-center p-4'>
            <div className='w-full flex flex-row justify-between mb-6'>
                <button
                    className='w-[40px] h-[30px] text-[30px] bg-rojo-mate flex items-center justify-center rounded-md border border-rojo-mate text-white hover:bg-rojo-oscuro ease-in-out transition-all duration-300'
                    onClick={() => navigate('/contraprestaciones')}
                >
                    <ArrowLeft />
                </button>
                <p className='text-center text-titulos'>Detalles de la Contraprestación</p>
                <div className='w-[40px]'></div>
            </div>

            <p className='text-normal'>Información de la contraprestación</p>
            <Divider className='mb-4' />

            {/* Información de la contraprestación */}
            <div className='w-full flex flex-col'>
                {/* Datos del estudiante */}
                <div className='w-full flex flex-row'>
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2 '
                        }}
                        readOnly
                        className='mb-4'
                        label='Primer nombre'
                        labelPlacement='outside-left'
                        type='text'
                        value={contraprestacion.primerNombre || ''}
                    />
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2 '
                        }}
                        readOnly
                        className='mb-4'
                        label='Segundo nombre'
                        labelPlacement='outside-left'
                        type='text'
                        value={contraprestacion.segundoNombre || ''}
                    />
                </div>

                <div className='w-full flex flex-row'>
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2 '
                        }}
                        readOnly
                        className='mb-4'
                        label='Primer apellido'
                        labelPlacement='outside-left'
                        type='text'
                        value={contraprestacion.primerApellido || ''}
                    />
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2 '
                        }}
                        readOnly
                        className='mb-4'
                        label='Segundo apellido'
                        labelPlacement='outside-left'
                        type='text'
                        value={contraprestacion.segundoApellido || ''}
                    />
                </div>

                {/* Detalles Contraprestación */}
                <div className='w-full flex flex-row'>
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2 '
                        }}
                        readOnly
                        className='mb-4'
                        label='Tipo'
                        labelPlacement='outside-left'
                        type='text'
                        value={contraprestacion.tipoContraprestacionNombre || ''}
                    />
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2 '
                        }}
                        readOnly
                        className='mb-4'
                        label='Porcentaje'
                        labelPlacement='outside-left'
                        type='text'
                        value={contraprestacion.porcentajeContraprestacion || ''}
                    />
                </div>

                <div className='w-full flex flex-row'>
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2 '
                        }}
                        readOnly
                        className='mb-4'
                        label='Semestre'
                        labelPlacement='outside-left'
                        type='text'
                        value={contraprestacion.semestre || ''}
                    />
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2 '
                        }}
                        readOnly
                        className='mb-4'
                        label='Fecha de creación'
                        labelPlacement='outside-left'
                        type='text'
                        value={formatDate(contraprestacion.fechaCreacion) || ''}
                    />
                </div>

                {/* Fechas */}
                <div className='w-full flex flex-row'>
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2 '
                        }}
                        readOnly
                        className='mb-4'
                        label='Fecha de inicio'
                        labelPlacement='outside-left'
                        type='text'
                        value={formatDate(contraprestacion.fechaInicio) || ''}
                    />
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2 '
                        }}
                        readOnly
                        className='mb-4'
                        label='Fecha de finalización'
                        labelPlacement='outside-left'
                        type='text'
                        value={formatDate(contraprestacion.fechaFin) || ''}
                    />
                </div>

                {/* Estado de aprobacion  */}
                <div className='w-full flex flex-row'>
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                            base: 'flex items-start',
                            inputWrapper:
                                `border border-gris-institucional rounded-[15px] w-full max-h-[40px] ${contraprestacion.aprobada
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-yellow-50 text-yellow-600'
                                }`,
                            mainWrapper: 'w-1/2 '
                        }}
                        readOnly
                        className='mb-4'
                        label='Estado'
                        labelPlacement='outside-left'
                        type='text'
                        value={contraprestacion.aprobada ? 'Aprobada' : 'Pendiente de aprobación'}

                    />
                    <Input
                    />
                </div>
            </div>

            <p className='text-normal mt-8'>Actividades realizadas</p>
            <Divider className='mb-4' />
            <div className='w-full'>
                <div className='w-full px-4'>
                    <textarea
                        className='w-full p-3 border border-gris-institucional rounded-[15px] min-h-[120px] resize-none'
                        readOnly
                        value={contraprestacion.actividades || 'No se han registrado actividades'}
                    />
                </div>
            </div>

            {/* Soporte documental (solo se muestra si está aprobada) */}
            {contraprestacion.aprobada && contraprestacion.soporte && (
                <>
                    <p className='text-normal mt-8'>Informe de Contraprestación</p>
                    <Divider className='mb-4' />
                    <div className='w-full px-4'>
                        <div className='w-full flex flex-row items-center border border-gris-institucional rounded-[15px] p-4'>
                            <div className='flex-grow'>
                                <div className='flex items-center'>
                                    <FileText className="text-rojo-institucional mr-2" />
                                    <p className="font-medium">{contraprestacion.soporte.nombre_archivo}</p>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Tipo: {contraprestacion.soporte.mime_type} | Tamaño: {contraprestacion.soporte.peso}
                                </p>
                                <p className="text-sm text-gray-500">Subido el {formatDate(contraprestacion.soporte.fecha_subida)}</p>
                            </div>
                            <div>
                                <Boton
                                    startContent={<Download size={18} />}
                                    onClick={handleDownloadReport}
                                    disabled={downloadingReport}
                                >
                                    {downloadingReport ? 'Descargando...' : 'Descargar Informe'}
                                </Boton>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Botón para aprobar (solo se muestra si no está aprobada) */}
            {!contraprestacion.aprobada ? (
                <div className='mt-8 w-full flex justify-end'>
                    <Boton
                        startContent={<CheckCircle size={18} />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Aprobar Contraprestación
                    </Boton>
                </div>
            ) : (
                // Nuevo botón para generar certificado (solo cuando está aprobada)
                <div className='mt-8 w-full flex justify-end'>
                    <Boton
                        startContent={<FileCheck size={18} />}
                        onClick={handleGenerateCertificate}
                        disabled={generatingCertificate}
                        color="secondary"
                    >
                        {generatingCertificate ? 'Generando...' : 'Descargar Certificado'}
                    </Boton>
                </div>
            )}

            {/* Modal para aprobar contraprestación */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="z-50"
                size="lg"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-center">
                        <p className="text-titulos">Aprobar Contraprestación</p>
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            ¿Estás seguro que quieres aprobar la contraprestación de {contraprestacion.primerNombre} {contraprestacion.primerApellido} realizada en el semestre {contraprestacion.semestre}?
                        </p>

                        <p className="text-normal mt-6 mb-2">Informe de Contraprestación (PDF)</p>
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
                                <div className="flex flex-col">
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
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <Boton
                                            onClick={previewSelectedFile}
                                            variant="bordered"
                                            color="primary"
                                            startContent={<FileCheck size={18} />}
                                            disabled={!selectedFile}
                                        >
                                            Previsualizar Documento
                                        </Boton>
                                    </div>
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
                                    >
                                        Seleccionar archivo
                                    </button>
                                </>
                            )}
                        </div>

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
                            onClick={handleApproveContraprestacion}
                            disabled={approving || !selectedFile}
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

export default VerContraprestacion