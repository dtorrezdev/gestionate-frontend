import { Component, signal, ViewChild } from "@angular/core";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Cliente, ClienteService } from "../../services/cliente.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { TagModule } from "primeng/tag";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { RatingModule } from "primeng/rating";
import { ToolbarModule } from "primeng/toolbar";
import { ToastModule } from "primeng/toast";
import { RippleModule } from "primeng/ripple";
import { Table, TableModule } from "primeng/table";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";

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
        InputTextModule,
        ButtonModule,
        CommonModule,
        CommonModule,
        TableModule,
        FormsModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        BreadcrumbModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        RouterModule,
    ],
    standalone: true,
    template: `
    <div class="card mb-0">
        <div class="font-semibold text-xl mb-4">Listar Cliente</div>
        <p-breadcrumb
            [model]="breadcrumbItems"
            [home]="breadcrumbHome">
        </p-breadcrumb>
    </div>

    <p-toolbar styleClass="mb-6 n-border n-border-r">
        <ng-template #start>
            <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()"/>
            <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined/>
        </ng-template>

        <ng-template #end>
            <p-button label="Export" icon="pi pi-upload" severity="secondary"/>
        </ng-template>
    </p-toolbar>

    <p-table
        #dt
        [value]="clientes()"
        [rows]="10"
        [columns]="cols"
        [tableStyle]="{ 'min-width': '75rem' }"
        [rowHover]="true"
        dataKey="id"
        [showCurrentPageReport]="true"
        >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Detalle venta</h5>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th style="width: 3rem">
                    <p-tableHeaderCheckbox />
                </th>
                <th style="min-width: 5rem">Code</th>
                <th pSortableColumn="nombre" style="min-width:16rem">
                    Nombre
                    <p-sortIcon field="nombre" />
                </th>
                <th pSortableColumn="ci" style="min-width: 8rem">
                    CI
                    <p-sortIcon field="ci" />
                </th>
                <th pSortableColumn="celular" style="min-width:8rem">
                    Celular
                    <p-sortIcon field="celular" />
                </th>
                <th style="min-width: 8rem"></th>
            </tr>
        </ng-template>
        <ng-template #body let-cliente>
            <tr>
                <td style="width: 3rem">
                    <p-tableCheckbox [value]="cliente" />
                </td>
                <td style="min-width: 5rem">{{ cliente.id }}</td>
                <td style="min-width: 16rem">{{ cliente.nombre }}</td>
                <td style="min-width: 8rem">{{ cliente.ci }}</td>
                <td style="min-width: 8rem">{{ cliente.celular }}</td>
                <td style="min-width: 8rem">
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" />
                </td>
            </tr>
        </ng-template>
    </p-table>

    <p-dialog [(visible)]="clienteDialog" [style]="{ width: '450px' }" header="Nuevo Cliente" [modal]="true">
    <ng-template #content>
        <div class="flex flex-col gap-6">
            <div>
                <label for="nombre" class="block font-bold mb-3">Nombre</label>
                <input type="text" pInputText id="nombre" [(ngModel)]="cliente.nombre" required autofocus fluid />
                <small class="text-red-500" *ngIf="submitted && !cliente.nombre">Nombre is required.</small>
            </div>
            <div>
                <label for="ci" class="block font-bold mb-3">CI</label>
                <input type="text" pInputText id="ci" [(ngModel)]="cliente.ci" required fluid />
                <small class="text-red-500" *ngIf="submitted && !cliente.ci">CI is required.</small>
            </div>

            <div>
                <label for="celular" class="block font-bold mb-3">Celular</label>
                <input type="text" pInputText id="celular" [(ngModel)]="cliente.celular" required fluid />
                <small class="text-red-500" *ngIf="submitted && !cliente.celular">Celular is required.</small>
            </div>
        </div>
    </ng-template>

        <ng-template #footer>
            <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
            <p-button label="Save" icon="pi pi-check" (click)="saveCliente()" />
        </ng-template>
    </p-dialog>


    <!-- <div class="card flex flex-col gap-4 mb-0">
        <div class="font-semibold text-xl">Formulario:</div>
        <div class="flex flex-col gap-2">
            <label for="nombre">Nombre</label>
            <input pInputText id="nombre" type="text"/>
        </div>
        <div class="flex flex-col gap-2">
            <label for="ci">CI</label>
            <input pInputText id="ci" type="text"/>
        </div>
        <div class="flex flex-col gap-2">
            <label for="celular">Celular</label>
            <input pInputText id="celular" type="text"/>
        </div>
    </div>
    <div class="card flex flex-col gap-4">
        <div class="flex flex-wrap gap-2">
            <p-button label="Guardar" />
            <p-button label="Cancelar" severity="secondary" />
        </div>
    </div> -->
    `,
    styles: `
        .mb-0 {
            margin-bottom: 0;
        }

        .n-border {
            border: none;
        }
        .n-border-r {
            border-radius: 0;
        }
    `,
    providers: [ClienteService, MessageService]
})
export class ClientePage {

    clientes = signal<Cliente[]>([]);
    cliente!: Cliente;

    // modal Dialog
    clienteDialog: boolean = false;
    submitted: boolean = false;

    // Table Component
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Clientes' }, { label: 'Listado' }, { label: 'All' }];


    constructor(
        private clienteService: ClienteService,
        private messageService: MessageService,
    ) { }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.clienteService.getClientes().then((data) => {
            this.clientes.set(data);
        });

        this.cols = [
            { field: 'id', header: 'ID', customExportHeader: 'Cliente Code' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'ci', header: 'CI' },
            { field: 'celuar', header: 'Celular' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    openNew() {
        this.cliente = {};
        this.submitted = false;
        this.clienteDialog = true;
    }

    editProduct(cliente: Cliente) {
        this.cliente = { ...cliente };
        this.clienteDialog = true;
    }

    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
    }

    saveCliente() {
        this.submitted = true;
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Cliente Creado',
            life: 3000
        });
        this.clienteDialog = false;
        this.cliente = {};

    }
}
