import { useState } from "react"
import { listarGrupos, listarProyectos, crearGrupo, importarProyecto, importarDocumentos, actualizarProgreso, crearSustentacion, evaluarSustentacion, listarDocentes, setJurados, setDirectores, eliminarProyecto, editarGrupo, eliminarGrupo, listarProgramas, eliminarLinea, editarLinea, crearLinea } from "../controllers/admin/actions"

export default function useAdmin() {
   const [error, setError] = useState(null)
   const [isError, setIsError] = useState(false)

   const accessToken = localStorage.getItem("accessToken")
   const googleToken = localStorage.getItem("googleToken")

   const obtenerProyectos = async ({ lineaId = "", grupoId = "" }) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await listarProyectos({ accessToken: token, lineaId, grupoId })
         return data
      } catch (error) {
         console.error("Error al obtener los proyectos:", error)
      }
   }

   const obtenerGrupos = async () => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await listarGrupos({ accessToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const obtenerDocentes = async () => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await listarDocentes({ accessToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const asignarJurados = async ({ body }) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await setJurados({ accessToken: token, body: body })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const asignarDirectores = async ({ body }) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await setDirectores({ accessToken: token, body: body })
         return data
      } catch (error) {
         console.error(error)
      }
   }

   const actualizarFase = async ({ idProyecto, faseNueva }) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await actualizarProgreso({ accessToken: token, body: faseNueva, id: idProyecto })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const createSustentacion = async ({ body }) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await crearSustentacion({ accessToken: token, body: body })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const guardarComentariosJurados = async ({ body }) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await evaluarSustentacion({ accessToken: token, body: body })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const importProyecto = async ({ body }) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await importarProyecto({ accessToken: token, body: body })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const importDocumentos = async (body) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await importarDocumentos({
            idProyecto: body.idProyecto,
            archivos: body.archivo,
            tipoDoc: body.tipoDoc,
            accessToken: token,
            tag: body.tag,
         })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const deleteProject = async (idProyecto) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await eliminarProyecto({ idProyecto: idProyecto, accessToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         console.log(error)
      }
   }

   const createGrupo = async (body) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await crearGrupo({ body: body, accessToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         console.log(error)
      }
   }

   const editGrupo = async (body, id) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await editarGrupo({ body: body, id: id, accessToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         console.log(error)
      }
   }


   const deleteGrupo = async (id) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await eliminarGrupo({ id: id, accessToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         console.log(error)
      }
   }

      const createLinea = async (body) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await crearLinea({ body: body, accessToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         console.log(error)
      }
   }

   const editLinea = async (body, id) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await editarLinea({ body: body, id: id, accessToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         console.log(error)
      }
   }


   const deleteLinea = async (id) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await eliminarLinea({ id: id, accessToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         console.log(error)
      }
   }


   const listProgramas = async (body) => {
      try {
         let token = accessToken
         if (!accessToken) token = googleToken
         const data = await listarProgramas({ body: body, accessToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         console.log(error)
      }
   }
   return { obtenerProyectos, listProgramas, deleteGrupo, editGrupo, createLinea, editLinea, deleteLinea, deleteProject, createGrupo, importProyecto, importDocumentos, obtenerGrupos, actualizarFase, createSustentacion, obtenerDocentes, asignarJurados, asignarDirectores, guardarComentariosJurados }
}