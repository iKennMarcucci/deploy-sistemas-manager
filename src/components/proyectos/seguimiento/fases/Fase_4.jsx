import { Alert } from "@heroui/alert";
import Actividades from "../componentes/Actividades";
import { CalendarDays } from "lucide-react";
import { Clock } from "lucide-react";
import { MapPinned } from "lucide-react";
import { Circle } from "lucide-react";
import { User } from "lucide-react";
import { CircleHelp } from "lucide-react";
import { CheckCircle } from "lucide-react";
import Boton from "../../../Boton";
import useProject from "../../../../lib/hooks/useProject";
import { useState } from "react";
import { useEffect } from "react";
import { Link2 } from "lucide-react";

const actividades = [
   {
      title: "Sustentación del Anteproyecto",
      tasks: [
         { desc: "Revisar detalles de la sustentación" },
         { desc: "Preparar presentación" },
         { desc: "Confirmar asistencia en su correo electrónico" },
      ],
   }
]

export default function Fase_4({ project }) {
   const { listSustentaciones } = useProject()
   const [sustentaciones, setSustentaciones] = useState(null)

   useEffect(() => {
      const fetchSustentaciones = async () => {
         try {
            const data = await listSustentaciones()
            setSustentaciones(data.find(d => d.tipoSustentacion == "ANTEPROYECTO"))
         } catch (error) {
            console.error("Error fetching sustentaciones:", error)
         }
      }

      fetchSustentaciones()
   }, [])

   return sustentaciones && (
      <section className="space-y-5">
         <div>
            <h4 className="font-bold text-2xl">Fase 4: Sustentación del Anteproyecto</h4>
            <p className="text-gris-institucional text-sm">
               Revise los detalles de la sustentación y confirme su asistencia
            </p>
         </div>

         <Actividades taskList={actividades} />

         <Alert
            title={"Sustentación del Anteproyecto"}
            classNames={{
               title: "font-bold text-base",
               base: "border-success bg-success-light text-success border py-5",
               iconWrapper: "bg-transparent border-0 shadow-none",
               description: "text-success"
            }}
            description={sustentaciones?.descripcion ?? "Sin descripción"}
            icon={<><CalendarDays size={24} /></>}
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
                                 const dateStr = sustentaciones?.fecha
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
                        <p className="text-gris-institucional text-xs">{sustentaciones?.hora.slice(0, 5)} hrs</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">

                     <Link2 className="-rotate-45" size={24} />

                     <div className="flex flex-col justify-center">
                        <h6 className="font-bold text-sm">Link</h6>
                        <a href={sustentaciones?.lugar} target="_blank" className="text-blue-600 hover:text-blue-800 duration-150 text-xs">{sustentaciones?.lugar}</a>
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
                        sustentaciones?.evaluadores.map((jurado, index) =>
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
                     sustentaciones.criteriosEvaluacion.length === 0 ?
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
                        </> : sustentaciones.criteriosEvaluacion?.map(ce =>
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
      </section>
   )
}