import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-calendar-loading',
    templateUrl: './calendar-loading.component.html',
    styleUrls: ['./calendar-loading.component.css']
})
export class CalendarLoadingComponent {
    @Input() mensaje: string = 'Cargando reuniones...';
    @Input() mostrar: boolean = false;
}
