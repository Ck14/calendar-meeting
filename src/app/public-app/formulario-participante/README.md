# Formulario de Participante

Este componente permite el registro de participantes para reuniones del MINFIN.

## Características

- Formulario reactivo con validaciones
- Campos organizados en secciones lógicas
- Diseño responsivo y moderno
- Validación de formato de DPI (13 dígitos)
- Validación de correo electrónico
- Campos de selección para información demográfica
- Manejo de query parameters para la llave del formulario

## Campos del Formulario

### Información Personal

- **DPI**: Número de identificación (13 dígitos, requerido)
- **Nombre Completo**: Nombre completo del participante (mínimo 3 caracteres, requerido)
- **Sexo**: Selección entre Masculino/Femenino (requerido)
- **Rango de Edad**: Selección de rangos de edad (requerido)

### Información Laboral

- **Puesto**: Cargo o puesto del participante (requerido)
- **Institución**: Institución donde trabaja (requerido)
- **Cargo del Puesto**: Descripción específica del cargo (requerido)
- **Teléfono/Extensión**: Número de contacto (requerido)
- **Correo Electrónico**: Email válido (requerido)

### Información Cultural y Lingüística

- **Idioma Principal**: Idioma principal del participante (requerido)
- **Pueblo**: Pueblo al que pertenece (requerido)
- **Comunidad Lingüística**: Comunidad lingüística específica (requerido)
- **Discapacidad**: Tipo de discapacidad si aplica (requerido)

## Uso

### Ruta

```
/public/formulario-participante?llave=LSXMO6T4VD
```

### Query Parameters

- `llave`: Llave única del formulario (ejemplo: "LSXMO6T4VD")

### Ejemplo de uso en el template

```html
<app-formulario-participante></app-formulario-participante>
```

## Validaciones

- **DPI**: Debe tener exactamente 13 dígitos numéricos
- **Nombre Completo**: Mínimo 3 caracteres
- **Correo**: Formato de email válido
- **Todos los campos**: Son requeridos

## Opciones de Selección

### Sexo

- Masculino (M)
- Femenino (F)

### Rango de Edad

- 18-25 años
- 26-35 años
- 36-45 años
- 46-55 años
- 56-65 años
- Más de 65 años

### Idioma Principal

- Español
- Inglés
- Francés
- Alemán
- Italiano
- Portugués
- Otro

### Pueblo

- Maya
- Garífuna
- Xinca
- Mestizo
- Ladino
- Otro

### Comunidad Lingüística

- K'iche'
- Q'eqchi'
- Kaqchikel
- Mam
- Q'anjob'al
- Poqomchi'
- Tz'utujil
- Achí
- Ixil
- Chuj
- Popti
- Ch'orti'
- Akateko
- Uspanteko
- Sipakapense
- Sakapulteko
- Awakateko
- Chaltiteko
- Mocho
- Tektiteko
- Español
- Otro

### Discapacidad

- Ninguna
- Visual
- Auditiva
- Motora
- Intelectual
- Psicosocial
- Otra

## Eventos

### onSubmit()

Se ejecuta cuando el formulario es válido y se envía. Los datos del formulario se pueden acceder a través de `formParticipante.value`.

## Estilos

El componente utiliza CSS Grid para el layout responsivo y incluye:

- Diseño moderno con gradientes
- Animaciones suaves
- Estados de hover y focus
- Diseño mobile-first
- Iconos de Material Design

## Dependencias

- Angular Reactive Forms
- Angular Router (para query parameters)
- Material Icons (para iconos)

## Notas de Desarrollo

- El componente está diseñado para ser completamente responsivo
- Incluye validaciones en tiempo real
- Maneja estados de carga y error
- Sigue las mejores prácticas de Angular
