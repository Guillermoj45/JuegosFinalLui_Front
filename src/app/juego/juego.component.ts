import { NgOptimizedImage } from "@angular/common";
import { LeafletMapComponent } from "../leaflet-map/leaflet-map.component";
import {Component, AfterViewInit, ElementRef, ViewChild, OnInit} from '@angular/core';
import * as L from 'leaflet';  // Importar Leaflet

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
export class JuegoComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  private map!: L.Map;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([51.505, -0.09], 13);

    // Agregar capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Intentar ubicar al usuario
    this.map.locate({ setView: true, maxZoom: 16 });
  }
}

