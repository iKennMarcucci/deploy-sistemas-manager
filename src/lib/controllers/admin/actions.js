import axios from "axios"

export const listarProyectos = async ({ accessToken, lineaId = "", grupoId = "" }) => {
   try {
      const params = [
         `lineaId=${lineaId}`,
         `grupoId=${grupoId}`
      ].join("&")
      const response = await axios.get(
         `${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_PROYECTOS}?${params}`,
         { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (response.status !== 200) throw new Error('Error al LISTAR los proyectos.')
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

export const eliminarProyecto = async ({ accessToken, idProyecto }) => {
   try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_PROYECTOS}/${idProyecto}`,
         { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (response.status !== 200) throw new Error('Error al ELIMINAR un proyecto.')
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

export const listarGrupos = async ({ accessToken }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_GET_GRUPOS}`,
         { headers: { Authorization: `Bearer ${accessToken}` } }
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

export const listarDocentes = async ({ accessToken }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_GET_DOCENTES}`,
         { headers: { Authorization: `Bearer ${accessToken}` } }
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

export const actualizarProgreso = async ({ body, id, accessToken }) => {
   try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_PROYECTOS}/${id}`, body,
         { headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` } })

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

export const setJurados = async ({ accessToken, body }) => {
   try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_EVALUADOR}`, body,
         { headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` } })

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

export const setDirectores = async ({ accessToken, body }) => {
   try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_ASIGNAR_USUARIOS}`, body,
         { headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` } })

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

export const crearSustentacion = async ({ body, accessToken }) => {
   try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_SUSTENTACIONES}`, body,
         { headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` } })

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

export const evaluarSustentacion = async ({ body, accessToken }) => {
   try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_RETROALIMENTACION_SUSTENTACION}`, body,
         { headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` } })

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

export const importarProyecto = async ({ body, accessToken }) => {
   try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_PROYECTOS}/importar`,
         body, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` } })

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

export const importarDocumentos = async ({ idProyecto, tag, tipoDoc, accessToken, archivos }) => {
   try {
      const formData = new FormData()
      // tags y tipos de documento como listas separadas por coma
      formData.append("tags", Array.isArray(tag) ? tag.join(",") : tag)
      formData.append("tipoDocumentos", Array.isArray(tipoDoc) ? tipoDoc.join(",") : tipoDoc)
      // Agrega todos los archivos individualmente
      if (archivos && archivos.length > 0) {
         Array.from(archivos).forEach(file => {
            formData.append("archivos", file)
         })
      }

      const response = await axios.post(
         `${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_IMPORT_DOCUMENTOS}/${idProyecto}`,
         formData, { headers: { Authorization: `Bearer ${accessToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al IMPORTAR los documentos.')
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