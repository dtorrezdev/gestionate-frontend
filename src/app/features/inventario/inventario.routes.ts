import { Routes } from "@angular/router";

export default [

    { path: 'stocks', loadComponent: () => import('./stock/pages/list-stock-page').then(p => p.ListStockPage) },
    { path: 'ubicacion-stock', loadComponent: () => import('./ubicacion-stock/pages/list-ubicacion-stock.page').then(p => p.ListUbicacionStockPage) },
    { path: 'kardex', loadComponent: () => import('./pages').then(p => p.Kardex) },

    { path: 'reception', loadComponent: () => import('./pages').then(p => p.Reception) },
    { path: 'otros', loadComponent: () => import('./pages').then(p => p.Otros) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
