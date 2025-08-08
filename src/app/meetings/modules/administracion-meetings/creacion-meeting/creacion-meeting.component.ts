import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

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
  selector: 'app-creacion-meeting',
  templateUrl: './creacion-meeting.component.html',
  styleUrls: ['./creacion-meeting.component.css']
})
export class CreacionMeetingComponent implements OnInit {

  @ViewChild('eventModal') eventModal!: ElementRef;

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

  // Variables para el modal
  isEditing = false;
  currentEvent: any = null;
  modalData = {
    title: '',
    start: '',
    end: '',
    room: '',
    description: '',
    attendees: '',
    organizer: 'Usuario Actual',
    priority: 'medium'
  };

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
    slotDuration: '01:00:00',
    expandRows: true,
    allDaySlot: false,
    slotEventOverlap: false,
    eventOverlap: false,
    eventDisplay: 'block',
    eventMinHeight: 20,
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
        backgroundColor: 'rgba(0, 123, 255, 0.3)',
        borderColor: 'rgba(0, 86, 179, 0.5)',
        textColor: '#0056b3',
        classNames: ['bootstrap-event', 'event-primary']
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
        backgroundColor: 'rgba(40, 167, 69, 0.3)',
        borderColor: 'rgba(30, 126, 52, 0.5)',
        textColor: '#1e7e34',
        classNames: ['bootstrap-event', 'event-success']
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
        backgroundColor: 'rgba(220, 53, 69, 0.3)',
        borderColor: 'rgba(200, 35, 51, 0.5)',
        textColor: '#c82333',
        classNames: ['bootstrap-event', 'event-danger']
      }
    ],
    select: (arg) => {
      this.showEventModal(arg);
    },
    eventClick: (arg) => {
      this.showEventDetails(arg.event);
    },
    eventDidMount: (arg) => {
      this.customizeEventDisplay(arg.event);
    },
    dayCellClassNames: 'bootstrap-day-cell',
    eventClassNames: 'bootstrap-event'
  };

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

  // Método para mostrar modal de creación de evento
  private showEventModal(arg: any): void {
    this.isEditing = false;
    this.currentEvent = null;

    // Formatear las fechas para los inputs datetime-local
    const startDate = new Date(arg.startStr);
    const endDate = new Date(arg.endStr);

    // Limpiar datos del modal
    this.modalData = {
      title: '',
      start: this.formatDateTimeForInput(startDate),
      end: this.formatDateTimeForInput(endDate),
      room: '',
      description: '',
      attendees: '',
      organizer: 'Usuario Actual',
      priority: 'medium'
    };

    // Mostrar modal usando Bootstrap
    const modal = new (window as any).bootstrap.Modal(document.getElementById('eventModal'));
    modal.show();
  }

  // Método para mostrar detalles del evento
  private showEventDetails(event: any): void {
    this.isEditing = true;
    this.currentEvent = event;

    const eventData = event.extendedProps;

    // Llenar datos del modal
    this.modalData = {
      title: event.title,
      start: this.formatDateTimeForInput(event.start),
      end: this.formatDateTimeForInput(event.end),
      room: eventData.room || '',
      description: eventData.description || '',
      attendees: eventData.attendees ? eventData.attendees.join(', ') : '',
      organizer: eventData.organizer || 'Usuario Actual',
      priority: eventData.priority || 'medium'
    };

    // Mostrar modal
    const modal = new (window as any).bootstrap.Modal(document.getElementById('eventModal'));
    modal.show();
  }

  // Método para guardar evento
  saveEvent(): void {
    if (!this.modalData.title || !this.modalData.start || !this.modalData.end) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    // Convertir las fechas de string a Date objects
    const startDate = new Date(this.modalData.start);
    const endDate = new Date(this.modalData.end);

    // Validar que la fecha de fin sea posterior a la de inicio
    if (endDate <= startDate) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    const newEvent: MeetingEvent = {
      id: this.isEditing ? this.currentEvent.id : this.createEventId(),
      title: this.modalData.title,
      start: startDate,
      end: endDate,
      room: this.modalData.room || undefined,
      description: this.modalData.description || undefined,
      attendees: this.modalData.attendees ? this.modalData.attendees.split(',').map(a => a.trim()) : undefined,
      organizer: this.modalData.organizer,
      priority: this.modalData.priority as 'low' | 'medium' | 'high',
      backgroundColor: this.getEventColor(this.modalData.priority),
      borderColor: this.getEventBorderColor(this.modalData.priority),
      textColor: this.getEventTextColor(this.modalData.priority),
      classNames: ['bootstrap-event', `event-${this.getEventType(this.modalData.priority)}`]
    };

    if (this.isEditing) {
      // Actualizar evento existente
      this.currentEvent.setProp('title', newEvent.title);
      this.currentEvent.setExtendedProp('room', newEvent.room);
      this.currentEvent.setExtendedProp('description', newEvent.description);
      this.currentEvent.setExtendedProp('attendees', newEvent.attendees);
      this.currentEvent.setExtendedProp('organizer', newEvent.organizer);
      this.currentEvent.setExtendedProp('priority', newEvent.priority);
      this.currentEvent.setStart(startDate);
      this.currentEvent.setEnd(endDate);
    } else {
      // Agregar nuevo evento
      const calendarApi = (this.calendarOptions.events as any);
      if (calendarApi) {
        calendarApi.push(newEvent);
      }
    }

    // Cerrar modal
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('eventModal'));
    modal.hide();
  }

  // Método para editar evento
  private editEvent(event: any): void {
    this.showEventDetails(event);
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

      // Asegurar que el evento tenga la altura correcta
      const eventDuration = event.end.getTime() - event.start.getTime();
      const minutes = eventDuration / (1000 * 60);
      const height = Math.max(20, minutes * 0.5); // 0.5px por minuto
      eventElement.style.minHeight = `${height}px`;
    }
  }

  // Métodos auxiliares
  private formatDateTimeForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private getEventColor(priority: string): string {
    switch (priority) {
      case 'high': return 'rgba(220, 53, 69, 0.3)';
      case 'medium': return 'rgba(40, 167, 69, 0.3)';
      case 'low': return 'rgba(255, 193, 7, 0.3)';
      default: return 'rgba(0, 123, 255, 0.3)';
    }
  }

  private getEventBorderColor(priority: string): string {
    switch (priority) {
      case 'high': return 'rgba(200, 35, 51, 0.5)';
      case 'medium': return 'rgba(30, 126, 52, 0.5)';
      case 'low': return 'rgba(224, 168, 0, 0.5)';
      default: return 'rgba(0, 86, 179, 0.5)';
    }
  }

  private getEventTextColor(priority: string): string {
    switch (priority) {
      case 'high': return '#c82333';
      case 'medium': return '#1e7e34';
      case 'low': return '#856404';
      default: return '#0056b3';
    }
  }

  private getEventType(priority: string): string {
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
        backgroundColor: 'rgba(0, 123, 255, 0.3)',
        borderColor: 'rgba(0, 86, 179, 0.5)',
        textColor: '#0056b3',
        classNames: ['bootstrap-event', 'event-primary']
      });
    }
  }

  // Método para obtener eventos
  obtenerEventos(): MeetingEvent[] {
    return this.calendarOptions.events as MeetingEvent[];
  }
}
