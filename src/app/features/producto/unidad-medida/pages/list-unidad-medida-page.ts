import { Component, inject, OnInit, signal } from "@angular/core";
import { UnidadMedidaService } from "../service/unidad-medida.service";
import { UnidadMedidaOuput } from "../dto/unidad-medida.output";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ToolbarModule } from "primeng/toolbar";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { DialogModule } from "primeng/dialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { UnidadMedidaInput } from "../dto/unidad-medida.input";
import { form, required, FormField } from "@angular/forms/signals";


@Component({
    imports: [
        BreadcrumbModule,
        ToolbarModule,
        TableModule,
        ButtonModule,
        ConfirmDialogModule,
        ToastModule,
        DialogModule,
        FormField
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-1">
        <div class="font-semibold text-xl mb-4">Listar Unidad Medida</div>
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
        [value]="unidadesMedidas()"
        [paginator]="true"
        [rowsPerPageOptions]="[10, 20, 50,100]"
        [rows]="10"
        [tableStyle]="{ 'min-width': '75rem' }"
        [rowHover]="true"
        dataKey="id"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Unidades de Medida registradas</h5>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th style="min-width: 3rem; text-align: center;">Id</th>
                <th pSortableColumn="nombre" style="min-width:8rem">
                    Abreviatura
                    <p-sortIcon field="nombre" />
                </th>
                <th pSortableColumn="descripcion" style="min-width:12rem">
                    Nombre
                    <p-sortIcon field="descripcion" />
                </th>
                <th style="min-width: 4rem"></th>
            </tr>
        </ng-template>
        <ng-template #body let-unidadMedida>
            <tr>
                <td style="min-width: 3rem; text-align: center;">{{ unidadMedida.id }}</td>
                <td style="min-width: 8rem">{{ unidadMedida.abreviatura }}</td>
                <td style="min-width: 12rem">{{ unidadMedida.nombre }}</td>
                <td style="min-width: 4rem">
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" />
                    <p-button
                        icon="pi pi-trash"
                        severity="danger"
                        [rounded]="true"
                        (onClick)="deleteUnidadMedida(unidadMedida)"
                        [outlined]="true"
                    />
                </td>
            </tr>
        </ng-template>
    </p-table>

    <p-dialog [(visible)]="unidadMedidaDialog" [style]="{ width: '450px' }" header="Nueva UnidadMedida" [modal]="true">
        <ng-template #content>
            <form (submit)="onSubmit($event)" action="POST">
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Abreviatura</label>
                        <input type="text" pInputText id="name" [formField]="unidadMedidaForm.abreviatura" autofocus fluid />
                        @if(unidadMedidaForm.abreviatura().touched() && unidadMedidaForm.abreviatura().invalid()) {
                            @for(error of unidadMedidaForm.abreviatura().errors(); track error.kind) {
                                <small class="text-red-500">{{error.message}}</small>
                            }
                        }
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Nombre</label>
                        <input id="description" pInputText [formField]="unidadMedidaForm.nombre" fluid />
                        @if(unidadMedidaForm.nombre().touched() && unidadMedidaForm.nombre().invalid()) {
                            @for(error of unidadMedidaForm.nombre().errors(); track error.kind) {
                                <small class="text-red-500">{{error.message}}</small>
                            }
                        }
                    </div>
                </div>

                <div class="p-dialog-footer mt-1 pb-0">
                    <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                    <p-button label="Save" type="submit" icon="pi pi-check" [disabled]="unidadMedidaForm().invalid()" />
                </div>
            </form>
        </ng-template>

    </p-dialog>
    <p-confirmdialog [style]="{ width: '450px' }" />

    <p-toast />
    `,
    providers: [UnidadMedidaService, ConfirmationService, MessageService]
})
export class ListUnidadMedidaPage implements OnInit {

    private unidadMedidaService = inject(UnidadMedidaService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    unidadesMedidas = signal<UnidadMedidaOuput[]>([]);

    // modal Dialog
    unidadMedidaDialog: boolean = false;

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Unidad Medida' }, { label: 'Listar' }, { label: 'Todo' }];

    unidadMedida = signal<UnidadMedidaInput>({
        nombre: '',
        abreviatura: '',
        esUnidadMinima: true
    });

    unidadMedidaForm = form(this.unidadMedida, (schemaPath) => {
        required(schemaPath.abreviatura, { message: 'Abreviatura es requerido.' });
        required(schemaPath.nombre, { message: 'El descripcion es requerido.' });
        required(schemaPath.esUnidadMinima, { message: 'Es unidad Minima es requerido.' });
    });

    constructor() { }

    ngOnInit(): void {
        this.loadData();
    }

    onSubmit(evt: Event) {

        evt.preventDefault();
        console.log('formCliente: ', this.unidadMedidaForm().value());
        this.unidadMedidaDialog = false;
        this.unidadMedidaService.saveUnidadMedida(
            this.unidadMedidaForm().value()
        ).subscribe({
            next: (resp) => {
                if (resp.success) {
                    const newData = resp.data;
                    this.unidadesMedidas.set([newData, ...this.unidadesMedidas()]);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Unidad Medida ' + resp.message,
                        life: 3000
                    });
                    // this.unidadMedidaForm().reset();
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

    private loadData(): void {
        this.unidadMedidaService.getAllUnidadMedida()
            .subscribe({
                next: (resp) => {
                    const  data = resp.data.content;
                    console.log('getAllUnidadMedida: ', resp);
                    this.unidadesMedidas.set(data);
                }
            });
    }

    deleteUnidadMedida(unidad: UnidadMedidaOuput) {
        this.confirmationService.confirm({
            message: 'Estas seguro de eliminar la Unidad Medida con id: ' + unidad.id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.unidadMedidaService.deleteUnidadMedida(unidad)
                    .subscribe({
                        next: (resp) => {
                            console.log('Unidad Medida eliminada: ', resp);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Unidad Medida eliminada correctamente!',
                                life: 3000
                            });
                            this.loadData();
                        },
                        error: (e) => {
                            console.log('Error al eliminar Unidad Medida: ', e);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error al eliminar Unidad Medida: \n' + e.error?.message,
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
        this.unidadMedidaDialog = true;
    }

    hideDialog() {
        this.unidadMedidaDialog = false;
    }

}
