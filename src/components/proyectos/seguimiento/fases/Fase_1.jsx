import { Save } from "lucide-react"
import { useState } from "react"
import Boton from "../../../Boton"
import Actividades from "../componentes/Actividades"
import { Plus } from "lucide-react"
import { XIcon } from "lucide-react"
import useProject from "../../../../lib/hooks/useProject"
import { useEffect } from "react"
import { ods } from "../../../../lib/controllers/ods"
import { useRef } from "react"
import { ChevronDown } from "lucide-react"

const actividades = [
   {
      title: "Formulario de Inicio de Proyecto",
      tasks: [
         {
            desc: "Completar información básica"
         },
         {
            desc: "Seleccionar grupo y línea de investigación"
         },
         {
            desc: "Definir objetivos"
         },
      ],
   },
]

export default function Fase_1({ project }) {
   const { createProject, editProject } = useProject()
   const [currentObjective, setCurrentObjective] = useState("")
   const [isOdsOpen, setIsOdsOpen] = useState(false)
   const odsRef = useRef(null)
   const [formData, setFormData] = useState({
      titulo: "",
      pregunta: "",
      problema: "",
      objetivoGeneral: "",
      objetivosEspecificos: [],
      metaODS: []
   })

   function normalizaFormData(data) {
      return {
         ...data,
         metaODS: Array.isArray(data.metaODS)
            ? data.metaODS.map(o => typeof o === "object" && o !== null ? o.id : o)
            : []
      }
   }

   const onSubmit = async (e) => {
      e.preventDefault()
      setCurrentObjective("")
      if (formData.objetivosEspecificos.length === 0) {
         alert("Agrega al menos un objetivo específico")
         return
      }
      const metaODSFormateado = (formData.metaODS ?? []).map(id => ({ id }))

      if (formData?.estadoActual === 1) {
         const res = await editProject({
            titulo: formData.titulo,
            pregunta: formData.pregunta,
            problema: formData.problema,
            objetivoGeneral: formData.objetivoGeneral,
            objetivosEspecificos: formData.objetivosEspecificos,
            metaODS: metaODSFormateado
         }, formData?.id)
         setFormData(normalizaFormData(res))
         return
      } else if (formData?.estadoActual === undefined) {
         const res = await createProject({
            titulo: formData.titulo,
            pregunta: formData.pregunta,
            problema: formData.problema,
            objetivoGeneral: formData.objetivoGeneral,
            objetivosEspecificos: formData.objetivosEspecificos,
            metaODS: metaODSFormateado,
            estadoActual: 1
         })
         setFormData(normalizaFormData(res))
         window.location.reload()
         return
      }
   }

   useEffect(() => {
      const fetchProject = async () => {
         const data = project
         if (!data) {
            setFormData({
               titulo: "",
               pregunta: "",
               problema: "",
               objetivoGeneral: "",
               objetivosEspecificos: [],
               metaODS: []
            })
            return
         }
         setFormData({
            ...data,
            metaODS: Array.isArray(data.metaODS)
               ? data.metaODS.map(o => typeof o === "object" && o !== null ? o.id : o)
               : []
         })
      }
      fetchProject()
   }, [])

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (odsRef.current && !odsRef.current.contains(event.target)) setIsOdsOpen(false)
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => { document.removeEventListener("mousedown", handleClickOutside) }
   }, [])

   return (
      <section className="space-y-5">
         <div>
            <h4 className="font-bold text-2xl">Fase 1: Inicio del Proyecto</h4>
            <p className="text-gris-institucional text-sm">
               Complete el formulario inicial con la información básica del proyecto
            </p>
         </div>

         <Actividades taskList={actividades} />

         <form onSubmit={onSubmit} className='flex flex-col w-full space-y-2.5 text-sm'>
            <div className="space-y-1">
               <label htmlFor="titulo" className="font-bold select-none">Título del Proyecto</label>
               <input className="border-gris-claro border rounded-md p-2.5 w-full"
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  value={formData.titulo}
                  placeholder="Ingrese el título de su proyecto"
                  autoComplete="off"
                  name="titulo"
                  type="text"
                  id="titulo"
                  readOnly={formData?.estadoActual !== 1 && formData?.estadoActual !== undefined}
                  required
               />
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
               <div ref={odsRef} className="relative w-full">
                  <button
                     type="button"
                     disabled={formData?.estadoActual !== 1 && formData?.estadoActual !== undefined}
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
               <label htmlFor="pregunta" className="font-bold select-none">Pregunta de Investigación</label>
               <input className="border-gris-claro border rounded-md p-2.5 w-full"
                  onChange={(e) => setFormData({ ...formData, pregunta: e.target.value })}
                  value={formData.pregunta}
                  placeholder="¿Cuál es la pregunta principal que aborda su investigación?"
                  autoComplete="off"
                  name="pregunta"
                  type="text"
                  id="pregunta"
                  readOnly={formData?.estadoActual !== 1 && formData?.estadoActual !== undefined}
                  required
               />
            </div>

            <div className="space-y-1">
               <label htmlFor="problema" className="font-bold select-none">Descripción del Problema</label>
               <textarea className="border-gris-claro border rounded-md p-2.5 w-full resize-none"
                  onChange={(e) => setFormData({ ...formData, problema: e.target.value })}
                  value={formData.problema}
                  placeholder="Describa el problema que aborda su proyecto"
                  name="problema"
                  id="problema"
                  rows={3}
                  readOnly={formData?.estadoActual !== 1 && formData?.estadoActual !== undefined}
                  required
               />
            </div>

            <div className="space-y-1">
               <label htmlFor="objetivoGeneral" className="font-bold select-none">Objetivo General</label>
               <textarea className="border-gris-claro border rounded-md p-2.5 w-full resize-none"
                  onChange={(e) => setFormData({ ...formData, objetivoGeneral: e.target.value })}
                  value={formData.objetivoGeneral}
                  placeholder="Describa el objetivo general de su proyecto"
                  name="objetivoGeneral"
                  id="objetivoGeneral"
                  rows={3}
                  required
                  readOnly={formData?.estadoActual !== 1 && formData?.estadoActual !== undefined}
               />
            </div>

            <div className="space-y-1">
               <label htmlFor="objetivosEspecificos" className="font-bold select-none">Objetivos Específicos</label>
               <div className="flex gap-2 items-stretch">
                  <input className="border-gris-claro border rounded-md p-2 w-full"
                     onChange={(e) => setCurrentObjective(e.target.value)}
                     value={currentObjective}
                     placeholder="Agrega los objetivos específicos de su proyecto (mín: 1)"
                     autoComplete="off"
                     name="objetivosEspecificos"
                     type="text"
                     id="objetivosEspecificos"
                     required={formData.objetivosEspecificos.length === 0}
                     readOnly={formData?.estadoActual !== 1 && formData?.estadoActual !== undefined}
                  />
                  {
                     formData?.estadoActual === 1 || formData?.estadoActual === undefined &&
                     <button type="button" className="hover:border-gris-institucional border aspect-square rounded-md p-2"
                        onClick={() => {
                           setFormData({ ...formData, objetivosEspecificos: [...formData.objetivosEspecificos, { numeroOrden: formData.objetivosEspecificos.length + 1, descripcion: currentObjective }] })
                           setCurrentObjective("")
                        }}>
                        <Plus />
                     </button>
                  }
               </div>
               <div className={`${formData.objetivosEspecificos.length !== 0 && "border-gris-claro border space-y-1 rounded-md p-1.5"}`}>
                  {
                     formData.objetivosEspecificos.map((obj, i) =>
                        <div key={obj.numeroOrden} className="flex items-stretch gap-2">
                           <input className="bg-gris-claro/25 border-gris-claro/25 border rounded-md p-1.5 w-full"
                              type="text"
                              value={obj.descripcion}
                              readOnly={formData?.estadoActual !== 1 && formData?.estadoActual !== undefined}
                              onChange={e => {
                                 const newobjetivosEspecificos = formData.objetivosEspecificos.map((o, idx) => idx === i ? { ...o, descripcion: e.target.value } : o)
                                 setFormData({ ...formData, objetivosEspecificos: newobjetivosEspecificos })
                              }}
                           />
                           {
                              formData?.estadoActual === 1 || formData?.estadoActual === undefined &&
                              <button type="button" className="bg-rojo-institucional hover:bg-rojo-mate border-rojo-institucional border text-white aspect-square rounded-md p-1.5" onClick={() => {
                                 const newobjetivosEspecificos = [...formData.objetivosEspecificos]
                                 newobjetivosEspecificos.splice(i, 1)
                                 setFormData({ ...formData, objetivosEspecificos: newobjetivosEspecificos })
                              }}>
                                 <XIcon size={20} strokeWidth={2.5} />
                              </button>
                           }
                        </div>
                     )
                  }
               </div>
            </div>

            {
               (formData?.estadoActual === 1 || formData?.estadoActual === undefined) &&
               <div className="w-fit self-end">
                  <Boton type={"submit"} variant={"borderwhite"}>
                     Guardar Cambios
                     <Save size={16} />
                  </Boton>
               </div>
            }
         </form>
      </section>
   )
}