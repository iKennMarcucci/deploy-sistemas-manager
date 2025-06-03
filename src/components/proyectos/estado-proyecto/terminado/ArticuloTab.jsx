import { Download, ExternalLink } from "lucide-react";
import Boton from "../../../Boton";

export default function ArticuloTab() {
   return (
      <div className="flex gap-4">
         <div className="border-gris-claro text-gris-institucional border rounded-md p-4 w-full">
            <div className="flex justify-between items-center">
               <h5 className="text-black font-bold text-2xl">Sistema de Monitoreo IoT para Optimización de Recursos Hídricos</h5>
               <span className="bg-rojo-mate text-white rounded-full font-black text-xs w-fit px-2 py-1">Publicado</span>
            </div>
            <p>
               Artículo científico publicado en la Revista Internacional de Tecnologías Sostenibles.
            </p>
            <div className="from-black/15 to-black/85 text-white bg-gradient-to-b h-80 rounded-md w-full mt-4 flex flex-col justify-end items-start p-5">
               <h5 className="font-bold">Sistema de Monitoreo IoT para Optimización de Recursos Hídricos</h5>
               <p className="font-thin text-xs">Kenn Alejandro Marcucci Cardenas</p>
            </div>
            <div className="mt-10">
               <h5 className="text-black font-bold text-2xl">Resumen del Artículo</h5>
               <p>
                  Este artículo presenta los resultados de la implementación de un sistema de monitoreo inteligente basado en IoT para la optimización del uso de recursos hídricos en cultivos urbanos. Se describen la arquitectura del sistema, los algoritmos desarrollados y los resultados obtenidos en términos de eficiencia hídrica y productividad agrícola.
               </p>
            </div>
            <div className="mt-10 space-y-2">
               <h5 className="text-black font-bold text-2xl">Palabras Clave</h5>
               <div className="flex gap-4">
                  <span className="bg-gris-claro text-black rounded-full font-black text-xs w-fit px-2 py-1">Recursos Hídricos</span>
                  <span className="bg-gris-claro text-black rounded-full font-black text-xs w-fit px-2 py-1">IoT</span>
                  <span className="bg-gris-claro text-black rounded-full font-black text-xs w-fit px-2 py-1">Agricultura Urbana</span>
                  <span className="bg-gris-claro text-black rounded-full font-black text-xs w-fit px-2 py-1">Sostenibilidad</span>
               </div>
            </div>
            <div className="flex gap-2 w-full mt-4">
               <Boton variant={"borderwhite"}>
                  Descargar Artículo
                  <Download size={16} />
               </Boton>
               <Boton variant={"whitered"}>
                  Ver en Journal
                  <ExternalLink size={16} />
               </Boton>
            </div>
         </div>
         <div className="border-gris-claro text-gris-institucional border rounded-md p-4 max-w-[33%]">
            <h5 className="text-black font-bold text-2xl">Información de Publicación</h5>
            <p>Detalles del artículo científico</p>
            <ul className="mt-4 flex flex-col gap-4 text-sm">
               <li className="flex flex-col gap-0">
                  <h6 className="text-xs font-bold">Journal</h6>
                  <p className="text-black text-base">Revista Internacional de Tecnologías Sostenibles</p>
               </li>
               <li className="flex flex-col gap-0">
                  <h6 className="text-xs font-bold">Volumen</h6>
                  <p className="text-black text-base">Vol. 12, No. 3</p>
               </li>
               <li className="flex flex-col gap-0">
                  <h6 className="text-xs font-bold">Fecha de Publicación</h6>
                  <p className="text-black text-base">27/03/2025</p>
               </li>
               <li className="flex flex-col gap-0">
                  <h6 className="text-xs font-bold">Autores</h6>
                  <p className="text-black text-base">Kenn Alejandro Marcucci</p>
                  <p className="text-black text-base">Dra. María Gonzáles</p>
               </li>
               <li className="flex flex-col gap-0">
                  <h6 className="text-xs font-bold">Citación</h6>
                  <p className="text-black text-base">Marcucci, K., & González, M. (2025). Sistema de Monitoreo IoT para Optimización de Recursos Hídricos.Revista Internacional de Tecnologías Sostenibles, 12(3), 145-162.</p>
               </li>
            </ul>
         </div>
      </div>
   )
}