export default function ResumenTab({ currentProject }) {
   if (!currentProject) return null

   const estudiante = currentProject.usuariosAsignados?.find(u => u.rol.nombre.toLowerCase() === "estudiante")
   const director = currentProject.usuariosAsignados?.find(u => u.rol.nombre.toLowerCase() === "director")
   const codirector = currentProject.usuariosAsignados?.find(u => u.rol.nombre.toLowerCase() === "codirector")

   const formatDate = (dateStr) => {
      if (!dateStr) return ""
      const d = new Date(dateStr)
      return d.toLocaleDateString("es-CO", { year: "numeric", month: "2-digit", day: "2-digit" })
   }

   return (
      <section className="flex flex-col md:flex-row gap-8">
         <div className="w-full md:w-2/3 space-y-4">
            <div className="border border-gris-claro rounded-md p-6 bg-white/80 space-y-4">
               <h2 className="font-bold text-2xl text-rojo-mate mb-2">{currentProject.titulo}</h2>
               <div className="space-y-2">
                  <div>
                     <label className="font-bold text-black block">Pregunta de investigación</label>
                     <div className="border border-gris-claro rounded-md p-2 bg-gray-50">{currentProject.pregunta}</div>
                  </div>
                  <div>
                     <label className="font-bold text-black block">Problema</label>
                     <div className="border border-gris-claro rounded-md p-2 bg-gray-50">{currentProject.problema}</div>
                  </div>
                  <div>
                     <label className="font-bold text-black block">Objetivo general</label>
                     <div className="border border-gris-claro rounded-md p-2 bg-gray-50">{currentProject.objetivoGeneral}</div>
                  </div>
                  <div>
                     <label className="font-bold text-black block">Objetivos específicos</label>
                     <ul className="list-disc space-y-1">
                        {currentProject.objetivosEspecificos?.map(obj => (
                           <div key={obj.id}>
                              <div className="border bg-success-50/50 border-gris-claro flex justify-between items-center
                               rounded-md p-2">
                                 <p>{obj.descripcion}</p>
                                 <span className="text-success text-xs ml-2">({obj.avanceReportado}% completado)</span>
                              </div>
                           </div>
                        ))}
                     </ul>
                  </div>
                  <div>
                     <label className="font-bold text-black block">Línea de investigación</label>
                     <div className="border border-gris-claro rounded-md p-2 bg-gray-50">{currentProject.lineaInvestigacion?.nombre}</div>
                  </div>
                  <div>
                     <label className="font-bold text-black block">Grupo de investigación</label>
                     <div className="border border-gris-claro rounded-md p-2 bg-gray-50">{currentProject.lineaInvestigacion?.grupoInvestigacion?.nombre}</div>
                  </div>
                  <div>
                     <label className="font-bold text-black block">Programa</label>
                     <div className="border border-gris-claro rounded-md p-2 bg-gray-50">{currentProject.lineaInvestigacion?.grupoInvestigacion?.programa?.nombre}</div>
                  </div>
                  <div>
                     <label className="font-bold text-black block">Metas ODS</label>
                     <div className="flex flex-wrap gap-2 mt-1">
                        {currentProject.metaODS?.length > 0
                           ? currentProject.metaODS.map(meta => (
                              <span key={meta.id} className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-semibold">
                                 {meta.nombre}
                              </span>
                           ))
                           : <span className="text-gray-400 italic">Sin metas ODS</span>
                        }
                     </div>
                  </div>
                  <div className="flex justify-between gap-4">
                     <div className="w-full">
                        <label className="font-bold text-black block">Fecha de inicio</label>
                        <div className="border border-gris-claro rounded-md p-2 bg-gray-50 w-full">{formatDate(currentProject.createdAt)}</div>
                     </div>
                     <div className="w-full">
                        <label className="font-bold text-black block">Fecha de finalización</label>
                        <div className="border border-gris-claro rounded-md p-2 bg-gray-50 w-full">{formatDate(currentProject.updatedAt)}</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="w-full md:max-w-[33%] space-y-4">
            <div className="border border-gris-claro rounded-md p-6 bg-white/80">
               <h3 className="font-bold text-xl text-rojo-mate mb-4">Integrantes</h3>
               <div className="flex flex-col gap-3">
                  {estudiante && (
                     <div className="border border-gris-claro rounded-md bg-gray-50 p-3">
                        <label className="font-bold text-black block mb-1">Estudiante</label>
                        <div className="flex flex-col">
                           <span className="font-medium">{estudiante.nombreUsuario}</span>
                           <span className="text-xs text-gris-institucional">{estudiante.email}</span>
                        </div>
                     </div>
                  )}
                  {director && (
                     <div className="border border-gris-claro rounded-md bg-gray-50 p-3">
                        <label className="font-bold text-black block mb-1">Director</label>
                        <div className="flex flex-col">
                           <span className="font-medium">{director.nombreUsuario}</span>
                           <span className="text-xs text-gris-institucional">{director.email}</span>
                        </div>
                     </div>
                  )}
                  {codirector && (
                     <div className="border border-gris-claro rounded-md bg-gray-50 p-3">
                        <label className="font-bold text-black block mb-1">Codirector</label>
                        <div className="flex flex-col">
                           <span className="font-medium">{codirector.nombreUsuario}</span>
                           <span className="text-xs text-gris-institucional">{codirector.email}</span>
                        </div>
                     </div>
                  )}
               </div>
            </div>
            <div className="border border-gris-claro rounded-md p-6 bg-white/80 flex flex-col gap-2">
               <h3 className="font-bold text-xl text-rojo-mate">Definitiva</h3>
               <span className="bg-success/10 text-success font-bold rounded-full px-3 py-1 text-xs w-fit">
                  {currentProject.definitiva?.calificacion || "N/A"}
               </span>
            </div>
         </div>
      </section>
   )
}