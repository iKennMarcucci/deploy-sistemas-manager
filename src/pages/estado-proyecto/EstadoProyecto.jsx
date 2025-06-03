import DiapositivaTab from "../../components/proyectos/estado-proyecto/terminado/DiapositivaTab"
import CurrentPhase from "../../components/proyectos/estado-proyecto/no-terminado/CurrentPhase"
import NextActivity from "../../components/proyectos/estado-proyecto/no-terminado/NextActivity"
import OverdueTasks from "../../components/proyectos/estado-proyecto/no-terminado/OverdueTasks"
import DocumentoTab from "../../components/proyectos/estado-proyecto/terminado/DocumentoTab"
import CoverSection from "../../components/proyectos/estado-proyecto/terminado/CoverSection"
import ArticuloTab from "../../components/proyectos/estado-proyecto/terminado/ArticuloTab"
import ResumenTab from "../../components/proyectos/estado-proyecto/terminado/ResumenTab"
import { Tabs, Tab } from "@heroui/tabs"
import { useState } from "react"
import { useEffect } from "react"
import useProyectoFlag from "./test/useProyectoFlag"
import useProject from "../../lib/hooks/useProject"

export default function EstadoProyecto() {
   const { getProjectStatus, getProject } = useProject()

   const [init, setInit] = useState(null)
   const [currentProject, setCurrentProject] = useState(null)
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      const obtenerProyecto = async () => {
         try {
            const data = await getProject()
            setCurrentProject(data)
         } catch (error) {
            console.error("Error al obtener el proyecto:", error)
         }
      }
      obtenerProyecto()
   }, [])

   useEffect(() => {
      if (!currentProject) return
      const obtenerEstadoProyecto = async () => {
         try {
            const data = await getProjectStatus(currentProject.id)
            setInit(data)
         } catch (error) {
            console.error("Error al obtener el estado del proyecto:", error)
         } finally {
            setIsLoading(false)
         }
      }
      obtenerEstadoProyecto()
   }, [currentProject])

   // {
   //    "faseActual":{
   //       "numeroFaseActual":3,
   //       "descripcionFaseActual":"Primera entrega del anteproyecto",
   //       "totalFases":10,
   //       "porcentajeCompletado":30,
   //       "fasesCompletadas":[
   //          "Inicio del proyecto",
   //          "Presentación inicial del proyecto"
   //       ],
   //       "fasesPendientes":[
   //          "Sustentación del anteproyecto",
   //          "Planifiación de hitos del proyecto",
   //          "Seguimiento de hitos",
   //          "Entrega de documentos finales",
   //          "Aprobación de sustentación final",
   //          "Sustentación final",
   //          "Completado"
   //       ]
   //    },
   //    "proximaActividad":[
   //       {
   //          "tipo":"Coloquio",
   //          "descripcion":"Segundo Informe de Avance",
   //          "fecha":"2025-06-19",
   //          "hora":"13:24:12",
   //          "horaFin":null,
   //          "lugar":"https://www.figma.com",
   //          "asistenciaConfirmada":null
   //       }
   //    ],
   //    "tareasAtrasadas":[
   //       {
   //          "tipo":"ANTEPROYECTO",
   //          "descripcion":"Su anteproyecto ha sido revisado y aprobado para sustentación. A continuación encontrará los detalles para la presentación ante el comité evaluador.",
   //          "fecha":"2025-05-15",
   //          "hora":"10:30:00",
   //          "horaFin":"08:05:59",
   //          "lugar":"https://www.example.com",
   //          "asistenciaConfirmada":null
   //       },
   //       {
   //          "tipo":"Coloquio",
   //          "descripcion":"Tercer Informe de Avance",
   //          "fecha":"2025-05-13",
   //          "hora":"11:12:13",
   //          "horaFin":null,
   //          "lugar":"https://kennmarcucci.vercel.app",
   //          "asistenciaConfirmada":null
   //       }
   //    ]
   // }


   return init && currentProject ? (
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
   ) : !isLoading ? (
      <div className="flex items-center justify-center h-screen">
         <span className="text-gris-institucional">Cargando estado del proyecto...</span>
      </div>
   ) : !init && !currentProject && (
      <div className="flex items-center justify-center h-screen">
         <span className="text-gris-institucional">No tienes ningún proyecto activo </span>
      </div>
   )
}

// ) : !init ? (
//    <main className="flex flex-col gap-4 p-10 mt-8">
//       <h1 className="font-semibold text-3xl">Estado Proyecto</h1>
//       <span className="text-gris-institucional">{!isLoading ? "No tienes asignado ningún proyecto." : "Cargando..."}</span>
//    </main>
// ) : init && (
//    <main className="flex flex-col gap-4 h-full">
//       <CoverSection />

//       <section className="p-6 mx-auto w-full max-w-5xl pb-40">
//          <Tabs aria-label="Options" classNames={{ base: "w-full", tabList: "bg-gris-claro w-full rounded-md" }}>
//             <Tab key="resumen" title="Resumen">
//                <ResumenTab />
//             </Tab>

//             <Tab key="documento" title="Documento de Tesis">
//                <DocumentoTab />
//             </Tab>

//             <Tab key="articulo" title="Artículo Científico">
//                <ArticuloTab />
//             </Tab>

//             <Tab key="diapositivas" title="Presentación">
//                <DiapositivaTab />
//             </Tab>
//          </Tabs>
//       </section>
//    </main>