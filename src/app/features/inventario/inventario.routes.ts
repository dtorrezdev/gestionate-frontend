import { Routes } from "@angular/router";

export default [

    { path: 'stocks', loadComponent: () => import('./pages').then(p => p.Stock) },
    { path: 'ubicacion-stock', loadComponent: () => import('./ubicacion-stock/pages/list-ubicacion-stock.page').then(p => p.ListUbicacionStockPage) },
    { path: 'kardex', loadComponent: () => import('./pages').then(p => p.Kardex) },

    { path: 'reception', loadComponent: () => import('./pages').then(p => p.Reception) },
    { path: 'otros', loadComponent: () => import('./pages').then(p => p.Otros) },
    { path: '**', redirectTo: '/about' }
] as Routes;
