import DiapositivaTab from "../../components/proyectos/estado-proyecto/terminado/DiapositivaTab"
import DocumentoTab from "../../components/proyectos/estado-proyecto/terminado/DocumentoTab"
import CoverSection from "../../components/proyectos/estado-proyecto/terminado/CoverSection"
import ArticuloTab from "../../components/proyectos/estado-proyecto/terminado/ArticuloTab"
import ResumenTab from "../../components/proyectos/estado-proyecto/terminado/ResumenTab"
import { Tabs, Tab } from "@heroui/tabs"
import { useState, useEffect } from "react"
import useProject from "../../lib/hooks/useProject"
import CurrentPhase from "../../components/proyectos/estado-proyecto/no-terminado/CurrentPhase"
import NextActivity from "../../components/proyectos/estado-proyecto/no-terminado/NextActivity"
import OverdueTasks from "../../components/proyectos/estado-proyecto/no-terminado/OverdueTasks"

export default function EstadoProyecto() {
   const { getProjectStatus, getProject, getDocuments } = useProject()

   const [init, setInit] = useState(null)
   const [currentProject, setCurrentProject] = useState(null)
   const [isLoading, setIsLoading] = useState(true)
   const [documentos, setDocumentos] = useState([])

   useEffect(() => {
      const obtenerProyecto = async () => {
         try {
            const data = await getProject()
            setCurrentProject(data)
            const proyectoId = data.id

            const docs = await getDocuments(proyectoId, "TESIS")
            setDocumentos(docs || [])

            const status = await getProjectStatus(proyectoId)
            setInit(status)
         } catch (error) {
            console.error("Error al obtener el proyecto:", error)
         } finally {
            setIsLoading(false)
         }
      }
      obtenerProyecto()
   }, [])

   // 1. Loading
   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-screen">
            <span className="text-gris-institucional">Cargando estado del proyecto...</span>
         </div>
      )
   }

   // 2. No hay proyecto activo
   if (!currentProject) {
      return (
         <div className="flex items-center justify-center h-screen">
            <span className="text-gris-institucional">No tienes ningún proyecto activo</span>
         </div>
      )
   }

   // 3. Proyecto terminado
   if (currentProject.estadoActual === 0) {
      return (
         <main className="flex flex-col gap-4 h-full">
            <CoverSection currentProject={currentProject} />
            <section className="p-6 mx-auto w-full max-w-5xl pb-40">
               <Tabs aria-label="Opciones" classNames={{ base: "w-full", tabList: "bg-gris-claro w-full rounded-md" }}>
                  <Tab key="resumen" title="Resumen">
                     <ResumenTab currentProject={currentProject} />
                  </Tab>
                  <Tab key="documento" title="Documento de Tesis">
                     <DocumentoTab currentProject={currentProject} listDocumentos={documentos} />
                  </Tab>
                  <Tab key="articulo" title="Artículo Científico">
                     <ArticuloTab currentProject={currentProject} listDocumentos={documentos} />
                  </Tab>
                  <Tab key="diapositivas" title="Presentación">
                     <DiapositivaTab currentProject={currentProject} listDocumentos={documentos} />
                  </Tab>
               </Tabs>
            </section>
         </main>
      )
   }

   // 4. Proyecto en curso
   return (
      <main className="flex flex-col gap-4 p-10 mt-8">
         <h1 className="font-semibold text-3xl">Estado Proyecto</h1>
         <section className="flex justify-between gap-14">
            <CurrentPhase
               init={{
                  numeroFaseActual: init.faseActual?.numeroFaseActual ?? 1,
                  descripcionFaseActual: init.faseActual?.descripcionFaseActual ?? "",
                  totalFases: init.faseActual?.totalFases ?? 1,
                  porcentajeCompletado: init.faseActual?.porcentajeCompletado ?? 0,
                  fasesCompletadas: Array.isArray(init.faseActual?.fasesCompletadas) ? init.faseActual.fasesCompletadas : [],
                  fasesPendientes: Array.isArray(init.faseActual?.fasesPendientes) ? init.faseActual.fasesPendientes : [],
               }}
            />
            <NextActivity
               init={Array.isArray(init.proximaActividad) && init.proximaActividad.length > 0 ? init.proximaActividad : [{
                  tipo: "",
                  descripcion: "",
                  fecha: "",
                  hora: "",
                  horaFin: "",
                  lugar: "",
                  asistenciaConfirmada: null
               }]}
            />
            <OverdueTasks
               init={Array.isArray(init.tareasAtrasadas) ? init.tareasAtrasadas : []}
            />
         </section>
      </main>
   )
}