import { Download, ChevronRight, ExternalLink } from "lucide-react";
import Boton from "../../../Boton";

export default function DocumentoTab() {
   return (
      <div className="flex gap-4">
         <div className="border-gris-claro text-gris-institucional border rounded-md p-4 w-full">
            <div className="flex justify-between items-center">
               <h5 className="text-black font-bold text-2xl">Documento de Tesis Completo</h5>
               <span className="bg-rojo-mate text-white rounded-full font-black text-xs w-fit px-2 py-1">187 páginas</span>
            </div>
            <p>
               Documento completo que detalla toda la investigación, metodología, resultados y conclusiones del proyecto.
            </p>
            <div className="text-black mt-8 flex flex-col gap-2">
               <h6 className="font-bold text-2xl">Estructura del Documento</h6>
               <div className="border-gris-claro border rounded-md p-4 flex justify-between items-center">
                  <p>Introducción y Planteamiento del Problema</p>
                  <ChevronRight size={20} />
               </div>
               <div className="border-gris-claro border rounded-md p-4 flex justify-between items-center">
                  <p>Marco Teórico y Estado del Arte</p>
                  <ChevronRight size={20} />
               </div>
               <div className="border-gris-claro border rounded-md p-4 flex justify-between items-center">
                  <p>Metodología de Investigación</p>
                  <ChevronRight size={20} />
               </div>
               <div className="border-gris-claro border rounded-md p-4 flex justify-between items-center">
                  <p>Diseño e Implementación del Sistema</p>
                  <ChevronRight size={20} />
               </div>
               <div className="border-gris-claro border rounded-md p-4 flex justify-between items-center">
                  <p>Análisis de Resultados</p>
                  <ChevronRight size={20} />
               </div>
               <div className="border-gris-claro border rounded-md p-4 flex justify-between items-center">
                  <p>Conclusiones y Recomendaciones</p>
                  <ChevronRight size={20} />
               </div>
               <div className="flex gap-2 w-full">
                  <Boton variant={"borderwhite"}>
                     Descargar PDF
                     <Download size={16} />
                  </Boton>
                  <Boton variant={"whitered"}>
                     Ver en Línea
                     <ExternalLink size={16} />
                  </Boton>
               </div>
            </div>
         </div>

         <div className="border-gris-claro text-gris-institucional border rounded-md p-4 max-w-[33%] flex flex-col justify-between">
            <div>
               <h5 className="text-black font-bold text-2xl">Información del Documento</h5>
               <p>Detalles de la publicación</p>
               <ul className="mt-4 flex flex-col gap-4 text-sm">
                  <li className="flex flex-col gap-0">
                     <h6 className="text-xs font-bold">Fecha de publicación</h6>
                     <p className="text-black text-base">15/05/2024</p>
                  </li>
                  <li className="flex flex-col gap-0">
                     <h6 className="text-xs font-bold">Autor</h6>
                     <p className="text-black text-base">Kenn Marcucci</p>
                  </li>
                  <li className="flex flex-col gap-0">
                     <h6 className="text-xs font-bold">Institución</h6>
                     <p className="text-black text-base">Universidad Francisco de Paula Santander</p>
                  </li>
                  <li className="flex flex-col gap-0">
                     <h6 className="text-xs font-bold">Asesor</h6>
                     <p className="text-black text-base">Dra. María Gonzáles</p>
                  </li>
               </ul>
            </div>
            <div className="border-rojo-mate border rounded-md text-center py-5">
               <p className="text-gris-institucional">Calificación Final</p>
               <h5 className="text-rojo-mate text-2xl font-bold">Sobresaliente</h5>
            </div>
         </div>
      </div>
   )
}