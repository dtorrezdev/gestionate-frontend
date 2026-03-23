import { Component, signal, ViewChild } from "@angular/core";
import { email, form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { BreadcrumbModule } from "primeng/breadcrumb";
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ClienteService } from "../../services/cliente.service";
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
import { ClienteOutput } from "../dto/cliente.output";
import { ClienteInput } from "../dto/cliente.input";

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
        TableModule,
        FormsModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
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
        FormField
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-1">
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
                <th style="min-width: 5rem">Code</th>
                <th pSortableColumn="ci" style="min-width: 8rem">
                    CI
                    <p-sortIcon field="ci" />
                </th>
                <th pSortableColumn="nombre" style="min-width:16rem">
                    Nombre
                    <p-sortIcon field="nombre" />
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
                <td style="min-width: 5rem">{{ cliente.id }}</td>
                <td style="min-width: 8rem">{{ cliente.ci }}</td>
                <td style="min-width: 16rem">{{ cliente.nombre }}</td>
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
            <form (submit)="saveCliente($event)" action="POST">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="nombre" class="block font-bold mb-3">Nombre</label>
                    <input type="text" pInputText id="nombre" [formField]="clienteForm.nombre" autofocus fluid />
                    @if(clienteForm.nombre().touched() && clienteForm.nombre().invalid()) {
                        @for(error of clienteForm.nombre().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>
                <div>
                    <label for="ci" class="block font-bold mb-3">CI</label>
                    <input type="text" pInputText id="ci" [formField]="clienteForm.ci" fluid />
                    @if(clienteForm.ci().touched() && clienteForm.ci().invalid()) {
                        @for(error of clienteForm.ci().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>

                <div>
                    <label for="celular" class="block font-bold mb-3">Celular</label>
                    <input type="text" pInputText id="celular" [formField]="clienteForm.celular" fluid />
                    @if(clienteForm.celular().touched() && clienteForm.celular().invalid()) {
                        @for(error of clienteForm.celular().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>
            </div>
                    <!-- p-dialog-footer -->
            <div class="p-dialog-footer mt-1 pb-0">
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" type="submit"  icon="pi pi-check" [disabled]="clienteForm().invalid()" />
            </div>
            </form>

        </ng-template>
        <!-- <ng-template #footer>
            <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
            <p-button label="Save" type="submit"  icon="pi pi-check" [disabled]="clienteForm().invalid()" />
        </ng-template> -->



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

        .pb-0 {
            padding-bottom: 0;
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

        .mt-1 {
            margin-top: 1.5rem;
        }


    `,
    providers: [ClienteService, MessageService]
})
export class ClientePage {

    clientes = signal<ClienteOutput[]>([]);

    cliente = signal<ClienteInput>(
        ClienteInput.getInstance()
    );

    clienteForm = form(this.cliente, (schemaPath) => {
        required(schemaPath.ci, { message: 'El CI es requerido.' });
        required(schemaPath.nombre, { message: 'El nombre es requerido.' });
        required(schemaPath.celular, { message: 'El celular es requerido.' });
        minLength(schemaPath.celular, 1, { message: 'El celular debe ser minimum 8 digitos' });
        maxLength(schemaPath.celular, 8, { message: 'El celular debe ser maximo 8 digitos' });
    });

    // modal Dialog
    clienteDialog: boolean = false;
    submitted: boolean = false;

    // Table Component
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Cliente' }, { label: 'Listar' }, { label: 'Todo' }];


    constructor(
        private clienteService: ClienteService,
        private messageService: MessageService,
    ) { }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.clienteService.getAllCliente()
            .subscribe(items =>
                this.clientes.set(items.data.content)
            );

        this.cols = [
            { field: 'id', header: 'ID', customExportHeader: 'Cliente Code' },
            { field: 'ci', header: 'CI' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'celuar', header: 'Celular' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    openNew() {
        // this.cliente = ClienteInput.getInstance();
        this.submitted = false;
        this.clienteDialog = true;
    }

    editProduct(cliente: ClienteInput) {
        // this.cliente = { ...cliente };
        this.clienteDialog = true;
    }

    hideDialog() {
        this.clienteDialog = false;
    }

    saveCliente(evt: Event) {
        evt.preventDefault();
        // this.submitted = true;
        console.log('formCliente: ', this.clienteForm().value());

        this.clienteDialog = false;

        this.clienteService.saveCliente(
            this.clienteForm().value()
        ).subscribe(item => {
            console.log('created successfully ', item);
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Cliente Creado',
                life: 3000
            });
            this.clienteForm().reset(ClienteInput.getInstance());
        });

        // this.cliente = ClienteInput.getInstance();

    }
}
