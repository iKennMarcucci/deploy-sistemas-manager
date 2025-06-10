import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Boton from "../../../../components/Boton"

export default function LineaModal({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  grupo,
  loading = false
}) {
  const [nombre, setNombre] = useState(() => initialData?.nombre || "")

  console.log("isOpen:", isOpen)
  console.log("onClose:", onClose)
  console.log("onSave:", onSave)
  console.log("initialData:", initialData)
  console.log("grupo:", grupo)
  console.log("loading:", loading)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nombre) return
    const data = { nombre }
    if (initialData?.id) {
      data.id = initialData.id
      onSave(data)
    } else {
      // Crear: incluir grupoInvestigacion
      onSave({ ...data, grupoInvestigacion: { id: grupo.id } })
    }
  }

  if (!isOpen || (!initialData?.id && (!grupo || !grupo.id))) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-md p-6 w-full max-w-md flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">{initialData?.id ? "Editar Línea" : "Crear Línea"}</h2>
          <button type="button" onClick={onClose}><X /></button>
        </div>
        <div>
          <label className="font-bold">Nombre de la Línea</label>
          <input
            className="border rounded-md p-2 w-full"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            placeholder="Nombre de la línea"
            autoFocus
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Boton type="button" variant="borderwhite" onClick={onClose}>Cancelar</Boton>
          <Boton type="submit" variant="whitered" disabled={loading}>
            {initialData?.id ? "Guardar Cambios" : "Crear Línea"}
          </Boton>
        </div>
      </form>
    </div>
  )
}