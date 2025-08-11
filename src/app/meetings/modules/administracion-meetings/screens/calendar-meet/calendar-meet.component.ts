import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalCrearMeetComponent, ModalCrearMeetData, MeetingEvent as CreateMeetingEvent } from '../../components/modal-crear-meet/modal-crear-meet.component';
import { ModalEditarMeetComponent, ModalEditarMeetData, MeetingEvent as EditMeetingEvent } from '../../components/modal-editar-meet/modal-editar-meet.component';

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
  priority?: 'low' | 'medium' | 'high';
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

  // Lista de salas disponibles
  availableRooms = [
    'Sala de Conferencias A',
    'Sala de Conferencias B',
    'Sala de Reuniones 1',
    'Sala de Reuniones 2',
    'Sala Ejecutiva',
    'Auditorio Principal',
    'Sala de Capacitación'
  ];

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
    events: [
      {
        id: '1',
        title: 'Reunión de Planificación',
        start: new Date(new Date().setHours(10, 0, 0, 0)),
        end: new Date(new Date().setHours(11, 30, 0, 0)),
        room: 'Sala de Conferencias A',
        description: 'Reunión semanal de planificación de proyectos',
        attendees: ['Juan Pérez', 'María García', 'Carlos López'],
        organizer: 'Juan Pérez',
        priority: 'high',
        backgroundColor: 'rgba(52, 152, 219, 0.9)',
        borderColor: 'rgba(31, 95, 139, 0.9)',
        textColor: 'white',
        classNames: ['fc-event-custom', 'event-primary']
      },
      {
        id: '2',
        title: 'Revisión de Proyectos',
        start: new Date(new Date().setHours(14, 0, 0, 0)),
        end: new Date(new Date().setHours(15, 0, 0, 0)),
        room: 'Sala de Reuniones 1',
        description: 'Revisión mensual de proyectos en curso',
        attendees: ['Ana Rodríguez', 'Luis Martínez'],
        organizer: 'Ana Rodríguez',
        priority: 'medium',
        backgroundColor: 'rgba(52, 152, 219, 0.9)',
        borderColor: 'rgba(31, 95, 139, 0.9)',
        textColor: 'white',
        classNames: ['fc-event-custom', 'event-success']
      },
      {
        id: '3',
        title: 'Presentación Ejecutiva',
        start: new Date(new Date().setHours(9, 0, 0, 0)),
        end: new Date(new Date().setHours(12, 0, 0, 0)),
        room: 'Auditorio Principal',
        description: 'Presentación de resultados trimestrales',
        attendees: ['Directores Ejecutivos', 'Gerentes de Área'],
        organizer: 'CEO',
        priority: 'high',
        backgroundColor: 'rgba(52, 152, 219, 0.9)',
        borderColor: 'rgba(31, 95, 139, 0.9)',
        textColor: 'white',
        classNames: ['fc-event-custom', 'event-danger']
      },
      {
        id: '4',
        title: 'Reunión de Equipo',
        start: new Date(new Date().setHours(10, 30, 0, 0)),
        end: new Date(new Date().setHours(11, 30, 0, 0)),
        room: 'Sala de Reuniones 2',
        description: 'Reunión diaria del equipo de desarrollo',
        attendees: ['Desarrolladores', 'QA', 'Product Owner'],
        organizer: 'Tech Lead',
        priority: 'medium',
        backgroundColor: 'rgba(52, 152, 219, 0.9)',
        borderColor: 'rgba(31, 95, 139, 0.9)',
        textColor: 'white',
        classNames: ['fc-event-custom', 'event-warning']
      },
      {
        id: '5',
        title: 'Entrevista de Trabajo',
        start: new Date(new Date().setHours(11, 0, 0, 0)),
        end: new Date(new Date().setHours(12, 0, 0, 0)),
        room: 'Sala Ejecutiva',
        description: 'Entrevista para posición de Senior Developer',
        attendees: ['HR Manager', 'Tech Lead', 'Candidato'],
        organizer: 'HR Manager',
        priority: 'high',
        backgroundColor: 'rgba(52, 152, 219, 0.9)',
        borderColor: 'rgba(31, 95, 139, 0.9)',
        textColor: 'white',
        classNames: ['fc-event-custom', 'event-info']
      }
    ],
    select: (arg) => {
      this.abrirModalCrearEvento(arg);
    },
    eventClick: (arg) => {
      this.abrirModalEditarEvento(arg.event);
    },
    eventDidMount: (arg) => {
      this.customizeEventDisplay(arg.event);
    },
    eventResize: (arg) => {
      this.handleEventResize(arg);
    },
    eventDrop: (arg) => {
      this.handleEventDrop(arg);
    }
  };

  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.calendarOptions = {
        ...this.calendarOptions,
        height: 'auto',
        expandRows: true
      };
    }, 100);
  }

  private createEventId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Método para abrir modal de crear evento
  abrirModalCrearEvento(arg: any): void {
    const initialState: ModalCrearMeetData = {
      tituloModal: 'Crear Nueva Reunión',
      startDate: new Date(arg.startStr),
      endDate: new Date(arg.endStr)
    };

    this.bsModalCrear = this.modalService.show(
      ModalCrearMeetComponent,
      {
        initialState,
        class: "modal-lg modal-dialog-centered",
        keyboard: true,
        backdrop: "static",
      }
    );

    // Suscribirse al resultado del modal
    this.bsModalCrear.content = initialState;
    this.bsModalCrear.onHidden?.subscribe((result: any) => {
      if (result && result.title) {
        this.agregarNuevoEvento(result);
      }
    });
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

  // Método para agregar nueva reunión
  agregarReunion(evento: MeetingEvent): void {
    const calendarApi = this.calendarOptions.events as any;
    if (calendarApi) {
      calendarApi.push({
        id: this.createEventId(),
        ...evento,
        backgroundColor: 'rgba(52, 152, 219, 0.9)',
        borderColor: 'rgba(31, 95, 139, 0.9)',
        textColor: 'white',
        classNames: ['bootstrap-event', 'event-primary']
      });
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

    // Aquí puedes agregar lógica adicional para guardar los cambios
    // Por ejemplo, actualizar en base de datos, notificar a otros usuarios, etc.
  }
}
