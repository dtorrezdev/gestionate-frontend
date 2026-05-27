import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
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
import { StorageService } from '../../../../core/services/storage-service';
import { ViewConfig } from '../../../../core/interface/view-config';
import { DrawerModule } from 'primeng/drawer';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastService } from '../../../../core/services/toast.service';

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
        DrawerModule,
        CheckboxModule
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-0">
        <div class="font-bold text-2xl mb-2">Catálogo de Productos</div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
    </div>
    <p-toolbar styleClass="mb-4 border-no rounded-no">
        <ng-template #start>
            <p-button label="Nuevo" routerLink="/producto/add-producto" icon="pi pi-plus" class="m-2"/>
            <p-button severity="secondary" label="Importar" icon="pi pi-upload" outlined />
        </ng-template>

        <ng-template #end>
            <p-button label="Exportar" icon="pi pi-download" severity="secondary" class="mr-2"/>
            <p-button icon="pi pi-bars" (click)="visibleRight = true" class="mr-2" />
        </ng-template>
    </p-toolbar>

    <p-table
        #dt
        [value]="products()"
        [columns]="viewConfig.columns"
        [rows]="10"
        [paginator]="true"
        [tableStyle]="{ 'min-width': '55rem' }"
        [rowHover]="true"
        dataKey="id"
        currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} productos"
        [showCurrentPageReport]="true"
        [rowsPerPageOptions]="[10, 20, 30, 50, 100]"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="m-0">Mis Productos</h5>
                <p-iconfield>
                    <p-inputicon styleClass="pi pi-search" />
                    <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                </p-iconfield>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
            @for (col of viewConfig.columns; track col.field) {
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
            @for (col of viewConfig.columns; track col) {
                @if(col.visible) {
                    @switch (col.field) {
                        @case ('id') {
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
                        @case ('imagen') {
                            <td>
                                <img [src]="product.imagen?? './assets/img/default-box.png'" [alt]="product.nombre" style="width: 64px" class="rounded" />
                            </td>
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

    <p-drawer [(visible)]="visibleRight" header="Columnas Visibles" position="right" (onHide)="saveConfigColumns()">
        <div class="flex flex-col gap-4">
            @for(col of viewConfig.columns; track col.field) {
            <div class="flex items-center justify-between">
                <label [for]="col.field" class="ml-2">{{col.header}}</label>
                <p-checkbox
                    [id]="col.field"
                    [binary]="true"
                    [(ngModel)]="col.visible" />
            </div>
            }
        </div>
    </p-drawer>

    <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [ProductService, StorageService, ConfirmationService]
})
export class PresentacionPage implements OnInit {

    private productService = inject(ProductService);
    private toastService = inject(ToastService);
    private confirmationService = inject(ConfirmationService);
    private storageService = inject(StorageService);

    products = signal<PresentacionOuput[]>([]);

    viewConfig!: ViewConfig;

    visibleRight: boolean = false;

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Productos' }, { label: 'Listado de Productos' }, { label: 'Todos' }];

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
                            this.toastService.success(`Producto PR-${product.id} eliminado correctamente!`);
                            this.loadDataTable();
                        }
                    });
            }
        });
    }

    private loadDataTable(): void {
        this.productService.list()
            .subscribe((value) => {
                console.log('getAllProdutos: ', value);
                this.products.set(value.data.content);
            });

        this.loadConfigColumns();
    }

    private loadConfigColumns(): void {
        const config =
            this.storageService.getViewConfig<ViewConfig>(
                'tenant-110',
                'user-1',
                'view-presentacion'
            );

        if (config) {
            this.viewConfig = config;
        } else {
            this.viewConfig = {
                columns: [{ field: 'id', header: 'Código', width: 'min-width: 7rem', visible: true },
                    { field: 'imagen', header: 'Img', width: 'min-width: 8rem', visible: true },
                    { field: 'marca', header: 'Marca', width: 'min-width: 10rem', visible: true },
                    { field: 'presentacion', header: 'Nombre', width: 'min-width:16rem', visible: true },
                    { field: 'unidadMedida', header: 'En', width: 'min-width: 4rem', visible: true },
                    { field: 'categoria', header: 'Categoria', width: 'min-width:8rem', visible: true },
                    { field: 'estadoStock', header: 'Stock', width: 'min-width: 5rem', visible: true },
                    { field: 'precioVenta', header: 'Precio Venta', width: 'min-width: 5rem', visible: true },
                    { field: '', header: 'Acciones', width: 'min-width: 8rem', visible: true }],
            };
        }
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

    saveConfigColumns() {
        console.log('saveConfigColumns()');
        console.log('se va guardar configuracion columnas ', this.viewConfig);
        this.storageService.setViewConfig<ViewConfig>(
            'tenant-110',
            'user-1',
            'view-presentacion',
            this.viewConfig
        );
    }

}
