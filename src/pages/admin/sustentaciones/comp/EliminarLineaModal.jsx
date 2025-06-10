import { X } from "lucide-react"
import Boton from "../../../../components/Boton"

export default function EliminarLineaModal({ isOpen, onClose, onConfirm, linea, loading = false }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Eliminar Línea</h2>
          <button type="button" onClick={onClose}><X /></button>
        </div>
        <p>¿Seguro que deseas eliminar la línea <b>{linea?.nombre}</b>? Esta acción no se puede deshacer.</p>
        <div className="flex gap-2 justify-end">
          <Boton variant="borderwhite" onClick={onClose}>Cancelar</Boton>
          <Boton variant="whitered" onClick={onConfirm} disabled={loading}>Eliminar</Boton>
        </div>
      </div>
    </div>
  )
}