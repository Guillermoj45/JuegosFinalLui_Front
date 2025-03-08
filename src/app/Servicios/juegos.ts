import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Ubicacion} from "../modelo/Ubicacion";

@Injectable({
  providedIn: 'root'
})
export class JuegosService {

  constructor(private http: HttpClient) { }

  enviarNivel(nivel: number) {
    return this.http.get<Ubicacion>('api/ubicaciones/' + nivel);
  }

  guardarPartida(){

  }

}
