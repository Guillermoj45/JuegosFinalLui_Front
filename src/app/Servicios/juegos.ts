import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Ubicacion} from "../modelo/Ubicacion";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class JuegosService {

  constructor(private http: HttpClient) { }

  enviarNivel(nivel: number) {
    return this.http.get<Ubicacion[]>('https://85.137.3.4/api/ubicaciones/' + nivel);
  }

  guardarPartida(puntuacion: number, Ubicaciones: Ubicacion[]) {
    let arrayIdUbicaciones = [];
    for (let i = 0; i < Ubicaciones.length; i++) {
      arrayIdUbicaciones.push(Ubicaciones[i].id);
    }
    let mensaje = {
      "nombre": localStorage.getItem('username'),
      "idUbicaciones": arrayIdUbicaciones,
      "puntaje": puntuacion,
    }
    return this.http.post('https://85.137.3.4/api/participante', mensaje)
  }

  obtenerPartida(): Observable<any> {
    const id = localStorage.getItem('id');
    return this.http.get(`https://85.137.3.4/api/resumen/${id}`);
  }

}
