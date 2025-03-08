import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'juego',
    loadComponent: () => import('./juego/juego.component').then((m) => m.JuegoComponent),
  },
  {
    path: 'resumen',
    loadComponent: () => import('./resumen/resumen.component').then((m) => m.ResumenComponent),
  }
];
