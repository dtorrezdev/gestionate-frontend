import { Routes } from "@angular/router";

export default [
    { path: '', loadComponent: () => import('./venta/pages/list.venta.page').then(v => v.ListVentaPage) },
    { path: 'add', loadComponent: () => import('./venta/pages/add/add.venta.page').then(v => v.AddVentaPage) },
    { path: 'show/:id', loadComponent: () => import('./venta/pages/edit.ver.venta.page').then(p => p.EditVerVentaPage) },
    { path: 'edit/:id', loadComponent: () => import('./venta/pages/edit.ver.venta.page').then(p => p.EditVerVentaPage) },
    { path: 'cliente', loadComponent: () => import('./cliente/pages/cliente.page').then(c => c.ClientePage) },
    { path: 'history', loadComponent: () => import('./venta/pages/historial.venta.page').then(v => v.HistorialVentaPage) },
    { path: 'dia', loadComponent: () => import('./venta/pages/list.venta.dia.page').then(v => v.ListVentaDiaPage) },
    { path: 'pago', loadComponent: () => import('./pages').then(p => p.Pago) },
    { path: '**', redirectTo: '/about' }
] as Routes;
