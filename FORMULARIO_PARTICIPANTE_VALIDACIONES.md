# Formulario de Participante - Validaciones Implementadas

## Resumen de Funcionalidades

Se han implementado las siguientes validaciones y funcionalidades para el formulario público de participantes:

### 1. Validación de Token

- **Sin token**: Si la URL no incluye el parámetro `token`, el usuario es redirigido al componente `/not-found`
- **Token inválido**: Si el token no es válido, el usuario es redirigido al componente `/not-found`

### 2. Validación de Horario de Reunión

- **Antes de la reunión**: Si el horario actual es anterior a la reunión (con margen de 15 minutos), redirige a `/formulario-desactivado`
- **Después de la reunión**: Si el horario actual es posterior a la reunión (con margen de 15 minutos), redirige a `/formulario-vencido`
- **Durante la reunión**: Si el horario está dentro del rango válido, muestra el formulario

### 3. Nuevos Métodos en el Servicio

#### `validarToken(token: string)`

- Valida el token y retorna información de la reunión
- Simula una llamada al backend con diferentes escenarios

#### `guardarFormularioParticipante(datos: FormularioParticipanteData)`

- Guarda los datos del formulario
- Simula una llamada al backend

### 4. Tokens de Prueba

Para probar los diferentes escenarios, puedes usar estos tokens:

- `token-antes`: Simula una reunión que aún no ha comenzado
- `token-despues`: Simula una reunión que ya terminó
- `token-activo`: Simula una reunión activa (dentro del rango de tiempo)
- Cualquier otro token: Simula una reunión válida

## Ejemplos de Uso

### URL con token válido durante la reunión:

```
/public/checkin?token=token-activo
```

### URL sin token (redirige a not-found):

```
/public/checkin
```

### URL con token de reunión futura (redirige a formulario-desactivado):

```
/public/checkin?token=token-antes
```

### URL con token de reunión pasada (redirige a formulario-vencido):

```
/public/checkin?token=token-despues
```

## Flujo de Validación

1. **Inicio**: El componente se inicializa
2. **Validación de token**: Se verifica si existe el parámetro `token` en la URL
3. **Validación de reunión**: Se consulta la información de la reunión usando el token
4. **Validación de horario**: Se verifica si el horario actual está dentro del rango válido
5. **Redirección o carga**: Según las validaciones, se redirige o se carga el formulario

## Componentes de Redirección

- `/not-found`: Para tokens inválidos o ausentes
- `/formulario-desactivado`: Para reuniones que aún no han comenzado
- `/formulario-vencido`: Para reuniones que ya terminaron

## Mejoras en la UI

- **Indicador de carga**: Muestra un spinner mientras se valida el token
- **Información de reunión**: Muestra detalles de la reunión cuando el token es válido
- **Notificaciones**: Usa Notiflix para mostrar mensajes de éxito y error
- **Estados de carga**: El formulario se oculta durante la validación

## Debugging y Logs

Se han agregado logs detallados para facilitar el debugging:

### Logs de Validación de Horario

- Hora actual
- Fecha inicio y fin de la reunión
- Márgenes de tiempo (15 minutos antes y después)
- Resultado de las comparaciones de tiempo
- Confirmación de redirecciones

### Logs de Navegación

- URL de redirección
- Confirmación de navegación exitosa
- Errores de navegación (si los hay)

### Logs de Componentes

- Confirmación de carga del componente FormularioVencidoComponent

## Cómo Probar las Redirecciones

1. **Abrir la consola del navegador** (F12)
2. **Navegar a las URLs de prueba**:
   - `/public/checkin?token=token-despues` → Debería redirigir a `/formulario-vencido`
   - `/public/checkin?token=token-antes` → Debería redirigir a `/formulario-desactivado`
   - `/public/checkin?token=token-activo` → Debería mostrar el formulario
3. **Verificar los logs en la consola** para confirmar el flujo de validación

## Estructura de Datos

### TokenValidationResponse

```typescript
interface TokenValidationResponse {
  isValid: boolean;
  meeting?: {
    idMeet: number;
    titulo: string;
    fechaInicio: Date;
    fechaFin: Date;
    horaInicio: string;
    horaFin: string;
  };
  message?: string;
}
```

### FormularioParticipanteData

```typescript
interface FormularioParticipanteData {
  token: string;
  dpi: string;
  nombreCompleto: string;
  puesto: string;
  institucion: string;
  telefonoExtension: string;
  correo: string;
  sexo: string;
  rangoEdad: number;
  discapacidad: number;
  pueblo: number;
  comunidadLinguistica: number;
}
```

## Notas de Implementación

- Los métodos del servicio simulan llamadas al backend con delays para una mejor experiencia de usuario
- Se agregó un margen de 15 minutos antes y después de la reunión para permitir registro temprano/tardío
- Las redirecciones se manejan usando el Router de Angular
- Se mantiene la compatibilidad con el código existente
- Se han agregado logs detallados para facilitar el debugging

## Solución de Problemas

Si las redirecciones no funcionan:

1. **Verificar la consola del navegador** para ver los logs de validación
2. **Confirmar que las rutas están correctamente configuradas** en `app-routing.module.ts`
3. **Verificar que los componentes están declarados** en `app.module.ts`
4. **Comprobar que no hay errores de JavaScript** en la consola
