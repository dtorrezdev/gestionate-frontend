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
    templateUrl: './cliente.page.html',
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
