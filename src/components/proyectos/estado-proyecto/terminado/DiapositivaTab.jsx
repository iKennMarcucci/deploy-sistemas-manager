import { Download, ExternalLink } from "lucide-react"
import Boton from "../../../Boton"

export default function DiapositivaTab({ currentProject, listDocumentos = [] }) {
   // Filtra los documentos de tipo PRESENTACION_TESIS
   const presentaciones = listDocumentos.filter(doc => doc.tag && doc.tag.startsWith("PRESENTACION_TESIS")) || []

   return (
      <div className="flex gap-4">
         <div className="border-gris-claro border rounded-md p-4 w-full">
            <div className="flex justify-between items-center">
               <h5 className="text-black font-bold text-2xl">Presentaciones de Defensa</h5>
               <span className="bg-rojo-mate text-white rounded-full font-black text-xs w-fit px-2 py-1">
                  {presentaciones.length > 0 ? `${presentaciones.length} presentación(es)` : "Sin presentaciones"}
               </span>
            </div>
            <p>
               Diapositivas utilizadas durante la defensa del proyecto ante el comité evaluador.
            </p>

            <h6 className="font-bold text-2xl mt-8">Historial de Presentaciones</h6>

            {/* Lista de presentaciones */}
            <div className="flex flex-col gap-2 mt-2">
               {presentaciones.length > 0 ? presentaciones.map(art => {
                  // Extraer versión del tag
                  let version = "v1"
                  const match = art.tag.match(/_v(\d+)$/)
                  if (match) version = `v${match[1]}`
                  return (
                     <div key={art.id} className="flex justify-between items-center gap-2 border border-gris-claro rounded-md p-2 bg-gray-50">
                        <span className="font-bold">
                           {art.nombre} <span className="text-xs text-gray-500 font-normal">({version})</span>
                        </span>
                        <div className="flex items-center gap-2">
                           <a href={art.url} target="_blank" rel="noopener noreferrer">
                              <Boton variant="whitered" className="ml-2">
                                 Ver Presentación <ExternalLink size={16} />
                              </Boton>
                           </a>
                           <a href={art.url} download>
                              <Boton variant="borderwhite" className="ml-2">
                                 Descargar <Download size={16} />
                              </Boton>
                           </a>
                        </div>
                     </div>
                  )
               }) : (
                  <span className="text-gray-400 italic">No hay defensa de tesis disponible</span>
               )}
            </div>
         </div>
      </div>
   )
}