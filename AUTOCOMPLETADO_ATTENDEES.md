# Autocompletado para Campo Attendees

## Descripción

Se ha implementado un sistema de autocompletado para el campo "Participantes" (attendees) en el modal de crear reuniones. Este autocompletado funciona de manera similar a las interfaces de envío de correo electrónico.

## Características

### 🔍 Búsqueda Inteligente

- Busca tanto por **nombre** como por **correo electrónico**
- La búsqueda es insensible a mayúsculas/minúsculas
- Filtra en tiempo real mientras el usuario escribe

### ⌨️ Navegación por Teclado

- **Flecha Abajo**: Navegar hacia abajo en las sugerencias
- **Flecha Arriba**: Navegar hacia arriba en las sugerencias
- **Enter**: Seleccionar la sugerencia resaltada
- **Escape**: Cerrar las sugerencias

### 🖱️ Navegación por Ratón

- Clic en cualquier sugerencia para seleccionarla
- Hover para resaltar la sugerencia

### 📝 Gestión de Múltiples Participantes

- Los participantes se separan automáticamente por comas
- Puedes agregar múltiples participantes en el mismo campo
- El autocompletado funciona con la última palabra escrita (después de la última coma)

### ⚡ Sistema de Caché Inteligente

- **Caché en memoria**: Los datos se mantienen en memoria para evitar llamadas repetidas a la API
- **TTL configurable**: Cada tipo de dato tiene su propio tiempo de vida en caché
- **Limpieza automática**: El caché se limpia automáticamente cuando expira
- **Gestión granular**: Puedes limpiar caché específico o completo

## Cómo Usar

1. **Escribir en el campo**: Comienza a escribir el nombre o correo de un participante
2. **Ver sugerencias**: Aparecerán sugerencias que coincidan con lo que escribes
3. **Seleccionar**: Usa las flechas del teclado + Enter o haz clic en la sugerencia
4. **Agregar más**: Escribe una coma y continúa agregando más participantes

## Ejemplo de Uso

```
Campo vacío: [                    ]
Escribes "juan": [Juan Pérez, Juan García]
Seleccionas "Juan Pérez": [Juan Pérez, ]
Escribes "maria": [María López, María García]
Seleccionas "María López": [Juan Pérez, María López, ]
```

## Archivos Modificados

### TypeScript

- `modal-crear-meet.component.ts`: Lógica del autocompletado
- `modal-crear-meet.service.ts`: Servicio con caché inteligente
- `cache.service.ts`: Servicio de caché global

### HTML

- `modal-crear-meet.component.html`: Template con las sugerencias

### CSS

- `modal-crear-meet.component.css`: Estilos para el autocompletado

## Funciones Principales

### `filterParticipants(searchText: string)`

Filtra la lista de participantes basándose en el texto de búsqueda.

### `onAttendeesInput(event: any)`

Maneja el evento de escritura en el campo de participantes.

### `onAttendeesKeyDown(event: KeyboardEvent)`

Maneja la navegación por teclado en las sugerencias.

### `selectParticipant(participante: IParticipanteModel)`

Selecciona un participante de las sugerencias y lo agrega al campo.

### `hideSuggestions()`

Oculta la lista de sugerencias.

## Sistema de Caché

### Características del Caché

- **TTL por tipo de dato**:
  - Salas: 10 minutos
  - Prioridades: 10 minutos
  - Participantes: 5 minutos

- **Limpieza automática**: Cada minuto se limpian los elementos expirados
- **Gestión granular**: Puedes limpiar caché específico o completo

### Métodos del Servicio de Caché

```typescript
// Obtener datos con caché automático
obtenerCategorias(): Observable<ISalaModel[]>
obtenerPrioridades(): Observable<IPrioridadModel[]>
obtenerParticipantes(): Observable<IParticipanteModel[]>

// Limpiar caché
limpiarCache(): void                    // Limpia todo el caché
limpiarCacheParticipantes(): void       // Limpia solo participantes

// Verificar estado del caché
estanCargadosSalas(): boolean
estanCargadosPrioridades(): boolean
estanCargadosParticipantes(): boolean

// Obtener datos del caché sin llamada a API
obtenerSalasCache(): ISalaModel[] | null
obtenerPrioridadesCache(): IPrioridadModel[] | null
obtenerParticipantesCache(): IParticipanteModel[] | null
```

### Beneficios del Caché

1. **Rendimiento**: Evita llamadas repetidas a la API
2. **Experiencia de usuario**: Carga instantánea en aperturas posteriores del modal
3. **Reducción de carga**: Menos peticiones al servidor
4. **Gestión inteligente**: Limpieza automática de datos obsoletos

## Estilos CSS

El autocompletado incluye:

- Diseño moderno y responsive
- Animaciones suaves
- Scrollbar personalizado
- Resaltado de elementos seleccionados
- Sombras y bordes elegantes

## Compatibilidad

- ✅ Angular 12+
- ✅ Navegadores modernos
- ✅ Responsive design
- ✅ Accesibilidad por teclado
- ✅ Sistema de caché optimizado
