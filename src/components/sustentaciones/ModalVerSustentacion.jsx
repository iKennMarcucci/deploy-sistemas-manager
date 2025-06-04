// ModalVerSustentacion.jsx
import { CalendarDays, Clock, Link2, User, Circle, CircleHelp } from "lucide-react"

export default function ModalVerSustentacion({ open, onClose, sustentacion }) {
   if (!open || !sustentacion) return null

   const fechaStr = (() => {
      if (!sustentacion.fecha) return ""
      const [year, month, day] = sustentacion.fecha.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString('es-ES', {
         day: '2-digit', month: 'long', weekday: 'long', year: 'numeric'
      })
   })()

   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
         <div className="bg-white rounded-md p-6 max-w-6xl w-full relative">
            <button className="absolute top-2 right-2 text-black/50 hover:text-black" onClick={onClose}>✕</button>
            <h2 className="font-bold text-2xl mb-2">{sustentacion.tituloProyecto}</h2>
            <p className="text-gris-institucional text-sm mb-4">{sustentacion.descripcion ?? "Sin descripción"}</p>
            <div className="border-gris-claro rounded-md border p-4">
               <h6 className="font-bold mb-2">Detalles de la Sustentación</h6>
               <div className="grid grid-cols-12 items-center gap-10 p-4">
                  <div className="flex flex-col gap-4 col-span-3">
                     <div className="flex items-center gap-2">
                        <CalendarDays size={24} />
                        <div className="flex flex-col justify-center">
                           <h6 className="font-bold text-sm">Fecha</h6>
                           <p className="text-gris-institucional text-xs">{fechaStr}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <Clock size={24} />
                        <div className="flex flex-col justify-center">
                           <h6 className="font-bold text-sm">Hora</h6>
                           <p className="text-gris-institucional text-xs">{sustentacion.hora?.slice(0, 5)} hrs</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <Link2 className="-rotate-45" size={24} />
                        <div className="flex flex-col justify-center">
                           <h6 className="font-bold text-sm">Link</h6>
                           <a href={sustentacion.lugar} target="_blank" className="text-blue-600 hover:text-blue-800 duration-150 text-xs">{sustentacion.lugar}</a>
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
                           sustentacion.evaluadores?.map((jurado, index) =>
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
                        !sustentacion.criteriosEvaluacion || sustentacion.criteriosEvaluacion.length === 0 ?
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
                                    Traiga una copia impresa de su anteproyecto y diapositivas por si fuera necesario.
                                 </p>
                              </div>
                              <div className="flex items-center gap-4">
                                 <Circle size={16} />
                                 <p className="text-black text-sm">
                                    Esté preparado para responder preguntas del comité evaluador después de su presentación.
                                 </p>
                              </div>
                           </> : sustentacion.criteriosEvaluacion?.map(ce =>
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
         </div>
      </div>
   )
}