import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import {
    FileText,
    ArrowLeft,
    CheckCircle,
    Download,
    Upload,
    X,
    FileCheck
} from "lucide-react";
import {
    Input,
    Divider
} from "@heroui/react";
import Boton from "../../components/Boton";
import Modal from "../../components/Modal";
import AlertaModal from "../../components/AlertaModal";

const VerCancelacion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [solicitud, setSolicitud] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Estados para el modal de aprobación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileError, setFileError] = useState(null);
    const [approving, setApproving] = useState(false);
    const fileInputRef = useRef(null);

    // Estado para controlar la descarga del informe
    const [downloadingReport, setDownloadingReport] = useState(false);

    // Estados para AlertaModal
    const [alertaModalOpen, setAlertaModalOpen] = useState(false);
    const [alertaMessage, setAlertaMessage] = useState("");
    const [alertaType, setAlertaType] = useState("success");
    const [alertaTitulo, setAlertaTitulo] = useState("");

    // Función para mostrar alerta
    const showAlerta = (mensaje, tipo, titulo) => {
        setAlertaMessage(mensaje);
        setAlertaType(tipo);
        setAlertaTitulo(titulo || (tipo === 'success' ? 'Operación exitosa' : 'Error'));
        setAlertaModalOpen(true);
    };

    useEffect(() => {
        fetchCancelacionData();
    }, [id, backendUrl]);

    const fetchCancelacionData = () => {
        setLoading(true);
        fetch(`${backendUrl}/solicitud/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar la información de la cancelación');
                }
                return response.json();
            })
            .then(data => {
                setSolicitud(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
                showAlerta('No se pudo cargar la información de la cancelación', 'error', 'Error de conexión');
            });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileError(null);

        // Validar tipo de archivo (PDF o DOCX)
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            setFileError('Solo se permiten archivos PDF o DOCX');
            setSelectedFile(null);
            setFileName('');
            return;
        }

        // Validar tamaño (máximo 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setFileError('El archivo no debe exceder los 10MB');
            setSelectedFile(null);
            setFileName('');
            return;
        }

        setSelectedFile(file);
        setFileName(file.name);
    };

    const handleApproveCancelacion = async () => {
        if (!selectedFile) {
            setFileError('Debe seleccionar un archivo para aprobar la cancelación');
            return;
        }

        setApproving(true);
        setFileError(null);

        const formData = new FormData();
        formData.append('informe', selectedFile);
        const userStorage = JSON.parse(localStorage.getItem('userInfo'));
        const nombreUsuario = userStorage && userStorage.nombre ? userStorage.nombre : "Usuario no identificado";

        try {
            const response = await fetch(`${backendUrl}/cancelacion/aprobar/${id}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Usuario': nombreUsuario,
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al aprobar la cancelación');
            }

            // Actualizar datos después de aprobar
            fetchCancelacionData();
            setIsModalOpen(false);
            showAlerta(data.mensaje || 'Cancelación aprobada con éxito', 'success', 'Solicitud aprobada');
        } catch (err) {
            setFileError(err.message);
            showAlerta(err.message, 'error', 'Error al aprobar');
        } finally {
            setApproving(false);
        }
    };

    const openFileSelector = () => {
        fileInputRef.current.click();
    };

    // Función para descargar el documento de soporte
    const handleDownloadReport = async () => {
        if (!solicitud.soporte || !solicitud.soporte.id) {
            showAlerta('No hay informe disponible para descargar', 'error', 'Error de descarga');
            return;
        }

        const soporteId = solicitud.soporte.id;

        try {
            setDownloadingReport(true);

            const response = await fetch(`${backendUrl}/api/s3/download/${soporteId}`, {
                method: 'GET',
                headers: {
                    'Accept': '*/*'
                }
            });

            if (!response.ok) {
                throw new Error('Error al descargar el archivo');
            }

            // Obtener el blob del archivo
            const blob = await response.blob();

            // Extraer el nombre del archivo del header Content-Disposition si está disponible
            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = solicitud.soporte.nombre_archivo || 'informe.pdf';

            if (contentDisposition) {
                // Intentar extraer el nombre del archivo del header
                const filenameRegex = /filename\*=UTF-8''([^;]+)/;
                const matches = filenameRegex.exec(contentDisposition);
                if (matches && matches.length > 1) {
                    fileName = decodeURIComponent(matches[1]);
                }
            }

            // Crear URL para descarga
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);

            // Agregar al DOM y simular clic para iniciar la descarga
            document.body.appendChild(link);
            link.click();

            // Limpiar elementos del DOM y revocar URL
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            // Mostrar mensaje de éxito
            showAlerta('Documento descargado correctamente', 'success', 'Descarga completada');

        } catch (error) {
            showAlerta(`Error al descargar el informe: ${error.message}`, 'error', 'Error de descarga');
        } finally {
            setDownloadingReport(false);
        }
    };

    const previewSelectedFile = () => {
        if (!selectedFile) return;

        // Crear un objeto URL para el archivo seleccionado
        const fileUrl = URL.createObjectURL(selectedFile);

        // Abrir en una nueva ventana
        window.open(fileUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-medium">Cargando información...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-lg text-red-600 mb-4">Error: {error}</p>
                <Boton onClick={() => navigate('/cancelaciones')} startContent={<ArrowLeft size={18} />}>
                    Volver a Cancelaciones
                </Boton>
            </div>
        );
    }

    return (
        <div className='flex flex-col w-full items-center p-4'>
            <div className='w-full flex flex-row justify-between mb-6'>
                <button
                    className='w-[40px] h-[30px] text-[30px] bg-rojo-mate flex items-center justify-center rounded-md border border-rojo-mate text-white hover:bg-rojo-oscuro ease-in-out transition-all duration-300'
                    onClick={() => navigate('/cancelaciones')}
                >
                    <ArrowLeft />
                </button>
                <p className='text-center text-titulos'>Detalles de Solicitud de Cancelación</p>
                <div className='w-[40px]'></div>
            </div>

            {/* Información de la cancelación */}
            <p className='text-normal'>Información de la cancelación</p>
            <Divider className='mb-4' />

            <div className='w-full flex flex-col'>
                {/* Primera fila: Estudiante y Materia */}
                <div className='w-full flex flex-row'>
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2'
                        }}
                        readOnly
                        className='mb-4'
                        label='Estudiante'
                        labelPlacement='outside-left'
                        type='text'
                        value={solicitud.estudianteNombre || ''}
                    />
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2'
                        }}
                        readOnly
                        className='mb-4'
                        label='Materia'
                        labelPlacement='outside-left'
                        type='text'
                        value={solicitud.grupoNombre?.split(' - ')[0] || 'No especificada'}
                    />
                </div>

                {/* Segunda fila: Grupo y Semestre */}
                <div className='w-full flex flex-row'>
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2'
                        }}
                        readOnly
                        className='mb-4'
                        label='Grupo'
                        labelPlacement='outside-left'
                        type='text'
                        value={solicitud.grupoCodigo || 'No especificado'}
                    />
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2'
                        }}
                        readOnly
                        className='mb-4'
                        label='Semestre'
                        labelPlacement='outside-left'
                        type='text'
                        value={solicitud.semestre || ''}
                    />
                </div>

                {/* Tercera fila: Fecha de solicitud y Estado */}
                <div className='w-full flex flex-row'>
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                            base: 'flex items-start',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                            mainWrapper: 'w-1/2'
                        }}
                        readOnly
                        className='mb-4'
                        label='Fecha de solicitud'
                        labelPlacement='outside-left'
                        type='text'
                        value={formatDate(solicitud.fechaCreacion) || ''}
                    />
                    <Input
                        classNames={{
                            label: `w-1/4 h-[40px] flex items-center`,
                            base: 'flex items-start',
                            inputWrapper:
                                `border border-gris-institucional rounded-[15px] w-full max-h-[40px] ${solicitud.estaAprobado
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-yellow-50 text-yellow-600'
                                }`,
                            mainWrapper: 'w-1/2'
                        }}
                        readOnly
                        className='mb-4'
                        label='Estado'
                        labelPlacement='outside-left'
                        type='text'
                        value={solicitud.estaAprobado ? 'Aprobada' : 'Pendiente'}

                    />
                </div>
            </div>

            {/* Motivo de la Solicitud */}
            <p className='text-normal mt-8'>Motivo de la Solicitud</p>
            <Divider className='mb-4' />
            <div className='w-full'>
                <div className='w-full px-4'>
                    <textarea
                        className='w-full p-3 border border-gris-institucional rounded-[15px] min-h-[120px] resize-none'
                        readOnly
                        value={solicitud.descripcion || 'No se ha especificado motivo'}
                    />
                </div>
            </div>

            {/* Informe de la cancelación (solo se muestra si está aprobado) */}
            {solicitud.estaAprobado && solicitud.soporte && (
                <>
                    <p className='text-normal mt-8'>Informe de Cancelación de Materia</p>
                    <Divider className='mb-4' />
                    <div className='w-full px-4'>
                        <div className='w-full flex flex-row items-center border border-gris-institucional rounded-[15px] p-4'>
                            <div className='flex-grow'>
                                <div className='flex items-center'>
                                    <FileText className="text-rojo-institucional mr-2" />
                                    <p className="font-medium">{solicitud.soporte.nombre_archivo}</p>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Tipo: {solicitud.soporte.mime_type} | Tamaño: {solicitud.soporte.peso}
                                </p>
                                <p className="text-sm text-gray-500">Subido el {formatDate(solicitud.soporte.fecha_subida)}</p>
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

            {/* Botón para aprobar (solo si no está aprobado) */}
            {!solicitud.estaAprobado && (
                <div className='mt-8 w-full flex justify-end'>
                    <Boton
                        startContent={<CheckCircle size={18} />}
                        color="success"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Aprobar Solicitud
                    </Boton>
                </div>
            )}

            {/* Modal para aprobar solicitud */}
            <Modal
                isOpen={isModalOpen}
                onOpenChange={(open) => {
                    if (!approving) setIsModalOpen(open);
                }}
                cabecera=""
                size="xl"
                cuerpo={
                    <div>
                        <div className="flex flex-col gap-1 text-center mb-6">
                            <p className="text-2xl font-semibold text-titulos">Aprobar Solicitud de Cancelación</p>
                        </div>

                        <p>
                            ¿Está seguro que desea aprobar la solicitud de cancelación de la materia <strong>{solicitud.grupoNombre?.split(' - ')[0]}</strong> para el estudiante <strong>{solicitud.estudianteNombre}</strong>?
                        </p>
                        <p className="mt-2 mb-1">
                            Esta acción cancelará la materia {solicitud.grupoNombre?.split(' - ')[0]} del grupo {solicitud.grupoCodigo} para el semestre {solicitud.semestre}.
                        </p>

                        <p className="text-normal mt-6 mb-2">Documento de Soporte (PDF o DOCX)</p>
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
                                                setSelectedFile(null);
                                                setFileName('');
                                            }}
                                            disabled={approving}
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
                                        disabled={approving}
                                    >
                                        Seleccionar archivo
                                    </button>
                                </>
                            )}
                        </div>

                        {fileError && (
                            <p className="text-red-600 mt-2 text-sm">{fileError}</p>
                        )}
                    </div>
                }
                footer={
                    <div className="flex justify-end w-full">
                        <Boton
                            color="success"
                            onClick={handleApproveCancelacion}
                            disabled={approving || !selectedFile}
                            startContent={approving ? null : <CheckCircle size={18} />}
                        >
                            {approving ? 'Aprobando...' : 'Aprobar'}
                        </Boton>
                    </div>
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
    );
};

export default VerCancelacion;