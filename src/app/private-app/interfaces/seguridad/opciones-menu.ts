export interface IOpcionMenu {
  idOpcionMenu?: number;
  idOpcionMenuPadre?: number;
  nombre: string;
  descripcion?: string;
  icono?: string;
  url?: string;
  activo?: number;
  orden: number;
}

export interface IListaOpcionMenu extends  IOpcionMenu {
  nombreMenuPadre?: string;
  opciones? : IListaOpcionMenu[];
}
