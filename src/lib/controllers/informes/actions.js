import axios from "axios"

export const obtenerInformes = async ({ googleToken }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_GET_COLOQUIOS}`,
         { headers: { Authorization: `Bearer ${googleToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al LISTAR los informes.')
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

export const obtenerEntregaInformes = async ({ id, googleToken }) => {
   try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_GET_ENTREGAS_COLOQUIO}/${id}`,
         { headers: { Authorization: `Bearer ${googleToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al LISTAR las entregas de los informes.')
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

export const entregarInforme = async ({ idColoquio, archivos, tipoDocumento, tag, googleToken }) => {
   try {
      const formData = new FormData()
      formData.append("idColoquio", idColoquio)
      formData.append("tipoDocumento", tipoDocumento)
      if (tag) formData.append("tag", tag)
      archivos.forEach(archivo => {
         formData.append("archivo", archivo)
      })

      const response = await axios.post(
         `${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_GET_SEND_COLOQUIO}`,
         formData, { headers: { Authorization: `Bearer ${googleToken}` } }
      )

      if (response.status !== 200) throw new Error('Error al ENTREGAR un informe.')
      return response.data
   } catch (error) {
      throw new Error(error?.message || "Error interno al enviar el informe.")
   }
}

export const eliminarInformeArchivo = async ({ docId, googleToken }) => {
   try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_DELETE_DOCUMENTOS}/${docId}`,
         { headers: { Authorization: `Bearer ${googleToken}` } }
      )
      if (response.status !== 204) throw new Error('Error al ELIMINAR el archivo del informe.')
      return response.data
   } catch (error) {
      throw new Error(error?.message || "Error interno al eliminar el archivo del informe.")
   }
}