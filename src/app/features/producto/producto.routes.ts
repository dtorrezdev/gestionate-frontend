import { Routes } from "@angular/router";

export default [
    { path: 'producto-base', loadComponent: () => import('./pages').then(p => p.ProductoBase) },
    // { path: 'presentacion', component: PresentacionPage },
    { path: 'presentacion', loadComponent: () => import('./presentacion/pages/presentacion.page').then(p => p.PresentacionPage) },
    { path: 'marca', loadComponent: () => import('./pages').then(p => p.Marca) },
    { path: 'unidad-medida', loadComponent: () => import('./pages').then(p => p.UnidadMedida) },
    { path: '**', redirectTo: '/about' }
] as Routes;
