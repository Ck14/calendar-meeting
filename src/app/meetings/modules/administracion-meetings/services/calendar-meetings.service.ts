import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { IMeetModelo } from 'src/app/interfaces/meetings/meetModel';

export interface ICalendarMeeting extends IMeetModelo {
    id?: number;
    sala?: string;
    prioridadNombre?: string;
    estadoNombre?: string;
    tipoMeetNombre?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CalendarMeetingsService {

    constructor(private http: HttpClient) { }

    /**
     * Obtiene las reuniones según el rango de fechas y vista seleccionada
     * @param startDate - Fecha de inicio del rango
     * @param endDate - Fecha de fin del rango
     * @param viewType - Tipo de vista: 'day', 'week', 'month'
     * @returns Observable<ICalendarMeeting[]> - Array de reuniones
     */
    obtenerReunionesPorRango(startDate: Date, endDate: Date, viewType: string): Observable<ICalendarMeeting[]> {
        // Simular llamada a API con delay
        return of(this.generarReunionesSimuladas(startDate, endDate, viewType)).pipe(delay(500));
    }

    /**
     * Obtiene todas las reuniones (para vista general)
     */
    obtenerTodasLasReuniones(): Observable<ICalendarMeeting[]> {
        return of(this.generarReunionesSimuladas(new Date(), new Date(), 'month')).pipe(delay(300));
    }

    /**
     * Genera datos simulados de reuniones según el rango de fechas
     */
    private generarReunionesSimuladas(startDate: Date, endDate: Date, viewType: string): ICalendarMeeting[] {
        const reuniones: ICalendarMeeting[] = [];
        const salas = [
            'Sala de Conferencias A',
            'Sala de Conferencias B',
            'Sala de Reuniones 1',
            'Sala de Reuniones 2',
            'Sala Ejecutiva',
            'Auditorio Principal',
            'Sala de Capacitación'
        ];

        const prioridades = [
            { id: 1, nombre: 'Baja', color: '#28a745' },
            { id: 2, nombre: 'Media', color: '#ffc107' },
            { id: 3, nombre: 'Alta', color: '#dc3545' }
        ];

        const tipos = [
            { id: 1, nombre: 'Reunión de Equipo' },
            { id: 2, nombre: 'Presentación' },
            { id: 3, nombre: 'Planificación' },
            { id: 4, nombre: 'Revisión' },
            { id: 5, nombre: 'Capacitación' }
        ];

        const estados = [
            { id: 1, nombre: 'Programada' },
            { id: 2, nombre: 'En Curso' },
            { id: 3, nombre: 'Completada' },
            { id: 4, nombre: 'Cancelada' }
        ];

        // Generar reuniones según el tipo de vista
        let cantidadReuniones = 0;
        switch (viewType) {
            case 'timeGridDay':
                cantidadReuniones = Math.floor(Math.random() * 8) + 3; // 3-10 reuniones por día
                break;
            case 'timeGridWeek':
                cantidadReuniones = Math.floor(Math.random() * 25) + 15; // 15-40 reuniones por semana
                break;
            case 'dayGridMonth':
                cantidadReuniones = Math.floor(Math.random() * 80) + 50; // 50-130 reuniones por mes
                break;
            default:
                cantidadReuniones = Math.floor(Math.random() * 15) + 5;
        }

        for (let i = 0; i < cantidadReuniones; i++) {
            const fechaInicio = this.generarFechaAleatoria(startDate, endDate);
            const duracion = Math.floor(Math.random() * 120) + 30; // 30 min a 2.5 horas
            const fechaFin = new Date(fechaInicio.getTime() + duracion * 60000);

            const prioridad = prioridades[Math.floor(Math.random() * prioridades.length)];
            const tipo = tipos[Math.floor(Math.random() * tipos.length)];
            const estado = estados[Math.floor(Math.random() * estados.length)];
            const sala = salas[Math.floor(Math.random() * salas.length)];

            const reunion: ICalendarMeeting = {
                id: i + 1,
                titulo: this.generarTituloReunion(tipo.nombre),
                descripcion: this.generarDescripcionReunion(tipo.nombre),
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                idSala: Math.floor(Math.random() * 7) + 1,
                idPrioridad: prioridad.id,
                idEstado: estado.id,
                idTipoMeet: tipo.id,
                invitados: this.generarInvitadosAleatorios(),
                organizadores: this.generarOrganizadoresAleatorios(),
                sala: sala,
                prioridadNombre: prioridad.nombre,
                estadoNombre: estado.nombre,
                tipoMeetNombre: tipo.nombre
            };

            reuniones.push(reunion);
        }

        // Ordenar por fecha de inicio
        return reuniones.sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());
    }

    /**
     * Genera una fecha aleatoria dentro del rango especificado
     */
    private generarFechaAleatoria(startDate: Date, endDate: Date): Date {
        const start = startDate.getTime();
        const end = endDate.getTime();
        const randomTime = start + Math.random() * (end - start);
        const fecha = new Date(randomTime);

        // Asegurar que sea en horario laboral (8:00 AM - 6:00 PM)
        const hora = Math.floor(Math.random() * 10) + 8; // 8:00 - 18:00
        const minuto = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45

        fecha.setHours(hora, minuto, 0, 0);
        return fecha;
    }

    /**
     * Genera títulos de reuniones realistas
     */
    private generarTituloReunion(tipo: string): string {
        const titulos = {
            'Reunión de Equipo': [
                'Daily Standup',
                'Sprint Planning',
                'Retrospectiva del Sprint',
                'Reunión de Coordinación',
                'Review de Código'
            ],
            'Presentación': [
                'Demo del Producto',
                'Presentación de Resultados',
                'Pitch de Proyecto',
                'Exposición de Avances',
                'Showcase de Funcionalidades'
            ],
            'Planificación': [
                'Planificación Trimestral',
                'Estrategia de Producto',
                'Roadmap de Desarrollo',
                'Plan de Implementación',
                'Estrategia de Marketing'
            ],
            'Revisión': [
                'Revisión de Presupuesto',
                'Auditoría de Procesos',
                'Revisión de Contratos',
                'Evaluación de Desempeño',
                'Revisión de Seguridad'
            ],
            'Capacitación': [
                'Entrenamiento de Equipo',
                'Workshop de Herramientas',
                'Sesión de Aprendizaje',
                'Capacitación en Procesos',
                'Entrenamiento de Liderazgo'
            ]
        };

        const titulosDisponibles = titulos[tipo as keyof typeof titulos] || ['Reunión General'];
        return titulosDisponibles[Math.floor(Math.random() * titulosDisponibles.length)];
    }

    /**
     * Genera descripciones realistas para las reuniones
     */
    private generarDescripcionReunion(tipo: string): string {
        const descripciones = {
            'Reunión de Equipo': [
                'Reunión diaria para sincronizar el trabajo del equipo y resolver impedimentos.',
                'Coordinación de tareas y seguimiento de objetivos del sprint actual.',
                'Evaluación del progreso y planificación de próximas acciones.',
                'Discusión de desafíos técnicos y búsqueda de soluciones colaborativas.'
            ],
            'Presentación': [
                'Presentación de los resultados obtenidos en el último período.',
                'Demo de nuevas funcionalidades desarrolladas por el equipo.',
                'Exposición de métricas y KPIs del proyecto.',
                'Showcase de mejoras implementadas en el sistema.'
            ],
            'Planificación': [
                'Definición de objetivos y estrategias para el próximo trimestre.',
                'Planificación detallada de recursos y cronogramas.',
                'Establecimiento de prioridades y asignación de responsabilidades.',
                'Desarrollo de roadmap de producto y plan de lanzamiento.'
            ],
            'Revisión': [
                'Revisión exhaustiva de documentos y procesos actuales.',
                'Evaluación de cumplimiento de objetivos y métricas.',
                'Análisis de riesgos y definición de planes de mitigación.',
                'Auditoría de calidad y verificación de estándares.'
            ],
            'Capacitación': [
                'Sesión de entrenamiento sobre nuevas herramientas y tecnologías.',
                'Capacitación en metodologías y mejores prácticas.',
                'Workshop práctico para mejorar habilidades del equipo.',
                'Entrenamiento en procesos y procedimientos organizacionales.'
            ]
        };

        const descripcionesDisponibles = descripciones[tipo as keyof typeof descripciones] || ['Reunión para discutir temas importantes del proyecto.'];
        return descripcionesDisponibles[Math.floor(Math.random() * descripcionesDisponibles.length)];
    }

    /**
     * Genera lista de invitados aleatorios
     */
    private generarInvitadosAleatorios(): string[] {
        const nombres = [
            'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez',
            'Carmen Sánchez', 'Pedro Torres', 'Isabel Ruiz', 'Miguel Fernández', 'Elena Moreno',
            'Roberto Jiménez', 'Sofia Herrera', 'Diego Castro', 'Valentina Vargas', 'Andrés Silva'
        ];

        const cantidad = Math.floor(Math.random() * 5) + 2; // 2-6 invitados
        const invitados: string[] = [];

        for (let i = 0; i < cantidad; i++) {
            const nombre = nombres[Math.floor(Math.random() * nombres.length)];
            if (!invitados.includes(nombre)) {
                invitados.push(nombre);
            }
        }

        return invitados;
    }

    /**
     * Genera lista de organizadores aleatorios
     */
    private generarOrganizadoresAleatorios(): string[] {
        const organizadores = [
            'Tech Lead', 'Product Owner', 'Scrum Master', 'Project Manager', 'Team Lead',
            'Senior Developer', 'Architect', 'DevOps Engineer', 'QA Lead', 'UX Designer'
        ];

        const cantidad = Math.floor(Math.random() * 2) + 1; // 1-2 organizadores
        const seleccionados: string[] = [];

        for (let i = 0; i < cantidad; i++) {
            const organizador = organizadores[Math.floor(Math.random() * organizadores.length)];
            if (!seleccionados.includes(organizador)) {
                seleccionados.push(organizador);
            }
        }

        return seleccionados;
    }

    /**
     * Obtiene el color de prioridad
     */
    obtenerColorPorPrioridad(idPrioridad: number): string {
        const colores = {
            1: '#28a745', // Baja - Verde
            2: '#ffc107', // Media - Amarillo
            3: '#dc3545'  // Alta - Rojo
        };
        return colores[idPrioridad as keyof typeof colores] || '#6c757d';
    }

    /**
     * Obtiene el color del borde por prioridad
     */
    obtenerColorBordePorPrioridad(idPrioridad: number): string {
        const colores = {
            1: '#1e7e34', // Baja - Verde oscuro
            2: '#e0a800', // Media - Amarillo oscuro
            3: '#c82333'  // Alta - Rojo oscuro
        };
        return colores[idPrioridad as keyof typeof colores] || '#495057';
    }

    /**
     * Obtiene la clase CSS por prioridad
     */
    obtenerClasePrioridad(idPrioridad: number): string {
        const clases = {
            1: 'success',
            2: 'warning',
            3: 'danger'
        };
        return clases[idPrioridad as keyof typeof clases] || 'info';
    }
}
