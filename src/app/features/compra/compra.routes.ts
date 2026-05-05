import { Routes } from '@angular/router';

export default [
    { path: '', loadComponent: () => import('./compra/pages/list.compra.page').then(v => v.ListCompraPage) },
    { path: 'solicitud', loadComponent: () => import('./solicitud/pages/list.solicitud.page').then(v => v.ListSolicitudCompraPage) },
    { path: 'solicitud-add', loadComponent: () => import('./solicitud/pages/add.solicitud.page').then(v => v.AddSolicitudPage) },
    { path: 'recepcion', loadComponent: () => import('./recepcion/pages/lista.recepcion.page').then(v => v.ListRecepcionPage) },
    {
        path: 'proveedor',
        loadComponent: () => import('./proveedor/pages/proveedor.page').then(p => p.ProveedorPage),
    }
] as Routes;
