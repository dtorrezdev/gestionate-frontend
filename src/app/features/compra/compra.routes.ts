import { Routes } from '@angular/router';
import { ProveedorPage } from './proveedor/pages/proveedor.page';

export const compraRoutes: Routes = [
    {
        path: 'proveedores',
        component: ProveedorPage,
        data: { title: 'Proveedores' }
    },
    {
        path: '',
        redirectTo: 'proveedores',
        pathMatch: 'full'
    }
];
