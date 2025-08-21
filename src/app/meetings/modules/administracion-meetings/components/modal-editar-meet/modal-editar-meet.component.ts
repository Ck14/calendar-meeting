import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalCrearMeetService } from '../modal-crear-meet/modal-crear-meet.service';

// Interfaz para los datos del modal
export interface ModalEditarMeetData {
  tituloModal: string;
  event: any;
}

// Interfaz para el evento editado
export interface MeetingEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  room?: string;
  description?: string;
  attendees?: string[];
  organizer?: string;
  priority?: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-modal-editar-meet',
  templateUrl: './modal-editar-meet.component.html',
  styleUrls: ['./modal-editar-meet.component.css']
})
export class ModalEditarMeetComponent implements OnInit {

  // Datos del modal
  tituloModal: string = '';
  event: any = null;

  // Lista de salas disponibles (se cargarán desde el servicio)
  availableRooms: string[] = [];

  // Datos del formulario
  modalData = {
    title: '',
    start: '',
    end: '',
    room: '',
    description: '',
    attendees: '',
    organizer: '',
    priority: 'medium'
  };

  constructor(
    public bsModalRef: BsModalRef,
    private modalCrearMeetService: ModalCrearMeetService
  ) { }

  ngOnInit(): void {
    // Cargar datos del catálogo (salas, etc.)
    this.loadCatalogData();

    if (this.event) {
      this.loadEventData();
    }
  }

  // Método para cargar datos del catálogo
  private loadCatalogData(): void {
    this.modalCrearMeetService.obtenerCategorias().subscribe({
      next: (salas: any[]) => {
        if (salas && salas.length > 0) {
          this.availableRooms = salas.map((sala: any) => sala.nombreSala);
        } else {
          this.setDefaultRooms();
        }
      },
      error: (error: any) => {
        console.error('Error cargando datos del catálogo:', error);
        this.setDefaultRooms();
      }
    });
  }

  // Método para establecer salas por defecto
  private setDefaultRooms(): void {
    this.availableRooms = [
      'Sala de Conferencias A',
      'Sala de Conferencias B',
      'Sala de Reuniones 1',
      'Sala de Reuniones 2',
      'Sala Ejecutiva',
      'Auditorio Principal',
      'Sala de Capacitación'
    ];
  }

  // Método para cargar datos del evento
  private loadEventData(): void {
    console.log('Datos del evento completo:', this.event);
    console.log('extendedProps:', this.event.extendedProps);

    // Los datos pueden estar en extendedProps o directamente en el evento
    const eventData = this.event.extendedProps || {};

    this.modalData = {
      title: this.event.title || '',
      start: this.formatDateTimeForInput(this.event.start),
      end: this.formatDateTimeForInput(this.event.end),
      // Buscar room en extendedProps o directamente en el evento
      room: eventData.room || this.event.room || '',
      // Buscar description en extendedProps o directamente en el evento
      description: eventData.description || this.event.description || '',
      // Buscar attendees en extendedProps o directamente en el evento
      attendees: this.getAttendeesString(eventData.attendees || this.event.attendees),
      // Buscar organizer en extendedProps o directamente en el evento
      organizer: eventData.organizer || this.event.organizer || 'Usuario Actual',
      // Buscar priority en extendedProps o directamente en el evento
      priority: this.mapPriorityToSelectValue(eventData.priority || this.event.priority || 'medium')
    };

    console.log('Datos cargados en modalData:', this.modalData);
  }

  // Método auxiliar para convertir array de participantes a string
  private getAttendeesString(attendees: any): string {
    if (!attendees) return '';
    if (Array.isArray(attendees)) {
      return attendees.join(', ');
    }
    if (typeof attendees === 'string') {
      return attendees;
    }
    return '';
  }

  // Método auxiliar para mapear prioridad a valores del select
  private mapPriorityToSelectValue(priority: any): string {
    if (!priority) return 'medium';

    // Si viene como string en español, convertir a inglés
    const priorityStr = priority.toString().toLowerCase();
    if (priorityStr.includes('baja') || priorityStr === 'low') return 'low';
    if (priorityStr.includes('media') || priorityStr === 'medium') return 'medium';
    if (priorityStr.includes('alta') || priorityStr === 'high') return 'high';

    return 'medium'; // Default
  }

  // Método para actualizar evento
  updateEvent(): void {
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

    const updatedEvent: MeetingEvent = {
      id: this.event.id,
      title: this.modalData.title,
      start: startDate,
      end: endDate,
      room: this.modalData.room || undefined,
      description: this.modalData.description || undefined,
      attendees: this.modalData.attendees ? this.modalData.attendees.split(',').map(a => a.trim()).filter(a => a.length > 0) : undefined,
      organizer: this.modalData.organizer,
      priority: this.modalData.priority as 'low' | 'medium' | 'high'
    };

    console.log('Evento actualizado:', updatedEvent);

    // Cerrar modal y retornar el evento actualizado
    this.bsModalRef.hide();

    // Pasar el resultado a través del content para que sea accesible
    if (this.bsModalRef.content) {
      this.bsModalRef.content.result = updatedEvent;
    }
  }

  // Método para cancelar
  cancel(): void {
    this.bsModalRef.hide();
  }

  // Método auxiliar para formatear fecha
  private formatDateTimeForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
