import { groups } from "./cursor"

export const informes = [
   {
      id: 1,
      title: "Entrega de Avance del Proyecto",
      group: groups[1],
      startDate: "20-04-2025",
      endDate: "26-04-2025",
      sents: 3,
      pending: 1,
      status: {
         id: 1,
         value: "Activo",
         color: "#4caf50"
      },
   },
   {
      id: 2,
      title: "Entrega Final del Proyecto",
      group: groups[2],
      startDate: "20-05-2025",
      endDate: "26-06-2025",
      sents: 0,
      pending: 20,
      status: {
         id: 2,
         value: "Próximo",
         color: "#1e40af"
      },
   },
   {
      id: 3,
      title: "Entrega Parcial del Proyecto",
      group: groups[3],
      startDate: "20-02-2025",
      endDate: "26-04-2025",
      sents: 16,
      pending: 2,
      status: {
         id: 3,
         value: "Terminado",
         color: "#000000"
      },
   },
]