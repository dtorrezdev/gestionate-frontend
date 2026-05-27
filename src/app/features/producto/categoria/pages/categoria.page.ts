import { Component, inject, OnInit, signal } from "@angular/core";
import { CategoriaService } from "../service/categoria.service";
import { ReactiveFormsModule } from "@angular/forms";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { form, required, FormField } from "@angular/forms/signals";
import { ConfirmationService } from "primeng/api";
import { CategoriaOutput } from "../dto/categoria-output";
import { ToastService } from "../../../../core/services/toast.service";

@Component({
    imports: [
        ReactiveFormsModule,
        BreadcrumbModule,
        ToolbarModule,
        ButtonModule,
        TableModule,
        DialogModule,
        InputTextModule,
        ConfirmDialogModule,
        FormField
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-0">
        <div class="font-bold text-xl mb-4">Gestion de Categorias</div>
        <p-breadcrumb
            [model]="breadcrumbItems"
            [home]="breadcrumbHome">
        </p-breadcrumb>
    </div>
    <p-toolbar styleClass="mb-4 border-no rounded-no">
        <ng-template #start>
            <p-button label="Nuevo" icon="pi pi-plus" class="m-2" (onClick)="openDialog()"/>
            <p-button severity="secondary" label="Importar" icon="pi pi-upload" outlined/>
        </ng-template>

        <ng-template #end>
            <p-button label="Exportar" icon="pi pi-download" severity="secondary"/>
        </ng-template>
    </p-toolbar>
    <p-table #dt
        [value]="categorias()"
        [paginator]="true"
        [rowsPerPageOptions]="[10, 20, 50,100]"
        [rows]="10"
        [tableStyle]="{ 'min-width': '55rem' }"
        [rowHover]="true"
        dataKey="id"
        [showCurrentPageReport]="true"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Categorias</h5>
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
        <ng-template #body let-categoria>
            <tr>
                <td style="min-width: 3rem; text-align: center;">{{ categoria.id }}</td>
                <td style="min-width: 8rem">{{ categoria.nombre }}</td>
                <td style="min-width: 12rem">{{ categoria.descripcion }}</td>
                <td style="min-width: 4rem">
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (onClick)="editCategoria(categoria)" />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" (onClick)="deleteCategoria(categoria)" [outlined]="true" />
                </td>
            </tr>
        </ng-template>
    </p-table>

    <p-dialog [(visible)]="categoriaDialog" [style]="{ width: '450px' }" header="Nueva Categoria" [modal]="true">
        <ng-template #content>
            <form (submit)="onSubmit($event)" action="POST">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <input type="text" pInputText id="name" [formField]="categoriaForm.nombre" autofocus fluid />
                    @if(categoriaForm.nombre().touched() && categoriaForm.nombre().invalid()) {
                        @for(error of categoriaForm.nombre().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <input id="description" pInputText [formField]="categoriaForm.descripcion" fluid />
                    @if(categoriaForm.descripcion().touched() && categoriaForm.descripcion().invalid()) {
                        @for(error of categoriaForm.descripcion().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>
            </div>

            <div class="p-dialog-footer mt-1 pb-0">
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" type="submit" icon="pi pi-check" [disabled]="categoriaForm().invalid()" />
            </div>
            </form>
        </ng-template>
    </p-dialog>

    <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [CategoriaService, ConfirmationService]
})
export class CategoriaPage implements OnInit {

    private categoriaService = inject(CategoriaService);
    private confirmationService = inject(ConfirmationService);
    private toastService = inject(ToastService);

    categorias = signal<CategoriaOutput[]>([]);
    categoria = signal<CategoriaOutput>({
        nombre: '',
        descripcion: ''
    });
    categoriaDialog: boolean = false;
    categoriaForm = form(this.categoria, (schemaPath) => {
        required(schemaPath.nombre, { message: 'El nombre es requerido.' });
        required(schemaPath.descripcion, { message: 'El descripcion es requerido.' });
    });

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Categorias' }, { label: 'Listar' }, { label: 'Todo' }];

    ngOnInit(): void {
        this.loadData();
    }

    onSubmit(evt: Event) {
        evt.preventDefault();
        const categoriaId = this.categoria().id;
        if (categoriaId) {
            this.updateCategoria(this.categoriaForm().value(), categoriaId);
        } else {
            this.saveCategoria(this.categoria());
        }
        this.categoriaDialog = false;
    }

    openDialog() { this.categoriaDialog = true; }

    editCategoria(categoria: CategoriaOutput) {
        this.categoria.set({ ...categoria });
        this.categoriaDialog = true;
    }

    hideDialog() { this.categoriaDialog = false; }

    private saveCategoria(categoria: CategoriaOutput) {
        this.categoriaService.save(categoria)
            .subscribe({
                next: (resp) => {
                    const newData = resp.data;
                    this.categorias.set([newData, ...this.categorias()]);
                    this.toastService.mostrarMsg('success', 'Categoria ' + resp.message);
                    this.categoriaForm().reset({
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

    private updateCategoria(categoria: CategoriaOutput, id: number) {
        this.updateDataTableCategorias(categoria, id);
        this.categoriaService.update(categoria, id)
            .subscribe({
                next: (resp) => {
                    this.toastService.mostrarMsg('success', resp.message);
                    this.categoriaForm().reset({
                        nombre: '',
                        descripcion: ''
                    });
                },
                error: (err: string) => {
                    this.toastService.mostrarMsg('error', err);
                    this.loadData();
                }
            });
    }

    deleteCategoria(categoria: CategoriaOutput) {
        this.confirmationService.confirm({
            message: 'Estas seguro de eliminar la Categoria con id: ' + categoria.id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.setDeleteTablaCategorias(categoria);
                this.categoriaService.deleteCategoria(categoria)
                    .subscribe({
                        next: () => {
                            this.toastService.mostrarMsg('success', 'Categoria eliminada correctamente!');
                        },
                        error: (err) => {
                            this.toastService.mostrarMsg('error', 'Error al eliminar categoria: \n' + err.error?.message);
                        }
                    })
            }
        });
    }

    private updateDataTableCategorias(categoria: CategoriaOutput, id: number) {
        const categoriasActuales = this.categorias();
        const indexcategoria = categoriasActuales.findIndex(m => m.id === id);
        if (indexcategoria !== -1) {
            const nuevasCategorias = [...categoriasActuales];
            nuevasCategorias[indexcategoria] = { ...nuevasCategorias[indexcategoria], ...categoria };
            this.categorias.set(nuevasCategorias);
        }
    }

    private setDeleteTablaCategorias(categoria: CategoriaOutput) {
        const categoriasActuales = this.categorias()
            .filter((val) => categoria.id !== val.id);
        this.categorias.set(categoriasActuales);
    }

    private loadData() {
        this.categoriaService.list()
            .subscribe({
                next: (resp) => this.categorias.set(resp.data.content)
            });
    }

    constructor() { }
}
