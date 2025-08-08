import { Component } from "@angular/core";
import { Router } from "@angular/router";
import Chart from "chart.js/auto";
import { url } from "inspector";
import { Loading, Notify } from "notiflix";
import { AuthService } from "src/app/utils/auth.service";

export interface IMenuModelo {
  icono?: string;
  nombre?: string;
  url?: string;
  descripcion?: string;
  color?: string;
  opciones: IMenuModelo[];
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent {
  public menu: IMenuModelo[] = [];
  public ejemplo = "bg-success";

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    Loading.init({
      svgColor: "#405189",
      messageMaxLength: 500,
    });

    let miMenu = this.auth.obtenerMenuUsuario();
    setTimeout(() => {
      if (miMenu.length) {
        let collapse = document.getElementsByClassName("collapse border-list");
        collapse[0].classList.add("show");
      }
    }, 0);
    this.menu = miMenu;

    console.log(".---------->", this.menu);

    if (this.menu.length == 0) {
      Loading.standard("El usuario no tiene ningún rol asignado");
      setTimeout(() => {
        Loading.remove();

        this.router.navigate(["/login"]);
      }, 5000);
    }
  }

  goToMenu(url?: string) {
    this.router.navigate([url]);
    // console.log("lllego aquí");
    // switch (menu) {
    //   case "internos":
    //     this.router.navigate(["clima-laboral/usuarios-interno"]);
    //     // this.router.navigate(["clima-laboral", "usuarios-internos"]);
    //     break;
    //   case "catalogos":
    //     this.router.navigate(["clima-laboral", "catalogos"]);
    //     break;
    //   case "encuestas":
    //     this.router.navigate(["clima-laboral", "encuestas"]);
    //     break;
    //   case "digitacion":
    //     this.router.navigate(["clima-laboral", "digitacion"]);
    //     break;

    //   default:
    //     break;
    // }
  }

  randomColor() {
    let colores = ["bg-success", "bg-danger", "bg-secondary"];
    const indiceAleatorio = Math.floor(Math.random() * colores.length);
    return colores[indiceAleatorio];
  }
}
