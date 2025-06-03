import { Alert } from "@heroui/alert"
import Actividades from "../componentes/Actividades"
import { CalendarDays, Clock, MapPinned, Circle, User, CheckCircle, Link2, CircleHelp, File, Download } from "lucide-react"
import Boton from "../../../Boton"
import useProject from "../../../../lib/hooks/useProject"
import { useState, useEffect } from "react"

export default function Fase_8({ project }) {
   const actividades = [
      {
         title: "Aprobación de la Sustentación",
         tasks: [
            { desc: "Revisar detalles de la sustentación" },
            { desc: "Descargar actas del comité curricular" },
            { desc: "Confirmar Asistencia a la sustentación del proyecto" },
         ],
      }
   ]

   const { listSustentaciones, getDocuments, sendDocuments, deleteDocumentos } = useProject()
   const [sustentacion, setSustentacion] = useState(null)
   const [listActas, setListActas] = useState([])
   const [showDeleteModal, setShowDeleteModal] = useState(false)
   const [actaToDelete, setActaToDelete] = useState(null)

   useEffect(() => {
      const fetchSustentaciones = async () => {
         try {
            const data = await listSustentaciones()
            const tesis = data.find(s => s.tipoSustentacion === "TESIS")
            setSustentacion(tesis)

            const actas = await getDocuments(project.id, "ACTABORRADOR")
            setListActas(actas || [])
         } catch (error) {
            console.error("Error fetching sustentaciones:", error)
         }
      }
      fetchSustentaciones()
   }, [])

   // Subir nueva acta de borrador
   const handleSubirActaBorrador = async (e) => {
      e.preventDefault()
      const file = e.target.actaArchivo.files[0]
      if (!file) return
      await sendDocuments(
         project.id,
         "ACTABORRADOR", // tipoDocumento
         "ActaBorrador", // tag
         file
      )
      const actas = await getDocuments(project.id, "ACTABORRADOR")
      setListActas(actas || [])
      e.target.reset()
   }

   // Eliminar acta
   const handleDeleteActaClick = (acta) => {
      setActaToDelete(acta)
      setShowDeleteModal(true)
   }
   const handleConfirmDeleteActa = async () => {
      if (actaToDelete) {
         await deleteDocumentos(actaToDelete.id)
         const actas = await getDocuments(project.id, "ACTABORRADOR")
         setListActas(actas || [])
         setShowDeleteModal(false)
         setActaToDelete(null)
      }
   }
   const handleCancelDeleteActa = () => {
      setShowDeleteModal(false)
      setActaToDelete(null)
   }

   return sustentacion && (
      <section className="space-y-5">
         <div>
            <h4 className="font-bold text-2xl">Fase 8: Aprobación de la Sustentación</h4>
            <p className="text-gris-institucional text-sm">
               Revise los detalles de la sustentación aprobada y confirme su asistencia
            </p>
         </div>

         <Actividades taskList={actividades} />

         <Alert
            title={"Sustentación Aprobada"}
            classNames={{
               title: "font-bold text-base",
               base: "border-success bg-success-light text-success border py-5",
               iconWrapper: "bg-transparent border-0 shadow-none",
               description: "text-success"
            }}
            description={sustentacion?.descripcion ?? "Sin descripción"}
            icon={<><CheckCircle size={24} /></>}
         />

         <div className="border-gris-claro rounded-md border p-4">
            <h6 className="font-bold">Detalles de la Sustentación</h6>
            <div className="grid grid-cols-12 items-center gap-10 p-4">
               <div className="flex flex-col gap-4 col-span-3">
                  <div className="flex items-center gap-2">
                     <CalendarDays size={24} />
                     <div className="flex flex-col justify-center">
                        <h6 className="font-bold text-sm">Fecha</h6>
                        <p className="text-gris-institucional text-xs">
                           {
                              (() => {
                                 const dateStr = sustentacion?.fecha
                                 if (!dateStr) return ''
                                 const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10))
                                 const date = new Date(year, month - 1, day)
                                 return date.toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'long',
                                    weekday: 'long',
                                    year: 'numeric'
                                 })
                              })()
                           }
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Clock size={24} />
                     <div className="flex flex-col justify-center">
                        <h6 className="font-bold text-sm">Hora</h6>
                        <p className="text-gris-institucional text-xs">{sustentacion?.hora?.slice(0, 5)} hrs</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Link2 className="-rotate-45" size={24} />
                     <div className="flex flex-col justify-center">
                        <h6 className="font-bold text-sm">Link</h6>
                        <a href={sustentacion?.lugar} target="_blank" className="text-blue-600 hover:text-blue-800 duration-150 text-xs">{sustentacion?.lugar}</a>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col gap-4 col-span-4">
                  <div className="flex items-center gap-4">
                     <User size={24} />
                     <h6 className="font-bold">Jurados Asignados</h6>
                  </div>
                  <div className="py-2 ml-1 space-y-2">
                     {
                        sustentacion?.evaluadores.length === 0
                           ? <div className="flex items-center gap-4">
                              <Circle size={16} />
                              <span className="text-gris-intermedio text-sm flex">Sin jurados asignados</span>
                           </div>
                           : sustentacion?.evaluadores.map((jurado, index) =>
                              <div key={index} className="flex items-center gap-4">
                                 <Circle size={16} />
                                 <p className="text-black text-sm">{jurado?.nombreUsuario}</p>
                              </div>
                           )
                     }
                  </div>
               </div>
               <div className="flex flex-col gap-4 col-span-5">
                  <div className="flex items-center gap-4">
                     <CircleHelp size={24} />
                     <h6 className="font-bold">Criterios de Evaluación</h6>
                  </div>
                  {
                     sustentacion.criteriosEvaluacion.length === 0 ?
                        <>
                           <div className="flex items-center gap-4">
                              <Circle size={16} />
                              <p className="text-black text-sm">
                                 Llegue al menos 15 minutos antes de la hora programada para preparar su presentación.
                              </p>
                           </div>
                           <div className="flex items-center gap-4">
                              <Circle size={16} />
                              <p className="text-black text-sm">
                                 Traiga una copia impresa de su tesis y diapositivas por si fuera necesario.
                              </p>
                           </div>
                           <div className="flex items-center gap-4">
                              <Circle size={16} />
                              <p className="text-black text-sm">
                                 Esté preparado para responder preguntas del comité evaluador después de su presentación.
                              </p>
                           </div>
                        </>
                        : sustentacion.criteriosEvaluacion?.map(ce =>
                           <div key={ce.id} className="flex items-center gap-4 ml-1">
                              <Circle size={16} />
                              <p className="text-black text-sm">
                                 {ce.descripcion}
                              </p>
                           </div>
                        )
                  }
               </div>
            </div>
         </div>

         {/* SECCIÓN DE ACTAS DE BORRADOR */}
         {Array.isArray(listActas) && listActas.length > 0 && (
            <section className="my-10">
               <div className="mb-4">
                  <h5 className="font-bold text-lg">Actas de Borrador</h5>
                  <p className="text-gris-institucional text-sm">Revisar y subir modificaciones si es necesario</p>
               </div>
               <div className="flex flex-col gap-3">
                  {listActas.map(acta => (
                     <div
                        key={acta.id}
                        className="border-gris-claro rounded-md border flex flex-col md:flex-row md:items-center justify-between gap-2 p-4"
                     >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                           <File size={22} className="text-blue-400 shrink-0" />
                           <div className="flex flex-col min-w-0">
                              <span className="truncate font-semibold text-sm">{acta.nombre}</span>
                              <span className="text-xs text-gray-500">{acta.peso}</span>
                           </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                           <a
                              href={acta.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                           >
                              <Boton type="button" variant="borderwhite" customClassName="w-fit">
                                 Descargar
                              </Boton>
                           </a>
                           <Boton
                              type="button"
                              variant="whitered"
                              customClassName="w-fit"
                              onClick={() => handleDeleteActaClick(acta)}
                           >
                              Eliminar
                           </Boton>
                        </div>
                     </div>
                  ))}
               </div>
               {/* Input para subir nueva acta */}
               <div className="mt-6 space-y-2">
                  <label className="font-bold select-none">Agregar Acta de Borrador</label>
                  <form
                     onSubmit={handleSubirActaBorrador}
                     className="flex flex-col md:flex-row gap-2 items-center"
                  >
                     <input
                        type="file"
                        name="actaArchivo"
                        required
                        className="border rounded p-2 text-sm"
                     />
                     <Boton type="submit" variant="borderwhite" customClassName="w-fit">
                        Subir Acta
                     </Boton>
                  </form>
               </div>
            </section>
         )}

         {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
         {showDeleteModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
               <div className="bg-white rounded-md p-6 max-w-sm w-full flex flex-col gap-4">
                  <h6 className="font-bold text-lg">¿Eliminar acta?</h6>
                  <p className="text-sm">
                     ¿Estás seguro de que deseas eliminar el acta <b>{actaToDelete?.nombre}</b>? Esta acción no se puede deshacer.
                  </p>
                  <div className="flex gap-2 justify-end">
                     <Boton variant="borderwhite" onClick={handleCancelDeleteActa}>
                        Cancelar
                     </Boton>
                     <Boton variant="whitered" onClick={handleConfirmDeleteActa}>
                        Eliminar
                     </Boton>
                  </div>
               </div>
            </div>
         )}
      </section>
   )
}