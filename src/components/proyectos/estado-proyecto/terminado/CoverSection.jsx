import { Download } from "lucide-react"
import { FileText } from "lucide-react"
import Boton from "../../../Boton"

function formatMonthYear(dateString) {
   if (!dateString) return ""
   const date = new Date(dateString)
   const mes = date.toLocaleDateString("es-ES", { month: "long" })
   const anio = date.getFullYear()
   return `${mes.charAt(0).toUpperCase() + mes.slice(1)}, ${anio}`
}

export default function CoverSection({ currentProject }) {
   const estudiante = currentProject.usuariosAsignados?.find(u => u.rol.nombre.toLowerCase() === "estudiante")
   const director = currentProject.usuariosAsignados?.find(u => u.rol.nombre.toLowerCase() === "director")
   const codirector = currentProject.usuariosAsignados?.find(u => u.rol.nombre.toLowerCase() === "codirector")

   return (
      <section className="bg-rojo-mate text-white flex flex-col justify-center items-center gap-10 pt-4 pb-12">
         <span className="bg-white text-rojo-mate rounded-full font-black text-xs w-fit px-2 py-1">Proyecto Finalizado</span>

         <div className="flex flex-col gap-4 max-w-2xl">
            <h1 className="font-black text-5xl text-center">
               {currentProject.titulo}
            </h1>
            <div className="flex justify-center gap-4 flex-wrap">
               {currentProject.metaODS && currentProject.metaODS.length > 0 ? (
                  currentProject.metaODS.map(meta => (
                     <span
                        key={meta.id}
                        className="bg-rojo-claro/20 text-white rounded-full font-black text-xs w-fit px-2 py-1"
                     >
                        {meta.nombre}
                     </span>
                  ))
               ) : (
                  <span className="text-white/60 italic">Sin metas ODS</span>
               )}
            </div>
         </div>

         <div className="flex flex-col justify-center items-center gap-2">
            {estudiante && (
               <h5 className="text-2xl">{estudiante.nombreUsuario}</h5>
            )}
            <h5 className="text-2xl">Universidad Francisco de Paula Santander</h5>
            {director && (
               <h5 className="text-2xl"><b>Director:</b> {director.nombreUsuario}</h5>
            )}
            {codirector && (
               <h5 className="text-2xl"><b>Codirector:</b> {codirector.nombreUsuario}</h5>
            )}
            <h5 className="text-2xl">{formatMonthYear(currentProject.updatedAt)}</h5>
         </div>
      </section>
   )
}