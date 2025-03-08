import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";
import { LeafletMapComponent } from "../leaflet-map/leaflet-map.component";
import * as L from "leaflet";

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
export class JuegoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([51.505, -0.09], 13);

    // Agregar capa de mapa base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Intentar ubicar al usuario
    map.locate({setView: true, maxZoom: 16});
  });
  }
}
