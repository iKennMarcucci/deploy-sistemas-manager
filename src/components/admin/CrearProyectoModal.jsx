import { useState, useEffect, useRef } from "react"
import { XIcon, Save, Upload, ChevronDown, Plus, FilePlus2 } from "lucide-react"
import Boton from "../Boton"
import useProject from "../../lib/hooks/useProject"
import { ods } from "../../lib/controllers/ods"
import useAdmin from "../../lib/hooks/useAdmin"
// ('ANTEPROYECTO','ARTICULO','COLOQUIO','EVALUACION','TESIS','REQUISITOS','ACTASOLICITUD','ACTAAPROBACION','ACTAVB','ACTABORRADOR','ACTAORIGINAL')
const tiposDocumento = [
   { value: "REQUISITOS", label: "Requisitos" },
   { value: "ANTEPROYECTO", label: "Anteproyecto" },
   { value: "TESIS", label: "Tesis" },
   { value: "ACTASOLICITUD", label: "Acta de solicitud" },
   { value: "ACTAAPROBACION", label: "Acta de aprobación" },
   { value: "ACTAVB", label: "Acta de visto bueno" },
   { value: "ACTABORRADOR", label: "Acta borrador" },
   { value: "ACTAORIGINAL", label: "Acta original" },
]

export default function CrearProyectoModal({ isOpen, onCreated }) {
   const { obtenerGrupos, importProyecto, importDocumentos } = useAdmin()
   const { listDocentes, listEstudiantes } = useProject()

   const [grupos, setGrupos] = useState([])
   const [docentes, setDocentes] = useState([])
   const [estudiantes, setEstudiantes] = useState([])

   const [formData, setFormData] = useState({
      estudiante: null,
      titulo: "",
      pregunta: "",
      problema: "",
      objetivoGeneral: "",
      objetivosEspecificos: [],
      metaODS: [],
      grupo: null,
      linea: null,
      director: null,
      codirector: null,
      fase: 1
   })
   const [currentObjective, setCurrentObjective] = useState("")
   const [isOdsOpen, setIsOdsOpen] = useState(false)
   const [isGrupoOpen, setIsGrupoOpen] = useState(false)
   const [isLineaOpen, setIsLineaOpen] = useState(false)
   const [isDirectorOpen, setIsDirectorOpen] = useState(false)
   const [isCodirectorOpen, setIsCodirectorOpen] = useState(false)
   const [isEstudianteOpen, setIsEstudianteOpen] = useState(false)
   const [showConfirm, setShowConfirm] = useState(false)
   const [hasChanges, setHasChanges] = useState(false)
   const [tab, setTab] = useState(0) // 0: info, 1: documentos
   const [proyectoCreado, setProyectoCreado] = useState(null)
   const modalRef = useRef(null)

   // Documentos
   const [archivosAdjuntos, setArchivosAdjuntos] = useState([]) // [{file, tipoDocumento}]
   const [uploading, setUploading] = useState(false)
   const [uploadMsg, setUploadMsg] = useState("")

   useEffect(() => {
      setHasChanges(true)
   }, [formData])

   const handleClose = () => {
      if (hasChanges && !proyectoCreado) setShowConfirm(true)
      else isOpen(false)
   }

   const confirmClose = () => {
      setShowConfirm(false)
      isOpen(false)
   }

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (modalRef.current && !modalRef.current.contains(event.target)) handleClose()
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => { document.removeEventListener('mousedown', handleClickOutside) }
   }, [hasChanges, proyectoCreado])

   useEffect(() => {
      const fetchData = async () => {
         const gruposData = await obtenerGrupos()
         setGrupos(gruposData || [])
         const docentesData = await listDocentes()
         setDocentes(docentesData || [])
         const estudiantesData = await listEstudiantes()
         setEstudiantes(estudiantesData || [])
      }
      fetchData()
   }, [])

   const groupOptions = grupos.map(g => ({ id: g.id, value: g.nombre, lineasInvestigacion: g.lineasInvestigacion }))
   const lineOptions = formData.grupo ? formData.grupo.lineasInvestigacion : []

   const getNombreEstudiante = (est) => {
      if (est.primerNombre || est.primerApellido) {
         return `${est.primerNombre ?? ""} ${est.segundoNombre ?? ""} ${est.primerApellido ?? ""} ${est.segundoApellido ?? ""}`.trim()
      }
      return est.email || est.codigo || "Estudiante sin nombre"
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (
         !formData.estudiante ||
         !formData.titulo ||
         !formData.pregunta ||
         !formData.problema ||
         !formData.objetivoGeneral ||
         formData.objetivosEspecificos.length === 0 ||
         !formData.grupo ||
         !formData.linea
      ) {
         alert("Por favor, complete todos los campos obligatorios.")
         return
      }
      const metaODSFormateado = (formData.metaODS ?? []).map(id => ({ id }))

      const data = {
         titulo: formData.titulo,
         pregunta: formData.pregunta,
         problema: formData.problema,
         objetivoGeneral: formData.objetivoGeneral,
         estadoActual: formData.fase,
         objetivosEspecificos: formData.objetivosEspecificos,
         lineaInvestigacion: formData.linea,
         metaODS: metaODSFormateado,
         usuariosAsignados: [
            {
               idUsuario: formData.estudiante.id,
               rol: {
                  id: 1,
                  nombre: "Estudiante"
               }
            },
            {
               idUsuario: formData.director?.id,
               rol: {
                  id: 3,
                  nombre: "Director"
               }
            },
            {
               idUsuario: formData.codirector?.id,
               rol: {
                  id: 5,
                  nombre: "Codirector"
               }
            },
         ].filter(u => u.idUsuario),
      }

      const proyecto = await importProyecto({ body: data })
      if (proyecto && proyecto.id) {
         setProyectoCreado(proyecto)
         setTab(1)
         setHasChanges(false)
      }
   }

   const handleArchivosChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
         const nuevosArchivos = Array.from(e.target.files)
         const existentes = archivosAdjuntos.map(a => a.file)
         const todos = [
            ...archivosAdjuntos,
            ...nuevosArchivos
               .filter(
                  file => !existentes.some(f => f.name === file.name && f.size === file.size)
               )
               .map(file => ({ file, tipoDocumento: "" }))
         ]
         setArchivosAdjuntos(todos)
      }
   }

   const handleTipoDocumentoChange = (idx, value) => {
      setArchivosAdjuntos(prev =>
         prev.map((a, i) => i === idx ? { ...a, tipoDocumento: value } : a)
      )
   }

   const handleEliminarArchivo = (idx) => {
      setArchivosAdjuntos(prev => prev.filter((_, i) => i !== idx))
   }

   const handleUploadDocumento = async (e) => {
      e.preventDefault()
      if (
         archivosAdjuntos.length === 0 ||
         archivosAdjuntos.some(a => !a.tipoDocumento)
      ) {
         setUploadMsg("Completa el tipo de documento para todos los archivos.")
         return
      }
      setUploading(true)
      setUploadMsg("")
      try {
         const tags = archivosAdjuntos.map(() => "IMPORTADO")
         const tipos = archivosAdjuntos.map(a => a.tipoDocumento)
         const files = archivosAdjuntos.map(a => a.file)

         await importDocumentos({
            idProyecto: proyectoCreado?.id,
            tag: tags,
            tipoDoc: tipos,
            archivo: files
         })

         setUploadMsg("Documentos subidos correctamente.")
         setArchivosAdjuntos([])
      } catch (err) {
         setUploadMsg("Error al subir los documentos.")
      }
      setUploading(false)
   }

   return (
      <main className="bg-black/50 backdrop-blur-md flex justify-center items-center fixed w-full h-full z-50 left-0 top-0">
         <section ref={modalRef} className="bg-white modal-animation max-w-3xl w-full rounded-md p-6 overflow-y-auto max-h-[95vh]">
            <header className="flex justify-between items-center mb-2">
               <h6 className="text-lg font-semibold">Crear Nuevo Proyecto</h6>
               <button onClick={handleClose} className="text-black/50 hover:text-black duration-150">
                  <XIcon size={20} />
               </button>
            </header>
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
               <button
                  className={`px-4 py-2 rounded-t-md font-semibold border-b-2 ${tab === 0 ? "border-azul text-azul bg-azul-claro/10" : "border-transparent text-black/60"}`}
                  onClick={() => setTab(0)}
                  disabled={tab === 0}
                  type="button"
               >
                  Información del Proyecto
               </button>
               <button
                  className={`px-4 py-2 rounded-t-md font-semibold border-b-2 ${tab === 1 ? "border-azul text-azul bg-azul-claro/10" : "border-transparent text-black/60"} ${!proyectoCreado ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => proyectoCreado && setTab(1)}
                  disabled={!proyectoCreado || tab === 1}
                  type="button"
               >
                  Documentos
               </button>
            </div>
            {/* Tab 1: Formulario */}
            {tab === 0 && (
               <form onSubmit={handleSubmit} className="space-y-3 text-sm">
                  {/* Selección de estudiante */}
                  <div className="space-y-1">
                     <label className="font-bold select-none">Estudiante</label>
                     <div className="relative w-full">
                        <button
                           type="button"
                           className="border-gris-claro text-start border rounded-md p-2.5 w-full flex justify-between items-center"
                           onClick={() => setIsEstudianteOpen(!isEstudianteOpen)}
                        >
                           <p>
                              {!formData.estudiante
                                 ? "Seleccione un estudiante"
                                 : getNombreEstudiante(formData.estudiante)}
                           </p>
                           <ChevronDown size={18} className={`${isEstudianteOpen ? "-rotate-180" : "rotate-0"} duration-150`} />
                        </button>
                        {isEstudianteOpen && (
                           <div className="bg-white border-gris-claro max-h-40 overflow-y-auto border absolute top-[110%] left-0 w-full select-animation rounded-md z-10">
                              {estudiantes.map((est, idx) => (
                                 <button
                                    key={est.id}
                                    type="button"
                                    onClick={() => {
                                       setFormData({ ...formData, estudiante: est })
                                       setIsEstudianteOpen(false)
                                    }}
                                    className="hover:bg-gris-claro/50 w-full text-start duration-150 p-2.5 text-sm"
                                 >
                                    {getNombreEstudiante(est)}
                                 </button>
                              ))}
                              {estudiantes.length === 0 && (
                                 <div className="text-center text-xs text-gray-400 p-2">No hay estudiantes disponibles</div>
                              )}
                           </div>
                        )}
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="font-bold select-none">Título del Proyecto</label>
                     <input className="border-gris-claro border rounded-md p-2.5 w-full"
                        onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                        value={formData.titulo}
                        placeholder="Ingrese el título de su proyecto"
                        autoComplete="off"
                        required
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="font-bold select-none">Fase del Proyecto</label>
                     <select
                        className="border-gris-claro border rounded-md p-2.5 w-full"
                        value={formData.fase ?? 1}
                        onChange={e => setFormData({ ...formData, fase: Number(e.target.value) })}
                     >
                        <option value={1}>Fase 1</option>
                        <option value={2}>Fase 2</option>
                        <option value={3}>Fase 3</option>
                        <option value={4}>Fase 4</option>
                        <option value={5}>Fase 5</option>
                        <option value={6}>Fase 6</option>
                        <option value={7}>Fase 7</option>
                        <option value={8}>Fase 8</option>
                        <option value={9}>Fase 9</option>
                        <option value={0}>Proyecto Terminado</option>
                     </select>
                  </div>
                  <div className="space-y-1">
                     <label className="font-bold select-none">Objetivos de Desarrollo Sostenible</label>
                     <div className="flex flex-wrap gap-2 mb-2">
                        {(formData.metaODS ?? []).map(id => {
                           const objetivo = ods.find(o => o.id === Number(id))
                           if (!objetivo) return null
                           return (
                              <span key={id} className="flex items-center bg-gray-200 rounded px-2 py-1 text-xs">
                                 {objetivo.nombre}
                                 <button
                                    type="button"
                                    className="ml-1 text-red-500 hover:text-red-700"
                                    onClick={() =>
                                       setFormData({
                                          ...formData,
                                          metaODS: (formData.metaODS ?? []).filter(oid => oid !== id)
                                       })
                                    }
                                 >
                                    <XIcon size={14} />
                                 </button>
                              </span>
                           )
                        })}
                     </div>
                     <div className="relative w-full">
                        <button
                           type="button"
                           onClick={() => setIsOdsOpen(!isOdsOpen)}
                           className="border-gris-claro text-start border rounded-md p-2 w-full flex justify-between items-center"
                        >
                           <span>
                              {formData.metaODS?.length
                                 ? "Agregar más ODS"
                                 : "Seleccione uno o varios ODS"}
                           </span>
                           <ChevronDown size={18} className={`${isOdsOpen ? "-rotate-180" : "rotate-0"} duration-150`} />
                        </button>
                        {isOdsOpen && (
                           <div className="bg-white border-gris-claro max-h-40 overflow-y-auto border absolute top-[110%] left-0 w-full select-animation rounded-md z-10">
                              {ods
                                 .filter(o => !(formData.metaODS ?? []).includes(o.id))
                                 .map(o => (
                                    <button
                                       key={o.id}
                                       type="button"
                                       onClick={() => {
                                          setFormData({
                                             ...formData,
                                             metaODS: [...(formData.metaODS ?? []), o.id]
                                          })
                                          setIsOdsOpen(false)
                                       }}
                                       className="hover:bg-gris-claro/50 w-full text-start duration-150 p-2 text-sm"
                                    >
                                       {o.nombre}
                                    </button>
                                 ))}
                              {ods.filter(o => !(formData.metaODS ?? []).includes(o.id)).length === 0 && (
                                 <div className="text-center text-xs text-gray-400 p-2">No hay más ODS disponibles</div>
                              )}
                           </div>
                        )}
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="font-bold select-none">Pregunta de Investigación</label>
                     <input className="border-gris-claro border rounded-md p-2.5 w-full"
                        onChange={e => setFormData({ ...formData, pregunta: e.target.value })}
                        value={formData.pregunta}
                        placeholder="¿Cuál es la pregunta principal que aborda su investigación?"
                        autoComplete="off"
                        required
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="font-bold select-none">Descripción del Problema</label>
                     <textarea className="border-gris-claro border rounded-md p-2.5 w-full resize-none"
                        onChange={e => setFormData({ ...formData, problema: e.target.value })}
                        value={formData.problema}
                        placeholder="Describa el problema que aborda su proyecto"
                        rows={3}
                        required
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="font-bold select-none">Objetivo General</label>
                     <textarea className="border-gris-claro border rounded-md p-2.5 w-full resize-none"
                        onChange={e => setFormData({ ...formData, objetivoGeneral: e.target.value })}
                        value={formData.objetivoGeneral}
                        placeholder="Describa el objetivo general de su proyecto"
                        rows={3}
                        required
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="font-bold select-none">Objetivos Específicos</label>
                     <div className="flex gap-2 items-stretch">
                        <input className="border-gris-claro border rounded-md p-2 w-full"
                           onChange={e => setCurrentObjective(e.target.value)}
                           value={currentObjective}
                           placeholder="Agrega los objetivos específicos de su proyecto (mín: 1)"
                           autoComplete="off"
                           type="text"
                        />
                        <button type="button" className="hover:border-gris-institucional border aspect-square rounded-md p-2"
                           onClick={() => {
                              if (currentObjective.trim() !== "") {
                                 setFormData({
                                    ...formData,
                                    objetivosEspecificos: [
                                       ...formData.objetivosEspecificos,
                                       { numeroOrden: formData.objetivosEspecificos.length + 1, descripcion: currentObjective }
                                    ]
                                 })
                                 setCurrentObjective("")
                              }
                           }}>
                           <Plus />
                        </button>
                     </div>
                     <div className={`${formData.objetivosEspecificos.length !== 0 && "border-gris-claro border space-y-1 rounded-md p-1.5"}`}>
                        {formData.objetivosEspecificos.map((obj, i) =>
                           <div key={obj.numeroOrden} className="flex items-stretch gap-2">
                              <input className="bg-gris-claro/25 border-gris-claro/25 border rounded-md p-1.5 w-full"
                                 type="text"
                                 value={obj.descripcion}
                                 onChange={e => {
                                    const newobjetivosEspecificos = formData.objetivosEspecificos.map((o, idx) => idx === i ? { ...o, descripcion: e.target.value } : o)
                                    setFormData({ ...formData, objetivosEspecificos: newobjetivosEspecificos })
                                 }}
                              />
                              <button type="button" className="bg-rojo-institucional hover:bg-rojo-mate border-rojo-institucional border text-white aspect-square rounded-md p-1.5" onClick={() => {
                                 const newobjetivosEspecificos = [...formData.objetivosEspecificos]
                                 newobjetivosEspecificos.splice(i, 1)
                                 setFormData({ ...formData, objetivosEspecificos: newobjetivosEspecificos })
                              }}>
                                 <XIcon size={20} strokeWidth={2.5} />
                              </button>
                           </div>
                        )}
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="font-bold select-none">Grupo y Línea de Investigación</label>
                     <div className="flex items-center gap-2">
                        <div className="relative w-full">
                           <button type="button" className="border-gris-claro text-start border rounded-md p-2.5 w-full flex justify-between items-center"
                              onClick={() => setIsGrupoOpen(!isGrupoOpen)}>
                              <p>{!formData.grupo ? "Seleccione un grupo de investigación" : formData.grupo.nombre}</p>
                              <ChevronDown size={18} className={`${isGrupoOpen ? "-rotate-180" : "rotate-0"} duration-150`} />
                           </button>
                           {isGrupoOpen &&
                              <div className="bg-white border-gris-claro max-h-40 overflow-y-auto border absolute top-[110%] left-0 w-full select-animation rounded-md z-10">
                                 {groupOptions.map((grupo, index) =>
                                    <button key={index} onClick={() => {
                                       setFormData({ ...formData, grupo: grupos.find(g => g.id === grupo.id), linea: grupos.find(g => g.id === grupo.id).lineasInvestigacion[0] })
                                       setIsGrupoOpen(false)
                                    }} type="button"
                                       className="hover:bg-gris-claro/50 w-full text-start duration-150 p-2.5 text-sm">
                                       {grupo.value}
                                    </button>
                                 )}
                              </div>
                           }
                        </div>
                        <div className="relative w-full">
                           <button type="button" disabled={!formData.grupo} className="border-gris-claro text-start border rounded-md p-2.5 w-full flex justify-between items-center"
                              onClick={() => setIsLineaOpen(!isLineaOpen)}>
                              <p>{!formData.linea && !formData.grupo ? "Primero seleccione un grupo de investigación" : formData.linea?.nombre}</p>
                              <ChevronDown size={18} className={`${isLineaOpen ? "-rotate-180" : "rotate-0"} duration-150`} />
                           </button>
                           {isLineaOpen && formData.grupo &&
                              <div className="bg-white border-gris-claro max-h-40 overflow-y-auto border absolute top-[110%] left-0 w-full select-animation rounded-md z-10">
                                 {lineOptions.map((linea, index) =>
                                    <button key={index} onClick={() => {
                                       setFormData({ ...formData, linea: linea })
                                       setIsLineaOpen(false)
                                    }} type="button"
                                       className="hover:bg-gris-claro/50 w-full text-start duration-150 p-2.5 text-sm">
                                       {linea.nombre}
                                    </button>
                                 )}
                              </div>
                           }
                        </div>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="font-bold select-none">Recomendar Director y Codirector (OPCIONAL)</label>
                     <div className="flex items-center gap-2">
                        <div className="relative w-full">
                           <button type="button" className="border-gris-claro text-start border rounded-md p-2.5 w-full flex justify-between items-center"
                              onClick={() => setIsDirectorOpen(!isDirectorOpen)}>
                              <p>{!formData.director ? "Seleccione un director" :
                                 `${formData.director.primerNombre ?? ""} ${formData.director.segundoNombre ?? ""} 
                              ${formData.director.primerApellido ?? ""} ${formData.director.segundoApellido ?? ""}`}</p>
                              <ChevronDown size={18} className={`${isDirectorOpen ? "-rotate-180" : "rotate-0"} duration-150`} />
                           </button>
                           {isDirectorOpen &&
                              <div className="bg-white border-gris-claro max-h-40 overflow-y-auto border absolute top-[110%] left-0 w-full select-animation rounded-md z-10">
                                 {docentes.filter(u => u.id !== formData.codirector?.id).map((user, index) =>
                                    <button key={index} onClick={() => {
                                       setFormData({ ...formData, director: user })
                                       setIsDirectorOpen(false)
                                    }} type="button"
                                       className="hover:bg-gris-claro/50 w-full text-start duration-150 p-2.5 text-sm">
                                       {`${user.primerNombre ?? ""} ${user.segundoNombre ?? ""} ${user.primerApellido ?? ""} ${user.segundoApellido ?? ""}`}
                                    </button>
                                 )}
                              </div>
                           }
                        </div>
                        <div className="relative w-full">
                           <button type="button" className="border-gris-claro text-start border rounded-md p-2.5 w-full flex justify-between items-center"
                              onClick={() => setIsCodirectorOpen(!isCodirectorOpen)}>
                              <p>{!formData.codirector ? "Seleccione un codirector" :
                                 `${formData.codirector.primerNombre ?? ""} ${formData.codirector.segundoNombre ?? ""} 
                              ${formData.codirector.primerApellido ?? ""} ${formData.codirector.segundoApellido ?? ""}`}</p>
                              <ChevronDown size={18} className={`${isCodirectorOpen ? "-rotate-180" : "rotate-0"} duration-150`} />
                           </button>
                           {isCodirectorOpen &&
                              <div className="bg-white border-gris-claro max-h-40 overflow-y-auto border absolute top-[110%] left-0 w-full select-animation rounded-md z-10">
                                 {docentes.filter(u => u.id !== formData.director?.id).map((user, index) =>
                                    <button key={index} onClick={() => {
                                       setFormData({ ...formData, codirector: user })
                                       setIsCodirectorOpen(false)
                                    }} type="button"
                                       className="hover:bg-gris-claro/50 w-full text-start duration-150 p-2.5 text-sm">
                                       {`${user.primerNombre ?? ""} ${user.segundoNombre ?? ""} ${user.primerApellido ?? ""} ${user.segundoApellido ?? ""}`}
                                    </button>
                                 )}
                              </div>
                           }
                        </div>
                     </div>
                  </div>
                  <div className="flex items-stretch gap-2 pt-4">
                     <Boton type="button" variant="whitered" onClick={handleClose}>
                        Cancelar
                     </Boton>
                     <Boton type="submit" variant="borderwhite">
                        Siguiente
                        <Save size={16} />
                     </Boton>
                  </div>
               </form>
            )}
            {/* Tab 2: Documentos */}
            {tab === 1 && (
               <form onSubmit={handleUploadDocumento} className="space-y-4 text-sm">
                  <div className="space-y-1">
                     <label className="font-bold select-none">Adjuntar Archivos (PDF, puede seleccionar varios)</label>
                     <input
                        id="archivoDocumento"
                        type="file"
                        accept=".pdf"
                        multiple
                        onChange={handleArchivosChange}
                        className="block"
                     />
                  </div>
                  {/* Lista de archivos adjuntos */}
                  {archivosAdjuntos.length > 0 && (
                     <div className="space-y-2">
                        {archivosAdjuntos.map((a, idx) => (
                           <div key={idx} className="flex items-center gap-3 border rounded-md p-2">
                              <span className="truncate flex-1">{a.file.name}</span>
                              <span className="text-xs text-gray-500">{(a.file.size / 1024).toFixed(1)} KB</span>
                              <select
                                 className="border-gris-claro border rounded-md p-1 text-xs"
                                 value={a.tipoDocumento}
                                 onChange={e => handleTipoDocumentoChange(idx, e.target.value)}
                                 required
                              >
                                 <option value="">Tipo de documento</option>
                                 {tiposDocumento.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                 ))}
                              </select>
                              <button
                                 type="button"
                                 className="text-red-500 hover:text-red-700 font-bold text-lg"
                                 onClick={() => handleEliminarArchivo(idx)}
                                 aria-label={`Eliminar archivo ${a.file.name}`}
                              >
                                 ×
                              </button>
                           </div>
                        ))}
                     </div>
                  )}
                  {uploadMsg && (
                     <div className={`text-sm ${uploadMsg.includes("Error") ? "text-red-600" : "text-green-600"}`}>{uploadMsg}</div>
                  )}
                  <div className="flex items-stretch gap-2 pt-2">
                     <Boton type="button" variant="borderwhite" onClick={() => setTab(0)}>
                        Volver
                     </Boton>
                     <Boton type="submit" variant="borderwhite" disabled={uploading}>
                        Subir Documento
                        <FilePlus2 size={16} />
                     </Boton>
                     <Boton type="button" variant="whitered" onClick={handleClose}>
                        Finalizar
                     </Boton>
                  </div>
               </form>
            )}
            {/* Modal de confirmación de cierre */}
            {showConfirm && (
               <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-md p-6 max-w-sm w-full flex flex-col gap-4">
                     <h6 className="font-bold text-lg">¿Salir sin guardar?</h6>
                     <p className="text-sm">Tienes cambios sin guardar. Si sales, perderás toda la información ingresada.</p>
                     <div className="flex gap-2 justify-end">
                        <Boton variant="borderwhite" onClick={() => setShowConfirm(false)}>
                           Cancelar
                        </Boton>
                        <Boton variant="whitered" onClick={confirmClose}>
                           Salir sin guardar
                        </Boton>
                     </div>
                  </div>
               </div>
            )}
         </section>
      </main>
   )
}