import { Routes } from "@angular/router";

export default [
    // { path: 'stock', component: Stock },
    { path: 'stock', loadComponent: () => import('./pages').then(p => p.Stock) },
    // { path: 'reception', component: Reception },
    { path: 'reception', loadComponent: () => import('./pages').then(p => p.Reception) },
    // { path: 'otros', component: Otros },
    { path: 'otros', loadComponent: () => import('./pages').then(p => p.Otros) },
    { path: '**', redirectTo: '/about' }
] as Routes;
