# MINFIN Meetings - Frontend

Aplicación web desarrollada en Angular 15 para la gestión de reuniones del Ministerio de Finanzas Públicas de Guatemala (MINFIN). Esta aplicación proporciona una interfaz moderna y funcional para la administración de reuniones, usuarios internos y gestión de seguridad.

## 🚀 Características

- **Gestión de Reuniones**: Sistema completo para crear, editar y administrar reuniones
- **Calendario Interactivo**: Integración con FullCalendar para visualización de eventos
- **Autenticación SSO**: Integración con sistema de autenticación único del MINFIN
- **Gestión de Usuarios**: Administración de usuarios internos y roles
- **Sistema de Seguridad**: Gestión de roles, permisos y opciones de menú
- **Interfaz Responsiva**: Diseño adaptativo con Bootstrap 5 y Angular Material
- **Tema Oscuro/Claro**: Soporte para múltiples temas visuales
- **Componentes Reutilizables**: Biblioteca de componentes HTML personalizados

## 🛠️ Tecnologías Utilizadas

- **Angular 15.1.0** - Framework principal
- **Angular Material 15.2.9** - Componentes de UI
- **Bootstrap 5.2.3** - Framework CSS
- **FullCalendar 6.1.18** - Calendario interactivo
- **Chart.js 4.4.4** - Gráficos y visualizaciones
- **RxJS 7.8.0** - Programación reactiva
- **TypeScript 4.9.4** - Lenguaje de programación

## 📋 Prerrequisitos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **Angular CLI** (versión 15.1.0)
- **Git**

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd Frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   El proyecto incluye diferentes configuraciones de entorno:
   - `src/environments/environment.ts` - Desarrollo
   - `src/environments/environment.qa.ts` - QA
   - `src/environments/environment.prod.ts` - Producción

## 🚀 Desarrollo

### Servidor de desarrollo
```bash
npm start
```
La aplicación estará disponible en `http://localhost:4200/`

### Construcción del proyecto
```bash
# Desarrollo
npm run build

# QA
npm run build:qa

# Producción
npm run build:prod
```

### Ejecutar pruebas
```bash
npm test
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layouts/                 # Componentes de layout principal
│   │   ├── private-app/        # Aplicación privada (requiere autenticación)
│   │   ├── public-app/         # Aplicación pública
│   │   └── components/         # Componentes compartidos (header, footer, sidebar)
│   ├── meetings/               # Módulo de reuniones
│   │   ├── modules/
│   │   │   ├── administracion-meetings/  # Administración de reuniones
│   │   │   └── usuarios-internos/        # Gestión de usuarios
│   │   └── shared/             # Componentes compartidos del módulo
│   ├── private-app/            # Módulo de administración privada
│   │   ├── modules/
│   │   │   ├── administracion/ # Administración general
│   │   │   └── seguridad/      # Gestión de seguridad
│   │   └── utils/              # Utilidades y interceptores
│   ├── componentes-html/       # Biblioteca de componentes reutilizables
│   ├── interfaces/             # Interfaces TypeScript
│   ├── utils/                  # Utilidades generales
│   └── constants/              # Constantes de la aplicación
├── assets/                     # Recursos estáticos
├── css/                        # Estilos personalizados
└── environments/               # Configuraciones de entorno
```

## 🔐 Autenticación y Seguridad

La aplicación utiliza:
- **SSO (Single Sign-On)** del MINFIN
- **Autenticación de dos factores**
- **Guardias de ruta** para proteger rutas privadas
- **Interceptores HTTP** para manejo de tokens
- **Encriptación** de datos sensibles

## 🎨 Componentes Personalizados

La aplicación incluye una biblioteca de componentes reutilizables:

- **Alerts** - Alertas y notificaciones
- **Buttons** - Botones personalizados
- **Forms** - Formularios con validación
- **Tables** - Tablas con paginación
- **Modals** - Ventanas modales
- **Loading** - Indicadores de carga
- **Toastr** - Notificaciones toast
- **File Upload** - Carga de archivos
- **View File** - Visualización de archivos

## 🚀 Despliegue

### Configuración de Despliegue

El proyecto incluye scripts de despliegue automatizado:

1. **Configurar `deploy.config.json`**
   ```json
   {
       "backendScript": "../Backend/makeDockerImage_PROD.sh",
       "frontendScript": "./makeDockerImage_PROD.sh",
       "nexusUser": "usuario_nexus",
       "nexusPass": "password_nexus",
       "ocpLoginCmd": "oc login https://ocp.example.com:6443 --token=sha256~xxxx",
       "ocpProject": "mi-proyecto-ocp",
       "deploymentName": "mi-app",
       "containerName": "mi-app-container",
       "imageRepo": "nexus.repo.com/mi-app"
   }
   ```

2. **Ejecutar despliegue**
   ```powershell
   # Para QA
   .\deploy.ps1 qa
   
   # Para Producción
   .\deploy.ps1 prod
   ```

### Entornos Disponibles

- **Desarrollo**: `http://localhost:4200`
- **QA**: `https://sistestqa.minfin.gob.gt`
- **Producción**: Configurado según el entorno de producción

## 📊 Scripts Disponibles

```bash
# Desarrollo
npm start                    # Inicia servidor de desarrollo
npm run build               # Construye para desarrollo
npm run watch               # Construye en modo watch

# Construcción
npm run build:qa            # Construye para QA
npm run build:prod          # Construye para producción

# Pruebas
npm test                    # Ejecuta pruebas unitarias
```

## 🔧 Configuración de Proxy

El proyecto incluye configuración de proxy para desarrollo:
- Archivo: `src/proxy.conf.json`
- Configurado para redirigir llamadas API al backend

## 📝 Notas de Desarrollo

### Generación de Componentes
```bash
ng generate component component-name
ng generate service service-name
ng generate module module-name
```

### Estructura de Módulos
- **MeetingsModule**: Gestión de reuniones
- **PrivateAppModule**: Administración privada
- **PublicAppModule**: Contenido público
- **SharedModule**: Componentes compartidos

## 🤝 Contribución

1. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
2. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
3. Push a la rama (`git push origin feature/AmazingFeature`)
4. Abrir un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contactar al equipo de desarrollo del MINFIN.

## 📄 Licencia

Este proyecto es propiedad del Ministerio de Finanzas Públicas de Guatemala.

---

**Desarrollado por el equipo de Desarrollo de Sistemas - MINFIN**
