import { Download, ChevronRight, ExternalLink } from "lucide-react"
import Boton from "../../../Boton"

export default function DocumentoTab({ currentProject, listDocumentos = [] }) {
   const documentos = listDocumentos.filter(doc => doc.tag && doc.tag.startsWith("DOCUMENTO_TESIS")) || []

   return (
      <div className="flex gap-4">
         <div className="border-gris-claro text-gris-institucional border rounded-md p-4 w-full">
            <div className="flex justify-between items-center">
               <h5 className="text-black font-bold text-2xl">Documento de Tesis Completo</h5>
               <span className="bg-rojo-mate text-white rounded-full font-black text-xs w-fit px-2 py-1">
                  {documentos.length > 0 ? `${documentos.length} documento(s)` : "Sin documentos"}
               </span>
            </div>
            <p>
               Documento completo que detalla toda la investigación, metodología, resultados y conclusiones del proyecto.
            </p>
            <div className="text-black mt-8 flex flex-col gap-2">
               <h6 className="font-bold text-2xl">Historial de Documentos</h6>

               {/* Lista de documentos */}
               <div className="flex flex-col gap-2">
                  {documentos.length > 0 ? documentos.map(art => {
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
                                    Ver Documento <ExternalLink size={16} />
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
                     <span className="text-gray-400 italic">No hay documentos disponibles</span>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}