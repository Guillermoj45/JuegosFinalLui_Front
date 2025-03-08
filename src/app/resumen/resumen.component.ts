import { Component, OnInit } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Observable} from "rxjs";
import {JuegosService} from "../Servicios/juegos";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ]
})
export class ResumenComponent  implements OnInit {
  puntaje: string = '';
  sitios: string[] = [];


  constructor(private juegoService: JuegosService, private router: Router) { }

  ngOnInit() {
    this.juegoService.obtenerPartida().subscribe({
      next: (data) => {
        this.puntaje = data.puntaje;
        this.sitios = data.ubicaciones.map((ubicacion: any) => ubicacion.nombre);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  volver() {
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    this.router.navigate(['/']);
  }
}
