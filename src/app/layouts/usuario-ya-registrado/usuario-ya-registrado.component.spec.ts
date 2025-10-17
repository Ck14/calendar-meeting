import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioYaRegistradoComponent } from './usuario-ya-registrado.component';

describe('UsuarioYaRegistradoComponent', () => {
    let component: UsuarioYaRegistradoComponent;
    let fixture: ComponentFixture<UsuarioYaRegistradoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UsuarioYaRegistradoComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UsuarioYaRegistradoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
