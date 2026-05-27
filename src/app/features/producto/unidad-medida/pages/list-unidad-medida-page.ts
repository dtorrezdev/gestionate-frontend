import { Component, inject, OnInit, signal } from "@angular/core";
import { UnidadMedidaService } from "../service/unidad-medida.service";
import { UnidadMedidaOuput } from "../dto/unidad-medida.output";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ToolbarModule } from "primeng/toolbar";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { ConfirmationService } from "primeng/api";
import { UnidadMedidaInput } from "../dto/unidad-medida.input";
import { form, required, FormField } from "@angular/forms/signals";
import { ToastService } from "../../../../core/services/toast.service";


@Component({
    imports: [
        BreadcrumbModule,
        ToolbarModule,
        TableModule,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        FormField
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-1">
        <div class="font-bold text-2xl mb-2">Gestion de Unidad de Medida</div>
        <p-breadcrumb
            [model]="breadcrumbItems"
            [home]="breadcrumbHome">
        </p-breadcrumb>
    </div>
    <p-toolbar styleClass="mb-4 border-no rounded-no">
        <ng-template #start>
            <p-button label="New" icon="pi pi-plus" class="m-2" (onClick)="openNew()"/>
            <p-button severity="secondary" label="Importar" icon="pi pi-upload" outlined/>
        </ng-template>

        <ng-template #end>
            <p-button label="Exportar" icon="pi pi-download" severity="secondary"/>
        </ng-template>
    </p-toolbar>

    <p-table #dt
        [value]="unidadesMedidas()"
        [paginator]="true"
        [rowsPerPageOptions]="[10, 20, 30, 50, 100]"
        [rows]="10"
        [tableStyle]="{ 'min-width': '55rem' }"
        [rowHover]="true"
        dataKey="id"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Unidades de Medida</h5>
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
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" (onClick)="editUnidadMedida(unidadMedida)" [outlined]="true" />
                    <p-button
                        icon="pi pi-trash"
                        severity="danger"
                        [rounded]="true"
                        (onClick)="showDialogRemoveUnidadMedida(unidadMedida)"
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


    `,
    providers: [UnidadMedidaService, ConfirmationService]
})
export class ListUnidadMedidaPage implements OnInit {
    private service = inject(UnidadMedidaService);
    private confirmationService = inject(ConfirmationService);
    private toastService = inject(ToastService);

    unidadesMedidas = signal<UnidadMedidaOuput[]>([]);
    unidadMedida = signal<UnidadMedidaInput>({
        nombre: '',
        abreviatura: '',
        esUnidadMinima: true
    });
    unidadMedidaDialog: boolean = false;
    unidadMedidaForm = form(this.unidadMedida, (schemaPath) => {
        required(schemaPath.abreviatura, { message: 'Abreviatura es requerido.' });
        required(schemaPath.nombre, { message: 'El descripcion es requerido.' });
        required(schemaPath.esUnidadMinima, { message: 'Es unidad Minima es requerido.' });
    });

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Unidad Medida' }, { label: 'Listar' }, { label: 'Todo' }];

    ngOnInit(): void {
        this.loadData();
    }

    onSubmit(evt: Event) {
        evt.preventDefault();
        const unidadMedidaId = this.unidadMedida().id;
        const unidadMedidaData = this.unidadMedidaForm().value();
        if (unidadMedidaId) {
            this.update(unidadMedidaData, unidadMedidaId);
        } else {
            this.save(unidadMedidaData);
        }
        this.unidadMedidaDialog = false;
    }

    editUnidadMedida(unidadMedida: UnidadMedidaOuput) {
        this.unidadMedida.set({ ...unidadMedida });
        this.unidadMedidaDialog = true;
    }

    showDialogRemoveUnidadMedida(unidadMedida: UnidadMedidaOuput) {
        this.confirmationService.confirm({
            message: 'Estas seguro de eliminar la Unidad Medida con id: ' + unidadMedida.id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteUnidadMedida(unidadMedida)
        });
    }

    openNew() { this.unidadMedidaDialog = true; }

    hideDialog() { this.unidadMedidaDialog = false; }

    private update(unidadMedida: UnidadMedidaInput, id: number) {
        this.setUpdateUnidadMedida(unidadMedida, id);
        this.service.update(unidadMedida, id)
            .subscribe({
                next: (resp) => {
                    this.toastService.mostrarMsg('success', `Unidad Medidad ${resp.message}`);
                    this.unidadMedidaForm().reset({
                        nombre: '',
                        abreviatura: '',
                        esUnidadMinima: true
                    });
                },
                error: (err: any) => {
                    this.toastService.mostrarMsg('error', err);
                    this.loadData();
                }
            });
    }

    private setUpdateUnidadMedida(unidadMedida: UnidadMedidaInput, id: number) {
        this.unidadesMedidas.update(unidadesMedida =>
            unidadesMedida.map(m =>
                m.id === id ? { ...m, ...unidadMedida } : m
            )
        );
    }

    private save(data: UnidadMedidaInput) {
        this.service.save(data)
            .subscribe({
                next: (resp) => {
                    const newData = resp.data;
                    this.unidadesMedidas.set([newData, ...this.unidadesMedidas()]);
                    this.toastService.mostrarMsg('success', `Unidad Medida ${resp.message}`);
                    this.unidadMedidaForm().reset({
                        nombre: '',
                        abreviatura: '',
                        esUnidadMinima: true
                    });
                },
                error: (err) =>
                    this.toastService.mostrarMsg('error',
                        `Unidad Medida  + ${err.error ? JSON.stringify(err.error.message) : 'error al crear.'}`)
            });
    }

    private loadData(): void {
        this.service.list()
            .subscribe({
                next: (resp) => {
                    this.unidadesMedidas.set(resp.data.content);
                }
            });
    }

    private deleteUnidadMedida(data: UnidadMedidaOuput) {
        this.setDeleteTablaMarcas(data);
        this.service.deleteUnidadMedida(data)
            .subscribe({
                next: () =>
                    this.toastService.mostrarMsg('success', 'Unidad Medida eliminada correctamente.'),
                error: (e) =>
                    this.toastService.mostrarMsg('error', 'Error al eliminar Unidad Medida: \n' + e.error?.message),
            });
    }

    private setDeleteTablaMarcas(unidadMedida: UnidadMedidaOuput) {
        const unidadesMedidaActuales = this.unidadesMedidas().filter((val) => unidadMedida.id !== val.id);
        this.unidadesMedidas.set(unidadesMedidaActuales);
    }

    constructor() { }
}
