import { users } from "./users";

export const enviados = [
   {
      id: 0,
      student: users[0],
      document: {
         id: 0,
         name: "Informe_Avance_KennMarcucci.pdf"
      },
      sendDate: "12/04/2025",
      status: {
         id: 1,
         value: "Calificado",
         color: "#4caf50"
      },
      nota: "4.5"
   },
   {
      id: 1,
      student: users[1],
      document: null,
      sendDate: "",
      status: {
         id: 2,
         value: "No enviado",
         color: "#ff0000"
      },
      nota: "0"
   },
   {
      id: 2,
      student: users[2],
      document: {
         id: 2,
         name: "Informe_Avance_AndresCamperos.pdf"
      },
      sendDate: "16/05/2025",
      status: {
         id: 3,
         value: "Sin Calificar",
         color: "#ffb000"
      },
      nota: "0"
   },
]