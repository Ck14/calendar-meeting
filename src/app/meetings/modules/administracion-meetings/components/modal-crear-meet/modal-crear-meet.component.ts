import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalCrearMeetService } from './modal-crear-meet.service';
import { ISalaModel } from 'src/app/interfaces/meetings/salaModelo';
import { Confirm, Loading } from 'notiflix';
import { forkJoin } from 'rxjs';
import { IPrioridadModel } from 'src/app/interfaces/meetings/prioridadModelo';
import { IMeetModelo } from 'src/app/interfaces/meetings/meetModel';
import { IParticipanteModel } from 'src/app/interfaces/meetings/participanteModelo';



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

  // FormGroup para el formulario
  formMeeting: FormGroup;

  // Lista de salas disponibles
  salas: ISalaModel[] = [];
  prioridades: IPrioridadModel[] = [];
  participantes: IParticipanteModel[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private modalCrearMeetService: ModalCrearMeetService
  ) {
    this.formMeeting = this.fb.group({
      title: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      room: [''],
      description: [''],
      attendees: [''],
      organizer: [''],
      priority: ['']
    });
  }

  ngOnInit(): void {

    Confirm.init({
      width: "35%",
      borderRadius: "5px",
      titleMaxLength: 200,
      titleColor: "#212529",
      messageColor: "#212529",
      plainText: false,
      messageMaxLength: 500,
      okButtonBackground: "#0ab39c",
      cancelButtonColor: "#f06548",
      cancelButtonBackground: "#fff",
    });
    // Inicializar el formulario con fechas vacías
    // Las fechas se pueden establecer desde el componente padre si es necesario
    this.cargarCatalogos();
  }


  cargarCatalogos() {
    Loading.standard("Obteniendo catalogos...");

    let salas = this.modalCrearMeetService.obtenerCategorias();
    let prioridades = this.modalCrearMeetService.obtenerPrioridades();
    let participantes = this.modalCrearMeetService.obtenerParticipantes();


    forkJoin([salas, prioridades, participantes]).subscribe({
      next: (result) => {
        console.log(result);
        this.salas = result[0];
        this.prioridades = result[1];
        this.participantes = result[2];
        Loading.remove();
      },
      error: (error) => { },
      complete() { },
    });
  }


  public confirmSave(): void {
    Confirm.show(
      "¿Confirma creación de la reunión?",
      `<div style="text-align: left;">Título de la reunión: <b>${this.title?.value}</b> </div>
       <div style="text-align: left;">Prioridad: <b>${this.priority?.value}</b> </div>
       <div style="text-align: left;">Fecha y Hora de Inicio: <b>${this.start?.value ? new Date(this.start.value).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</b> </div>
       <div style="text-align: left;">Fecha y Hora de Fin: <b>${this.end?.value ? new Date(this.end.value).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</b> </div>
       <div style="text-align: left;">Sala de Reunión: <b>${this.room?.value}</b> </div>
       <div>&nbsp;</div>       
      `,
      "Si",
      "No",
      () => {
        this.saveMeeting();
      },
      () => { }
    );
  } // end


  public saveMeeting(): void {
    Loading.standard("Guardando reunión...");

    // Extraer solo la hora del datetime-local
    const horaInicio = this.start?.value ? this.extractTimeFromDateTime(this.start.value) : undefined;
    const horaFin = this.end?.value ? this.extractTimeFromDateTime(this.end.value) : undefined;

    let meeting: IMeetModelo = {
      titulo: this.title?.value,
      descripcion: this.description?.value,
      fechaInicio: this.start?.value,
      horaInicio: horaInicio,
      fechaFin: this.end?.value,
      horaFin: horaFin,
      idSala: +this.room?.value,
      idPrioridad: +this.priority?.value,
      idEstado: 1,
      idTipoMeet: 1
    }

    console.log(meeting);
  }

  /**
 * Extrae solo la hora de un string datetime-local (formato: YYYY-MM-DDTHH:MM)
 * @param dateTimeString - String en formato datetime-local
 * @returns Date con solo la hora (fecha actual + hora extraída)
 */
  private extractTimeFromDateTime(dateTimeString: string): Date | undefined {
    if (!dateTimeString) return undefined;

    try {
      // El formato datetime-local es YYYY-MM-DDTHH:MM
      // Extraemos la parte después de la T (que es la hora)
      const timePart = dateTimeString.split('T')[1];
      if (!timePart) return undefined;

      // Creamos una fecha con la hora extraída (usando la fecha actual)
      const [hours, minutes] = timePart.split(':').map(Number);
      const today = new Date();
      today.setHours(hours, minutes, 0, 0);

      return today;
    } catch (error) {
      console.error('Error al extraer la hora:', error);
      return undefined;
    }
  }


  public get title() {
    return this.formMeeting.get("title");
  }

  public get start() {
    return this.formMeeting.get("start");
  }

  public get end() {
    return this.formMeeting.get("end");
  }


  public get room() {
    return this.formMeeting.get("room");
  }

  public get description() {
    return this.formMeeting.get("description");
  }

  public get attendees() {
    return this.formMeeting.get("attendees");
  }

  public get organizer() {
    return this.formMeeting.get("organizer");
  }

  public get priority() {
    return this.formMeeting.get("priority");
  }
}
