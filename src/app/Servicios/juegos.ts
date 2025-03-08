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
    return this.http.get<Ubicacion[]>('api/ubicaciones/' + nivel);
  }

  guardarPartida(){

  }

  obtenerPartida(): Observable<any> {
    const id = localStorage.getItem('id');
    return this.http.get(`api/resumen/${id}`);
  }

}
