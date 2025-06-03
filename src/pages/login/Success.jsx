import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../lib/hooks/useAuth"

export default function Success() {
   const { userLoggedSetter } = useAuth()
   const [searchParams] = useSearchParams()
   const navigate = useNavigate()
   const token = searchParams.get("token")

   useEffect(() => {
      try {
         const user = userLoggedSetter(token)
         if (user?.role.toLowerCase() === "estudiante") { navigate("/estado-proyecto"); return }
         if (user?.role.toLowerCase() === "docente") { navigate("/listado-proyectos"); return }
         navigate("/estado-proyecto")
      } catch (error) {
         console.error(error)
      }
   }, [token, userLoggedSetter, navigate])

   return (
      <div className="hidden" />
   )
}
