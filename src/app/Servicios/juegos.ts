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
    return this.http.get<Ubicacion[]>('https://juegosfinallui-back.onrender.com/ubicaciones/' + nivel);
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
    return this.http.post('https://juegosfinallui-back.onrender.com/participante', mensaje)
  }

  obtenerPartida(): Observable<any> {
    const id = localStorage.getItem('id');
    return this.http.get(`https://juegosfinallui-back.onrender.com/resumen/${id}`);
  }

}
