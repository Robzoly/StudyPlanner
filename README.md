# StudyPlanner

StudyPlanner es una aplicación web diseñada para ayudar a los estudiantes a gestionar sus tareas, asignaciones y horarios de estudio de manera eficiente. Con una interfaz intuitiva y accesible desde cualquier dispositivo, StudyPlanner ofrece herramientas prácticas para organizar responsabilidades académicas, reducir el estrés y mejorar el rendimiento escolar.

## Características

- **Gestión de Tareas**: Crea, edita, elimina y marca tareas como completadas. Asigna fechas de vencimiento y categorías para mantener todo organizado.
- **Recordatorios**: Recibe notificaciones dentro de la aplicación para tareas próximas a vencer.
- **Calendario Compartido**: Organiza eventos grupales, invita a otros usuarios y visualiza tareas y eventos en un calendario interactivo.
- **Gamificación**: Gana puntos por completar tareas a tiempo y desbloquea niveles e insignias para mantenerte motivado.
- **Autenticación**: Regístrate e inicia sesión de manera segura para acceder a tus datos desde cualquier lugar.

## Tecnologías Utilizadas

### Frontend:
- React.js 18.3.1 con TypeScript
- Vite para una construcción rápida
- Tailwind CSS para estilización
- Lucide React para iconos

### Gestión del Estado:
- React Query (@tanstack/react-query)

### Base de Datos:
- Supabase (PostgreSQL con autenticación integrada)

Estas tecnologías garantizan un rendimiento óptimo y una experiencia de desarrollo eficiente.

## Instalación

Para configurar y ejecutar StudyPlanner en tu entorno local, sigue estos pasos:

### Requisitos Previos
- Node.js: Versión 14 o superior instalada.
- Supabase: Cuenta activa y proyecto configurado en Supabase.

### Pasos de Instalación

1. **Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/studyplanner.git
cd studyplanner
```

2. **Instalar Dependencias**
```bash
npm install
```

3. **Configurar Variables de Entorno**
   Crea un archivo `.env` en el directorio raíz con las siguientes variables:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
   ```

4. **Iniciar la Aplicación**
```bash
npm run dev
```

5. **Acceder a la Aplicación**
   Abre tu navegador y visita [http://localhost:3000](http://localhost:3000).

## Uso

- **Registro e Inicio de Sesión**: Crea una cuenta o inicia sesión para comenzar a gestionar tus tareas.
- **Gestión de Tareas**: Desde la página principal, agrega nuevas tareas, asigna fechas y categorías, y marca las completadas.
- **Calendario**: Consulta y gestiona tus eventos y tareas en el calendario interactivo.
- **Progreso y Puntos**: Revisa tus puntos acumulados y logros en la sección de perfil.

## Contribución

Si deseas contribuir al desarrollo de StudyPlanner, sigue estos pasos:

1. **Fork el Repositorio**: Haz una copia del repositorio en tu cuenta de GitHub.
2. **Clona tu Fork**: Descarga tu copia localmente:
   ```bash
   git clone https://github.com/tu-usuario/studyplanner.git
   ```
3. **Crea una Rama**: Usa una nueva rama para tus cambios:
   ```bash
   git checkout -b nombre-de-tu-rama
   ```
4. **Realiza tus Cambios**: Implementa mejoras o correcciones siguiendo las guías de estilo del proyecto.
5. **Envía un Pull Request**: Propón tus cambios al repositorio principal mediante un pull request.

Todas las contribuciones son bienvenidas, desde correcciones de errores hasta nuevas funcionalidades.

## Licencia

StudyPlanner se distribuye bajo la Licencia MIT. Para más detalles, consulta el archivo LICENSE en el repositorio.

---

Este README.md proporciona toda la información esencial para entender, instalar y contribuir al proyecto StudyPlanner. Si necesitas más detalles o ajustes, no dudes en solicitarlos. ¡Esperamos que esta aplicación sea de gran utilidad para estudiantes y desarrolladores!

