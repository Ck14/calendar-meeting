import { Component, OnInit, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalCrearMeetService } from '../modal-crear-meet/modal-crear-meet.service';
import { ISalaModel } from 'src/app/interfaces/meetings/salaModelo';
import { Confirm, Loading, Notify } from 'notiflix';
import { forkJoin, of } from 'rxjs';
import { IPrioridadModel } from 'src/app/interfaces/meetings/prioridadModelo';
import { IMeetModelo, IValidarSalaModel } from 'src/app/interfaces/meetings/meetModel';
import { IParticipanteModel } from 'src/app/interfaces/meetings/participanteModelo';
import { ValidacionesService } from '../../services/validaciones.service';

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

  // Datos del modal (recibidos como propiedades desde initialState)
  tituloModal: string = 'Editar Reunión';
  event: any = null;

  // FormGroup para el formulario
  formMeeting: FormGroup;
  eventoGuardar = new EventEmitter();

  // Lista de salas disponibles
  salas: ISalaModel[] = [];
  prioridades: IPrioridadModel[] = [];
  participantes: IParticipanteModel[] = [];

  // Propiedades para el autocompletado de participantes
  filteredParticipants: IParticipanteModel[] = [];
  showSuggestions: boolean = false;
  selectedParticipantIndex: number = -1;
  currentInputValue: string = '';
  selectedParticipants: IParticipanteModel[] = [];

  // Propiedades para el autocompletado de organizadores
  filteredOrganizers: IParticipanteModel[] = [];
  showOrganizerSuggestions: boolean = false;
  selectedOrganizerIndex: number = -1;
  currentOrganizerInputValue: string = '';
  selectedOrganizers: IParticipanteModel[] = [];

  // Propiedades para validación de sala
  isValidatingSala: boolean = false;
  salaDisponible: boolean = false;
  meetsOcupandoSala: IMeetModelo[] = [];

  // ID del evento que se está editando
  meetingId: number | null = null;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private modalCrearMeetService: ModalCrearMeetService,
    private validacionesService: ValidacionesService,
    private cdr: ChangeDetectorRef
  ) {
    this.formMeeting = this.fb.group({
      title: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      room: ['', [Validators.required]],
      description: [''],
      attendees: ['', [Validators.required, this.validacionesService.participantesRequeridosValidator()]],
      organizer: ['', [Validators.required, this.validacionesService.participantesRequeridosValidator()]],
      priority: ['']
    }, {
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

    console.log('🔄 Modal editar inicializando...');
    console.log('🔄 bsModalRef.content:', this.bsModalRef.content);

    // Cargar catálogos
    this.cargarCatalogos();

    // Inicializar los campos de autocompletado
    this.updateAttendeesField();
    this.updateOrganizerField();
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

      // Establecer prioridad por defecto si no hay evento, o cargar datos del evento
      setTimeout(() => {
        console.log('🔄 Verificando evento en caché:', this.event);
        if (this.event) {
          this.loadEventData();
        } else {
          this.establecerPrioridadPorDefecto();
        }
      }, 100);
      return;
    }

    // Si no están todos en caché, mostramos loading y cargamos solo los que faltan
    Loading.standard("Obteniendo catálogos...");

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

        // Cargar datos del evento después de tener los catálogos o establecer prioridad por defecto
        console.log('🔄 Verificando evento después de cargar catálogos:', this.event);
        if (this.event) {
          this.loadEventData();
        } else {
          this.establecerPrioridadPorDefecto();
        }
      },
      error: (error) => {
        console.error('Error al cargar catálogos:', error);
        Loading.remove();
      },
      complete() { },
    });
  }

  /**
   * Cargar datos del evento al formulario
   */
  private loadEventData(): void {
    console.log('Datos del evento completo:', this.event);
    console.log('extendedProps:', this.event.extendedProps);

    // Los datos pueden estar en extendedProps o directamente en el evento
    const eventData = this.event.extendedProps || {};

    // Cargar ID del meeting si existe
    this.meetingId = eventData.idMeet ||
      this.event.extendedProps?.idMeet ||
      eventData.id ||
      this.event.id ||
      null;
    console.log('🔄 Meeting ID cargado:', this.meetingId);

    // Cargar datos básicos al formulario
    this.formMeeting.patchValue({
      title: this.event.title || '',
      start: this.formatDateTimeForInput(this.event.start),
      end: this.formatDateTimeForInput(this.event.end),
      description: eventData.description || this.event.description || ''
    });

    // Cargar sala (buscar por ID o nombre)
    const salaId = eventData.idSala ||
      this.event.extendedProps?.idSala ||
      this.event.idSala;

    const salaNombre = eventData.nombreSala ||
      this.event.extendedProps?.nombreSala ||
      this.event.room ||
      eventData.room;

    console.log('🔄 salaId encontrado:', salaId);
    console.log('🔄 salaNombre encontrado:', salaNombre);

    if (salaId && salaId !== null && salaId !== undefined) {
      this.formMeeting.patchValue({ room: salaId.toString() });
      console.log('✅ Sala cargada por ID:', salaId);
    } else if (salaNombre && this.salas.length > 0) {
      const sala = this.salas.find(s => s.nombreSala === salaNombre);
      if (sala) {
        this.formMeeting.patchValue({ room: sala.idSala?.toString() });
        console.log('✅ Sala cargada por nombre:', salaNombre, 'con ID:', sala.idSala);
      }
    }

    // Cargar prioridad - ahora con extendedProps
    console.log('🔄 CARGANDO PRIORIDAD:');
    console.log('🔄 eventData (extendedProps):', eventData);
    console.log('🔄 this.event:', this.event);
    console.log('🔄 this.event.extendedProps:', this.event.extendedProps);

    // Buscar ID de prioridad en varios lugares posibles
    const prioridadId = eventData.idPrioridad ||
      this.event.extendedProps?.idPrioridad ||
      this.event.idPrioridad;

    // Buscar nombre de prioridad en varios lugares posibles
    const prioridadNombre = eventData.prioridadNombre ||
      this.event.extendedProps?.prioridadNombre ||
      this.event.priority ||
      eventData.priority;

    console.log('🔄 prioridadId encontrado:', prioridadId);
    console.log('🔄 prioridadNombre encontrado:', prioridadNombre);
    console.log('🔄 Prioridades disponibles:', this.prioridades.map(p => ({ id: p.idPrioridad, nombre: p.nombrePrioridad })));

    if (prioridadId && prioridadId !== null && prioridadId !== undefined) {
      this.formMeeting.patchValue({ priority: prioridadId.toString() });
      console.log('✅ Prioridad cargada por ID:', prioridadId);
    } else if (prioridadNombre && this.prioridades.length > 0) {
      const prioridad = this.prioridades.find(p =>
        p.nombrePrioridad?.toLowerCase() === prioridadNombre.toLowerCase()
      );
      console.log('🔄 Prioridad encontrada por nombre:', prioridad);
      if (prioridad) {
        this.formMeeting.patchValue({ priority: prioridad.idPrioridad?.toString() });
        console.log('✅ Prioridad cargada por nombre:', prioridad.nombrePrioridad, 'con ID:', prioridad.idPrioridad);
      } else {
        console.log('❌ No se encontró prioridad por nombre, usando por defecto');
        this.establecerPrioridadPorDefecto();
      }
    } else {
      console.log('❌ No hay datos de prioridad, usando por defecto');
      this.establecerPrioridadPorDefecto();
    }

    // Cargar participantes
    const participantesData = eventData.invitados ||
      this.event.extendedProps?.invitados ||
      this.event.attendees ||
      eventData.attendees;
    console.log('🔄 Participantes encontrados:', participantesData);
    this.loadParticipants(participantesData);

    // Cargar organizadores
    const organizadoresData = eventData.organizadores ||
      this.event.extendedProps?.organizadores ||
      this.event.organizer ||
      eventData.organizer;
    console.log('🔄 Organizadores encontrados:', organizadoresData);
    this.loadOrganizers(organizadoresData);

    // Forzar detección de cambios
    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('✅ Datos cargados en el formulario reactivo');
      console.log('✅ Valor actual de priority:', this.formMeeting.get('priority')?.value);
      console.log('✅ Prioridades disponibles:', this.prioridades.map(p => ({ id: p.idPrioridad, nombre: p.nombrePrioridad })));
    }, 100);
  }

  /**
   * Cargar participantes al formulario
   */
  private loadParticipants(attendees: any): void {
    this.selectedParticipants = [];

    if (!attendees) return;

    let participantsList: string[] = [];

    if (Array.isArray(attendees)) {
      participantsList = attendees;
    } else if (typeof attendees === 'string') {
      participantsList = attendees.split(',').map(p => p.trim()).filter(p => p.length > 0);
    }

    // Convertir a objetos IParticipanteModel
    participantsList.forEach(participantName => {
      // Buscar en la lista de participantes existentes
      let participant = this.participantes.find(p =>
        p.nombre === participantName || p.correo === participantName
      );

      // Si no se encuentra, crear uno personalizado
      if (!participant) {
        participant = {
          nombre: participantName,
          correo: participantName
        };
      }

      this.selectedParticipants.push(participant);
    });

    this.updateAttendeesField();
  }

  /**
   * Cargar organizadores al formulario
   */
  private loadOrganizers(organizers: any): void {
    this.selectedOrganizers = [];

    if (!organizers) return;

    let organizersList: string[] = [];

    if (Array.isArray(organizers)) {
      organizersList = organizers;
    } else if (typeof organizers === 'string') {
      organizersList = organizers.split(',').map(o => o.trim()).filter(o => o.length > 0);
    }

    // Convertir a objetos IParticipanteModel
    organizersList.forEach(organizerName => {
      // Buscar en la lista de participantes existentes
      let organizer = this.participantes.find(p =>
        p.nombre === organizerName || p.correo === organizerName
      );

      // Si no se encuentra, crear uno personalizado
      if (!organizer) {
        organizer = {
          nombre: organizerName,
          correo: organizerName
        };
      }

      this.selectedOrganizers.push(organizer);
    });

    this.updateOrganizerField();
  }

  public confirmUpdate(): void {
    // Forzar validación de los campos
    this.updateAttendeesField();
    this.updateOrganizerField();

    if (!this.formMeeting.valid) {
      this.formMeeting.markAllAsTouched();
      this.formMeeting.markAsDirty();
      return Notify.failure("Por favor, revise los campos resaltados y complete correctamente la información solicitada.");
    }

    // Validar que la sala esté disponible antes de continuar
    if (!this.validarSalaAntesDeGuardar()) {
      return;
    }

    // Obtener nombres descriptivos para el confirm
    const nombrePrioridad = this.obtenerNombrePrioridad(+this.priority?.value);
    const nombreSala = this.obtenerNombreSala(+this.room?.value);

    Confirm.show(
      "¿Confirma actualización de la reunión?",
      `<div style="text-align: left;">Título de la reunión: <b>${this.title?.value}</b> </div>
       <div style="text-align: left;">Prioridad: <b>${nombrePrioridad}</b> </div>
       <div style="text-align: left;">Fecha y Hora de Inicio: <b>${this.start?.value ? new Date(this.start.value).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</b> </div>
       <div style="text-align: left;">Fecha y Hora de Fin: <b>${this.end?.value ? new Date(this.end.value).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</b> </div>
       <div style="text-align: left;">Sala de Reunión: <b>${nombreSala}</b> </div>
       <div>&nbsp;</div>       
      `,
      "Si",
      "No",
      () => {
        this.updateMeeting();
      },
      () => { }
    );
  }

  public updateMeeting(): void {
    Loading.standard("Actualizando reunión...");

    let meeting: IMeetModelo = {
      idMeet: this.meetingId ?? undefined,
      titulo: this.title?.value,
      descripcion: this.description?.value,
      fechaInicio: this.start?.value,
      fechaFin: this.end?.value,
      idSala: +this.room?.value,
      idPrioridad: +this.priority?.value,
      idEstado: 1,
      idTipoMeet: 1,
      invitados: this.selectedParticipants.map(p => p.correo || p.nombre || ''),
      organizadores: this.selectedOrganizers.map(p => p.correo || p.nombre || '')
    }



    this.modalCrearMeetService.actualizarMeet(meeting).subscribe({
      next: (response) => {
        console.log(response);
        Loading.remove();

        // Mostrar notificación de éxito con el título de la reunión
        const tituloReunion = this.title?.value || 'la reunión';
        Notify.success(`¡Reunión "${tituloReunion}" actualizada exitosamente!`);

        this.eventoGuardar.emit(true);
        this.bsModalRef.hide();
        Loading.remove();

        // Cerrar el modal después de un breve delay para que se vea la notificación
        /* setTimeout(() => {
          this.bsModalRef.hide();
        }, 1000); */
      },
      error: (error) => {
        console.error('Error al guardar la reunión:', error);
        Loading.remove();

        // Mostrar notificación de error
        Notify.failure("Error al crear la reunión. Por favor, intente nuevamente.");
      }
    });
  }

  /**
   * Establece la primera prioridad como seleccionada por defecto
   */
  private establecerPrioridadPorDefecto(): void {
    console.log('🔄 Estableciendo prioridad por defecto...');
    console.log('🔄 Prioridades disponibles:', this.prioridades?.length);

    if (this.prioridades && this.prioridades.length > 0) {
      const primeraPrioridad = this.prioridades[0];
      console.log('🔄 Primera prioridad:', primeraPrioridad);

      if (primeraPrioridad && primeraPrioridad.idPrioridad) {
        this.formMeeting.patchValue({
          priority: primeraPrioridad.idPrioridad.toString()
        });
        console.log('✅ Prioridad por defecto establecida:', primeraPrioridad.nombrePrioridad);
        console.log('✅ Valor establecido:', primeraPrioridad.idPrioridad.toString());

        // Forzar detección de cambios
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 10);
      } else {
        console.log('❌ Primera prioridad no tiene ID válido');
      }
    } else {
      console.log('❌ No hay prioridades disponibles');
    }
  }

  /**
   * Obtiene el nombre de la prioridad basado en el ID
   */
  private obtenerNombrePrioridad(idPrioridad: number): string {
    const prioridad = this.prioridades.find(p => p.idPrioridad === idPrioridad);
    return prioridad?.nombrePrioridad || 'No especificada';
  }

  /**
   * Obtiene el nombre de la sala basado en el ID
   */
  private obtenerNombreSala(idSala: number): string {
    const sala = this.salas.find(s => s.idSala === idSala);
    return sala?.nombreSala || 'No especificada';
  }

  /**
   * Valida la disponibilidad de la sala seleccionada
   */
  onSalaChange(): void {
    const salaId = this.room?.value;
    const fechaInicio = this.start?.value;
    const fechaFin = this.end?.value;

    // Solo validar si tenemos todos los datos necesarios
    if (!salaId || !fechaInicio || !fechaFin) {
      this.resetSalaValidation();
      return;
    }

    // Validar que las fechas sean válidas
    if (new Date(fechaInicio) >= new Date(fechaFin)) {
      this.resetSalaValidation();
      return;
    }

    this.isValidatingSala = true;
    this.salaDisponible = false;
    this.meetsOcupandoSala = [];

    const validacionSala: IValidarSalaModel = {
      idSala: +salaId,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin
    };

    this.modalCrearMeetService.validarSalaDisponible(validacionSala).subscribe({
      next: (meetsOcupados: IMeetModelo[]) => {
        this.isValidatingSala = false;
        this.meetsOcupandoSala = meetsOcupados;
        this.salaDisponible = meetsOcupados.length === 0;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al validar la sala:', error);
        this.isValidatingSala = false;
        this.salaDisponible = false;
        this.meetsOcupandoSala = [];
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Resetea la validación de sala
   */
  private resetSalaValidation(): void {
    this.isValidatingSala = false;
    this.salaDisponible = false;
    this.meetsOcupandoSala = [];
  }

  /**
   * Se ejecuta cuando cambian las fechas de inicio o fin
   */
  onFechaChange(): void {
    // Si ya hay una sala seleccionada, revalidar
    if (this.room?.value) {
      this.onSalaChange();
    }
  }

  /**
   * Valida que la sala seleccionada esté disponible antes de guardar
   */
  private validarSalaAntesDeGuardar(): boolean {
    if (!this.room?.value) {
      Notify.info('Debe seleccionar una sala de reunión');
      return false;
    }

    if (this.isValidatingSala) {
      Notify.info('Espere mientras se valida la disponibilidad de la sala');
      return false;
    }

    if (!this.salaDisponible && this.meetsOcupandoSala.length > 0) {
      Notify.info('La sala seleccionada está ocupada. Debe seleccionar otra sala disponible');
      return false;
    }

    return true;
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

      if (correo.includes(searchLower)) {
        return true;
      }

      if (nombre.includes(searchLower)) {
        return true;
      }

      const palabrasBusqueda = searchLower.split(' ').filter(palabra => palabra.length > 0);
      const palabrasNombre = nombre.split(' ').filter(palabra => palabra.length > 0);

      if (palabrasBusqueda.length === 1) {
        return palabrasNombre.some(palabraNombre =>
          palabraNombre.startsWith(palabrasBusqueda[0]) || palabraNombre.includes(palabrasBusqueda[0])
        );
      }

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
   * Filtra los organizadores basado en el texto ingresado
   */
  filterOrganizers(searchText: string): void {
    if (!searchText || searchText.trim() === '') {
      this.filteredOrganizers = [];
      this.showOrganizerSuggestions = false;
      return;
    }

    const searchLower = searchText.toLowerCase().trim();

    this.filteredOrganizers = this.participantes.filter(participante => {
      const nombre = participante.nombre?.toLowerCase() || '';
      const correo = participante.correo?.toLowerCase() || '';

      if (correo.includes(searchLower)) {
        return true;
      }

      if (nombre.includes(searchLower)) {
        return true;
      }

      const palabrasBusqueda = searchLower.split(' ').filter(palabra => palabra.length > 0);
      const palabrasNombre = nombre.split(' ').filter(palabra => palabra.length > 0);

      if (palabrasBusqueda.length === 1) {
        return palabrasNombre.some(palabraNombre =>
          palabraNombre.startsWith(palabrasBusqueda[0]) || palabraNombre.includes(palabrasBusqueda[0])
        );
      }

      if (palabrasBusqueda.length > 1) {
        return palabrasBusqueda.every(palabraBusqueda =>
          palabrasNombre.some(palabraNombre =>
            palabraNombre.startsWith(palabraBusqueda) || palabraNombre.includes(palabraBusqueda)
          )
        );
      }

      return false;
    });

    this.showOrganizerSuggestions = this.filteredOrganizers.length > 0;
    this.selectedOrganizerIndex = -1;
  }

  /**
   * Agrega un correo personalizado cuando no se encuentra coincidencia
   */
  addCustomEmail(email: string): void {
    const newEmail = email.trim();

    const isAlreadySelected = this.selectedParticipants.some(p =>
      p.correo === newEmail || p.nombre === newEmail
    );

    if (isAlreadySelected || !newEmail) {
      return;
    }

    const customParticipant: IParticipanteModel = {
      nombre: newEmail,
      correo: newEmail
    };

    this.selectedParticipants.push(customParticipant);
    this.updateAttendeesField();

    this.currentInputValue = '';
    this.hideSuggestions();
  }

  /**
   * Agrega un correo personalizado de organizador cuando no se encuentra coincidencia
   */
  addCustomOrganizerEmail(email: string): void {
    const newEmail = email.trim();

    const isAlreadySelected = this.selectedOrganizers.some(p =>
      p.correo === newEmail || p.nombre === newEmail
    );

    if (isAlreadySelected || !newEmail) {
      return;
    }

    const customOrganizer: IParticipanteModel = {
      nombre: newEmail,
      correo: newEmail
    };

    this.selectedOrganizers.push(customOrganizer);
    this.updateOrganizerField();

    this.currentOrganizerInputValue = '';
    this.hideOrganizerSuggestions();
  }

  /**
   * Maneja el evento de input en el campo attendees
   */
  onAttendeesInput(event: any): void {
    const value = event.target.value;
    this.currentInputValue = value;

    if (!value || value.trim() === '') {
      this.selectedParticipants = [];
      this.hideSuggestions();
      return;
    }

    const lastCommaIndex = value.lastIndexOf(',');
    const searchText = lastCommaIndex === -1 ? value : value.substring(lastCommaIndex + 1).trim();

    if (searchText && searchText.trim() !== '') {
      this.filterParticipants(searchText);
    } else {
      this.hideSuggestions();
    }
  }

  /**
   * Maneja el evento de input en el campo organizer
   */
  onOrganizerInput(event: any): void {
    const value = event.target.value;
    this.currentOrganizerInputValue = value;

    if (!value || value.trim() === '') {
      this.selectedOrganizers = [];
      this.hideOrganizerSuggestions();
      return;
    }

    const lastCommaIndex = value.lastIndexOf(',');
    const searchText = lastCommaIndex === -1 ? value : value.substring(lastCommaIndex + 1).trim();

    if (searchText && searchText.trim() !== '') {
      this.filterOrganizers(searchText);
    } else {
      this.hideOrganizerSuggestions();
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
          this.addCustomEmail(this.getCurrentSearchText());
        }
        break;
      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }

  /**
   * Maneja la navegación con teclado en las sugerencias de organizadores
   */
  onOrganizerKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        if (this.showOrganizerSuggestions) {
          event.preventDefault();
          this.selectedOrganizerIndex = Math.min(
            this.selectedOrganizerIndex + 1,
            this.filteredOrganizers.length - 1
          );
        }
        break;
      case 'ArrowUp':
        if (this.showOrganizerSuggestions) {
          event.preventDefault();
          this.selectedOrganizerIndex = Math.max(this.selectedOrganizerIndex - 1, -1);
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (this.showOrganizerSuggestions && this.selectedOrganizerIndex >= 0) {
          this.selectOrganizer(this.filteredOrganizers[this.selectedOrganizerIndex]);
        } else if (this.getCurrentOrganizerSearchText()) {
          this.addCustomOrganizerEmail(this.getCurrentOrganizerSearchText());
        }
        break;
      case 'Escape':
        this.hideOrganizerSuggestions();
        break;
    }
  }

  /**
   * Selecciona un participante de las sugerencias
   */
  selectParticipant(participante: IParticipanteModel): void {
    const isAlreadySelected = this.selectedParticipants.some(p =>
      p.nombre === participante.nombre && p.correo === participante.correo
    );

    if (isAlreadySelected) {
      this.hideSuggestions();
      return;
    }

    this.selectedParticipants.push(participante);
    this.updateAttendeesField();

    this.hideSuggestions();
    this.currentInputValue = '';

    setTimeout(() => {
      const input = document.querySelector('input[formControlName="attendees"]') as HTMLInputElement;
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 0);
  }

  /**
   * Selecciona un organizador de las sugerencias
   */
  selectOrganizer(organizador: IParticipanteModel): void {
    const isAlreadySelected = this.selectedOrganizers.some(p =>
      p.nombre === organizador.nombre && p.correo === organizador.correo
    );

    if (isAlreadySelected) {
      this.hideOrganizerSuggestions();
      return;
    }

    this.selectedOrganizers.push(organizador);
    this.updateOrganizerField();

    this.hideOrganizerSuggestions();
    this.currentOrganizerInputValue = '';

    setTimeout(() => {
      const input = document.querySelector('input[formControlName="organizer"]') as HTMLInputElement;
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
    if (this.selectedParticipants.length === 0) {
      this.attendees?.setValue('');
    } else {
      const displayNames = this.selectedParticipants.map(p => p.nombre || p.correo || '');
      const value = displayNames.join(', ') + ', ';
      this.attendees?.setValue(value);
    }
    this.attendees?.updateValueAndValidity();
  }

  /**
   * Actualiza el campo de organizadores con los seleccionados
   */
  private updateOrganizerField(): void {
    if (this.selectedOrganizers.length === 0) {
      this.organizer?.setValue('');
    } else {
      const displayNames = this.selectedOrganizers.map(p => p.nombre || p.correo || '');
      const value = displayNames.join(', ') + ', ';
      this.organizer?.setValue(value);
    }
    this.organizer?.updateValueAndValidity();
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
   * Elimina un organizador de la lista de seleccionados
   */
  removeOrganizer(organizador: IParticipanteModel): void {
    this.selectedOrganizers = this.selectedOrganizers.filter(p =>
      !(p.nombre === organizador.nombre && p.correo === organizador.correo)
    );
    this.updateOrganizerField();
  }

  /**
   * Oculta las sugerencias
   */
  hideSuggestions(): void {
    this.showSuggestions = false;
    this.selectedParticipantIndex = -1;
  }

  /**
   * Oculta las sugerencias de organizadores
   */
  hideOrganizerSuggestions(): void {
    this.showOrganizerSuggestions = false;
    this.selectedOrganizerIndex = -1;
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
   * Maneja el evento blur del campo organizer
   */
  onOrganizerBlur(): void {
    setTimeout(() => {
      this.hideOrganizerSuggestions();
    }, 150);
  }

  /**
   * Maneja cuando se borra el contenido del campo
   */
  onAttendeesClear(): void {
    this.selectedParticipants = [];
    this.currentInputValue = '';
    this.hideSuggestions();
    this.updateAttendeesField();
  }

  /**
   * Maneja cuando se borra el contenido del campo organizer
   */
  onOrganizerClear(): void {
    this.selectedOrganizers = [];
    this.currentOrganizerInputValue = '';
    this.hideOrganizerSuggestions();
    this.updateOrganizerField();
  }

  /**
   * Obtiene el texto actual de búsqueda (después de la última coma)
   */
  getCurrentSearchText(): string {
    const value = this.attendees?.value || '';
    const lastCommaIndex = value.lastIndexOf(',');
    const searchText = lastCommaIndex === -1 ? value.trim() : value.substring(lastCommaIndex + 1).trim();
    return searchText && searchText.length > 0 ? searchText : '';
  }

  /**
   * Obtiene el texto actual de búsqueda para organizadores (después de la última coma)
   */
  getCurrentOrganizerSearchText(): string {
    const value = this.organizer?.value || '';
    const lastCommaIndex = value.lastIndexOf(',');
    const searchText = lastCommaIndex === -1 ? value.trim() : value.substring(lastCommaIndex + 1).trim();
    return searchText && searchText.length > 0 ? searchText : '';
  }

  /**
   * Obtiene la clase CSS para resaltar la sugerencia seleccionada
   */
  getSuggestionClass(index: number): string {
    return index === this.selectedParticipantIndex ? 'suggestion-selected' : '';
  }

  /**
   * Obtiene la clase CSS para resaltar la sugerencia de organizador seleccionada
   */
  getOrganizerSuggestionClass(index: number): string {
    return index === this.selectedOrganizerIndex ? 'suggestion-selected' : '';
  }

  // Getters para fácil acceso a los controles del formulario
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
