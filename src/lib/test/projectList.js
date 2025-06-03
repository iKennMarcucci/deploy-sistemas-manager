import { subjects } from "./materias"
import { groups } from "./cursor"
import { users } from "./users"

export const projectList = [
   {
      id: 1,
      student: users[0],
      subject: subjects[1],
      group: groups[1],
      project: {
         title: "Inteligencia Artificial Aplicadas a la Educación",
         desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum minus ex molestiae, impedit harum quod incidunt quasi reprehenderit veniam nihil asperiores sequi voluptatum labore excepturi porro. Deleniti saepe obcaecati nemo. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium, laborum delectus? Sunt, odit vitae voluptas recusandae impedit repellat ad nobis saepe veniam similique cum, deserunt quos ab! Quos, ratione. Eaque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus optio similique illo a, enim sunt deserunt nihil numquam fuga cumque facere ipsam! Velit eveniet quisquam tempore consectetur iure in harum!",
         status: { value: "Propuesta", color: "#0ea5e9" },
         director: users[1],
         codirector: users[2],
         startDate: "15-03-2025",
         lastUpdate: "12-04-2025",
         phase: 2,
         specificObjectives: [
            { id: 2, value: "Definición del objetivo específico #2", limitDate: "30-06-2025", status: { id: 2, value: "Completado", progress: 100, color: "#4caf50" } },
            { id: 1, value: "Definición del objetivo específico #1", limitDate: "15-05-2025", status: { id: 1, value: "Completado", progress: 100, color: "#4caf50" } },
            { id: 3, value: "Definición del objetivo específico #3", limitDate: "05-07-2025", status: { id: 3, value: "En progreso", progress: 75, color: "#f5a524" } },
            { id: 4, value: "Definición del objetivo específico #4", limitDate: "12-08-2025", status: { id: 4, value: "Atrasado", progress: 25, color: "#aa1916" } },
            { id: 5, value: "Definición del objetivo específico #5", limitDate: "26-09-2025", status: { id: 5, value: "No iniciado", progress: 0, color: "#3b3b3f" } },
         ]
      },
   },
   {
      id: 2,
      student: users[1],
      subject: subjects[2],
      group: groups[2],
      project: {
         title: "BlockChain con CSS",
         desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum minus ex molestiae, impedit harum quod incidunt quasi reprehenderit veniam nihil asperiores sequi voluptatum labore excepturi porro. Deleniti saepe obcaecati nemo. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium, laborum delectus? Sunt, odit vitae voluptas recusandae impedit repellat ad nobis saepe veniam similique cum, deserunt quos ab! Quos, ratione. Eaque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus optio similique illo a, enim sunt deserunt nihil numquam fuga cumque facere ipsam! Velit eveniet quisquam tempore consectetur iure in harum!",
         status: { value: "Completado", color: "#4caf50" },
         director: users[0],
         codirector: users[2],
         startDate: "15-12-2024",
         lastUpdate: "12-04-2025",
         phase: 8,
         specificObjectives: [
            { id: 1, value: "Definición del objetivo específico #1", limitDate: "15-05-2025", status: { id: 1, value: "Completado", progress: 100, color: "#4caf50" } },
            { id: 2, value: "Definición del objetivo específico #2", limitDate: "30-06-2025", status: { id: 2, value: "Completado", progress: 100, color: "#4caf50" } },
            { id: 3, value: "Definición del objetivo específico #3", limitDate: "05-07-2025", status: { id: 3, value: "En progreso", progress: 75, color: "#f5a524" } },
            { id: 4, value: "Definición del objetivo específico #4", limitDate: "12-08-2025", status: { id: 4, value: "Atrasado", progress: 25, color: "#aa1916" } },
            { id: 5, value: "Definición del objetivo específico #5", limitDate: "26-09-2025", status: { id: 5, value: "No iniciado", progress: 0, color: "#3b3b3f" } },
         ]
      },
   },
   {
      id: 3,
      student: users[2],
      subject: subjects[3],
      group: groups[3],
      project: {
         title: "Integración de Modelo GTP-4 a Chip Cuántico",
         desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum minus ex molestiae, impedit harum quod incidunt quasi reprehenderit veniam nihil asperiores sequi voluptatum labore excepturi porro. Deleniti saepe obcaecati nemo. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium, laborum delectus? Sunt, odit vitae voluptas recusandae impedit repellat ad nobis saepe veniam similique cum, deserunt quos ab! Quos, ratione. Eaque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus optio similique illo a, enim sunt deserunt nihil numquam fuga cumque facere ipsam! Velit eveniet quisquam tempore consectetur iure in harum!",
         status: { value: "En desarrollo", color: "#f5a524" },
         director: users[0],
         codirector: users[1],
         startDate: "01-01-2023",
         lastUpdate: "22-04-2024",
         phase: 0,
         specificObjectives: [
            { id: 1, value: "Definición del objetivo específico #1", limitDate: "15-05-2025", status: { id: 1, value: "Completado", progress: 100, color: "#4caf50" } },
            { id: 2, value: "Definición del objetivo específico #2", limitDate: "30-06-2025", status: { id: 2, value: "Completado", progress: 100, color: "#4caf50" } },
            { id: 3, value: "Definición del objetivo específico #3", limitDate: "05-07-2025", status: { id: 3, value: "En progreso", progress: 75, color: "#f5a524" } },
            { id: 4, value: "Definición del objetivo específico #4", limitDate: "12-08-2025", status: { id: 4, value: "Atrasado", progress: 25, color: "#aa1916" } },
            { id: 5, value: "Definición del objetivo específico #5", limitDate: "26-09-2025", status: { id: 5, value: "No iniciado", progress: 0, color: "#3b3b3f" } },
         ]
      },
   },
   {
      id: 4,
      student: users[3],
      subject: subjects[4],
      group: groups[4],
      project: {
         title: "Sistema de Gestión de Proyectos",
         desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum minus ex molestiae, impedit harum quod incidunt quasi reprehenderit veniam nihil asperiores sequi voluptatum labore excepturi porro. Deleniti saepe obcaecati nemo. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium, laborum delectus? Sunt, odit vitae voluptas recusandae impedit repellat ad nobis saepe veniam similique cum, deserunt quos ab! Quos, ratione. Eaque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus optio similique illo a, enim sunt deserunt nihil numquam fuga cumque facere ipsam! Velit eveniet quisquam tempore consectetur iure in harum!",
         status: { value: "Propuesta", color: "#0ea5e9" },
         director: users[0],
         codirector: users[1],
         startDate: "22-04-2025",
         lastUpdate: "23-04-2025",
         phase: 2,
         specificObjectives: [
            { id: 1, value: "Definición del objetivo específico #1", limitDate: "15-05-2025", status: { id: 1, value: "Completado", progress: 100, color: "#4caf50" } },
            { id: 2, value: "Definición del objetivo específico #2", limitDate: "30-06-2025", status: { id: 2, value: "Completado", progress: 100, color: "#4caf50" } },
            { id: 3, value: "Definición del objetivo específico #3", limitDate: "05-07-2025", status: { id: 3, value: "En progreso", progress: 75, color: "#f5a524" } },
            { id: 4, value: "Definición del objetivo específico #4", limitDate: "12-08-2025", status: { id: 4, value: "Atrasado", progress: 25, color: "#aa1916" } },
            { id: 5, value: "Definición del objetivo específico #5", limitDate: "26-09-2025", status: { id: 5, value: "No iniciado", progress: 0, color: "#3b3b3f" } },
         ]
      },
   },
]