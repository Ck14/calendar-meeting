import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

// Interfaz para los datos del modal
export interface ModalCrearMeetData {
  tituloModal: string;
  startDate: Date;
  endDate: Date;
}

// Interfaz para el evento creado
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
  selector: 'app-modal-crear-meet',
  templateUrl: './modal-crear-meet.component.html',
  styleUrls: ['./modal-crear-meet.component.css']
})
export class ModalCrearMeetComponent implements OnInit {

  // Datos del modal
  tituloModal: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();

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

  // Datos del formulario
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

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    // Formatear las fechas para los inputs datetime-local
    this.modalData.start = this.formatDateTimeForInput(this.startDate);
    this.modalData.end = this.formatDateTimeForInput(this.endDate);
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
      title: this.modalData.title,
      start: startDate,
      end: endDate,
      room: this.modalData.room || undefined,
      description: this.modalData.description || undefined,
      attendees: this.modalData.attendees ? this.modalData.attendees.split(',').map(a => a.trim()) : undefined,
      organizer: this.modalData.organizer,
      priority: this.modalData.priority as 'low' | 'medium' | 'high'
    };

    // Cerrar modal y retornar el evento creado
    this.bsModalRef.hide();
    this.bsModalRef.content = newEvent;
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
