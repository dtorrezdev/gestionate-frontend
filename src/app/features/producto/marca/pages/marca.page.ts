import { Component, inject, signal, ViewChild } from "@angular/core";
import { MessageService, ToastMessageOptions } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { ToolbarModule } from "primeng/toolbar";
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';


import { MarcaService } from "../../services/marca.service";
import { MarcaOutput } from "../dto/marca.output";
import { Table, TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { form, required, FormField } from "@angular/forms/signals";
import { MarcaInput } from "../dto/marca.input";

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
        TableModule,
        DialogModule,
        ReactiveFormsModule,
        FormField,
        MessageModule,
        ToastModule,
        InputTextModule,
        CommonModule
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-1">
        <div class="font-semibold text-xl mb-4">Listar Marcas</div>
        <p-breadcrumb
            [model]="breadcrumbItems"
            [home]="breadcrumbHome">
        </p-breadcrumb>
    </div>
    <p-toolbar styleClass="mb-6 n-border n-border-r">
        <ng-template #start>
            <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()"/>
            <p-button severity="secondary" label="Import" icon="pi pi-download" outlined/>
        </ng-template>

        <ng-template #end>
            <p-button label="Export" icon="pi pi-upload" severity="secondary"/>
        </ng-template>
    </p-toolbar>

    <p-table #dt
        [value]="marcas()"
        [rows]="10"
        [columns]="cols"
        [tableStyle]="{ 'min-width': '75rem' }"
        [rowHover]="true"
        dataKey="id"
        [showCurrentPageReport]="true"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Marcas registradas</h5>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th style="min-width: 3rem; text-align: center;">Code</th>
                <th pSortableColumn="nombre" style="min-width:8rem">
                    Nombre
                    <p-sortIcon field="nombre" />
                </th>

                <th pSortableColumn="descripcion" style="min-width:12rem">
                    Descripcion
                    <p-sortIcon field="descripcion" />
                </th>
                <th style="min-width: 4rem">Acciones</th>
            </tr>
        </ng-template>
        <ng-template #body let-marca>
            <tr>
                <td style="min-width: 3rem; text-align: center;">{{ marca.id }}</td>
                <td style="min-width: 8rem">{{ marca.nombre }}</td>
                <td style="min-width: 12rem">{{ marca.descripcion }}</td>
                <td style="min-width: 4rem">
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" />
                </td>
            </tr>
        </ng-template>
    </p-table>

    <p-dialog [(visible)]="marcaDialog" [style]="{ width: '450px' }" header="Nueva Marca" [modal]="true">
        <ng-template #content>
            <form (submit)="onSubmit($event)" action="POST">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <input type="text" pInputText id="name" [formField]="marcaForm.nombre" autofocus fluid />
                    @if(marcaForm.nombre().touched() && marcaForm.nombre().invalid()) {
                        @for(error of marcaForm.nombre().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <input id="description" pInputText [formField]="marcaForm.descripcion" fluid />
                    @if(marcaForm.descripcion().touched() && marcaForm.descripcion().invalid()) {
                        @for(error of marcaForm.descripcion().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>
            </div>

            <div class="p-dialog-footer mt-1 pb-0">
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" type="submit" icon="pi pi-check" [disabled]="marcaForm().invalid()" />
            </div>
            </form>
        </ng-template>
    </p-dialog>
    <p-toast />
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
    providers: [MarcaService, MessageService]
})
export class Marca {

    marcas = signal<MarcaOutput[]>([]);

    // private formBuilder = inject(FormBuilder);
    private marcaService = inject(MarcaService);
    private messageService = inject(MessageService);

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Marcas' }, { label: 'Listar' }, { label: 'Todo' }];

    // modal Dialog
    marcaDialog: boolean = false;
    submitted: boolean = false;

    // marcaForm = this.formBuilder.group({
    //     nombre: ['', [Validators.required, Validators.minLength(2)]],
    //     descripcion: ['']
    // });

    cliente = signal<MarcaInput>(
        MarcaInput.getInstance()
    );

    marcaForm = form(this.cliente, (schemaPath) => {
        required(schemaPath.nombre, { message: 'El nombre es requerido.' });
        required(schemaPath.descripcion, { message: 'El descripcion es requerido.' });
    });

    // Table Component
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];


    constructor(

    ) { }

    ngOnInit() {
        this.loadData();
    }

    private loadData(): void {
        this.loadMarcas();
        this.cols = [
            { field: 'id', header: 'ID', customExportHeader: 'Cliente Code' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'descripcion', header: 'Descripcion' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    private loadMarcas(): void {
        this.marcaService.getAllMarcas()
            .subscribe(resp => {
                const items = resp.data.content;
                console.log('items: ', items)
                this.marcas.set(items);
            }
            );
    }

    onSubmit(evt: Event) {
        // TODO: Use EventEmitter with form value
        // console.warn(this.marcaForm.value);
        evt.preventDefault();
        console.log('formCliente: ', this.marcaForm().value());
        this.marcaDialog = false;
        this.marcaService.saveMarca(
            this.marcaForm().value()
        ).subscribe({
            next: (resp) => {
                if (resp.success) {
                    const newData = resp.data;
                    this.marcas.set([newData, ...this.marcas()]);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Marca ' + resp.message,
                        life: 3000
                    });
                    this.marcaForm().reset(MarcaInput.getInstance());
                }
            },
            error: (err) => {
                console.error(err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'VALIDATION_ERROR',
                    detail: 'Marca ' + err.error ? JSON.stringify(err.error.message) : 'error al crear.',
                    life: 3000
                });
            },
            complete: () => console.info('complete')
        });

    }
    showSuccessViaToast() {
        this.messageService.add({
            severity: 'success',
            summary: 'Success Message',
            detail: 'Message sent',
            life: 3000
        });
    }

    openNew() {
        this.submitted = false;
        this.marcaDialog = true;
    }

    editProduct(cliente: MarcaOutput) {
        // this.cliente = { ...cliente };
        this.marcaDialog = true;
    }

    hideDialog() {
        this.marcaDialog = false;
    }

    // getErrors(control: any): string[] {
    //     if (!control || !control.errors) return [];

    //     return Object.keys(control.errors).map(key => {
    //         const error = control.errors[key];
    //         return this.validationMessages[key]?.(error) || key;
    //     });
    // }
}
