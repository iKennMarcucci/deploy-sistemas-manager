import { useEffect, useRef, useState } from "react"
import { ChevronDown, XIcon } from "lucide-react"
import Boton from "../Boton"

export default function AsignarDirectoresModal({ isOpen, proyecto, docentes, onAsignar }) {
   const [isDirectorOpen, setIsDirectorOpen] = useState(false)
   const [isCodirectorOpen, setIsCodirectorOpen] = useState(false)
   const directorRef = useRef(null)
   const codirectorRef = useRef(null)
   const [formData, setFormData] = useState({
      director: null,
      codirector: null,
   })

   // Detectar si ya hay director y codirector asignados
   const asignadoDirector = proyecto?.usuariosAsignados?.find(u => u.rol?.nombre === "Director")
   const asignadoCodirector = proyecto?.usuariosAsignados?.find(u => u.rol?.nombre === "Codirector")

   // Parsear recomendacionDirectores solo si no hay ambos asignados
   useEffect(() => {
      if (asignadoDirector && asignadoCodirector) {
         setFormData({ director: null, codirector: null })
      } else if (proyecto?.recomendacionDirectores) {
         const [dir, coDir] = proyecto.recomendacionDirectores.split(" y ")
         const director = docentes.find(d => getNombreCompleto(d).toUpperCase().replace(/\s+/g, " ") === (dir ?? "").toUpperCase().replace(/\s+/g, " "))
         const codirector = docentes.find(d => getNombreCompleto(d).toUpperCase().replace(/\s+/g, " ") === (coDir ?? "").toUpperCase().replace(/\s+/g, " "))
         setFormData({
            director: director || null,
            codirector: codirector || null,
         })
      } else {
         setFormData({ director: null, codirector: null })
      }
      // eslint-disable-next-line
   }, [proyecto, docentes])

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (directorRef.current && !directorRef.current.contains(event.target)) setIsDirectorOpen(false)
         if (codirectorRef.current && !codirectorRef.current.contains(event.target)) setIsCodirectorOpen(false)
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
   }, [])

   function getNombreCompleto(persona) {
      if (!persona) return ""
      return [
         persona.primerNombre,
         persona.segundoNombre,
         persona.primerApellido,
         persona.segundoApellido
      ].filter(Boolean).join(" ").replace(/\s+/g, " ").trim()
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!formData.director) return alert("Seleccione un director")

      await onAsignar({ director: formData.director, codirector: formData.codirector })
      isOpen(null)
   }

   // Mostrar solo los nombres si ambos están asignados
   if (asignadoDirector && asignadoCodirector) {
      return (
         <main className="bg-black/50 backdrop-blur-md flex justify-center items-center fixed w-full h-full z-50 left-0 top-0">
            <section className="bg-white modal-animation max-w-lg w-full rounded-md p-6">
               <header className="flex justify-between items-center mb-2">
                  <h6 className="text-lg font-semibold">Director y Codirector asignados</h6>
                  <button onClick={() => isOpen(null)} className="text-black/50 hover:text-black duration-150">
                     <XIcon size={20} />
                  </button>
               </header>
               <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                     <label className="font-semibold">Director</label>
                     <div className="w-full border rounded-md p-2.5 bg-gray-50">
                        {asignadoDirector.nombreUsuario || "Sin nombre"}
                     </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="font-semibold">Codirector</label>
                     <div className="w-full border rounded-md p-2.5 bg-gray-50">
                        {asignadoCodirector.nombreUsuario || "Sin nombre"}
                     </div>
                  </div>
                  <div className="flex justify-end pt-4">
                     <Boton type="button" variant="whitered" onClick={() => isOpen(null)}>
                        Cerrar
                     </Boton>
                  </div>
               </div>
            </section>
         </main>
      )
   }

   // Si no están ambos asignados, mostrar selects
   return (
      <main className="bg-black/50 backdrop-blur-md flex justify-center items-center fixed w-full h-full z-50 left-0 top-0">
         <section className="bg-white modal-animation max-w-lg w-full rounded-md p-6">
            <header className="flex justify-between items-center mb-2">
               <h6 className="text-lg font-semibold">Asignar Director y Codirector</h6>
               <button onClick={() => isOpen(null)} className="text-black/50 hover:text-black duration-150">
                  <XIcon size={20} />
               </button>
            </header>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="flex flex-col gap-2">
                  <label className="font-semibold">Director</label>
                  <div ref={directorRef} className="relative w-full">
                     <button
                        type="button"
                        onClick={() => setIsDirectorOpen(!isDirectorOpen)}
                        className="border-gris-claro text-start border rounded-md p-2.5 w-full flex justify-between items-center"
                     >
                        <span>
                           {formData.director
                              ? getNombreCompleto(formData.director)
                              : "Seleccione un director"}
                        </span>
                        <ChevronDown size={18} className={`${isDirectorOpen ? "-rotate-180" : "rotate-0"} duration-150`} />
                     </button>
                     {isDirectorOpen && (
                        <div className="bg-white border-gris-claro max-h-40 overflow-y-auto border absolute top-[110%] left-0 w-full select-animation rounded-md z-10">
                           {docentes
                              .filter(u => u.id !== formData.codirector?.id)
                              .map((user, index) =>
                                 <button key={index} type="button"
                                    onClick={() => {
                                       setFormData({ ...formData, director: user })
                                       setIsDirectorOpen(false)
                                    }}
                                    className="hover:bg-gris-claro/50 w-full text-start duration-150 p-2.5 text-sm">
                                    {getNombreCompleto(user)}
                                 </button>
                              )}
                        </div>
                     )}
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                  <label className="font-semibold">Codirector</label>
                  <div ref={codirectorRef} className="relative w-full">
                     <button
                        type="button"
                        onClick={() => setIsCodirectorOpen(!isCodirectorOpen)}
                        className="border-gris-claro text-start border rounded-md p-2.5 w-full flex justify-between items-center"
                     >
                        <span>
                           {formData.codirector
                              ? getNombreCompleto(formData.codirector)
                              : "Seleccione un codirector"}
                        </span>
                        <ChevronDown size={18} className={`${isCodirectorOpen ? "-rotate-180" : "rotate-0"} duration-150`} />
                     </button>
                     {isCodirectorOpen && (
                        <div className="bg-white border-gris-claro max-h-40 overflow-y-auto border absolute top-[110%] left-0 w-full select-animation rounded-md z-10">
                           {docentes
                              .filter(u => u.id !== formData.director?.id)
                              .map((user, index) =>
                                 <button key={index} type="button"
                                    onClick={() => {
                                       setFormData({ ...formData, codirector: user })
                                       setIsCodirectorOpen(false)
                                    }}
                                    className="hover:bg-gris-claro/50 w-full text-start duration-150 p-2.5 text-sm">
                                    {getNombreCompleto(user)}
                                 </button>
                              )}
                        </div>
                     )}
                  </div>
               </div>
               <div className="flex justify-end gap-2 pt-4">
                  <Boton type="button" variant="whitered" onClick={() => isOpen(null)}>
                     Cancelar
                  </Boton>
                  <Boton type="submit" variant="borderwhite">
                     Asignar
                  </Boton>
               </div>
            </form>
         </section>
      </main>
   )
}