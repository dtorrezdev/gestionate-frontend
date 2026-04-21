import { Routes } from "@angular/router";

export default [
    { path: 'producto-base', loadComponent: () => import('./base/pages/list-producto-page').then(p => p.ListProductoPage) },
    // { path: 'presentacion', component: PresentacionPage },
    { path: 'presentacion', loadComponent: () => import('./presentacion/pages/presentacion.page').then(p => p.PresentacionPage) },
    { path: 'add-producto', loadComponent: () => import('./presentacion/pages/add.presentacion.page').then(p => p.AddPresentacionPage) },
    { path: 'edit-producto/:id', loadComponent: () => import('./presentacion/pages/edit.presentacion.page').then(p => p.EditPresentacionPage) },
    { path: 'marca', loadComponent: () => import('./marca/pages/marca.page').then(p => p.Marca) },
    { path: 'categoria', loadComponent: () => import('./pages').then(p => p.Categoria) },
    { path: 'unidad-medida', loadComponent: () => import('./unidad-medida/pages/list-unidad-medida-page').then(p => p.ListUnidadMedidaPage) },
    { path: '**', redirectTo: '/about' }
] as Routes;
