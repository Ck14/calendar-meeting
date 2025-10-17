# Componente de Consulta de Participantes

Este componente permite a los usuarios consultar la lista de participantes registrados en una reunión específica utilizando un token de acceso.

## Características

- **Búsqueda por Token**: Campo de entrada para ingresar el token de la reunión
- **Validación de Formulario**: Validación en tiempo real del campo requerido
- **Información de la Reunión**: Muestra detalles de la reunión encontrada
- **Lista de Participantes**: Visualización en tarjetas de todos los participantes registrados
- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- **Estados de Carga**: Indicadores visuales durante las operaciones

## Estructura del Componente

### Archivos Principales

- `consulta-participantes.component.ts` - Lógica del componente
- `consulta-participantes.component.html` - Template HTML
- `consulta-participantes.component.css` - Estilos CSS
- `consulta-participantes.service.ts` - Servicio para API
- `consulta-participantes.component.spec.ts` - Pruebas unitarias del componente
- `consulta-participantes.service.spec.ts` - Pruebas unitarias del servicio

### Funcionalidades

1. **Formulario de Consulta**

   - Campo de entrada para el token
   - Validación de campo requerido
   - Botones de búsqueda y limpieza

2. **Búsqueda de Participantes**

   - Llamada al API con el token proporcionado
   - Manejo de estados de carga
   - Procesamiento de respuestas exitosas y errores

3. **Visualización de Resultados**

   - Información de la reunión (título, fecha, hora, número de participantes)
   - Lista de participantes en formato de tarjetas
   - Estado vacío cuando no hay resultados

4. **Manejo de Estados**
   - Estado de carga durante la búsqueda
   - Estado de búsqueda completada
   - Estados de error y éxito

## Uso

### En el Template

```html
<app-consulta-participantes></app-consulta-participantes>
```

### En el Componente Padre

```typescript
import { ConsultaParticipantesComponent } from "./consulta-participantes/consulta-participantes.component";

// El componente se puede usar directamente en el template
```

## API

### Endpoint

```
POST /meetings/participantes/consulta
```

### Request Body

```json
{
  "token": "string"
}
```

### Response

```json
{
  "success": boolean,
  "message": "string",
  "meetingInfo": {
    "id": number,
    "titulo": "string",
    "descripcion": "string",
    "horaInicio": "string",
    "horaFin": "string",
    "estado": "string"
  },
  "participantes": [
    {
      "id": number,
      "dpi": "string",
      "nombreCompleto": "string",
      "puesto": "string",
      "institucion": "string",
      "telefonoExtension": "string",
      "correo": "string",
      "sexo": "string",
      "rangoEdad": "string",
      "discapacidad": "string",
      "pueblo": "string",
      "comunidadLinguistica": "string",
      "fechaRegistro": "string"
    }
  ]
}
```

## Dependencias

- `@angular/core` - Funcionalidades básicas de Angular
- `@angular/forms` - Formularios reactivos
- `@angular/common/http` - Cliente HTTP
- `notiflix` - Notificaciones y estados de carga

## Estilos

El componente utiliza un diseño moderno y responsivo basado en:

- Gradientes y sombras para profundidad visual
- Iconos de Material Design
- Grid CSS para layouts responsivos
- Transiciones y animaciones CSS
- Paleta de colores consistente con el tema MINFIN

## Responsividad

- **Desktop**: Layout de múltiples columnas para participantes
- **Tablet**: Ajuste automático del grid
- **Mobile**: Layout de una sola columna con botones apilados

## Pruebas

El componente incluye pruebas unitarias completas que cubren:

- Creación del componente
- Inicialización del formulario
- Validación de campos
- Búsqueda de participantes
- Limpieza del formulario
- Manejo de errores
- Funciones auxiliares

## Notas de Implementación

- El componente utiliza `trackBy` para optimizar el rendimiento de la lista
- Las notificaciones se configuran para durar 10 segundos
- El diseño se basa en el componente `formulario-participante` existente
- Se incluye manejo completo de estados de carga y error
