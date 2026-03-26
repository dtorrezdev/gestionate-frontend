import { Component, inject, OnInit, signal, ViewChild } from "@angular/core";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { Venta, VentaService } from "../../services/venta.service";
import { Table, TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RippleModule } from "primeng/ripple";
import { ToastModule } from "primeng/toast";
import { RatingModule } from "primeng/rating";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { SelectModule } from "primeng/select";
import { RadioButtonModule } from "primeng/radiobutton";
import { InputNumberModule } from "primeng/inputnumber";
import { DialogModule } from "primeng/dialog";
import { TagModule } from "primeng/tag";
import { InputIconModule } from "primeng/inputicon";
import { IconFieldModule } from "primeng/iconfield";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { RouterModule } from "@angular/router";
import { VentaOutput } from "../dto/venta.output";

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

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
        RouterModule
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
            <p-button label="Export" icon="pi pi-upload" severity="secondary"/>
        </ng-template>
    </p-toolbar>

    <p-table
        #dt
        [value]="ventas()"
        [rows]="10"
        [columns]="cols"
        [globalFilterFields]="['id', 'cliente', 'nit', 'vendedor']"
        [tableStyle]="{ 'min-width': '75rem' }"
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
            <th style="width: 3rem">
                <p-tableHeaderCheckbox />
            </th>
            <th style="min-width: 7rem">#</th>
            <th pSortableColumn="name" style="min-width:12rem">
                Fecha Creacion
                <p-sortIcon field="name" />
            </th>
            <th>Cliente</th>
            <th pSortableColumn="price" style="min-width: 8rem">
                Vendedor
                <p-sortIcon field="price" />
            </th>
            <th pSortableColumn="category" style="min-width:10rem">
                total
                <p-sortIcon field="category" />
            </th>
            <th pSortableColumn="inventoryStatus" style="min-width: 12rem">
                Estado
                <p-sortIcon field="inventoryStatus" />
            </th>
            <th style="min-width: 12rem"></th>
        </tr>
    </ng-template>
    <ng-template #body let-venta>
        <tr>
            <td style="width: 3rem">
                <p-tableCheckbox [value]="venta" />
            </td>
            <td style="min-width: 7rem">{{ venta.codigo }}</td>
            <td style="min-width: 12rem">{{ venta.fechaRegistro }}</td>
            <td>{{ venta.cliente }}</td>
            <td>{{ venta.vendedor ?? 'admin' }}</td>
            <td>{{ venta.total | currency: 'Bs' }}</td>
            <td>
                <p-tag [value]="venta.estado" [severity]="getSeverityEstado(venta.estado)"/>
            </td>
            <td>
                <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true"/>
                <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true"/>
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
    providers: [VentaService]

})
export class ListVentaPage implements OnInit {

    private ventaServive = inject(VentaService);

    ventas = signal<VentaOutput[]>([]);

    venta!: VentaOutput;

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Ventas' }, { label: 'Listar Venta' }, { label: 'all' }];

    constructor() { }

    ngOnInit() {
        this.loadData();
    }

    public loadData(): void {

        this.ventaServive.getAllVenta()
            .subscribe((resp) => {
                const ventas = resp.data.content;
                console.log('resp', resp);
                this.ventas.set(ventas);
            });

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
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
}
