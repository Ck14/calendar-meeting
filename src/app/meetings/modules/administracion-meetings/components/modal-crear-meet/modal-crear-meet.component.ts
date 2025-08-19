import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalCrearMeetService } from './modal-crear-meet.service';
import { ISalaModel } from 'src/app/interfaces/meetings/salaModelo';
import { Confirm, Loading, Notify } from 'notiflix';
import { forkJoin, of } from 'rxjs';
import { IPrioridadModel } from 'src/app/interfaces/meetings/prioridadModelo';
import { IMeetModelo } from 'src/app/interfaces/meetings/meetModel';
import { IParticipanteModel } from 'src/app/interfaces/meetings/participanteModelo';
import { ValidacionesService } from '../../services/validaciones.service';



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

  // Propiedades para el autocompletado
  filteredParticipants: IParticipanteModel[] = [];
  showSuggestions: boolean = false;
  selectedParticipantIndex: number = -1;
  currentInputValue: string = '';
  selectedParticipants: IParticipanteModel[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private modalCrearMeetService: ModalCrearMeetService,
    private validacionesService: ValidacionesService
  ) {
    this.formMeeting = this.fb.group({
      title: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      room: ['', [Validators.required]],
      description: [''],
      attendees: ['', [Validators.required]],
      organizer: [''],
      priority: ['']
    }, {
      // Ejemplo de uso del validador de rango de fechas y horas
      // También se puede usar: this.validacionesService.rangoHorasValidator('horaInicio', 'horaFinalizacion')
      // o: this.validacionesService.rangoFechasValidator('fechaInicio', 'fechaFin')
      validators: this.validacionesService.rangoFechaHoraValidator('start', 'end')
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
    // Verificar si ya tenemos datos en caché
    const salasCache = this.modalCrearMeetService.obtenerSalasCache();
    const prioridadesCache = this.modalCrearMeetService.obtenerPrioridadesCache();
    const participantesCache = this.modalCrearMeetService.obtenerParticipantesCache();

    // Si todos los datos están en caché, los usamos directamente
    if (salasCache && prioridadesCache && participantesCache) {
      this.salas = salasCache;
      this.prioridades = prioridadesCache;
      this.participantes = participantesCache;
      return;
    }

    // Si no están todos en caché, mostramos loading y cargamos solo los que faltan
    Loading.standard("Obteniendo catalogos...");

    // Cargar todos los datos (el servicio maneja el caché internamente)
    forkJoin([
      this.modalCrearMeetService.obtenerCategorias(),
      this.modalCrearMeetService.obtenerPrioridades(),
      this.modalCrearMeetService.obtenerParticipantes()
    ]).subscribe({
      next: (result) => {
        console.log('Datos cargados:', result);
        this.salas = result[0];
        this.prioridades = result[1];
        this.participantes = result[2];
        Loading.remove();
      },
      error: (error) => {
        console.error('Error al cargar catálogos:', error);
        Loading.remove();
      },
      complete() { },
    });
  }


  public confirmSave(): void {


    if (!this.formMeeting.valid) {
      this.formMeeting.markAllAsTouched();
      this.formMeeting.markAsDirty();
      return Notify.failure("Por favor, revise los campos resaltados y complete correctamente la información solicitada.");
    }



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
      fechaFin: this.end?.value,
      idSala: +this.room?.value,
      idPrioridad: +this.priority?.value,
      idEstado: 1,
      idTipoMeet: 1,
      invitados: this.selectedParticipants.map(p => p.correo || p.nombre || '')
    }

    console.log(meeting);

    this.modalCrearMeetService.insertarMeet(meeting).subscribe({
      next: (response) => {
        console.log(response);
        Loading.remove();
      },
      error: (error) => {
        console.error('Error al guardar la reunión:', error);
        Loading.remove();
      }
    });


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

  /**
* Filtra los participantes basado en el texto ingresado
*/
  filterParticipants(searchText: string): void {
    if (!searchText || searchText.trim() === '') {
      this.filteredParticipants = [];
      this.showSuggestions = false;
      return;
    }

    const searchLower = searchText.toLowerCase().trim();

    this.filteredParticipants = this.participantes.filter(participante => {
      const nombre = participante.nombre?.toLowerCase() || '';
      const correo = participante.correo?.toLowerCase() || '';

      // Verificar si coincide con el correo
      if (correo.includes(searchLower)) {
        return true;
      }

      // Verificar si coincide con el nombre completo
      if (nombre.includes(searchLower)) {
        return true;
      }

      // Búsqueda inteligente por múltiples palabras
      const palabrasBusqueda = searchLower.split(' ').filter(palabra => palabra.length > 0);
      const palabrasNombre = nombre.split(' ').filter(palabra => palabra.length > 0);

      // Si solo hay una palabra de búsqueda, buscar en cualquier palabra del nombre
      if (palabrasBusqueda.length === 1) {
        return palabrasNombre.some(palabraNombre =>
          palabraNombre.startsWith(palabrasBusqueda[0]) || palabraNombre.includes(palabrasBusqueda[0])
        );
      }

      // Si hay múltiples palabras de búsqueda, verificar que todas estén en el nombre
      if (palabrasBusqueda.length > 1) {
        return palabrasBusqueda.every(palabraBusqueda =>
          palabrasNombre.some(palabraNombre =>
            palabraNombre.startsWith(palabraBusqueda) || palabraNombre.includes(palabraBusqueda)
          )
        );
      }

      return false;
    });

    this.showSuggestions = this.filteredParticipants.length > 0;
    this.selectedParticipantIndex = -1;
  }

  /**
* Agrega un correo personalizado cuando no se encuentra coincidencia
*/
  addCustomEmail(email: string): void {
    // Usar directamente el email que se pasa como parámetro
    const newEmail = email.trim();

    // Verificar si el correo ya está en la lista de seleccionados
    const isAlreadySelected = this.selectedParticipants.some(p =>
      p.correo === newEmail || p.nombre === newEmail
    );

    if (isAlreadySelected || !newEmail) {
      return;
    }

    // Crear un participante personalizado
    const customParticipant: IParticipanteModel = {
      nombre: newEmail,
      correo: newEmail
    };

    // Agregar a la lista de seleccionados
    this.selectedParticipants.push(customParticipant);

    // Actualizar el campo
    this.updateAttendeesField();

    // Limpiar el campo de búsqueda
    this.currentInputValue = '';
    this.hideSuggestions();
  }

  /**
* Maneja el evento de input en el campo attendees
*/
  onAttendeesInput(event: any): void {
    const value = event.target.value;
    this.currentInputValue = value;

    // Si el campo está vacío, limpiar participantes seleccionados
    if (!value || value.trim() === '') {
      this.selectedParticipants = [];
      this.hideSuggestions();
      return;
    }

    // Extraer la última palabra que se está escribiendo (después de la última coma)
    const lastCommaIndex = value.lastIndexOf(',');
    const searchText = lastCommaIndex === -1 ? value : value.substring(lastCommaIndex + 1).trim();

    // Solo buscar si hay texto después de la última coma y no está vacío
    if (searchText && searchText.trim() !== '') {
      this.filterParticipants(searchText);
    } else {
      this.hideSuggestions();
    }
  }

  /**
   * Maneja la navegación con teclado en las sugerencias
   */
  onAttendeesKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        if (this.showSuggestions) {
          event.preventDefault();
          this.selectedParticipantIndex = Math.min(
            this.selectedParticipantIndex + 1,
            this.filteredParticipants.length - 1
          );
        }
        break;
      case 'ArrowUp':
        if (this.showSuggestions) {
          event.preventDefault();
          this.selectedParticipantIndex = Math.max(this.selectedParticipantIndex - 1, -1);
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (this.showSuggestions && this.selectedParticipantIndex >= 0) {
          this.selectParticipant(this.filteredParticipants[this.selectedParticipantIndex]);
        } else if (this.getCurrentSearchText()) {
          // Si no hay sugerencias pero hay texto, agregar como correo personalizado
          this.addCustomEmail(this.getCurrentSearchText());
        }
        break;
      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }

  /**
 * Selecciona un participante de las sugerencias
 */
  selectParticipant(participante: IParticipanteModel): void {
    // Verificar si el participante ya está seleccionado
    const isAlreadySelected = this.selectedParticipants.some(p =>
      p.nombre === participante.nombre && p.correo === participante.correo
    );

    if (isAlreadySelected) {
      this.hideSuggestions();
      return;
    }

    // Agregar el participante a la lista de seleccionados
    this.selectedParticipants.push(participante);

    // Actualizar el valor del campo con los participantes seleccionados
    this.updateAttendeesField();

    this.hideSuggestions();
    this.currentInputValue = '';

    // Enfocar el input después de la selección
    setTimeout(() => {
      const input = document.querySelector('input[formControlName="attendees"]') as HTMLInputElement;
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 0);
  }

  /**
   * Actualiza el campo de participantes con los seleccionados
   */
  private updateAttendeesField(): void {
    const displayNames = this.selectedParticipants.map(p => p.nombre || p.correo || '');
    this.attendees?.setValue(displayNames.join(', ') + ', ');
  }

  /**
   * Elimina un participante de la lista de seleccionados
   */
  removeParticipant(participante: IParticipanteModel): void {
    this.selectedParticipants = this.selectedParticipants.filter(p =>
      !(p.nombre === participante.nombre && p.correo === participante.correo)
    );
    this.updateAttendeesField();
  }

  /**
   * Oculta las sugerencias
   */
  hideSuggestions(): void {
    this.showSuggestions = false;
    this.selectedParticipantIndex = -1;
  }

  /**
   * Maneja el evento blur del campo attendees
   */
  onAttendeesBlur(): void {
    setTimeout(() => {
      this.hideSuggestions();
    }, 150);
  }

  /**
   * Maneja cuando se borra el contenido del campo
   */
  onAttendeesClear(): void {
    this.selectedParticipants = [];
    this.currentInputValue = '';
    this.hideSuggestions();
  }

  /**
 * Obtiene el texto actual de búsqueda (después de la última coma)
 */
  getCurrentSearchText(): string {
    const value = this.attendees?.value || '';
    const lastCommaIndex = value.lastIndexOf(',');
    const searchText = lastCommaIndex === -1 ? value.trim() : value.substring(lastCommaIndex + 1).trim();

    // Solo devolver si hay texto y no está vacío
    return searchText && searchText.length > 0 ? searchText : '';
  }

  /**
   * Obtiene la clase CSS para resaltar la sugerencia seleccionada
   */
  getSuggestionClass(index: number): string {
    return index === this.selectedParticipantIndex ? 'suggestion-selected' : '';
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

  /**
   * Verifica si hay error en el rango de fechas del formulario
   */
  public get hasRangoFechaHoraError(): boolean {
    return this.formMeeting.hasError('rangoFechaHoraInvalido');
  }
}
