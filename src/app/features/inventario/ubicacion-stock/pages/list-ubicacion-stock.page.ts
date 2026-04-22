import { Component, inject, OnInit, signal } from "@angular/core";
import { UbicacionStockService } from "../service/ubicacion-stock.service";
import { UbicacionStockOutput } from "../dtos/ubicacion-stock.outpu";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ToolbarModule } from "primeng/toolbar";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { form, required, FormField } from "@angular/forms/signals";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { ConfirmationService, MessageService } from "primeng/api";


@Component({
    imports: [
        BreadcrumbModule,
        ToolbarModule,
        TableModule,
        ButtonModule,
        FormField,
        DialogModule,
        ConfirmDialogModule,
        ToastModule
    ],
    standalone: true,
    template: `
    <div class="card">
        <div class="font-semibold text-xl mb-4">Lista Ubicacion Stock</div>
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
        [value]="ubicacionStock()"
        [paginator]="true"
        [rowsPerPageOptions]="[10, 20, 50,100]"
        [rows]="10"
        [tableStyle]="{ 'min-width': '75rem' }"
        [rowHover]="true"
        dataKey="id"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Ubicacion Stock registradas</h5>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th style="min-width: 3rem; text-align: center;">Id</th>
                <th pSortableColumn="nombre" style="min-width:8rem">
                    Seccion
                    <p-sortIcon field="nombre" />
                </th>

                <th pSortableColumn="descripcion" style="min-width:12rem">
                    Estante
                    <p-sortIcon field="descripcion" />
                </th>
                <th pSortableColumn="descripcion" style="min-width:12rem">
                    Nivel
                    <p-sortIcon field="descripcion" />
                </th>
                <th style="min-width: 4rem"></th>
            </tr>
        </ng-template>
        <ng-template #body let-ubi>
            <tr>
                <td style="min-width: 3rem; text-align: center;">{{ ubi.id }}</td>
                <td style="min-width: 8rem">{{ ubi.seccion }}</td>
                <td style="min-width: 12rem">{{ ubi.estante }}</td>
                <td style="min-width: 12rem">{{ ubi.nivel }}</td>
                <td style="min-width: 4rem">
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" (onClick)="deleteUbicacionStock(ubi)" [outlined]="true" />
                </td>
            </tr>
        </ng-template>
    </p-table>
    <p-dialog [(visible)]="ubicacionDialog" [style]="{ width: '450px' }" header="Nueva Marca" [modal]="true">
        <ng-template #content>
            <form (submit)="onSubmit($event)" action="POST">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Seccion</label>
                    <input type="text" pInputText id="name" [formField]="ubicacionForm.seccion" autofocus fluid />
                    @if(ubicacionForm.seccion().touched() && ubicacionForm.seccion().invalid()) {
                        @for(error of ubicacionForm.seccion().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Estante</label>
                    <input id="description" pInputText [formField]="ubicacionForm.estante" fluid />
                    @if(ubicacionForm.estante().touched() && ubicacionForm.estante().invalid()) {
                        @for(error of ubicacionForm.estante().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Nivel</label>
                    <input id="description" pInputText [formField]="ubicacionForm.nivel" fluid />
                    @if(ubicacionForm.nivel().touched() && ubicacionForm.nivel().invalid()) {
                        @for(error of ubicacionForm.nivel().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>
            </div>

            <div class="p-dialog-footer mt-1 pb-0">
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" type="submit" icon="pi pi-check" [disabled]="ubicacionForm().invalid()" />
            </div>
            </form>
        </ng-template>
    </p-dialog>

    <p-toast />
    <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [UbicacionStockService, ConfirmationService, MessageService]
})
export class ListUbicacionStockPage implements OnInit {

    private ubicacionStockService = inject(UbicacionStockService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    ubicacionStock = signal<UbicacionStockOutput[]>([]); //

    ubicacionStockInput = signal<UbicacionStockInput>({
        seccion: '',
        estante: '',
        nivel: ''
    });

    ubicacionForm = form(this.ubicacionStockInput, (schemaPath) => {
        required(schemaPath.seccion, { message: 'La Seccion es requerido.' });
        required(schemaPath.estante, { message: 'El estante es requerido.' });
        required(schemaPath.nivel, { message: 'El nivel es requerido.' });
    });


    // modal Dialog
    ubicacionDialog: boolean = false;
    submitted: boolean = false;

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Ubicacion' }, { label: 'Stock' }, { label: 'Listar' }];

    constructor() { }

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.ubicacionStockService.getAllUbicacionStock()
            .subscribe({
                next: (resp) => {
                    const items = resp.data.content;
                    console.log('Ubicacion Stock:', resp);
                    this.ubicacionStock.set(items);
                }
            });
    }

    onSubmit(evt: Event) {
        evt.preventDefault();
        console.log('formValue: ', this.ubicacionForm().value());
        this.ubicacionDialog = false;

        this.ubicacionStockService.saveUbicacionStock(this.ubicacionForm().value())
            .subscribe({
                next: (resp) => {
                    console.log('Add ubicacion', resp);

                },
            });
    }

    deleteUbicacionStock(ubicacion: UbicacionStockOutput) {
        this.confirmationService.confirm({
            message: 'Estas seguro de eliminar la ubicacion stock id: ' + ubicacion.id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.ubicacionStockService.deleteUbicacionStock(ubicacion)
                    .subscribe({
                        next: (resp) => {
                            console.log('Venta anulada: ', resp);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Ubicacion Stock eliminada correctamente!',
                                life: 3000
                            });
                            this.loadData();
                        },
                        error: (e) => {
                            console.log('Error al anular venta: ', e);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error al eliminar ubicacion stock: \n' + e.error?.message,
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

    openNew() {
        this.submitted = false;
        this.ubicacionDialog = true;
    }

    editProduct(cliente: UbicacionStockOutput) {
        // this.cliente = { ...cliente };
        this.ubicacionDialog = true;
    }

    hideDialog() {
        this.ubicacionDialog = false;
    }
}
