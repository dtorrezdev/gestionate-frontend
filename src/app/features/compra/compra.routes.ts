import { Routes } from '@angular/router';

export default [
    {
        path: 'proveedor',
        loadComponent: () => import('./proveedor/pages/proveedor.page').then(p => p.ProveedorPage),
    }
] as Routes;
