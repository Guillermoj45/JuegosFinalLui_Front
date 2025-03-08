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
      next: (data: Ubicacion) => {
        this.ubicacionActual = data;
        console.log(this.ubicacionActual);
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
    this.ListaParaClick = false;
    this.markerResult = L.marker([51.5, -0.09]).addTo(this.map);
  }
}

