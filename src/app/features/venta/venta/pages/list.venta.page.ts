import { Component, inject, OnInit, signal } from "@angular/core";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { VentaService } from "../../services/venta.service";
import { Table, TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { CommonModule } from "@angular/common";
import { ToastModule } from "primeng/toast";
import { InputTextModule } from "primeng/inputtext";
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from "primeng/inputnumber";
import { TagModule } from "primeng/tag";
import { InputIconModule } from "primeng/inputicon";
import { IconFieldModule } from "primeng/iconfield";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { RouterModule } from "@angular/router";
import { VentaOutput } from "../dto/venta.output";
import { ConfirmationService, MessageService } from "primeng/api";
import { VentaDelete } from "../dto/venta.delete";
import { DatePipe } from "@angular/common";
import { DrawerModule } from "primeng/drawer";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { ViewConfig } from "../../../../core/interface/view-config";
import { StorageService } from "../../../../core/services/storage-service";

@Component({
    imports: [
        FormsModule,
        BreadcrumbModule,
        ToolbarModule,
        ButtonModule,
        CommonModule,
        TableModule,
        InputTextModule,
        InputNumberModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        RouterModule,
        TooltipModule,
        ToastModule,
        ConfirmDialogModule,
        DatePipe,
        DrawerModule,
        CheckboxModule
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-1">
        <div class="font-semibold text-xl mb-4">Listado de Ventas</div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
    </div>

    <p-toolbar styleClass="mb-6 n-border n-border-r">
        <ng-template #start>
            <p-button label="New" icon="pi pi-plus" [routerLink]="'/venta/add'" severity="secondary" class="mr-2"/>
            <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined/>
        </ng-template>

        <ng-template #end>
            <p-button icon="pi pi-arrow-left" (click)="visibleRight = true" [style]="{ marginRight: '0.25em' }" />
            <p-button label="Export" icon="pi pi-upload" severity="secondary"/>
        </ng-template>
    </p-toolbar>

    <p-table
        #dt
        [value]="ventas()"
        [rows]="10"
        [globalFilterFields]="['id', 'cliente', 'nit', 'vendedor']"
        [tableStyle]="{ 'min-width': '65rem' }"
        [rowHover]="true"
        dataKey="id"
        >
    <ng-template #caption>
        <div class="flex items-center justify-between">
            <h5 class="m-0">Lista de ventas</h5>
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
            <!-- <th style="min-width: 2rem; text-align: center;">Nro</th>
            <th pSortableColumn="fechaRegistro" style="min-width:3rem">
                Fecha Registro
                <p-sortIcon field="fechaRegistro" />
            </th>
            <th pSortableColumn="cliente" style="min-width: 6rem">
                Cliente
                <p-sortIcon field="cliente" />
            </th>
            <th pSortableColumn="price" style="min-width: 4rem">
                Vendedor
                <p-sortIcon field="price" />
            </th>
            <th pSortableColumn="total" style="min-width:2rem">
                total
                <p-sortIcon field="total" />
            </th>
            <th pSortableColumn="estado" style="min-width:4rem">
                Estado
                <p-sortIcon field="estado"/>
            </th>
            <th></th> -->
        </tr>
    </ng-template>
    <ng-template #body let-venta>
        <tr>
            @for (col of viewConfig.columns; track col) {
                @if(col.visible) {
                    @switch (col.field) {
                        @case ('fechaRegistro') {
                            <td>{{ venta.fechaRegistro | date: 'dd/MM/yyyy HH:mm' }}</td>
                        }
                        @case ('vendedor') {
                            <td>{{ venta.vendedor ?? 'admin' }}</td>
                        }
                        @case ('total') {
                            <td>{{ venta.total | currency: 'Bs' }}</td>
                        }
                        @case ('estado') {
                            <td>
                                <p-tag [value]="venta.estado" [severity]="getSeverityEstado(venta.estado)"/>
                            </td>
                        }
                        @case ('') {
                            <td>
                                <p-button icon="pi pi-eye" severity="info" class="mr-2"
                                        pTooltip="Ver detalle" tooltipPosition="top"
                                        routerLink="/venta/show/{{venta.id}}"
                                        [rounded]="true" [outlined]="true"/>
                                @if(venta.estado === 'VENTA') {
                                    <p-button icon="pi pi-trash" severity="danger"
                                        pTooltip="Anular" tooltipPosition="top"
                                        (onClick)="deleteVenta(venta)"
                                        [rounded]="true" [outlined]="true"/>
                                }
                                @if(venta.estado === 'PREVENTA') {
                                    <p-button icon="pi pi-pencil"
                                        pTooltip="Editar detalle" tooltipPosition="top"
                                        routerLink="/venta/edit/{{venta.id}}"
                                        [rounded]="true" [outlined]="true"/>
                                }
                            </td>
                        }
                        @default {
                        <td [style]="col.width">
                            {{ venta[col.field] }}
                        </td>
                        }
                    }
                }

            }
        </tr>
    </ng-template>
    </p-table>

    <p-drawer [(visible)]="visibleRight" header="Columnas Visibles" position="right" (onHide)="saveConfigColumns()">
        <!-- <div class="font-semibold text-xl">Columnas</div> -->
        <div class="flex flex-col gap-4">
                @for(col of viewConfig.columns; track col.field) {
                    <!-- @if(col.field !== '') { -->
                    <div class="flex items-center flex-jc-se">
                        <label [for]="col.field" class="ml-2">{{col.header}}</label>
                        <p-checkbox

                            [id]="col.field"
                            [binary]="true"
                            [(ngModel)]="col.visible" />
                    </div>
                    <!-- } -->
                }
            </div>
    </p-drawer>

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
    providers: [VentaService, StorageService, ConfirmationService, MessageService]

})
export class ListVentaPage implements OnInit {

    private ventaServive = inject(VentaService);
    private storageService = inject(StorageService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    ventas = signal<VentaOutput[]>([]);
    venta!: VentaOutput;

    viewConfig!: ViewConfig;
    visibleRight: boolean = false;

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Ventas' }, { label: 'Listar Venta' }, { label: 'all' }];

    constructor() { }

    ngOnInit() {
        this.loadData();
    }

    public loadData(): void {

        this.ventaServive.list()
            .subscribe((resp) => {
                const ventas = resp.data.content;
                this.ventas.set(ventas);
            });

        this.loadConfigColumns();
    }

    private loadConfigColumns(): void {
        const config =
            this.storageService.getViewConfig<ViewConfig>(
                'tenant-110',
                'user-1',
                'view-venta-list'
            );

        if (config) {
            this.viewConfig = config;
        } else {
            this.viewConfig = {
                columns: [{ field: 'codigo', header: 'Nro', width: 'min-width: 2rem; text-align: center;', visible: true },
                { field: 'fechaRegistro', header: 'Fecha Registro', width: 'min-width: 3rem', visible: true },
                { field: 'cliente', header: 'Cliente', width: 'min-width: 6rem', visible: true },
                { field: 'vendedor', header: 'Vendedor', width: 'min-width: 6rem', visible: true },
                { field: 'total', header: 'Total', width: 'min-width:2rem', visible: false },
                { field: 'estado', header: 'Estado', width: 'min-width: 4rem', visible: true }],
            };
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getSeverityEstado(status: string) {
        switch (status) {
            case 'VENTA':
                return 'success';
            case 'PREVENTA':
                return 'warn';
            case 'ANULADO':
                return 'danger';
            default:
                return 'info';
        }
    }

    public deleteVenta(venta: VentaOutput): void {

        this.confirmationService.confirm({
            message: 'Estas seguro de anular la venta ' + venta.codigo + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.ventaServive.deleteVenta(this.buildBodyVentaDelete(venta))
                    .subscribe({
                        next: (resp) => {
                            console.log('Venta anulada: ', resp);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Venta Anulada correctamente!',
                                life: 3000
                            });
                            this.loadData();
                        },
                        error: (e) => {
                            console.log('Error al anular venta: ', e);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error al anulada venta: \n' + e.error?.message,
                                life: 3000
                            });
                        }
                    })
            },
            reject: () => {
                console.log('Reject Solicitud');
            }
        });

    }
    private buildBodyVentaDelete(venta: VentaOutput): VentaDelete {
        return {
            ventaId: venta.id,
            glosa: 'Anulacion de venta ' + venta.codigo,
            clienteId: venta.clienteId,
            movimientoId: venta.movimientoId
        };
    }

    saveConfigColumns() {
        console.log('saveConfigColumns()');
        console.log('se va guardar configuracion columnas ', this.viewConfig);
        this.storageService.setViewConfig<ViewConfig>(
            'tenant-110',
            'user-1',
            'view-venta-list',
            this.viewConfig
        );
    }
}
