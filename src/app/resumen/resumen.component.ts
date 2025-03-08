import { Component, OnInit } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss'],
  standalone: true,
  imports: [
    FormsModule
  ]
})
export class ResumenComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  volverAlInicio() {

  }
}
