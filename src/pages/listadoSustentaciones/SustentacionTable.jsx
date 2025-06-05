import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../lib/hooks/useAuth"
import ModalCalificarSustentacion from "../../components/sustentaciones/ModalCalificarSustentacion"
import ModalVerSustentacion from "../../components/sustentaciones/ModalVerSustentacion"
import useProject from "../../lib/hooks/useProject"
import useAdmin from "../../lib/hooks/useAdmin"

function formatearFechaHora(fecha, hora, horaFin) {
   if (!fecha || !hora) return ""
   const fechaObj = new Date(`${fecha}T${hora}`)
   const fechaFinObj = horaFin ? new Date(`${fecha}T${horaFin}`) : null
   const opciones = { year: "numeric", month: "long", day: "numeric" }
   const fechaStr = fechaObj.toLocaleDateString("es-CO", opciones)
   const horaStr = fechaObj.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
   const horaFinStr = fechaFinObj ? fechaFinObj.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }) : ""
   return `${fechaStr} | ${horaStr}${horaFinStr ? " - " + horaFinStr : ""}`
}

export default function SustentacionTable({ sustentaciones }) {
   const [openActions, setOpenActions] = useState({})
   const { userLogged } = useAuth()
   const [modalVer, setModalVer] = useState(null)
   const [modalCalificar, setModalCalificar] = useState(null)
   const dropdownRefs = useRef({})
   const { getDocuments } = useProject()
   const [documentosModal, setDocumentosModal] = useState([])
   const { guardarComentariosJurados } = useAdmin()

   // Simula obtener retroalimentaciones y mi retro
   const getRetroalimentaciones = (sustentacion, miId) =>
      (sustentacion.evaluadores || [])
         .filter(ev => ev.idUsuario !== miId)
         .map(ev => ({
            idUsuario: ev.idUsuario,
            nombreUsuario: ev.nombreUsuario,
            retroalimentacion: ev.observaciones || "",
            nota: ev.nota
         }))
   const getMiRetro = (sustentacion, miId) => {
      const yo = (sustentacion.evaluadores || []).find(ev => ev.email === miId)
      return yo?.observaciones || ""
   }
   const getMiNota = (sustentacion, miId) => {
      const yo = (sustentacion.evaluadores || []).find(ev => ev.email === miId)
      return yo?.nota ?? ""
   }
   const miId = userLogged?.id

   // Consulta los documentos antes de abrir la modal
   const handleOpenCalificar = async (s) => {
      const docs = await getDocuments(s.idProyecto, s.tipoSustentacion)
      setDocumentosModal(docs)
      setModalCalificar(s)
      setOpenActions({})
   }

   const toggleActions = (sustentacionId) => {
      setOpenActions(prev => ({
         ...prev,
         [sustentacionId]: !prev[sustentacionId]
      }))
   }

   useEffect(() => {
      function handleClickOutside(event) {
         Object.keys(openActions).forEach(sustentacionId => {
            if (
               openActions[sustentacionId] &&
               dropdownRefs.current[sustentacionId] &&
               !dropdownRefs.current[sustentacionId].contains(event.target)
            ) {
               setOpenActions(prev => ({ ...prev, [sustentacionId]: false }))
            }
         })
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
   }, [openActions])

   // Lógica para guardar retroalimentación y nota
   const handleSaveRetro = async ({ retro, nota }) => {
      if (!modalCalificar || !miId) return
      await guardarComentariosJurados({
         body: {
            idSustentacion: modalCalificar.id,
            observaciones: retro,
            nota: Number(nota)
         }
      })
      setModalCalificar(null)
      window.location.reload()
   }

   return (
      <>
         <table className="flex flex-col rounded-md border">
            <thead className="bg-black/5 p-4">
               <tr className="grid grid-cols-12 gap-2">
                  <th className="col-span-5 text-start">Título del Proyecto</th>
                  <th className="col-span-2 text-start">Tipo de Sustentación</th>
                  <th className="col-span-3 text-start">Fecha y Hora</th>
                  <th className="col-span-2 text-center">Acciones</th>
               </tr>
            </thead>
            <tbody className="text-sm">
               {sustentaciones.map(s => (
                  <tr key={s.id} className="grid grid-cols-12 items-center gap-2 p-4">
                     <td className="col-span-5">{s.tituloProyecto}</td>
                     <td className="col-span-2">{s.tipoSustentacion}</td>
                     <td className="col-span-3">{formatearFechaHora(s.fecha, s.hora, s.horaFin)}</td>
                     <td
                        className="relative col-span-2 place-self-center w-full"
                        ref={el => dropdownRefs.current[s.id] = el}
                     >
                        <button
                           id="custom-ellipsis"
                           onClick={() => toggleActions(s.id)}
                           className="flex justify-center items-center gap-1 p-2 w-full"
                        >
                           <span id="dot" />
                           <span id="dot" />
                           <span id="dot" />
                        </button>

                        {openActions[s.id] && (
                           <div className="bg-white whitespace-nowrap border rounded-md absolute z-50 top-[115%] right-0 select-animation flex flex-col">
                              <button
                                 className="hover:bg-gris-claro/50 duration-150 p-2 text-left"
                                 onClick={() => {
                                    setModalVer(s)
                                    setOpenActions({})
                                 }}
                              >
                                 Ver sustentación
                              </button>
                              <button
                                 className="hover:bg-gris-claro/50 duration-150 p-2 text-left"
                                 onClick={() => handleOpenCalificar(s)}
                              >
                                 Calificar sustentación
                              </button>
                           </div>
                        )}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>

         {/* Modal Ver Sustentación */}
         <ModalVerSustentacion
            open={!!modalVer}
            onClose={() => setModalVer(null)}
            sustentacion={modalVer}
         />

         {/* Modal Calificar Sustentación */}
         <ModalCalificarSustentacion
            open={!!modalCalificar}
            onClose={() => setModalCalificar(null)}
            sustentacion={modalCalificar}
            documentosTesis={documentosModal}
            retroalimentaciones={modalCalificar ? getRetroalimentaciones(modalCalificar, miId) : []}
            miRetro={modalCalificar ? getMiRetro(modalCalificar, miId) : ""}
            miNota={modalCalificar ? getMiNota(modalCalificar, miId) : ""}
            onSave={handleSaveRetro}
         />
      </>
   )
}