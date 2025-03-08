import { NgOptimizedImage } from "@angular/common";
import { LeafletMapComponent } from "../leaflet-map/leaflet-map.component";
import {Component, AfterViewInit, ElementRef, ViewChild, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {Ubicacion} from "../modelo/Ubicacion";
import {JuegosService} from "../Servicios/juegos";  // Importar Leaflet

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.scss'],
  standalone: true,
  imports: [
    NgOptimizedImage,
    LeafletMapComponent
  ]
})
export class JuegoComponent implements AfterViewInit, OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  private map!: L.Map;
  private marker?: L.Marker;
  private markerResult!: L.Marker;
  private ListaParaClick: boolean = true;
  private ubicaciones? : Ubicacion[];
  private ubicacionActual? : Ubicacion;

  constructor(private juegos:JuegosService) {}

  ngOnInit() {
    this.juegos.enviarNivel(1).subscribe({
      next: (data: Ubicacion[]) => {
        this.ubicaciones = data;
        console.log(this.ubicaciones);
        this.siguienteUbicacion();
      },
      error: () => {
        console.log("Error al recibir la ubicación");
      },
      complete: () => {
        console.log("Completado");
      }
    });
  }

  ngAfterViewInit(): void {
    this.arranque();
    this.map.on('click', this.onMapClick);
  }

  arranque() {
    this.map = L.map(this.mapContainer.nativeElement).setView([51.505, -0.09], 3);

    // Agregar capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Intentar ubicar al usuario
    this.map.locate({ setView: true, maxZoom: 0 });
  }

  public siguienteUbicacion() {
    if (this.ubicacionActual && this.ubicaciones) {
      this.ubicacionActual = this.ubicaciones[this.ubicaciones.indexOf(this.ubicacionActual) + 1];
    } else if (this.ubicaciones) {
      this.ubicacionActual = this.ubicaciones[0];
      this.markerResult = L.marker([this.ubicacionActual.latitud, this.ubicacionActual.longitud]);
      console.log(this.ubicacionActual);
    } else {
      console.error("No hay ubicaciones");
      return;
    }
  }

  public onMapClick = (e: L.LeafletMouseEvent) => {
    if (!this.ListaParaClick) {
      return;
    }
    console.log([e.latlng.lat, e.latlng.lng]);
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
  }

  public revelacionCordenada() {
    if (this.ListaParaClick) {
      this.ListaParaClick = false;
      this.markerResult.addTo(this.map);
    } else {
      this.ListaParaClick = true;
      this.markerResult.remove();
    }
  }
}

