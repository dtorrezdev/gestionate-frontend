import { Component, inject, signal } from "@angular/core";
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from 'primeng/button';
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";

import { ClienteService } from "../../services/cliente.service";
import { ClienteOutput } from "../dto/cliente.output";
import { ClienteInput } from "../dto/cliente.input";
import { ToastService } from "../../../../core/services/toast.service";

@Component({
    imports: [
        BreadcrumbModule,
        InputTextModule,
        ButtonModule,
        TableModule,
        ToolbarModule,
        DialogModule,
        ConfirmDialogModule,
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
    providers: [ClienteService, ConfirmationService]
})
export class ClientePage {
    private service = inject(ClienteService);
    private toastService = inject(ToastService);
    private confirmationService = inject(ConfirmationService);

    clientes = signal<ClienteOutput[]>([]);
    cliente = signal<ClienteInput>({
        ci: '',
        nombre: '',
        celular: ''
    });
    clienteDialog: boolean = false;
    clienteForm = form(this.cliente, (schemaPath) => {
        required(schemaPath.ci, { message: 'El CI es requerido.' });
        required(schemaPath.nombre, { message: 'El nombre es requerido.' });
        required(schemaPath.celular, { message: 'El celular es requerido.' });
        minLength(schemaPath.celular, 1, { message: 'El celular debe ser minimum 8 digitos' });
        maxLength(schemaPath.celular, 8, { message: 'El celular debe ser maximo 8 digitos' });
    });

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Cliente' }, { label: 'Listar' }, { label: 'Todo' }];

    ngOnInit() {
        this.loadData();
    }

    onSubmit(evt: Event) {
        evt.preventDefault();
        const clienteId = this.cliente().id;
        const clienteData = this.clienteForm().value();
        if (clienteId) {
            this.updateCliente(clienteData, clienteId);
        } else {
            this.saveCliente(clienteData);
        }
        this.clienteDialog = false;
    }

    editCliente(cliente: ClienteInput) {
        this.cliente.set({ ...cliente });
        this.clienteDialog = true;
    }

    showDialogRemoveCliente(cliente: ClienteOutput) {
        this.confirmationService.confirm({
            message: 'Estas seguro de eliminar la client con id: ' + cliente.id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteCliente(cliente)
        });
    }

    openNew() { this.clienteDialog = true; }

    hideDialog() { this.clienteDialog = false; }

    private saveCliente(data: ClienteInput) {
        this.service.save(data)
            .subscribe({
                next: (resp) => {
                    const newMarca = resp.data;
                    this.clientes.set([newMarca, ...this.clientes()]);
                    this.toastService.mostrarMsg('success', 'Cliente ' + resp.message);
                    this.clienteForm().reset({
                        ci: '',
                        nombre: '',
                        celular: ''
                    });
                },
                error: (err) => {
                    this.toastService.mostrarMsg('error',
                        `Cliente  + ${err.error ? JSON.stringify(err.error.message) : 'error al crear.'}`);
                }
            });
    }

    private updateCliente(data: ClienteInput, id: number) {
        this.setUpdateCliente(data, id);
        this.service.update(data, id)
            .subscribe({
                next: (resp) => {
                    this.toastService.mostrarMsg('success', 'Cliente ' + resp.message);
                    this.clienteForm().reset({
                        ci: '',
                        nombre: '',
                        celular: ''
                    });
                },
                error: (err: any) => {
                    this.toastService.mostrarMsg('error', err);
                    this.loadData();
                }
            });
    }

    private deleteCliente(cliente: ClienteOutput) {
        this.setDeleteTablaMarcas(cliente);
        this.service.deleteCliente(cliente)
            .subscribe({
                next: () =>
                    this.toastService.mostrarMsg('success', 'Cliente eliminada correctamente.'),
                error: (e) => {
                    this.toastService.mostrarMsg('error', 'Error al eliminar Cliente: \n' + e.error?.message);
                }
            });
    }

    private setDeleteTablaMarcas(cliente: ClienteOutput) {
        const clientesActuales = this.clientes().filter((val) => cliente.id !== val.id);
        this.clientes.set(clientesActuales);
    }

    private setUpdateCliente(cliente: ClienteInput, id: number) {
        this.clientes.update(clientesArr =>
            clientesArr.map(m =>
                m.id === id ? { ...m, ...cliente } : m
            )
        );
    }

    private loadData() {
        this.service.list()
            .subscribe(items => this.clientes.set(items.data.content));
    }

    constructor() { }
}
