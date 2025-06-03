import { Download, ExternalLink } from "lucide-react";
import Boton from "../../../Boton";

export default function DiapositivaTab() {
   return (
      <div className="flex gap-4">
         <div className="border-gris-claro text-gris-institucional border rounded-md p-4 w-full">
            <div className="flex justify-between items-center">
               <h5 className="text-black font-bold text-2xl">Presentación de Defensa de Tesis</h5>
               <span className="bg-rojo-mate text-white rounded-full font-black text-xs w-fit px-2 py-1">42 diapositivas</span>
            </div>
            <p>
               Diapositivas utilizadas durante la defensa del proyecto ante el comité evaluador.
            </p>

            <div className="grid grid-cols-3 gap-2 mt-5">
               <span className="from-black/15 to-black/85 text-white bg-gradient-to-b h-24 rounded-md w-full flex flex-col justify-end items-start" />
               <span className="from-black/15 to-black/85 text-white bg-gradient-to-b h-24 rounded-md w-full flex flex-col justify-end items-start" />
               <span className="from-black/15 to-black/85 text-white bg-gradient-to-b h-24 rounded-md w-full flex flex-col justify-end items-start" />
               <span className="from-black/15 to-black/85 text-white bg-gradient-to-b h-24 rounded-md w-full flex flex-col justify-end items-start" />
               <span className="from-black/15 to-black/85 text-white bg-gradient-to-b h-24 rounded-md w-full flex flex-col justify-end items-start" />
               <span className="from-black/15 to-black/85 text-white bg-gradient-to-b h-24 rounded-md w-full flex flex-col justify-end items-start" />
            </div>


            <div className="text-black mt-10 space-y-2">
               <h5 className=" font-bold text-2xl">Estructura de la Presentación</h5>
               <div className="border-gris-claro border rounded-md p-4 flex justify-between items-center">
                  <h6 className="font-black">
                     1. Introducción y Objetivos
                  </h6>
                  <p className="text-xs">
                     Slides 1 - 5
                  </p>
               </div>
               <div className="border-gris-claro border rounded-md p-4 flex justify-between items-center">
                  <h6 className="font-black">
                     2. Metodología
                  </h6>
                  <p className="text-xs">
                     Slides 6 - 12
                  </p>
               </div>
               <div className="border-gris-claro border rounded-md p-4 flex justify-between items-center">
                  <h6 className="font-black">
                     3. Diseño del Sistema
                  </h6>
                  <p className="text-xs">
                     Slides 13 - 20
                  </p>
               </div>
               <div className="border-gris-claro border rounded-md p-4 flex justify-between items-center">
                  <h6 className="font-black">
                     4. Implementación
                  </h6>
                  <p className="text-xs">
                     Slides 21 - 28
                  </p>
               </div>
               <div className="border-gris-claro border rounded-md p-4 flex justify-between items-center">
                  <h6 className="font-black">
                     5. Resultados
                  </h6>
                  <p className="text-xs">
                     Slides 29 - 36
                  </p>
               </div>
               <div className="border-gris-claro border rounded-md p-4 flex justify-between items-center">
                  <h6 className="font-black">
                     6. Conclusiones
                  </h6>
                  <p className="text-xs">
                     Slides 37 - 42
                  </p>
               </div>
            </div>
            <div className="flex gap-2 w-full mt-4">
               <Boton variant={"borderwhite"}>
                  Descargar Presentación
                  <Download size={16} />
               </Boton>
               <Boton variant={"whitered"}>
                  Ver Presentación
                  <ExternalLink size={16} />
               </Boton>
            </div>
         </div>

         <div className="border-gris-claro text-gris-institucional border rounded-md p-4 max-w-[33%] flex flex-col justify-between">
            <div>
               <h5 className="text-black font-bold text-2xl">Detalles de la Defensa</h5>
               <p className="         truncate         ">Información sobre la presentación</p>
               <ul className="mt-4 flex flex-col gap-4 text-sm">
                  <li className="flex flex-col gap-0">
                     <h6 className="text-xs font-bold">Fecha de Presentación</h6>
                     <p className="text-black text-base">15/05/2024</p>
                  </li>
                  <li className="flex flex-col gap-0">
                     <h6 className="text-xs font-bold">Duración</h6>
                     <p className="text-black text-base">45 minutos + 15 minutos de preguntas</p>
                  </li>
                  <li className="flex flex-col gap-0">
                     <h6 className="text-xs font-bold">Lugar</h6>
                     <p className="text-black text-base">Universidad Francisco de Paula Santander</p>
                  </li>
                  <li className="flex flex-col gap-0">
                     <h6 className="text-xs font-bold">Comité Evaluador</h6>
                     <p className="text-black text-base">Dr. Carlos Ramírez (Presidente)</p>
                     <p className="text-black text-base">Dra. María González (Asesora)</p>
                     <p className="text-black text-base">Dr. Fernando López (Vocal)</p>
                     <p className="text-black text-base">Dra. Ana Martínez (Secretaria)</p>
                  </li>
               </ul>
            </div>
            <div className="space-y-2">
               <div className="border-rojo-mate border rounded-md text-center py-5">
                  <p className="text-gris-institucional">Calificación de la Presentación</p>
                  <h5 className="text-rojo-mate text-2xl font-bold">9.8/10</h5>
               </div>
            </div>
         </div>
      </div>
   )
}