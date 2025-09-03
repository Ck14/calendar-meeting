# Arquitectura del Frontend - MINFIN MEETINGS

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Tecnologías y Dependencias](#tecnologías-y-dependencias)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Arquitectura de Módulos](#arquitectura-de-módulos)
5. [Componentes](#componentes)
6. [Servicios](#servicios)
7. [Interfaces y Modelos](#interfaces-y-modelos)
8. [Sistema de Rutas](#sistema-de-rutas)
9. [Autenticación y Autorización](#autenticación-y-autorización)
10. [Convenciones de Código](#convenciones-de-código)
11. [Flujo de Trabajo](#flujo-de-trabajo)
12. [Comandos Útiles](#comandos-útiles)

## 🎯 Descripción General

Este es un proyecto Angular 15 que implementa un sistema de gestión de reuniones para el Ministerio de Finanzas (MINFIN). La aplicación está diseñada con una arquitectura modular que separa claramente las funcionalidades públicas y privadas, implementando un sistema de autenticación SSO y control de acceso basado en roles.

## 🛠️ Tecnologías y Dependencias

### Core Framework

- **Angular**: 15.1.0 (Framework principal)
- **TypeScript**: 4.9.4 (Lenguaje de programación)
- **RxJS**: 7.8.0 (Programación reactiva)

### UI Libraries

- **Bootstrap**: 5.2.3 (Framework CSS)
- **ngx-bootstrap**: 10.3.0 (Componentes Bootstrap para Angular)
- **Angular Material**: 15.2.9 (Componentes Material Design)
- **Bootstrap Icons**: 1.10.5 (Iconografía)

### Utilidades

- **ngx-mask**: 15.1.5 (Máscaras de entrada)
- **ngx-pagination**: 6.0.3 (Paginación)
- **ngx-loading**: 15.0.0 (Indicadores de carga)
- **ngx-colors**: 3.6.0 (Selector de colores)
- **FullCalendar**: 6.1.18 (Calendario interactivo)
- **Chart.js**: 4.4.4 (Gráficos)
- **SweetAlert2**: 11.7.21 (Alertas personalizadas)
- **Notiflix**: 3.2.6 (Notificaciones)

### Seguridad

- **crypto-js**: 4.1.1 (Criptografía)
- **node-forge**: 1.3.1 (Criptografía adicional)

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── app.module.ts                 # Módulo principal de la aplicación
│   ├── app-routing.module.ts         # Rutas principales
│   ├── app.component.*               # Componente raíz
│   │
│   ├── layouts/                      # Layouts de la aplicación
│   │   ├── components/               # Componentes de layout (header, footer, sidebar)
│   │   ├── private-app/              # Layout para usuarios autenticados
│   │   ├── public-app/               # Layout para usuarios públicos
│   │   └── [otros-layouts]/          # Otros layouts especializados
│   │
│   ├── private-app/                  # Módulo de aplicación privada
│   │   ├── modules/                  # Módulos funcionales
│   │   │   ├── administracion/       # Módulo de administración
│   │   │   └── seguridad/            # Módulo de seguridad
│   │   ├── components/               # Componentes específicos del área privada
│   │   └── dashboard/                # Dashboard principal
│   │
│   ├── meetings/                     # Módulo de reuniones
│   │   ├── modules/                  # Submódulos de reuniones
│   │   │   ├── administracion-meetings/  # Administración de reuniones
│   │   │   ├── usuarios-internos/        # Gestión de usuarios internos
│   │   │   └── shared/                   # Componentes compartidos
│   │   └── meetings-routing.module.ts    # Rutas de reuniones
│   │
│   ├── public-app/                   # Módulo de aplicación pública
│   │   ├── consulta-participantes/   # Consulta de participantes
│   │   ├── formulario-participante/  # Formulario de registro
│   │   └── home/                     # Página de inicio pública
│   │
│   ├── componentes-html/             # Biblioteca de componentes reutilizables
│   │   ├── components/               # Componentes base (botones, inputs, tablas, etc.)
│   │   └── home/                     # Página de demostración de componentes
│   │
│   ├── interfaces/                   # Definiciones de tipos TypeScript
│   │   ├── administracion/           # Interfaces de administración
│   │   ├── compartido/               # Interfaces compartidas
│   │   ├── meetings/                 # Interfaces de reuniones
│   │   └── sso/                      # Interfaces de autenticación
│   │
│   ├── utils/                        # Utilidades y servicios base
│   │   ├── functions/                # Funciones utilitarias
│   │   ├── auth.service.ts           # Servicio de autenticación
│   │   ├── auth-guard.service.ts     # Guard de autenticación
│   │   └── startup-configuration.service.ts  # Configuración de inicio
│   │
│   ├── pipes/                        # Pipes personalizados
│   └── constants/                    # Constantes de la aplicación
│
├── assets/                           # Recursos estáticos
│   ├── files/                        # Archivos de configuración JSON
│   ├── images/                       # Imágenes
│   └── logo/                         # Logos
│
├── environments/                      # Configuraciones por ambiente
└── styles/                           # Estilos globales
```

## 🔧 Arquitectura de Módulos

### 1. AppModule (Módulo Principal)

- **Propósito**: Módulo raíz que configura la aplicación
- **Características**:
  - Configuración de interceptores HTTP
  - Inicialización de la aplicación
  - Configuración de máscaras y validaciones
  - Importación de módulos externos

### 2. PrivateAppModule

- **Propósito**: Módulo para usuarios autenticados
- **Características**:
  - Dashboard principal
  - Autenticación de dos factores
  - Validación de credenciales
  - Interceptor de autenticación

### 3. MeetingsModule

- **Propósito**: Gestión de reuniones
- **Características**:
  - Administración de reuniones
  - Gestión de usuarios internos
  - Componentes compartidos

### 4. PublicAppModule

- **Propósito**: Funcionalidades públicas
- **Características**:
  - Consulta de participantes
  - Formulario de registro
  - Página de inicio pública

### 5. ComponentesHtmlModule

- **Propósito**: Biblioteca de componentes reutilizables
- **Componentes incluidos**:
  - Botones, inputs, alertas
  - Formularios, tablas, paginación
  - Modales, carga de archivos
  - Dropdowns, breadcrumbs

## 🧩 Componentes

### Estructura de un Componente

```typescript
@Component({
  selector: "app-nombre-componente",
  templateUrl: "./nombre-componente.component.html",
  styleUrls: ["./nombre-componente.component.css"],
})
export class NombreComponenteComponent implements OnInit {
  // Propiedades del componente

  constructor(private servicio: ServicioService, private router: Router) {}

  ngOnInit(): void {
    // Lógica de inicialización
  }

  // Métodos del componente
}
```

### Tipos de Componentes

1. **Componentes de Layout**: Header, Footer, Sidebar
2. **Componentes de Página**: Dashboard, Formularios, Listas
3. **Componentes Reutilizables**: Botones, Inputs, Tablas
4. **Componentes de Estado**: Loading, Error, NotFound

## 🔌 Servicios

### Estructura de un Servicio

```typescript
@Injectable({
  providedIn: "root", // Singleton global
})
export class NombreServicio {
  constructor(private http: HttpClient, private router: Router) {}

  // Métodos del servicio
}
```

### Servicios Principales

1. **AuthService**: Gestión de autenticación y sesión
2. **StartupConfigurationService**: Configuración inicial de la aplicación
3. **ResizeService**: Manejo de cambios de tamaño de pantalla
4. **Servicios específicos por módulo**: Cada módulo tiene sus propios servicios

### Patrones de Servicios

- **Singleton**: Servicios globales con `providedIn: 'root'`
- **Inyección de Dependencias**: Uso extensivo del patrón DI de Angular
- **Observables**: Uso de RxJS para programación reactiva

## 📊 Interfaces y Modelos

### Estructura de Interfaces

```typescript
export interface IModelo {
  id: number;
  nombre: string;
  fechaCreacion: Date;
  estado: Estado;
}

export interface Estado {
  id: number;
  nombre: string;
  estilo: string;
}
```

### Interfaces Principales

1. **UsuarioSSOModelo**: Modelo de usuario autenticado
2. **Perfil**: Perfil de usuario con menú y roles
3. **Opcion**: Opciones del menú de navegación
4. **IPermisosUsuario**: Permisos CRUD del usuario

### Tipado Estricto

- Uso extensivo de interfaces TypeScript
- Tipado de parámetros y retornos de métodos
- Enums para valores constantes

## 🛣️ Sistema de Rutas

### Estructura de Rutas

```typescript
const routes: Routes = [
  {
    path: "",
    component: StartupLoadingComponent,
  },
  {
    path: "admin",
    loadChildren: () => import("./private-app/private-app.module").then((m) => m.PrivateAppModule),
  },
  {
    path: "meetings",
    loadChildren: () => import("./meetings/meetings.module").then((m) => m.MeetingsModule),
  },
];
```

### Características del Enrutamiento

1. **Lazy Loading**: Carga diferida de módulos
2. **Guards**: Protección de rutas con autenticación
3. **Rutas Anidadas**: Estructura jerárquica de navegación
4. **Rutas Públicas vs Privadas**: Separación clara de acceso

### Guards Implementados

- **AuthGuardService**: Verificación de autenticación
- **StartupConfigurationGuard**: Verificación de configuración inicial

## 🔐 Autenticación y Autorización

### Sistema SSO

- Integración con sistema de autenticación externo
- Manejo de tokens JWT
- Redirección automática a login

### Control de Acceso

```typescript
export interface IPermisosUsuario {
  inserta: boolean;
  modifica: boolean;
  elimina: boolean;
  consulta: boolean;
}
```

### Características de Seguridad

1. **Interceptores HTTP**: Manejo automático de tokens
2. **Guards de Ruta**: Protección de rutas sensibles
3. **Validación de Permisos**: Control granular de acceso
4. **Timeout de Sesión**: Cierre automático por inactividad

## 📝 Convenciones de Código

### Nomenclatura

- **Componentes**: `NombreComponenteComponent`
- **Servicios**: `NombreServicioService`
- **Interfaces**: `INombreModelo`
- **Archivos**: `nombre-componente.component.ts`

### Estructura de Archivos

```
nombre-componente/
├── nombre-componente.component.ts
├── nombre-componente.component.html
├── nombre-componente.component.css
└── nombre-componente.component.spec.ts
```

### Estándares de Código

- Uso de TypeScript estricto
- Implementación de interfaces
- Manejo de errores consistente
- Documentación de métodos públicos

## 🔄 Flujo de Trabajo

### 1. Desarrollo de Nuevas Funcionalidades

1. Crear interfaz en `src/app/interfaces/`
2. Crear servicio en el módulo correspondiente
3. Crear componente siguiendo la estructura estándar
4. Configurar rutas en el módulo
5. Implementar lógica de negocio
6. Agregar validaciones y manejo de errores

### 2. Modificación de Componentes Existentes

1. Identificar el módulo y componente
2. Verificar dependencias y servicios
3. Implementar cambios manteniendo la estructura
4. Actualizar interfaces si es necesario
5. Probar funcionalidad

### 3. Creación de Nuevos Módulos

1. Crear estructura de carpetas
2. Definir módulo principal
3. Configurar enrutamiento
4. Implementar componentes y servicios
5. Integrar con el sistema de autenticación

## ⚡ Comandos Útiles

### Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm start

# Construcción para desarrollo
npm run build

# Construcción para QA
npm run build:qa

# Construcción para producción
npm run build:prod

# Ejecutar tests
npm test
```

### Generación de Componentes

```bash
# Generar componente
ng generate component nombre-componente

# Generar servicio
ng generate service nombre-servicio

# Generar módulo
ng generate module nombre-modulo

# Generar interfaz
ng generate interface nombre-interfaz
```

### Docker

```bash
# Construir imagen Docker
./makeDockerImage.sh

# Construir para QA
./makeDockerImage_QA.sh

# Construir para producción
./makeDockerImage_PROD.sh
```

## 🚀 Mejores Prácticas

### 1. Arquitectura

- Mantener separación clara entre módulos
- Usar lazy loading para optimizar rendimiento
- Implementar interfaces para todos los modelos

### 2. Rendimiento

- Evitar detección de cambios innecesaria
- Usar OnPush strategy cuando sea posible
- Implementar trackBy en ngFor

### 3. Seguridad

- Validar siempre los datos de entrada
- Implementar sanitización de datos
- Usar guards para proteger rutas sensibles

### 4. Mantenibilidad

- Seguir convenciones de nomenclatura
- Documentar métodos complejos
- Mantener componentes pequeños y enfocados

## 📚 Recursos Adicionales

- **Documentación Angular**: https://angular.io/docs
- **ngx-bootstrap**: https://valor-software.com/ngx-bootstrap/
- **RxJS**: https://rxjs.dev/
- **TypeScript**: https://www.typescriptlang.org/

## 🤝 Soporte

Para dudas sobre la arquitectura o implementación:

1. Revisar este documento
2. Consultar código existente similar
3. Revisar interfaces y modelos
4. Contactar al equipo de desarrollo

---

_Documento actualizado: [Fecha]_
_Versión: 1.0_
