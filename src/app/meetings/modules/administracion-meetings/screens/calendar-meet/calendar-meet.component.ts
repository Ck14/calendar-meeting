import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput, CalendarApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalCrearMeetComponent, MeetingEvent as CreateMeetingEvent } from '../../components/modal-crear-meet/modal-crear-meet.component';
import { ModalEditarMeetComponent, ModalEditarMeetData, MeetingEvent as EditMeetingEvent } from '../../components/modal-editar-meet/modal-editar-meet.component';
import { CalendarMeetingsService, ICalendarMeeting } from '../../services/calendar-meetings.service';

// Interfaz extendida para eventos con datos adicionales
interface MeetingEvent extends EventInput {
  id?: string;
  title: string;
  start: string | Date;
  end: string | Date;
  room?: string;
  description?: string;
  attendees?: string[];
  organizer?: string;
  priority?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  classNames?: string[];
}

@Component({
  selector: 'app-calendar-meet',
  templateUrl: './calendar-meet.component.html',
  styleUrls: ['./calendar-meet.component.css']
})
export class CalendarMeetComponent implements OnInit {

  // Referencias a los modales
  bsModalCrear: any;
  bsModalEditar: any;

  // Estado del calendario
  isLoading: boolean = false;
  currentView: string = 'timeGridDay';
  currentStartDate: Date = new Date();
  currentEndDate: Date = new Date();


  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek,dayGridMonth'
    },
    initialView: 'timeGridDay',
    locale: 'es',
    height: 'auto',
    editable: true,
    selectable: true,
    eventResizableFromStart: true,
    nowIndicator: true,
    now: new Date(),
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista'
    },
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    },
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    },
    slotMinTime: '00:00:00',
    slotMaxTime: '24:00:00',
    scrollTime: '06:00:00',
    slotDuration: '00:30:00',
    expandRows: true,
    allDaySlot: false,
    slotEventOverlap: true,
    eventDisplay: 'block',
    eventMinHeight: 20,
    eventConstraint: {
      start: '00:00',
      end: '24:00',
      dows: [0, 1, 2, 3, 4, 5, 6]
    },
    eventOverlap: function (stillEvent: any, movingEvent: any) {
      return true; // Permite que todos los eventos se traslapen
    },
    slotLaneClassNames: 'fc-slot-lane',
    eventClassNames: 'fc-event-custom',
    dayCellClassNames: 'fc-day-cell',
    events: [], // Los eventos se cargarán dinámicamente
    select: (arg) => {
      this.abrirModalCrearEvento(arg);
    },
    eventClick: (arg) => {
      this.abrirModalEditarEvento(arg.event);
    },
    eventDidMount: (arg) => {
      this.customizeEventDisplay(arg.event);
    },
    eventResize: (arg) => { // Added event resize callback
      this.handleEventResize(arg);
    },
    eventDrop: (arg) => { // Added event drop callback
      this.handleEventDrop(arg);
    },
    datesSet: (arg) => {
      // Capturar el calendarApi y detectar traslapes cuando cambian las fechas
      this.calendarApi = arg.view.calendar;
      this.currentView = arg.view.type;
      this.currentStartDate = arg.start;
      this.currentEndDate = arg.end;

      // Cargar eventos para la nueva vista
      this.cargarEventosPorVista();

      // Detectar traslapes
      this.detectAndStyleOverlappingEvents();
    }
  };

  private calendarApi: CalendarApi | null = null;

  constructor(
    private modalService: BsModalService,
    private calendarMeetingsService: CalendarMeetingsService
  ) { }

  ngOnInit(): void {
    // Cargar eventos iniciales
    this.cargarEventosPorVista();

    // Detectar traslapes iniciales
    setTimeout(() => {
      this.detectAndStyleOverlappingEvents();
    }, 500);
  }

  private createEventId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Método para abrir modal de crear evento
  abrirModalCrearEvento(arg: any): void {
    console.log('📅 Datos del calendario recibidos:', arg);

    this.bsModalCrear = this.modalService.show(
      ModalCrearMeetComponent,
      {
        initialState: {
          calendarData: arg
        },
        class: "modal-lg modal-dialog-centered",
        keyboard: true,
        backdrop: "static",
      }
    );


    this.bsModalCrear.content.eventoGuardar.subscribe({
      next: () => {
        this.cargarEventosPorVista();
      },
      error: (error: any) => { },
      complete() { },
    });

    // Suscribirse al resultado del modal    
    /* this.bsModalCrear.onHidden?.subscribe((result: any) => {
      if (result && result.title) {
        this.agregarNuevoEvento(result);
      }
    }); */
  }

  // Método para abrir modal de editar evento
  abrirModalEditarEvento(event: any): void {
    const initialState: ModalEditarMeetData = {
      tituloModal: `Editar Reunión: ${event.title}`,
      event: event
    };

    this.bsModalEditar = this.modalService.show(
      ModalEditarMeetComponent,
      {
        initialState,
        class: "modal-lg modal-dialog-centered",
        keyboard: true,
        backdrop: "static",
      }
    );

    // Suscribirse al resultado del modal
    this.bsModalEditar.content = initialState;
    this.bsModalEditar.onHidden?.subscribe((result: any) => {
      if (result && result.title) {
        this.actualizarEventoExistente(event, result);
      }
    });
  }

  // Método para agregar nuevo evento
  private agregarNuevoEvento(eventData: CreateMeetingEvent): void {
    const newEvent: MeetingEvent = {
      id: this.createEventId(),
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      room: eventData.room,
      description: eventData.description,
      attendees: eventData.attendees,
      organizer: eventData.organizer,
      priority: eventData.priority,
      backgroundColor: this.getEventColor(eventData.priority),
      borderColor: this.getEventBorderColor(eventData.priority),
      textColor: this.getEventTextColor(eventData.priority),
      classNames: ['bootstrap-event', `event-${this.getEventType(eventData.priority)}`]
    };

    // Agregar evento al calendario
    const calendarApi = this.calendarOptions.events as any;
    if (calendarApi) {
      calendarApi.push(newEvent);
    }
  }

  // Método para actualizar evento existente
  private actualizarEventoExistente(event: any, updatedData: EditMeetingEvent): void {
    // Actualizar propiedades del evento
    event.setProp('title', updatedData.title);
    event.setExtendedProp('room', updatedData.room);
    event.setExtendedProp('description', updatedData.description);
    event.setExtendedProp('attendees', updatedData.attendees);
    event.setExtendedProp('organizer', updatedData.organizer);
    event.setExtendedProp('priority', updatedData.priority);
    event.setStart(updatedData.start);
    event.setEnd(updatedData.end);

    // Actualizar colores
    event.setProp('backgroundColor', this.getEventColor(updatedData.priority));
    event.setProp('borderColor', this.getEventBorderColor(updatedData.priority));
    event.setProp('textColor', this.getEventTextColor(updatedData.priority));
  }

  // Método para personalizar la visualización del evento
  private customizeEventDisplay(event: any): void {
    const eventElement = event.el;
    if (eventElement) {
      const eventData = event.extendedProps;

      // Agregar información adicional al tooltip
      let tooltipText = event.title;
      if (eventData.room) {
        tooltipText += `\n📍 ${eventData.room}`;
        // Agregar atributo data-room para CSS
        eventElement.setAttribute('data-room', eventData.room);
      }
      if (eventData.description) {
        tooltipText += `\n📝 ${eventData.description}`;
      }
      if (eventData.attendees && eventData.attendees.length > 0) {
        tooltipText += `\n👥 ${eventData.attendees.length} participantes`;
      }
      if (eventData.organizer) {
        tooltipText += `\n👤 Organizador: ${eventData.organizer}`;
      }
      if (eventData.priority) {
        tooltipText += `\n⚡ Prioridad: ${eventData.priority}`;
        // Agregar clase de prioridad
        eventElement.classList.add(`event-priority-${eventData.priority}`);
      }

      eventElement.setAttribute('title', tooltipText);

      // Asegurar que el evento tenga la altura correcta basada en su duración
      const eventDuration = event.end.getTime() - event.start.getTime();
      const minutes = eventDuration / (1000 * 60);

      // Calcular altura basada en la duración del evento
      if (event.view.type.includes('timeGrid')) {
        // Para vistas de tiempo, usar altura proporcional
        const height = Math.max(30, minutes * 1.2); // 1.2px por minuto
        eventElement.style.height = `${height}px`;
        eventElement.style.minHeight = `${height}px`;
      } else {
        // Para vistas de día, altura mínima
        eventElement.style.minHeight = '20px';
      }
    }
  }

  // Métodos auxiliares para colores
  private getEventColor(priority?: string): string {
    switch (priority) {
      case 'high': return 'rgba(52, 152, 219, 0.9)';
      case 'medium': return 'rgba(52, 152, 219, 0.9)';
      case 'low': return 'rgba(52, 152, 219, 0.9)';
      default: return 'rgba(52, 152, 219, 0.9)';
    }
  }

  private getEventBorderColor(priority?: string): string {
    switch (priority) {
      case 'high': return 'rgba(31, 95, 139, 0.9)';
      case 'medium': return 'rgba(31, 95, 139, 0.9)';
      case 'low': return 'rgba(31, 95, 139, 0.9)';
      default: return 'rgba(31, 95, 139, 0.9)';
    }
  }

  private getEventTextColor(priority?: string): string {
    switch (priority) {
      case 'high': return 'white';
      case 'medium': return 'white';
      case 'low': return 'white';
      default: return 'white';
    }
  }

  private getEventType(priority?: string): string {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'success';
      case 'low': return 'warning';
      default: return 'primary';
    }
  }



  // Método para obtener eventos
  obtenerEventos(): MeetingEvent[] {
    return this.calendarOptions.events as MeetingEvent[];
  }

  // Método para manejar el redimensionamiento de eventos
  private handleEventResize(arg: any): void {
    const event = arg.event;
    const newStart = event.start;
    const newEnd = event.end;

    console.log(`Evento redimensionado: ${event.title}`);
    console.log(`Nuevo inicio: ${newStart}`);
    console.log(`Nuevo fin: ${newEnd}`);

    // Detectar traslapes después del redimensionamiento
    setTimeout(() => {
      this.detectAndStyleOverlappingEvents();
    }, 100);

    // Aquí puedes agregar lógica adicional para guardar los cambios
    // Por ejemplo, actualizar en base de datos, notificar a otros usuarios, etc.
  }

  // Método para manejar el arrastre de eventos
  private handleEventDrop(arg: any): void {
    const event = arg.event;
    const newStart = event.start;
    const newEnd = event.end;

    console.log(`Evento movido: ${event.title}`);
    console.log(`Nuevo inicio: ${newStart}`);
    console.log(`Nuevo fin: ${newEnd}`);

    // Detectar traslapes después del movimiento
    setTimeout(() => {
      this.detectAndStyleOverlappingEvents();
    }, 100);

    // Aquí puedes agregar lógica adicional para guardar los cambios
    // Por ejemplo, actualizar en base de datos, notificar a otros usuarios, etc.
  }

  /**
   * Carga eventos según la vista actual del calendario
   */
  private cargarEventosPorVista(): void {
    this.isLoading = true;
    console.log('Cargando eventos por vista:', this.currentStartDate, this.currentEndDate, this.currentView);
    this.calendarMeetingsService.obtenerReunionesPorRango(
      this.currentStartDate,
      this.currentEndDate,
      this.currentView
    ).subscribe({
      next: (reuniones) => {
        const eventos = this.convertirReunionesAEventos(reuniones);
        this.actualizarEventosCalendario(eventos);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar reuniones:', error);
        this.isLoading = false;
        // Aquí podrías mostrar una notificación de error
      }
    });
  }

  /**
   * Convierte las reuniones del backend a eventos del calendario
   */
  private convertirReunionesAEventos(reuniones: ICalendarMeeting[]): MeetingEvent[] {
    return reuniones.map(reunion => ({
      id: reunion.id?.toString(),
      title: reunion.titulo,
      start: reunion.fechaInicio,
      end: reunion.fechaFin || reunion.fechaInicio,
      room: reunion.sala,
      description: reunion.descripcion,
      attendees: reunion.invitados,
      organizer: reunion.organizadores?.[0] || '',
      priority: reunion.prioridadNombre ? reunion.prioridadNombre : '',
      backgroundColor: this.calendarMeetingsService.obtenerColorPorPrioridad(reunion.idPrioridad),
      borderColor: this.calendarMeetingsService.obtenerColorBordePorPrioridad(reunion.idPrioridad),
      textColor: 'white',
      classNames: ['fc-event-custom', `event-${this.calendarMeetingsService.obtenerClasePrioridad(reunion.idPrioridad)}`]
    }));
  }

  /**
   * Actualiza los eventos del calendario
   */
  private actualizarEventosCalendario(eventos: MeetingEvent[]): void {
    if (this.calendarApi) {
      // Limpiar eventos existentes
      this.calendarApi.removeAllEvents();
      // Agregar nuevos eventos
      this.calendarApi.addEventSource(eventos);
    }
  }



  /**
   * Obtiene el nombre legible de la vista actual
   */
  obtenerNombreVista(): string {
    switch (this.currentView) {
      case 'timeGridDay':
        return 'Día';
      case 'timeGridWeek':
        return 'Semana';
      case 'dayGridMonth':
        return 'Mes';
      default:
        return 'Vista';
    }
  }

  // Método para detectar eventos traslapados y aplicar estilos
  private detectAndStyleOverlappingEvents(): void {
    const events = this.calendarOptions.events as MeetingEvent[];

    // Limpiar estilos previos
    events.forEach(event => {
      if (event.classNames) {
        event.classNames = event.classNames.filter(className =>
          !className.includes('overlapping-')
        );
      }
    });

    // Detectar traslapes
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const eventA = events[i];
        const eventB = events[j];

        if (this.eventsOverlap(eventA, eventB)) {
          // Marcar ambos eventos como traslapados
          this.addOverlappingClass(eventA, 'overlapping-primary');
          this.addOverlappingClass(eventB, 'overlapping-secondary');
        }
      }
    }

    // Refrescar el calendario para aplicar los cambios
    if (this.calendarApi) {
      this.calendarApi.refetchEvents();
    }
  }

  // Método para verificar si dos eventos se traslapan
  private eventsOverlap(eventA: MeetingEvent, eventB: MeetingEvent): boolean {
    const startA = new Date(eventA.start);
    const endA = new Date(eventA.end);
    const startB = new Date(eventB.start);
    const endB = new Date(eventB.end);

    // Verificar si hay traslape
    return startA < endB && startB < endA;
  }

  // Método para agregar clase de traslape
  private addOverlappingClass(event: MeetingEvent, className: string): void {
    if (!event.classNames) {
      event.classNames = [];
    }
    if (!event.classNames.includes(className)) {
      event.classNames.push(className);
    }
  }

  // Método para limpiar estilos de traslape
  private clearOverlappingStyles(): void {
    const events = this.calendarOptions.events as MeetingEvent[];
    events.forEach(event => {
      if (event.classNames) {
        event.classNames = event.classNames.filter(className =>
          !className.includes('overlapping-')
        );
      }
    });
  }
}
