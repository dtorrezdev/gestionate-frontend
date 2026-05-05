import { Component, inject, OnInit, signal } from "@angular/core";
import { BreadcrumbModule } from "primeng/breadcrumb";
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
import { ConfirmationService, MessageService } from "primeng/api";
import { DatePipe } from "@angular/common";
import { VentaService } from "../../../venta/services/venta.service";
import { VentaOutput } from "../../../venta/venta/dto/venta.output";
import { VentaDelete } from "../../../venta/venta/dto/venta.delete";
import { CompraOutput } from "../dto/compra.output";
import { CompraService } from "../../compra/service/compra.service";

@Component({
    imports: [
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
        DatePipe
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-1">
        <div class="font-semibold text-xl mb-4">Listado de Solicitud Compras</div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
    </div>

    <p-toolbar styleClass="mb-6 n-border n-border-r">
        <ng-template #start>
            <p-button label="New" icon="pi pi-plus" [routerLink]="'/compra/solicitud-add'" severity="secondary" class="mr-2"/>
            <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined/>
        </ng-template>

        <ng-template #end>
            <p-button label="Export" icon="pi pi-upload" severity="secondary"/>
        </ng-template>
    </p-toolbar>

    <p-table
        #dt
        [value]="compras()"
        [rows]="10"
        [globalFilterFields]="['id', 'cliente', 'nit', 'vendedor']"
        [tableStyle]="{ 'min-width': '65rem' }"
        [rowHover]="true"
        dataKey="id"
        >
    <ng-template #caption>
        <div class="flex items-center justify-between">
            <h5 class="m-0">Lista de Solicitud Compras</h5>
            <p-iconfield>
                <p-inputicon styleClass="pi pi-search" />
                <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
            </p-iconfield>
        </div>
    </ng-template>
    <ng-template #header>
        <tr>
            <th style="min-width: 2rem; text-align: center;">Nro</th>
            <th pSortableColumn="fechaRegistro" style="min-width:3rem">
                Fecha
                <p-sortIcon field="fechaRegistro" />
            </th>
            <th pSortableColumn="cliente" style="min-width: 6rem">
                Proveedor
                <p-sortIcon field="cliente" />
            </th>
            <th pSortableColumn="price" style="min-width: 4rem">
                Usuario
                <p-sortIcon field="price" />
            </th>
            <th pSortableColumn="total" style="min-width:2rem">
                Monto total
                <p-sortIcon field="total" />
            </th>
            <th></th>
        </tr>
    </ng-template>
    <ng-template #body let-venta>
        <tr>
            <td style="text-align: center">{{ venta.codigo }}</td>
            <td>{{ venta.fechaRegistro | date: 'dd/MM/yyyy HH:mm' }}</td>
            <td>{{ venta.cliente }}</td>
            <td>{{ venta.vendedor ?? 'admin' }}</td>
            <td>{{ venta.total | currency: 'Bs' }}</td>
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
        </tr>
    </ng-template>
    </p-table>

    <p-toast />
    <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [CompraService, VentaService, ConfirmationService, MessageService]
})
export class ListSolicitudCompraPage implements OnInit {

    private service = inject(VentaService);
    private compraService = inject(CompraService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    compras = signal<CompraOutput[]>([]);

    venta!: CompraOutput;

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Compras' }, { label: 'Listar Compras' }, { label: 'all' }];

    constructor() { }

    ngOnInit() {
        this.loadData();
    }

    public loadData(): void {
        this.service.list()
            .subscribe((resp) => {
                const compras = resp.data.content;
                this.compras.set(compras);
            });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    public deleteVenta(compra: CompraOutput): void {

        this.confirmationService.confirm({
            message: 'Estas seguro de anular la compra ' + compra.codigo + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.service.deleteVenta(this.buildBodyVentaDelete(compra))
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
}
