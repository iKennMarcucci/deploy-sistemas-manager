import axios from "axios"

export const crearProyecto = async ({ body, googleToken }) => {
   console.log("googleToken", googleToken)
   try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_PROYECTOS}`, body,
         { headers: { "Content-Type": "application/json", Authorization: `Bearer ${googleToken}` } })

      return response.data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const listarProyectos = async ({ googleToken }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_PROYECTOS}`,
         { headers: { Authorization: `Bearer ${googleToken}` } })

      return response.data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const obtenerProyecto = async ({ googleToken }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_GET_PROYECTO}`,
         { headers: { Authorization: `Bearer ${googleToken}` } })

      return response.data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const obtenerProyectoEspecifico = async ({ id, googleToken }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_PROYECTOS}/${id}`,
         { headers: { Authorization: `Bearer ${googleToken}` } })

      return response.data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const obtenerEstadoProyecto = async ({ googleToken }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_GET_ESTADO_PROYECTO}`,
         { headers: { Authorization: `Bearer ${googleToken}` } })

      return response.data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const actualizarProyecto = async ({ body, id, googleToken }) => {
   try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_PROYECTOS}/${id}`, body,
         { headers: { "Content-Type": "application/json", Authorization: `Bearer ${googleToken}` } })

      return response.data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const actualizarProgreso = async ({ body, id, googleToken }) => {
   try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_PROYECTOS}/${id}`, body,
         { headers: { "Content-Type": "application/json", Authorization: `Bearer ${googleToken}` } })

      return response.data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const asignarDefinitiva = async ({ id, googleToken }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_PROYECTOS}/definitiva?idProyecto=${id}&tipoSustentacion=TESIS`,
         { headers: { "Content-Type": "application/json", Authorization: `Bearer ${googleToken}` } })

      if (response.status !== 200) throw new Error('Error al ASIGNAR la nota definitiva.')

      const data = await response.json()
      return data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const listarGrupos = async ({ googleToken }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_GET_GRUPOS}`,
         { headers: { Authorization: `Bearer ${googleToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al LISTAR los grupos.')
      const data = await response.data
      return data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const listarDocentes = async ({ googleToken }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_GET_DOCENTES}`,
         { headers: { Authorization: `Bearer ${googleToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al LISTAR los docentes.')
      const data = await response.data
      return data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const listarEstudiantes = async ({ googleToken }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_GET_ESTUDIANTES}`,
         { headers: { Authorization: `Bearer ${googleToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al LISTAR los estudiantes.')
      const data = await response.data
      return data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const listarSustentaciones = async ({ googleToken, idProyecto = "" }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_SUSTENTACIONES}?idProyecto=${idProyecto}`,
         { headers: { Authorization: `Bearer ${googleToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al LISTAR las sustentaciones.')
      const data = await response.data
      return data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const obtenerDocumentos = async ({ id, tipoDoc, googleToken }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_DOCUMENTOS}/${id}?tipoDocumento=${tipoDoc}`,
         { headers: { Authorization: `Bearer ${googleToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al OBTENER los documentos.')
      const data = await response.data
      return data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const enviarDocumentos = async ({ id, tag, tipoDoc, googleToken, archivo }) => {
   try {
      console.log({ id, tag, tipoDoc, googleToken, archivo })
      const formData = new FormData()
      formData.append("tag", tag)
      formData.append("tipoDocumento", tipoDoc)
      formData.append("archivo", archivo)

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_DELETE_DOCUMENTOS}/${id}`, formData,
         { headers: { Authorization: `Bearer ${googleToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al ENVIAR los documentos.')
      const data = await response.data
      return data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const eliminarDocumentos = async ({ id, googleToken }) => {
   try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_DELETE_DOCUMENTOS}/${id}`,
         { headers: { Authorization: `Bearer ${googleToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al ELIMINAR los documentos.')
      const data = await response.data
      return data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const enviarRetroalimentacion = async ({ body, googleToken }) => {
   try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_RETROALIMENTACION}`, body,
         { headers: { Authorization: `Bearer ${googleToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al ENVIAR una retroalimentación.')
      const data = await response.data
      return data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const editarRetroalimentacion = async ({ body, googleToken }) => {
   try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_RETROALIMENTACION}`, body,
         { headers: { Authorization: `Bearer ${googleToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al EDITAR una retroalimentación.')
      const data = await response.data
      return data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}

export const eliminarRetroalimentacion = async ({ id, googleToken }) => {
   try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_RETROALIMENTACION}/${id}`,
         { headers: { Authorization: `Bearer ${googleToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al ELIMINAR una retroalimentación.')
      const data = await response.data
      return data
   } catch (error) {
      throw new Error(error ?? {
         httpStatus: "INTERNAL_SERVER_ERROR",
         reason: "Internal Server Error",
         message: "Oops, algo salió mal, por favor intenta más tarde.",
         httpStatusCode: 500
      })
   }
}
