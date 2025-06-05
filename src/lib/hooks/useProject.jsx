import { useState } from "react"
import {
   crearProyecto,
   listarProyectos,
   obtenerProyecto,
   actualizarProgreso,
   actualizarProyecto,
   obtenerProyectoEspecifico,
   asignarDefinitiva,
   enviarRetroalimentacion,
   listarDocentes,
   listarGrupos,
   listarSustentaciones,
   obtenerDocumentos,
   eliminarDocumentos,
   obtenerEstadoProyecto,
   enviarDocumentos,
   editarRetroalimentacion,
   listarEstudiantes,
   eliminarRetroalimentacion,
} from "../controllers/projects/actions"

export default function useProject() {
   const [project, setProject] = useState(null)
   const [projectList, setProjectList] = useState([])
   const [isError, setIsError] = useState(false)
   const [error, setError] = useState(null)
   const googleToken = localStorage.getItem("googleToken")
   const accessToken = localStorage.getItem("accessToken")

   const getProject = async (forceFetch = false) => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         if (forceFetch || !project) {
            const data = await obtenerProyecto({ googleToken: token })
            setProject(data)
            return data
         } else {
            return project
         }
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const getSpecificProject = async (id) => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await obtenerProyectoEspecifico({ id: id, googleToken: token })
         setProject(data)
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const getProjectStatus = async (id) => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await obtenerEstadoProyecto({ id: id, googleToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const createProject = async (body) => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await crearProyecto({ body: body, googleToken: token })
         setProject(data)
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         return null
      }
   }

   const listProjects = async () => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await listarProyectos({ googleToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const listaGrupos = async () => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await listarGrupos({ googleToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const listDocentes = async () => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await listarDocentes({ googleToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const listEstudiantes = async () => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await listarEstudiantes({ googleToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const listSustentaciones = async (id = "") => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await listarSustentaciones({ googleToken: token, idProyecto: id })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
      }
   }

   const editProject = async (body, id) => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await actualizarProyecto({ body: body, id: id, googleToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         return null
      }
   }

   const editProgress = async (body, id) => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await actualizarProgreso({ body: body, id: id, googleToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         return null
      }
   }

   const getDocuments = async (id, tipoDoc) => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await obtenerDocumentos({ id: id, tipoDoc: tipoDoc, googleToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         return null
      }
   }

   const sendDocuments = async (id, tipoDoc, tag, file) => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await enviarDocumentos({ id: id, tag: tag, tipoDoc: tipoDoc, googleToken: token, archivo: file })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         return null
      }
   }

   const deleteDocumentos = async (id) => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await eliminarDocumentos({ id: id, googleToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         return null
      }
   }

   const sendRetroalimentacion = async (body) => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await enviarRetroalimentacion({ body: body, googleToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         return null
      }
   }

   const editRetroalimentacion = async (body) => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await editarRetroalimentacion({ body: body, googleToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         return null
      }
   }

   const deleteRetroalimentacion = async (id) => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await eliminarRetroalimentacion({ id: id, googleToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         return null
      }
   }

   const asignarDefinitivaAction = async (id) => {
      try {
         let token = googleToken
         if (!googleToken) token = accessToken
         const data = await asignarDefinitiva({ id: id, googleToken: token })
         return data
      } catch (error) {
         setIsError(true)
         setError(error)
         return null
      }
   }

   return {
      project,
      projectList,
      isError,
      error,
      getProject,
      asignarDefinitivaAction,
      listProjects,
      createProject,
      listaGrupos,
      listDocentes,
      listSustentaciones,
      editProject,
      editProgress,
      getDocuments,
      getProjectStatus,
      getSpecificProject,
      sendDocuments,
      deleteDocumentos,
      sendRetroalimentacion,
      editRetroalimentacion,
      deleteRetroalimentacion,
      listEstudiantes,
   }
}