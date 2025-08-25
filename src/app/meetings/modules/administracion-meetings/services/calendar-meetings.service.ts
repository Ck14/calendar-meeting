import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { IMeetModelo } from 'src/app/interfaces/meetings/meetModel';

export interface ICalendarMeeting extends IMeetModelo {
    idMeet?: number;
    nombreSala?: string;
    nombrePrioridad?: string;
    nombreEstado?: string;
    nombreTipoMeet?: string;
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
        // return of(this.generarReunionesSimuladas(startDate, endDate, viewType)).pipe(delay(500));

        let url = `api/meet/reunionesPorRango`;

        const params = new HttpParams()
            .set('startDate', startDate.toDateString())
            .set('endDate', endDate.toDateString());


        return this.http.get<ICalendarMeeting[]>(url, { params });
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
     * Obtiene el color de prioridad - Esquema Azul/Morado
     */
    obtenerColorPorPrioridad(idPrioridad: number): string {
        const colores = {
            1: '#2196F3', // Baja - Azul Material
            2: '#9C27B0', // Media - Púrpura Material
            3: '#3F51B5'  // Alta - Índigo Material
        };
        return colores[idPrioridad as keyof typeof colores] || '#6c757d';
    }

    /**
     * Obtiene el color del borde por prioridad - Esquema Azul/Morado
     */
    obtenerColorBordePorPrioridad(idPrioridad: number): string {
        const colores = {
            1: '#1565C0', // Baja - Azul Material oscuro
            2: '#6A1B9A', // Media - Púrpura Material oscuro  
            3: '#283593'  // Alta - Índigo Material oscuro
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
