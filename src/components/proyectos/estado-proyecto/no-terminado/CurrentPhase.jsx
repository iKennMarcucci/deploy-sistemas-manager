import { Progress } from "@heroui/progress";
import { CheckCircle, Circle, Clock } from "lucide-react"


export default function CurrentPhase({ init }) {
   const estadoIcono = {
      "no empezado": <Circle size={24} color="#818386" />,
      "terminado": <CheckCircle size={24} color="#4caf50" />,
      "en proceso": <Clock size={24} color="#f5a524" />,
   }

   return (
      <div className="border-gris-claro rounded-md border p-5 w-full flex flex-col gap-4">
         <div className="flex flex-col gap-0">
            <h6 className="font-bold text-xl">Fase Actual</h6>
            <p className="text-gris-institucional text-sm">Proceso general del proyecto</p>
         </div>

         <div className="flex justify-start items-center gap-2 mt-2">
            <span className="bg-success text-white rounded-full p-2 w-10 h-10 flex justify-center items-center font-bold text-xl">
               {/* estado actual */}
               {init.numeroFaseActual}
            </span>
            <div className="flex flex-col">
               <h6 className="font-bold text-xl">{init.descripcionFaseActual}</h6>
               <p className="text-gris-institucional text-sm">Fase {init.numeroFaseActual} de {init.totalFases}</p>
            </div>
         </div>

         <div className="flex flex-col gap-2">
            <Progress aria-label="Progreso de la fase actual" value={init.porcentajeCompletado} classNames={{ indicator: "bg-rojo-institucional", track: "bg-rojo-claro" }} />
            <p className="text-sm">{init.porcentajeCompletado}% completado</p>
         </div>

         {/* listado de tareas */}
         <ul className="flex flex-col gap-2.5">
            {
               (init.fasesCompletadas ?? []).map((fase, i) =>
                  <li key={i} className="flex justify-start items-center gap-2">
                     {estadoIcono["terminado"]}
                     <p className="text-sm">{fase}</p>
                  </li>
               )
            }
            <li className="flex justify-start items-center gap-2">
               {estadoIcono["en proceso"]}
               <p className="text-sm">{init.descripcionFaseActual}</p>
            </li>
            {
               (init.fasesPendientes ?? []).map((fase, i) =>
                  <li key={i} className="flex justify-start items-center gap-2">
                     {estadoIcono["no empezado"]}
                     <p className="text-sm">{fase}</p>
                  </li>
               )
            }
         </ul>
      </div>
   )
}