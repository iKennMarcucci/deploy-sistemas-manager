import { eliminarInformeArchivo, entregarInforme, obtenerEntregaInformes, obtenerInformes } from "../controllers/informes/actions"

export default function useInformes() {
   const googleToken = localStorage.getItem("googleToken")

   const getInformes = async () => {
      try {
         const data = await obtenerInformes({ googleToken })
         return data
      } catch (error) {
         console.error("Error al obtener los informes:", error)
      }
   }

   const sendInforme = async ({ idColoquio, archivos, tag }) => {
      try {
         // Enviar cada archivo por separado
         const results = []
         for (const archivo of archivos) {
            const data = await entregarInforme({
               idColoquio,
               archivos: [archivo], // Solo un archivo por petición
               tipoDocumento: "COLOQUIO",
               tag,
               googleToken
            })
            results.push(data)
         }
         return results
      } catch (error) {
         console.error("Error al enviar el informe:", error)
         throw error
      }
   }

   const getEntregaInformes = async (id) => {
      try {
         const data = await obtenerEntregaInformes({ id: id, googleToken: googleToken })
         return data
      } catch (error) {
         console.error("Error al obtener las entregas de los informes:", error)
      }
   }

   const deleteInformeArchivo = async (docId) => {
      try {
         await eliminarInformeArchivo({ docId, googleToken })
         return true
      } catch (error) {
         console.error("Error al eliminar el archivo del informe:", error)
         throw error
      }
   }
   return { getInformes, sendInforme, getEntregaInformes, deleteInformeArchivo }
}