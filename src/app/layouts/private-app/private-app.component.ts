import { Component } from '@angular/core';

@Component({
  selector: 'app-private-app',
  templateUrl: './private-app.component.html',
  styleUrls: ['./private-app.component.css']
})
export class PrivateAppComponent {
  sideBar : boolean = false;
  isDark: boolean = false;
  iconNavBar = "menu"

  constructor() { }

  ngOnInit(): void {
  }

  onOpen(e:any) {
    if (e === 1) {
      this.iconNavBar = 'menu_open'
    } else {
      this.iconNavBar = 'menu'
    }
    var side = document.getElementById("offcanvasExample")
    if(side?.classList.contains("show")) {
      side?.classList.remove("show")
      this.sideBar = false;
    } else {
      side?.classList.add("show")
      this.sideBar = true;
    }
  }
  onDark(e:any) {
    if (e === 1) {
      this.isDark = true;
    } else {
      this.isDark = false;
    }
  }
}
