import { Component, inject, OnInit, signal } from "@angular/core";
import { form, required, FormField } from "@angular/forms/signals";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { ToolbarModule } from "primeng/toolbar";
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";

import { MarcaService } from "../service/marca.service";
import { MarcaOutput } from "../dto/marca.output";
import { MarcaInput } from "../dto/marca.input";
import { ToastService } from "../../../../core/services/toast.service";


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
        <div class="font-semibold text-xl mb-4">Listar Marcas</div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"/>
    </div>
    <p-toolbar styleClass="mb-6 n-border n-border-r">
        <ng-template #start>
            <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openDialogMarca()"/>
            <p-button severity="secondary" label="Import" icon="pi pi-download" outlined/>
        </ng-template>

        <ng-template #end>
            <p-button label="Export" icon="pi pi-upload" severity="secondary"/>
        </ng-template>
    </p-toolbar>

    <p-table #dt
        [value]="marcas()"
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
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (onClick)="editMarca(marca)" />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" (onClick)="showDialogRemoveMarca(marca)" [outlined]="true" />
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
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialogMarca()" />
                <p-button label="Save" type="submit" icon="pi pi-check" [disabled]="marcaForm().invalid()" />
            </div>
            </form>
        </ng-template>
    </p-dialog>

    <p-confirmdialog [style]="{ width: '450px' }" />

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
    providers: [MarcaService, ConfirmationService]
})
export class Marca implements OnInit {
    private service = inject(MarcaService);
    private confirmationService = inject(ConfirmationService);
    private toastService = inject(ToastService);

    marcas = signal<MarcaOutput[]>([]);
    marca = signal<MarcaInput>({
        nombre: '',
        descripcion: ''
    });
    marcaDialog: boolean = false;
    marcaForm = form(this.marca, (schemaPath) => {
        required(schemaPath.nombre, { message: 'El nombre es requerido.' });
        required(schemaPath.descripcion, { message: 'El descripcion es requerido.' });
    });

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Marcas' }, { label: 'Listar' }, { label: 'Todo' }];

    ngOnInit() {
        this.loadData();
    }

    onSubmit(evt: Event) {
        evt.preventDefault();
        const marcaId = this.marca().id;
        const marcaData = this.marcaForm().value();
        if (marcaId) {
            this.update(marcaData, marcaId);
        } else {
            this.save(marcaData);
        }
        this.marcaDialog = false;
    }

    editMarca(marca: MarcaOutput) {
        this.marca.set({ ...marca });
        this.marcaDialog = true;
    }

    showDialogRemoveMarca(marca: MarcaOutput) {
        this.confirmationService.confirm({
            message: 'Estas seguro de eliminar la marca con id: ' + marca.id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteMarca(marca)
        });
    }

    openDialogMarca() { this.marcaDialog = true; }

    hideDialogMarca() { this.marcaDialog = false; }

    private save(marca: MarcaInput) {
        this.service.save(marca)
            .subscribe({
                next: (resp) => {
                    const newMarca = resp.data as MarcaOutput;
                    this.marcas.set([newMarca, ...this.marcas()]);
                    this.toastService.mostrarMsg('success', 'Marca ' + resp.message);
                    this.marcaForm().reset({
                        nombre: '',
                        descripcion: ''
                    });
                },
                error: (err) => {
                    console.log('Error: ', err);
                    this.toastService.mostrarMsg('error',
                        `Marca ${err ? err : 'error al crear.'}`);
                }
            });
    }
    private update(marca: MarcaInput, id: number) {
        this.setUpdateMarcas(marca, id);
        this.service.update(marca, id)
            .subscribe({
                next: (resp) => {
                    this.toastService.mostrarMsg('success', resp.message);
                    this.marcaForm().reset({
                        nombre: '',
                        descripcion: ''
                    });
                },
                error: (err) => {
                    this.toastService.mostrarMsg('error', err);
                    this.loadData();
                }
            });
    }

    private setUpdateMarcas(marca: MarcaInput, id: number) {
        const marcasActuales = this.marcas();
        const indexMarca = marcasActuales.findIndex(m => m.id === id);
        if (indexMarca !== -1) {
            const nuevasMarcas = [...marcasActuales];
            nuevasMarcas[indexMarca] = { ...nuevasMarcas[indexMarca], ...marca };
            this.marcas.set(nuevasMarcas);
        }
    }

    private deleteMarca(marca: MarcaOutput) {
        this.setDeleteTablaMarcas(marca);
        this.service.delete(marca.id)
            .subscribe({
                next: () =>
                    this.toastService.mostrarMsg('success', 'Marca eliminada correctamente!'),
                error: (err) => {
                    this.toastService.mostrarMsg('error', err);
                }
            });
    }

    private setDeleteTablaMarcas(marca: MarcaOutput) {
        const marcasActuales = this.marcas().filter((val) => marca.id !== val.id);
        this.marcas.set(marcasActuales);
    }

    private loadData(): void {
        this.service.list()
            .subscribe({
                next: (resp) => {
                    console.log('Load Data ', resp);
                    this.marcas.set(resp.data.content);
                },
                error: (err) => this.toastService.mostrarMsg('error', err)
            });
    }

    constructor() { }
}
