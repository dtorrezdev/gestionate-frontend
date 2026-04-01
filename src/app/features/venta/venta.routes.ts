import { Routes } from "@angular/router";
import { Pago } from "./pages";
import { AddVentaPage } from "./venta/pages/add.venta.page";
import { ListVentaPage } from "./venta/pages/list.venta.page";
import { ClientePage } from "./cliente/pages/cliente.page";

export default [
    { path: '', loadComponent: () => import('./venta/pages/list.venta.page').then(v => v.ListVentaPage) },
    { path: 'add', loadComponent: () => import('./venta/pages/add.venta.page').then(v => v.AddVentaPage) },
    { path: 'show', loadComponent: () => import('./pages').then(p => p.VentaDetalle) },
    { path: 'edit', loadComponent: () => import('./pages').then(p => p.VentaDetalle) },
    { path: 'cliente', loadComponent: () => import('./cliente/pages/cliente.page').then(c => c.ClientePage) },
    { path: 'pago', loadComponent: () => import('./pages').then(p => p.Pago) },
    { path: '**', redirectTo: '/about' }
] as Routes;
