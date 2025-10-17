# Ejemplos de Uso del Sistema de Caché

## Descripción

Este documento muestra cómo usar el sistema de caché implementado en otros componentes de la aplicación.

## Servicio de Caché Global

El `CacheService` es un servicio global que puede ser usado en cualquier componente para cachear datos.

### Importación

```typescript
import { CacheService } from 'src/app/meetings/modules/administracion-meetings/services/cache.service';
```

### Inyección

```typescript
constructor(private cacheService: CacheService) { }
```

## Ejemplos de Uso

### 1. Cachear Datos de API

```typescript
// En tu servicio
export class MiServicio {
  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  obtenerUsuarios(): Observable<Usuario[]> {
    const url = 'api/usuarios';
    return this.cacheService.cacheObservable(
      'usuarios_lista',
      this.http.get<Usuario[]>(url),
      5 * 60 * 1000 // 5 minutos
    );
  }
}
```

### 2. Verificar si Existen Datos en Caché

```typescript
// En tu componente
export class MiComponente {
  ngOnInit() {
    // Verificar si ya tenemos datos en caché
    const usuariosCache = this.cacheService.get<Usuario[]>('usuarios_lista');
    
    if (usuariosCache) {
      // Usar datos del caché
      this.usuarios = usuariosCache;
    } else {
      // Cargar datos de la API
      this.cargarUsuarios();
    }
  }
}
```

### 3. Limpiar Caché Específico

```typescript
// Cuando se actualiza un usuario
actualizarUsuario(usuario: Usuario) {
  this.http.put(`api/usuarios/${usuario.id}`, usuario).subscribe(() => {
    // Limpiar caché de usuarios para forzar recarga
    this.cacheService.delete('usuarios_lista');
    
    // O limpiar todo el caché
    // this.cacheService.clear();
  });
}
```

### 4. Cachear con TTL Personalizado

```typescript
// Datos que cambian frecuentemente (TTL corto)
obtenerNotificaciones(): Observable<Notificacion[]> {
  return this.cacheService.cacheObservable(
    'notificaciones',
    this.http.get<Notificacion[]>('api/notificaciones'),
    30 * 1000 // 30 segundos
  );
}

// Datos que cambian poco (TTL largo)
obtenerConfiguracion(): Observable<Configuracion> {
  return this.cacheService.cacheObservable(
    'configuracion',
    this.http.get<Configuracion>('api/configuracion'),
    60 * 60 * 1000 // 1 hora
  );
}
```

### 5. Cachear Datos Locales

```typescript
// Cachear datos que no vienen de API
guardarPreferencias(preferencias: Preferencias) {
  this.cacheService.set('preferencias_usuario', preferencias, 24 * 60 * 60 * 1000); // 24 horas
}

obtenerPreferencias(): Preferencias | null {
  return this.cacheService.get<Preferencias>('preferencias_usuario');
}
```

## Mejores Prácticas

### 1. Nomenclatura de Claves

```typescript
// Usar prefijos para organizar el caché
const CACHE_KEYS = {
  USUARIOS: 'app_usuarios_lista',
  CONFIGURACION: 'app_configuracion',
  NOTIFICACIONES: 'app_notificaciones',
  PREFERENCIAS: 'app_preferencias_usuario'
};
```

### 2. TTL Apropiado

```typescript
// Datos estáticos (configuración, catálogos)
const TTL_ESTATICO = 60 * 60 * 1000; // 1 hora

// Datos semi-estáticos (usuarios, salas)
const TTL_SEMI_ESTATICO = 10 * 60 * 1000; // 10 minutos

// Datos dinámicos (notificaciones, mensajes)
const TTL_DINAMICO = 30 * 1000; // 30 segundos
```

### 3. Limpieza de Caché

```typescript
// Limpiar caché cuando el usuario cierra sesión
logout() {
  this.cacheService.clear();
  // ... resto de la lógica de logout
}

// Limpiar caché específico cuando se actualiza
actualizarDatos() {
  this.http.put('api/datos', datos).subscribe(() => {
    this.cacheService.delete('datos_cache_key');
  });
}
```

### 4. Manejo de Errores

```typescript
obtenerDatosConCache(): Observable<Datos[]> {
  return this.cacheService.cacheObservable(
    'datos_key',
    this.http.get<Datos[]>('api/datos'),
    5 * 60 * 1000
  ).pipe(
    catchError(error => {
      console.error('Error al cargar datos:', error);
      // Limpiar caché en caso de error
      this.cacheService.delete('datos_key');
      return of([]);
    })
  );
}
```

## Monitoreo del Caché

### Verificar Estado del Caché

```typescript
// En desarrollo, puedes monitorear el caché
console.log('Tamaño del caché:', this.cacheService.getSize());
console.log('Claves en caché:', this.cacheService.getKeys());
```

### Debug del Caché

```typescript
// Agregar logs para debug
obtenerDatos(): Observable<Datos[]> {
  const cacheKey = 'datos_key';
  
  if (this.cacheService.has(cacheKey)) {
    console.log('Usando datos del caché');
  } else {
    console.log('Cargando datos de la API');
  }
  
  return this.cacheService.cacheObservable(cacheKey, this.http.get<Datos[]>('api/datos'));
}
```

## Consideraciones

1. **Memoria**: El caché se mantiene en memoria, no en localStorage
2. **Persistencia**: Los datos se pierden al recargar la página
3. **TTL**: Configura tiempos apropiados según la frecuencia de cambio de los datos
4. **Limpieza**: Implementa limpieza de caché cuando sea necesario
5. **Errores**: Maneja errores apropiadamente para evitar caché corrupto
