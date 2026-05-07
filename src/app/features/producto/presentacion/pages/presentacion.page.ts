import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ProductService } from "../services/producto.service";
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PresentacionOuput } from '../dto/presentacion.output';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StatusStock } from '../../../../shared/enums/status-stock.enum';

interface Column {
    field: string;
    header: string;
    width: string;
    visible: boolean;
}

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
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
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
        [columns]="columns"
        [rows]="10"
        [paginator]="true"
        [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
        [tableStyle]="{ 'min-width': '55rem' }"
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
            @for (col of columns; track col) {
                @if(col.visible) {
                <th [style]="col.width"
                    [pSortableColumn]="col.field">
                    {{ col.header }}
                    <p-sortIcon [field]="col.field" />
                </th>
                }
            }
            </tr>
        </ng-template>
        <ng-template #body let-product>
            <tr>
            @for (col of columns; track col) {
                @if(col.visible) {
                    @switch (col.field) {
                        @case ('codigo') {
                        <td>PR-{{ product.id }}</td>
                        }
                        @case ('estadoStock') {
                        <td>
                            <p-tag [value]="product.estadoStock"
                                [severity]="getStockStatusClass(product.estadoStock)" />
                        </td>
                        }
                        @case ('precioVenta') {
                        <td>{{ product.precioVenta | currency: 'Bs' }}</td>
                        }
                        @case('') {
                        <td>
                            <p-button icon="pi pi-pencil"
                                class="mr-2"
                                [rounded]="true"
                                [outlined]="true"
                                routerLink="/producto/edit-producto/{{product.id}}"
                            />
                            <p-button
                                icon="pi pi-trash"
                                severity="danger"
                                (onClick)="deleteProducto(product)"
                                [rounded]="true"
                                [outlined]="true"
                            />
                        </td>
                        }
                        @default {
                        <td>
                            {{ product[col.field] }}
                        </td>
                        }
                    }
                }
            }
            </tr>
        </ng-template>
    </p-table>
    <p-toast />
    <p-confirmdialog [style]="{ width: '450px' }" />
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
    providers: [ProductService, MessageService, ConfirmationService]
})
export class PresentacionPage implements OnInit {

    private productService = inject(ProductService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    products = signal<PresentacionOuput[]>([]);
    columns!: Column[];

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Producto' }, { label: 'Listar Presentaciones' }, { label: 'Todos' }];

    constructor() { }

    ngOnInit() {
        this.loadDataTable();
    }

    public deleteProducto(product: PresentacionOuput): void {
        this.confirmationService.confirm({
            message: 'Estas seguro de eliminar el producto PR-' + product.id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productService.deletePresentacion(product.id).
                    subscribe({
                        next: (value) => {
                            console.log(value);
                            console.log('Se va eliminar ');
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: `Producto PR-${product.id} eliminado correctamente!`,
                                life: 3000
                            });
                            this.loadDataTable();
                        }
                    });
            },
            reject: () => {
                console.log('Reject Solicitud');
            }
        });
    }

    private loadDataTable(): void {
        this.productService.list()
            .subscribe((value) => {
                console.log('getAllProdutos: ', value);
                this.products.set(value.data.content);
            });
        this.columns = [
            { field: 'codigo', header: 'Código', width: 'min-width: 5rem', visible: true },
            { field: 'presentacion', header: 'Nombre', width: 'min-width:16rem', visible: true },
            { field: 'marca', header: 'Macra', width: 'min-width: 10rem', visible: false },
            { field: 'categoria', header: 'Categoria', width: 'min-width:8rem', visible: false },
            { field: 'unidadMedida', header: 'U. Medida', width: 'min-width: 4rem', visible: false },
            { field: 'estadoStock', header: 'Stock', width: 'min-width: 5rem', visible: true },
            { field: 'precioVenta', header: 'Precio Venta', width: 'min-width: 5rem', visible: false },
            { field: '', header: 'Acciones', width: 'min-width: 8rem', visible: true }
        ];
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getStockStatusClass(estadoStock: StatusStock) {
        switch (estadoStock) {
            case StatusStock.HAY_STOCK:
                return 'success';
            case StatusStock.POCO_STOCK:
                return 'warn';
            case StatusStock.AGOTADO:
                return 'danger';
            default:
                return 'info';
        }
    }

}
