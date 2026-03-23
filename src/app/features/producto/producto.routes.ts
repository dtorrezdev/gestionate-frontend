import { Routes } from "@angular/router";

export default [
    { path: 'producto-base', loadComponent: () => import('./pages').then(p => p.ProductoBase) },
    // { path: 'presentacion', component: PresentacionPage },
    { path: 'presentacion', loadComponent: () => import('./presentacion/pages/presentacion.page').then(p => p.PresentacionPage) },
    { path: 'marca', loadComponent: () => import('./marca/pages/marca.page').then(p => p.Marca) },
    { path: 'categoria', loadComponent: () => import('./pages').then(p => p.Categoria) },
    { path: 'unidad-medida', loadComponent: () => import('./pages').then(p => p.UnidadMedida) },
    { path: '**', redirectTo: '/about' }
] as Routes;
