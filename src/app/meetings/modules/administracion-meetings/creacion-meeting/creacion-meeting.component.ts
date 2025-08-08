import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'app-creacion-meeting',
  templateUrl: './creacion-meeting.component.html',
  styleUrls: ['./creacion-meeting.component.css']
})
export class CreacionMeetingComponent implements OnInit {

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
    slotMaxTime: '23:59:59',
    scrollTime: '00:00:00',
    slotDuration: '01:00:00',
    expandRows: true,
    events: [
      {
        title: 'Reunión de Planificación',
        start: '2024-01-15T10:00:00',
        end: '2024-01-15T11:30:00',
        backgroundColor: '#3788d8',
        borderColor: '#3788d8'
      },
      {
        title: 'Revisión de Proyectos',
        start: '2024-01-17T14:00:00',
        end: '2024-01-17T15:00:00',
        backgroundColor: '#28a745',
        borderColor: '#28a745'
      },
      {
        title: 'Presentación Ejecutiva',
        start: '2024-01-20T09:00:00',
        end: '2024-01-20T12:00:00',
        backgroundColor: '#dc3545',
        borderColor: '#dc3545'
      }
    ],
    select: (arg) => {
      const title = prompt('Título de la reunión:');
      if (title) {
        const calendarApi = arg.view.calendar;
        calendarApi.unselect();
        calendarApi.addEvent({
          id: this.createEventId(),
          title,
          start: arg.startStr,
          end: arg.endStr,
          allDay: arg.allDay,
          backgroundColor: '#3788d8',
          borderColor: '#3788d8'
        });
      }
    },
    eventClick: (arg) => {
      if (confirm('¿Eliminar esta reunión?')) {
        arg.event.remove();
      }
    }
  };

  ngOnInit(): void {
    // Inicialización básica
    // Forzar la actualización del calendario para asegurar que la línea de hora actual se muestre
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

  // Método para agregar nueva reunión
  agregarReunion(evento: EventInput): void {
    const calendarApi = this.calendarOptions.events as any;
    if (calendarApi) {
      calendarApi.push({
        id: this.createEventId(),
        ...evento,
        backgroundColor: '#3788d8',
        borderColor: '#3788d8'
      });
    }
  }

  // Método para obtener eventos
  obtenerEventos(): EventInput[] {
    return this.calendarOptions.events as EventInput[];
  }
}
