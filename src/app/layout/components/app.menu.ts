import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            /*{
                label: 'Administracion',
                items: [
                    {
                        label: 'Usuarios',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/documentation']
                    },
                    {
                        label: 'Roles',
                        icon: 'pi pi-fw pi-shield',
                        url: 'https://github.com/primefaces/sakai-ng',
                        target: '_blank'
                    },
                    {
                        label: 'Grupos',
                        icon: 'pi pi-fw pi-users',
                        url: 'https://github.com/primefaces/sakai-ng',
                        target: '_blank'
                    }
                ]
            },*/
            {
                label: 'Ventas',
                icon: 'pi pi-fw pi-briefcase',
                path: '/venta',
                items: [
                    {
                        label: 'Venta',
                        icon: 'pi pi-fw pi-receipt',
                        routerLink: ['/venta']
                    },
                    {
                        label: 'Venta del Dia',
                        icon: 'pi pi-fw pi-ticket',
                        routerLink: ['/venta/dia']
                    },
                    {
                        label: 'Historial Venta',
                        icon: 'pi pi-fw pi-shop',
                        routerLink: ['/venta/history']
                    }
                ]
            },
            {
                label: 'Clientes',
                icon: 'pi pi-fw pi-briefcase',
                path: '/venta',
                items: [
                    {
                        label: 'Listar cliente',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/venta/cliente']
                    },
                ]
            },
            /*{
                label: 'Hierarchy',
                path: '/hierarchy',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        path: '/hierarchy/submenu_1',
                        items: [
                            {
                                label: 'Submenu 1.1',
                                icon: 'pi pi-fw pi-bookmark',
                                path: '/hierarchy/submenu_1/submenu_1_1',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                path: '/hierarchy/submenu_1/submenu_1_2',
                                items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-bookmark',
                        path: '/hierarchy/submenu_2',
                        items: [
                            {
                                label: 'Submenu 2.1',
                                icon: 'pi pi-fw pi-bookmark',
                                path: '/hierarchy/submenu_2/submenu_2_1',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 2.2',
                                icon: 'pi pi-fw pi-bookmark',
                                path: '/hierarchy/submenu_2/submenu_2_2',
                                items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    }
                ]
            },*/
            {
                label: 'Productos',
                items: [
                    {
                        label: 'Marcas',
                        icon: 'pi pi-fw pi-tags',
                        routerLink: ['/producto/marca']
                    },
                    {
                        label: 'Prod Base',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/producto/producto-base']
                    },
                    {
                        label: 'Prod Presentacion',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/producto/presentacion']
                    },
                    {
                        label: 'Categoria',
                        icon: 'pi pi-fw pi-tag',
                        routerLink: ['/producto/categoria']
                    },
                    {
                        label: 'Unidad Medida',
                        icon: 'pi pi-fw pi-gauge',
                        routerLink: ['/producto/unidad-medida']
                    }
                ]
            },
            {
                label: 'Inventario',
                items: [
                    {
                        label: 'Producto Stock',
                        icon: 'pi pi-fw pi-warehouse',
                        routerLink: ['/inventario/stocks']
                    },
                    {
                        label: 'Ubicacion Stock',
                        icon: 'pi pi-fw pi-shop',
                        routerLink: ['/inventario/ubicacion-stock']
                    },
                    {
                        label: 'Kardex',
                        icon: 'pi pi-fw pi-microsoft',
                        routerLink: ['/inventario/kardex']
                    },
                ]
            },
            {
                label: 'Compras',
                items: [
                    {
                        label: 'Solicitud Compra',
                        icon: 'pi pi-fw pi-cart-plus',
                        routerLink: ['/documentation']
                    },
                    {
                        label: 'Recepcion Compra',
                        icon: 'pi pi-fw pi-shopping-bag',
                        routerLink: ['/recpcion']
                    },
                    {
                        label: 'Proveedor',
                        icon: 'pi pi-fw pi-car',
                        routerLink: ['/compra/proveedor']
                    }
                ]
            },
            {
                label: 'Reportes',
                items: [
                    {
                        label: 'Reporte Ventas',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/report-ventas']
                    },
                    {
                        label: 'Reporte Compras',
                        icon: 'pi pi-fw pi-chart-scatter',
                        routerLink: ['/report-compras']
                    }
                ]
            }
        ];
    }
}
