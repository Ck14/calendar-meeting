export interface IUsuarioSAT {
    nit: string,
    nombre: string,
    cui: string,
    email: string,
    emailSinMascara: string,
    estado: string,
    telefono: string,
    domicilioFiscal: string,
    tipoOrganizacion: number,
    actividadEconomica: string,
    procedencia: number,
    sexo: string,
    fechaInscripcionRTU: string,
    estadoInsolvencia: string,
    departamento: number,
    municipio: number
}


export interface IUsuarioSSO {
    nit: string;
    nombre: string;
    correo: string;
    activo?: boolean;
}


export interface IUsuarioClima {
    nitUsuario: string;
    nombreCompleto: string;
    emailInstitucional: string;
    emailPersonal: string;
    fechaRegistro: Date;
    nitRegistro: string;
    activo: boolean;
}