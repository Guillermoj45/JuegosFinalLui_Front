import {NgForOf, NgOptimizedImage} from "@angular/common";
import { LeafletMapComponent } from "../leaflet-map/leaflet-map.component";
import {Component, AfterViewInit, ElementRef, ViewChild, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {Ubicacion} from "../modelo/Ubicacion";
import {JuegosService} from "../Servicios/juegos";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";  // Importar Leaflet

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.scss'],
  standalone: true,
  imports: [
    NgOptimizedImage,
    LeafletMapComponent,
    NgForOf
  ]
})
export class JuegoComponent implements AfterViewInit, OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  private map!: L.Map;
  private marker?: L.Marker;
  private markerResult!: L.Marker;
  private ListaParaClick: boolean = true;
  private ubicaciones? : Ubicacion[];
  protected ubicacionActual? : Ubicacion;
  protected puntuacion: number = 0;

  constructor(private juegos:JuegosService, private toastController: ToastController, private router: Router) {}

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
    try {
      if (this.ubicacionActual && this.ubicaciones) {
        this.ubicacionActual = this.ubicaciones[this.ubicaciones.indexOf(this.ubicacionActual) + 1];
        this.markerResult = L.marker([this.ubicacionActual.latitud, this.ubicacionActual.longitud]);
        console.log(this.ubicacionActual);

      } else if (this.ubicaciones) {
        this.ubicacionActual = this.ubicaciones[0];
        this.markerResult = L.marker([this.ubicacionActual.latitud, this.ubicacionActual.longitud]);
        console.log(this.ubicacionActual);

      } else {
        console.error("No hay ubicaciones");
        return;
      }

    } catch (e) {
      if (!this.ubicaciones){
        return;
      }
      this.juegos.guardarPartida(this.puntuacion, this.ubicaciones).subscribe({
        next: (data: any) => {
          console.log(data);
          localStorage.setItem("id", data.id);
          this.router.navigate(['/resumen']);
        },
        error: () => {
          console.log("Error al guardar la partida");
        },
        complete: () => {
          console.log("Completado");
        }
      });
    }
  }

  public onMapClick = (e: L.LeafletMouseEvent) => {
    if (!this.ListaParaClick) {
      console.error("No se puede hacer click");
      return;
    }
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
  }

  public revelacionCordenada() {
    let boton = document.getElementById("boton")
    if (this.ListaParaClick) {
      if (!this.marker) {
        this.presentToast('Por favor, selecciona una ubicación en el mapa');
        return;
      }

      this.ListaParaClick = false;
      this.markerResult.addTo(this.map);
      if (boton)
        boton.innerHTML = "Siguiente";

      this.puntuacion += this.calcularPuntuacion()
    } else {

      this.ListaParaClick = true;
      if (this.marker)
        this.marker.remove();
      this.marker = undefined;
      this.markerResult.remove();
      if (boton)
        boton.innerHTML = "Confirmar";
      this.siguienteUbicacion();
    }
  }

  private calcularDistancia(): number {
    if (this.marker && this.markerResult) {
      const markerLatLng = this.marker.getLatLng();
      const markerResultLatLng = this.markerResult.getLatLng();
      return markerLatLng.distanceTo(markerResultLatLng);
    }
    return 0;
  }

  private calcularPuntuacion(): number {
    const distancia = this.calcularDistancia(); // Obtener la distancia en metros

    if (distancia === 0) {
      return 100; // Máxima puntuación si están en el mismo punto
    }

    // Convertir metros a kilómetros
    const distanciaKm = distancia / 1000;

    // Definir el umbral donde la puntuación empieza a ser negativa
    const umbralNegativo = 1000; // 1,000 km

    // Normalizar la puntuación con una escala logarítmica
    let puntuacion = 100 - (Math.log10(1 + distanciaKm) * 25);

    // Si la distancia supera el umbral, la puntuación sigue bajando en negativo
    if (distanciaKm > umbralNegativo) {
      puntuacion -= (distanciaKm - umbralNegativo) / 100; // Resta 1 punto por cada 1000 km extra
    }

    console.log(`Distancia: ${distanciaKm.toFixed(2)} km → Puntuación: ${puntuacion.toFixed(2)}`); // 👀 Verificar en consola

    return Math.round(puntuacion); // Redondear el resultado
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

}

