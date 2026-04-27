import { Component, inject, OnInit, signal } from "@angular/core";
import { form, required, FormField } from "@angular/forms/signals";
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { ToolbarModule } from "primeng/toolbar";
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";

import { ProveedorService } from "../service/proveedor.service";
import { ProveedorOutput } from "../dto/proveedor.output";


@Component({
    imports: [
        BreadcrumbModule,
        ToolbarModule,
        ButtonModule,
        TableModule,
        DialogModule,
        FormField,
        ToastModule,
        InputTextModule,
        ConfirmDialogModule
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-1">
        <div class="font-semibold text-xl mb-4">Listar Proveedores</div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"/>
    </div>
    <p-toolbar styleClass="mb-6 n-border n-border-r">
        <ng-template #start>
            <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openDialogProveedor()"/>
            <p-button severity="secondary" label="Import" icon="pi pi-download" outlined/>
        </ng-template>

        <ng-template #end>
            <p-button label="Export" icon="pi pi-upload" severity="secondary"/>
        </ng-template>
    </p-toolbar>

    <p-table #dt
        [value]="proveedores()"
        [paginator]="true"
        [rowsPerPageOptions]="[10, 20, 50,100]"
        [rows]="10"
        [tableStyle]="{ 'min-width': '75rem' }"
        [rowHover]="true"
        dataKey="id"
        [showCurrentPageReport]="true"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Proveedores registrados</h5>
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
        <ng-template #body let-proveedor>
            <tr>
                <td style="min-width: 3rem; text-align: center;">{{ proveedor.id }}</td>
                <td style="min-width: 8rem">{{ proveedor.nombre }}</td>
                <td style="min-width: 12rem">{{ proveedor.descripcion }}</td>
                <td style="min-width: 4rem">
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (onClick)="editProveedor(proveedor)" />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" (onClick)="showDialogRemoveProveedor(proveedor)" [outlined]="true" />
                </td>
            </tr>
        </ng-template>
    </p-table>

    <p-dialog [(visible)]="proveedorDialog" [style]="{ width: '450px' }" header="Nuevo Proveedor" [modal]="true">
        <ng-template #content>
            <form (submit)="onSubmit($event)" action="POST">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <input type="text" pInputText id="name" [formField]="proveedorForm.nombre" autofocus fluid />
                    @if(proveedorForm.nombre().touched() && proveedorForm.nombre().invalid()) {
                        @for(error of proveedorForm.nombre().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <input id="description" pInputText [formField]="proveedorForm.descripcion" fluid />
                    @if(proveedorForm.descripcion().touched() && proveedorForm.descripcion().invalid()) {
                        @for(error of proveedorForm.descripcion().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>
            </div>

            <div class="p-dialog-footer mt-1 pb-0">
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialogProveedor()" />
                <p-button label="Save" type="submit" icon="pi pi-check" [disabled]="proveedorForm().invalid()" />
            </div>
            </form>
        </ng-template>
    </p-dialog>

    <p-confirmdialog [style]="{ width: '450px' }" />
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
    providers: [ProveedorService, MessageService, ConfirmationService]
})
export class ProveedorPage implements OnInit {

    private proveedorService = inject(ProveedorService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    proveedores = signal<ProveedorOutput[]>([]);
    proveedorDialog = signal(false);
    selectedProveedor = signal<ProveedorOutput>({
        nombre: '',
        descripcion: ''
    });
    isEditMode = signal(false);

    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [
        { label: 'Compra', routerLink: '/compra' },
        { label: 'Proveedores' }
    ];

    proveedorForm = form(this.selectedProveedor, (schemaPath) => {
        required(schemaPath.nombre, { message: 'El nombre es requerido.' });
        required(schemaPath.descripcion, { message: 'El descripcion es requerido.' });
    });

    ngOnInit(): void {
        this.loadProveedores();
    }

    loadProveedores(): void {
        this.proveedorService.list().subscribe({
            next: (response: any) => {
                if (response.success && response.data && response.data.content) {
                    this.proveedores.set(response.data.content);
                }
            },
            error: (error: any) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar proveedores' });
            }
        });
    }

    openDialogProveedor(): void {
        this.isEditMode.set(false);
        this.proveedorDialog.set(true);
    }

    hideDialogProveedor(): void {
        this.proveedorDialog.set(false);
    }

    editProveedor(proveedor: ProveedorOutput): void {
        this.selectedProveedor.set(proveedor);
        this.isEditMode.set(true);
        this.proveedorDialog.set(true);
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        if (this.proveedorForm().invalid()) {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Por favor completa todos los campos' });
            return;
        }

        const formValue = this.proveedorForm().value();

        if (this.isEditMode()) {
            const id = this.selectedProveedor()?.id;
            if (id) {
                this.proveedorService.update(formValue, id).subscribe({
                    next: (response: any) => {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Proveedor actualizado correctamente' });
                        this.loadProveedores();
                        this.hideDialogProveedor();
                    },
                    error: (error: any) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el proveedor' });
                    }
                });
            }
        } else {
            this.proveedorService.save(formValue).subscribe({
                next: (response: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Proveedor creado correctamente' });
                    this.loadProveedores();
                    this.hideDialogProveedor();
                },
                error: (error: any) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el proveedor' });
                }
            });
        }
    }

    showDialogRemoveProveedor(proveedor: ProveedorOutput): void {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas eliminar el proveedor "${proveedor.nombre}"?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteProveedor(proveedor);
            }
        });
    }

    deleteProveedor(proveedor: ProveedorOutput): void {
        const proveedorId = proveedor.id || 0;
        this.proveedorService.delete(proveedorId).subscribe({
            next: (response: any) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Proveedor eliminado correctamente' });
                this.loadProveedores();
            },
            error: (error: any) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el proveedor' });
            }
        });
    }
}
