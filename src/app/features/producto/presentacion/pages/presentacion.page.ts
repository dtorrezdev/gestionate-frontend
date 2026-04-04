import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ProductService } from "../../services/producto.service";
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PresentacionOuput } from '../dto/presentacion.output';

@Component({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        BreadcrumbModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        TagModule,
        InputIconModule,
        IconFieldModule
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-1">
        <div class="font-semibold text-xl mb-4">Listado de Productos Presentacion</div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
    </div>
    <p-toolbar styleClass="mb-6  n-border n-border-r">
        <ng-template #start>
            <p-button label="New Producto" routerLink="/producto/add-producto" icon="pi pi-plus" severity="secondary" class="mr-2"/>
            <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined />
        </ng-template>

        <ng-template #end>
            <p-button label="Export" icon="pi pi-upload" severity="secondary"/>
        </ng-template>
    </p-toolbar>

    <p-table
        #dt
        [value]="products()"
        [rows]="10"
        [paginator]="true"
        [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
        [tableStyle]="{ 'min-width': '75rem' }"
        [rowHover]="true"
        dataKey="id"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        [showCurrentPageReport]="true"
        [rowsPerPageOptions]="[10, 20, 30]"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="m-0">Manage Products</h5>
                <p-iconfield>
                    <p-inputicon styleClass="pi pi-search" />
                    <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                </p-iconfield>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th style="min-width: 5rem">Code</th>
                <th pSortableColumn="marcaId" style="min-width:16rem">
                    Nombre
                    <p-sortIcon field="marcaId" />
                </th>
                <!-- <th>Image</th> -->
                <th pSortableColumn="productoId" style="min-width: 10rem">
                    Marca
                    <p-sortIcon field="productoId" />
                </th>
                <th pSortableColumn="nombre" style="min-width:8rem">
                    Categoria
                    <p-sortIcon field="nombre" />
                </th>
                <th pSortableColumn="unidadMedidaId" style="min-width: 4rem">
                    U. Medida
                    <p-sortIcon field="unidadMedidaId" />
                </th>
                <th pSortableColumn="stock" style="min-width: 5rem">
                    Stock
                    <p-sortIcon field="stock" />
                </th>
                <th pSortableColumn="precioVenta" style="min-width: 5rem">
                    Precio Venta
                    <p-sortIcon field="precioVenta" />
                </th>
                <th style="min-width: 8rem"></th>
            </tr>
        </ng-template>
        <ng-template #body let-product>
            <tr>
                <td>PR-{{ product.id }}</td>
                <td>{{ product.presentacion }}</td>
                <td>{{ product.marca }}</td>
                <!-- <td>
                    <img [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + product.image" [alt]="product.name" style="width: 64px" class="rounded" />
                </td> -->
                <td>{{ product.categoria }}</td>
                <td>{{ product.unidadMedida | lowercase }}</td>
                <td>
                    <p-tag value="INSTOCK" [severity]="getSeverity('INSTOCK')" />
                </td>
                <td>{{ product.precioVenta | currency: 'Bs' }}</td>
                <td>
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" />
                </td>
            </tr>
        </ng-template>
    </p-table>
    `,
    styles: `
        .mb-0 {
            margin-bottom: 0;
        }
        .pb-1 {
            padding-bottom: 1rem;
        }
        .n-border {
            border: none;
        }
        .n-border-r {
            border-radius: 0;
        }
    `,
    providers: [MessageService, ProductService]
})
export class PresentacionPage implements OnInit {

    private productService = inject(ProductService);
    private messageService = inject(MessageService);

    products = signal<PresentacionOuput[]>([]);


    statuses!: any[];

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Producto' }, { label: 'Listar Presentaciones' }, { label: 'Todos' }];

    constructor() { }

    ngOnInit() {
        this.loadDataTable();
    }

    private loadDataTable(): void {
        this.productService.getAllProdutos()
            .subscribe((value) => {
                console.log('getAllProdutos: ', value);
                this.products.set(value.data.content);
            })

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

}
