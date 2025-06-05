import { useState, useRef, useEffect } from "react"
import { XIcon } from "lucide-react"
import Boton from "../Boton"
import useAdmin from "../../lib/hooks/useAdmin"
import { BsWindowSidebar } from "react-icons/bs"

const tipos = [
   { label: "Tesis", value: "TESIS" },
   { label: "Anteproyecto", value: "ANTEPROYECTO" }
]

export default function CrearSustentacionForm({ isOpen, proyecto }) {
   const { createSustentacion, obtenerDocentes, asignarJurados, actualizarFase } = useAdmin()
   const [docentes, setDocentes] = useState([])
   const [formData, setFormData] = useState({
      tipoSustentacion: "",
      fecha: "",
      hora: "",
      horaFin: "",
      lugar: "",
      descripcion: "",
      sustentacionExterna: false,
      idProyecto: proyecto?.id,
      docenteId: [],
      juradosTesis: [] // [{ id: docenteId, externo: boolean }]
   })

   const modalRef = useRef(null)

   useEffect(() => {
      setFormData(f => ({
         ...f,
         idProyecto: proyecto?.id,
         tipoSustentacion: proyecto?.estadoActual === 3
            ? "ANTEPROYECTO"
            : proyecto?.estadoActual === 7
               ? "TESIS"
               : ""
      }))
      const getDocentes = async () => {
         const users = await obtenerDocentes()
         setDocentes(users)
      }
      getDocentes()
   }, [proyecto])

   const handleSubmit = async (e) => {
      e.preventDefault()
      try {
         let seAsignaron = false
         const res = await createSustentacion({ body: formData })
         if (res && res.id) {
            // ANTEPROYECTO: docenteId (array de ids)
            if (formData.tipoSustentacion === "ANTEPROYECTO" && Array.isArray(formData.docenteId)) {
               for (const docenteId of formData.docenteId) {
                  await asignarJurados({
                     body: {
                        idSustentacion: Number(res.id),
                        idUsuario: Number(docenteId),
                        juradoExterno: false
                     }
                  })
               }
               seAsignaron = true
            }
            // TESIS: juradosTesis (array de {id, externo})
            if (formData.tipoSustentacion === "TESIS" && Array.isArray(formData.juradosTesis)) {
               for (const jurado of formData.juradosTesis) {
                  await asignarJurados({
                     body: {
                        idSustentacion: Number(res.id),
                        idUsuario: Number(jurado.id),
                        juradoExterno: jurado.externo
                     }
                  })
               }
               seAsignaron = true
            }
         }
         if (seAsignaron) await actualizarFase({ idProyecto: proyecto.id, faseNueva: { estadoActual: proyecto.estadoActual + 1 } })
         window.location.reload()
      } catch (error) {
         console.error(error)
      } finally {
         isOpen(null)
      }
   }

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (modalRef.current && !modalRef.current.contains(event.target)) isOpen(null)
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => { document.removeEventListener('mousedown', handleClickOutside) }
   }, [])

   // --- Render ---
   return (
      <main className="bg-black/50 backdrop-blur-md flex justify-center items-center fixed w-full h-full z-50 left-0 top-0">
         <section ref={modalRef} className="bg-white modal-animation max-w-xl w-full rounded-md p-6">
            <header className="flex justify-between items-center">
               <h6 className="text-lg font-semibold">Nueva Sustentación</h6>
               <button onClick={() => isOpen(null)} className="text-black/50 hover:text-black duration-150">
                  <XIcon size={20} />
               </button>
            </header>
            <p className="text-sm text-black/50">Complete el formulario para crear una nueva sustentación</p>
            <form onSubmit={handleSubmit} className="space-y-2 mt-4 text-sm">
               <div className="flex flex-col">
                  <label className="font-semibold">Tipo de sustentación</label>
                  <div className="border-black/5 rounded-md border w-full p-2 bg-gray-100">
                     {formData.tipoSustentacion === "TESIS" && "Tesis"}
                     {formData.tipoSustentacion === "ANTEPROYECTO" && "Anteproyecto"}
                     {!formData.tipoSustentacion && <span className="text-gray-400">No disponible</span>}
                  </div>
               </div>
               <div className="flex flex-col">
                  <label className="font-semibold">Fecha</label>
                  <input
                     className="border-black/5 rounded-md border w-full p-2 outline-none"
                     type="date"
                     value={formData.fecha}
                     onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                     required
                  />
               </div>
               <div className="flex gap-2">
                  <div className="flex flex-col w-1/2">
                     <label className="font-semibold">Hora inicio</label>
                     <input
                        className="border-black/5 rounded-md border w-full p-2 outline-none"
                        type="time"
                        value={formData.hora}
                        onChange={e => setFormData({ ...formData, hora: e.target.value })}
                        required
                     />
                  </div>
                  <div className="flex flex-col w-1/2">
                     <label className="font-semibold">Hora fin</label>
                     <input
                        className="border-black/5 rounded-md border w-full p-2 outline-none"
                        type="time"
                        value={formData.horaFin}
                        onChange={e => setFormData({ ...formData, horaFin: e.target.value })}
                        required
                     />
                  </div>
               </div>
               <div className="flex flex-col">
                  <label className="font-semibold">Link</label>
                  <input
                     className="border-black/5 rounded-md border w-full p-2 outline-none"
                     type="url"
                     value={formData.lugar}
                     onChange={e => setFormData({ ...formData, lugar: e.target.value })}
                     required
                  />
               </div>
               <div className="flex flex-col">
                  <label className="font-semibold">Descripción</label>
                  <input
                     className="border-black/5 rounded-md border w-full p-2 outline-none"
                     type="text"
                     value={formData.descripcion}
                     onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                     required
                  />
               </div>

               {/* Jurados */}
               {formData.tipoSustentacion === "ANTEPROYECTO" && (
                  <div className="flex flex-col">
                     <label className="font-semibold">Jurados</label>
                     <div className="flex flex-wrap gap-2 mb-2">
                        {(formData.docenteId ?? []).map(id => {
                           const doc = docentes.find(d => d.id === Number(id))
                           if (!doc) return null
                           const nombre = `${doc.primerNombre ?? ""} ${doc.segundoNombre ?? ""} ${doc.primerApellido ?? ""} ${doc.segundoApellido ?? ""}`.trim() || doc.email
                           return (
                              <span key={id} className="flex items-center bg-black/5 rounded px-2 py-1 text-xs">
                                 {nombre}
                                 <button
                                    type="button"
                                    className="ml-1 text-red-500 hover:text-red-700"
                                    onClick={() => setFormData({
                                       ...formData,
                                       docenteId: (formData.docenteId ?? []).filter(did => did !== id)
                                    })}
                                 >
                                    <XIcon size={14} />
                                 </button>
                              </span>
                           )
                        })}
                     </div>
                     <select
                        className="border-black/5 rounded-md border w-full p-2 outline-none"
                        value=""
                        onChange={e => {
                           const selectedId = e.target.value
                           if (!selectedId) return
                           setFormData({
                              ...formData,
                              docenteId: [...(formData.docenteId ?? []), selectedId]
                           })
                        }}
                     >
                        <option value="">Agregar jurados...</option>
                        {docentes
                           .filter(doc => !(formData.docenteId ?? []).includes(String(doc.id)))
                           .map(doc => (
                              <option key={doc.id} value={doc.id}>
                                 {`${doc.primerNombre ?? ""} ${doc.segundoNombre ?? ""} ${doc.primerApellido ?? ""} ${doc.segundoApellido ?? ""}`.trim() || doc.email}
                              </option>
                           ))}
                     </select>
                  </div>
               )}

               {formData.tipoSustentacion === "TESIS" && (
                  <div className="flex flex-col gap-2">
                     <label className="font-semibold">Jurados (2 requeridos)</label>
                     {(formData.juradosTesis ?? []).map((jurado, idx) => {
                        const doc = docentes.find(d => d.id === Number(jurado.id))
                        if (!doc) return null
                        const nombre = `${doc.primerNombre ?? ""} ${doc.segundoNombre ?? ""} ${doc.primerApellido ?? ""} ${doc.segundoApellido ?? ""}`.trim() || doc.email
                        return (
                           <div key={jurado.id} className="flex items-center gap-2 bg-black/5 rounded px-2 py-1 text-xs">
                              {nombre}
                              <label className="flex items-center gap-1 ml-2">
                                 <input
                                    type="checkbox"
                                    checked={jurado.externo}
                                    onChange={e => {
                                       setFormData({
                                          ...formData,
                                          juradosTesis: formData.juradosTesis.map(j =>
                                             j.id === jurado.id ? { ...j, externo: e.target.checked } : j
                                          )
                                       })
                                    }}
                                 />
                                 <span className="text-xs">Externo</span>
                              </label>
                              <button
                                 type="button"
                                 className="ml-1 text-red-500 hover:text-red-700"
                                 onClick={() => setFormData({
                                    ...formData,
                                    juradosTesis: formData.juradosTesis.filter(j => j.id !== jurado.id)
                                 })}
                              >
                                 <XIcon size={14} />
                              </button>
                           </div>
                        )
                     })}
                     {formData.juradosTesis.length < 2 && (
                        <select
                           className="border-black/5 rounded-md border w-full p-2 outline-none"
                           value=""
                           onChange={e => {
                              const selectedId = e.target.value
                              if (!selectedId) return
                              if (formData.juradosTesis.some(j => j.id === selectedId)) return
                              setFormData({
                                 ...formData,
                                 juradosTesis: [...(formData.juradosTesis ?? []), { id: selectedId, externo: false }]
                              })
                           }}
                        >
                           <option value="">Agregar jurado...</option>
                           {docentes
                              .filter(doc => !(formData.juradosTesis ?? []).some(j => j.id === String(doc.id)))
                              .map(doc => (
                                 <option key={doc.id} value={doc.id}>
                                    {`${doc.primerNombre ?? ""} ${doc.segundoNombre ?? ""} ${doc.primerApellido ?? ""} ${doc.segundoApellido ?? ""}`.trim() || doc.email}
                                 </option>
                              ))}
                        </select>
                     )}
                  </div>
               )}

               {formData.tipoSustentacion === "TESIS" && (
                  <div className="flex items-center gap-2">
                     <input
                        type="checkbox"
                        id="sustentacionExterna"
                        checked={formData.sustentacionExterna}
                        onChange={e => setFormData({ ...formData, sustentacionExterna: e.target.checked })}
                     />
                     <label htmlFor="sustentacionExterna" className="font-semibold">Aplica como sustentación EduTIC LAB</label>
                  </div>
               )}
               <div className="flex items-stretch gap-2 pt-4">
                  <Boton type="button" variant="whitered" onClick={() => isOpen(null)}>
                     Cancelar
                  </Boton>
                  <Boton type="submit" variant="borderwhite">
                     Crear sustentación
                  </Boton>
               </div>
            </form>
         </section>
      </main>
   )
}