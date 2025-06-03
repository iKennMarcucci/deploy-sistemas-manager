# Sistemas-Manager

## Descripción del Proyecto

Sistemas-Manager es una aplicación web integral para la gestión académica que facilita la administración de programas educativos, pensums, materias, grupos, estudiantes y profesores. El sistema cuenta con integración completa con Moodle, permitiendo la sincronización automática de cursos, usuarios y matrículas.

## Características Principales

### Gestión de Usuarios

- **Estudiantes:** Registro, edición y visualización de información de estudiantes
- **Profesores:** Administración de docentes y asignación a grupos
- **Administradores:** Control de accesos y permisos

### Gestión Académica

- **Programas:** Creación y administración de programas académicos
- **Pensums:** Configuración de planes de estudio por programa
- **Materias:** Gestión de asignaturas con créditos, semestres y requisitos
- **Grupos:** Vinculación de materias con docentes y cohortes

### Procesos Académicos

- **Matrículas:** Inscripción de estudiantes a grupos y materias
- **Cancelaciones:** Gestión de solicitudes de cancelación de materias
- **Notas:** Registro y consulta de calificaciones
- **Seguimiento:** Monitoreo del rendimiento académico

### Integración con Moodle

- Creación automática de categorías y cursos en Moodle
- Sincronización de usuarios (estudiantes y profesores)
- Gestión de inscripciones (enrollments) en cursos
- Asociación bidireccional mediante IDs de Moodle

## Tecnologías Utilizadas

### Frontend

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.14-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![HeroUI](https://img.shields.io/badge/HeroUI-2.7.4-7B68EE?style=for-the-badge&logo=heroui&logoColor=white)](https://heroui.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.16-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Tailwind Variants](https://img.shields.io/badge/Tailwind_Variants-0.3.0-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwind-variants.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.15.0-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![React Router](https://img.shields.io/badge/React_Router-6.23.0-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)

### Herramientas de Desarrollo

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![ESLint](https://img.shields.io/badge/ESLint-8.57.1-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.3.3-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)](https://prettier.io/)
[![PostCSS](https://img.shields.io/badge/PostCSS-8.4.38-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)](https://postcss.org/)

### Paquetes Adicionales

[![Axios](https://img.shields.io/badge/Axios-1.8.3-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![JWT Decode](https://img.shields.io/badge/JWT_Decode-4.0.0-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://www.npmjs.com/package/jwt-decode)
[![Lucide React](https://img.shields.io/badge/Lucide_React-0.479.0-546BFA?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev/)
[![React Icons](https://img.shields.io/badge/React_Icons-5.5.0-E91E63?style=for-the-badge&logo=react&logoColor=white)](https://react-icons.github.io/react-icons/)

### Características Adicionales

- Sistema de autenticación con JWT
- Diseño responsive para diferentes dispositivos
- Manejo de estados y contextos en React
- Validación de formularios
- Notificaciones y alertas personalizadas

## Estructura del Proyecto

El proyecto sigue una estructura organizada por funcionalidades:

```
src/
  ├── components/         # Componentes reutilizables
  ├── context/           # Contextos de React
  ├── layouts/           # Layouts principales
  ├── lib/               # Utilidades y hooks
  │   ├── controllers/   # Controladores de la lógica de negocio
  │   ├── hooks/         # Hooks personalizados
  │   └── test/          # Datos de prueba
  ├── pages/             # Páginas de la aplicación
  │   ├── grupos/        # Gestión de grupos
  │   ├── materias/      # Gestión de materias
  │   ├── pensum/        # Gestión de pensums
  │   ├── programas/     # Gestión de programas
  │   ├── usuarios/      # Gestión de usuarios
  │   └── ...            # Otras páginas
  └── styles/            # Estilos globales
```

## Módulos Principales

### Gestión de Grupos

- Creación y edición de grupos
- Vinculación con materias, docentes y cohortes
- Integración con Moodle para crear cursos automáticamente
- Asignación automática de profesores a cursos en Moodle

### Gestión de Materias

- Creación y edición de materias
- Asignación a pensums y semestres
- Creación automática de categorías en Moodle

### Gestión de Estudiantes

- Registro completo de información personal y académica
- Creación automática de usuarios en Moodle
- Gestión de matrículas y seguimiento académico

### Gestión de Profesores

- Registro de información personal y profesional
- Asignación a grupos y materias
- Creación automática de usuarios en Moodle con rol docente

## Configuración del Entorno

### Requisitos Previos

- Node.js (versión 16 o superior)
- npm, yarn o pnpm

### Variables de Entorno

El proyecto requiere las siguientes variables de entorno:

- `VITE_BACKEND_URL`: URL del backend
- `VITE_MOODLE_URL`: URL de la API de Moodle
- `VITE_MOODLE_TOKEN`: Token de acceso para la API de Moodle

### Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/sistemas-manager.git
   cd sistemas-manager
   ```

2. Instalar dependencias:

   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   ```

4. La aplicación estará disponible en `http://localhost:5173`

## Implementación en Producción

Para construir la aplicación para producción:

```bash
npm run build
# o
yarn build
# o
pnpm build
```

Los archivos generados estarán en la carpeta `dist/` listos para ser desplegados en cualquier servidor web.

## Integración con Moodle

El sistema utiliza la API REST de Moodle para:

- Crear categorías para programas, semestres y materias
- Crear cursos para grupos
- Registrar estudiantes y profesores
- Gestionar inscripciones a cursos

Es necesario tener un servidor Moodle configurado y un token de API con los permisos adecuados para todas estas operaciones.

## Mantenimiento y Contribución

### Convenciones de Código

- ESLint y Prettier configurados para mantener un estilo de código consistente
- Utilizar componentes funcionales y hooks de React
- Documentar funciones y componentes principales

### Flujo de Trabajo

1. Crear una rama para la nueva funcionalidad o corrección
2. Desarrollar y probar los cambios
3. Enviar un Pull Request para revisión
4. Después de la aprobación, fusionar con la rama principal
