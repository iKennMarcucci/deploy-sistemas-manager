import { Download } from "lucide-react";
import { FileText } from "lucide-react";
import Boton from "../../../Boton";

export default function CoverSection() {
   return (
      <section className="bg-rojo-mate text-white flex flex-col justify-center items-center gap-10 pt-4 pb-12">
         <span className="bg-white text-rojo-mate rounded-full font-black text-xs w-fit px-2 py-1">Proyecto Finalizado</span>

         <div className="flex flex-col gap-4 max-w-2xl">
            <h1 className="font-black text-5xl text-center">
               Implementación de un Sistema de Monitoreo Inteligente para la Optimización de Recursos Hídricos en Cultivos Urbanos
            </h1>
            <div className="flex justify-center gap-4">
               <span className="bg-rojo-claro/20 text-white rounded-full font-black text-xs w-fit px-2 py-1">Recursos Hídricos</span>
               <span className="bg-rojo-claro/20 text-white rounded-full font-black text-xs w-fit px-2 py-1">IoT</span>
               <span className="bg-rojo-claro/20 text-white rounded-full font-black text-xs w-fit px-2 py-1">Agricultura Urbana</span>
               <span className="bg-rojo-claro/20 text-white rounded-full font-black text-xs w-fit px-2 py-1">Sostenibilidad</span>
            </div>
         </div>

         <div className="flex flex-col justify-center items-center gap-2">
            <h5 className="text-2xl">Kenn Alejandro Marcucci Cárdenas</h5>
            <h5 className="text-2xl">Facultad de Ingeniería • Universidad Francisco de Paula Santander</h5>
            <h5 className="text-2xl">Asesor: Dra. María Gonzáles</h5>
            <h5 className="text-2xl">Marzo 2025</h5>
         </div>

         <div className="flex gap-2">
            <Boton variant={"whitered"}>
               Ver Documento Completo
               <FileText size={16} />
            </Boton>
            <Boton variant={"borderwhite"}>
               Descargar Recursos
               <Download size={16} />
            </Boton>
         </div>
      </section>
   )
}