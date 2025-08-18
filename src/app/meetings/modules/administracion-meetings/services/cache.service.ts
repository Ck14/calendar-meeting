import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en milisegundos
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutos por defecto

  constructor() {
    // Limpiar caché expirado cada minuto
    setInterval(() => {
      this.cleanExpiredCache();
    }, 60 * 1000);
  }

  /**
   * Obtiene datos del caché
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Verificar si el caché ha expirado
    if (this.isExpired(item)) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Guarda datos en el caché
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    };

    this.cache.set(key, item);
  }

  /**
   * Verifica si existe un elemento en el caché
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    if (this.isExpired(item)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Elimina un elemento del caché
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Limpia todo el caché
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Limpia el caché expirado
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Verifica si un elemento del caché ha expirado
   */
  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  /**
   * Obtiene el tamaño del caché
   */
  getSize(): number {
    return this.cache.size;
  }

  /**
   * Obtiene todas las claves del caché
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Método helper para cachear observables
   */
  cacheObservable<T>(
    key: string, 
    observable: Observable<T>, 
    ttl?: number
  ): Observable<T> {
    // Si ya tenemos datos en caché, los devolvemos
    const cachedData = this.get<T>(key);
    if (cachedData !== null) {
      return of(cachedData);
    }

    // Si no hay datos en caché, hacemos la llamada y cacheamos el resultado
    return observable.pipe(
      tap(data => {
        this.set(key, data, ttl);
      }),
      catchError(error => {
        console.error(`Error al cargar datos para clave ${key}:`, error);
        throw error;
      })
    );
  }
}
