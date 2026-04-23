import { Component, inject, OnInit, signal } from "@angular/core";
import { ProductoBaseService } from "../service/producto.base.service";
import { ProductoBaseOutput } from "../dto/producto.base.output";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ToolbarModule } from "primeng/toolbar";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ConfirmationService, MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { form, required, FormField } from "@angular/forms/signals";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { CategoriaService } from "../../categoria/service/categoria.service";
import { Select, SelectModule } from "primeng/select";

@Component({
    imports: [
        BreadcrumbModule,
        ToolbarModule,
        TableModule,
        ButtonModule,
        ToastModule,
        FormField,
        ConfirmDialogModule,
        DialogModule,
        SelectModule
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-1">
        <div class="font-semibold text-xl mb-4">Listar Productos</div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"/>
    </div>

    <p-toolbar styleClass="mb-6 n-border n-border-r">
        <ng-template #start>
            <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openDialogProducto()"/>
            <p-button severity="secondary" label="Import" icon="pi pi-download" outlined/>
        </ng-template>

        <ng-template #end>
            <p-button label="Export" icon="pi pi-upload" severity="secondary"/>
        </ng-template>
    </p-toolbar>

    <p-table #dt
        [value]="productos()"
        [paginator]="true"
        [rowsPerPageOptions]="[10, 20, 50,100]"
        [rows]="10"
        [tableStyle]="{ 'min-width': '75rem' }"
        [rowHover]="true"
        dataKey="id"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Productos Base registrados</h5>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th style="min-width: 3rem; text-align: center;">ID</th>
                <th pSortableColumn="nombre" style="min-width:8rem">
                    Codigo
                    <p-sortIcon field="nombre" />
                </th>

                <th pSortableColumn="descripcion" style="min-width:12rem">
                    Nombre
                    <p-sortIcon field="descripcion" />
                </th>
                <th pSortableColumn="descripcion" style="min-width:12rem">
                    Categoria
                    <p-sortIcon field="descripcion" />
                </th>
                <th pSortableColumn="descripcion" style="min-width:12rem">
                    Descripcion
                    <p-sortIcon field="descripcion" />
                </th>
                <th style="min-width: 4rem"></th>
            </tr>
        </ng-template>
        <ng-template #body let-producto>
            <tr>
                <td style="min-width: 3rem; text-align: center;">{{ producto.id }}</td>
                <td style="min-width: 8rem">{{ producto.codigo }}</td>
                <td style="min-width: 12rem">{{ producto.nombre }}</td>
                <td style="min-width: 12rem">{{ producto.categoriaId }}</td>
                <td style="min-width: 12rem">{{ producto.descripcion }}</td>
                <td style="min-width: 4rem">
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" (onClick)="editProducto(producto)" [outlined]="true" />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" (onClick)="showDialogRemoveProducto(producto)" [outlined]="true" />
                </td>
            </tr>
        </ng-template>
    </p-table>

    <p-dialog [(visible)]="productoDialog" [style]="{ width: '450px' }" header="Nuevo Producto" [modal]="true">
        <ng-template #content>
            <form (submit)="onSubmit($event)" action="POST">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <input type="text" pInputText id="name" [formField]="productoForm.nombre" autofocus fluid />
                    @if(productoForm.nombre().touched() && productoForm.nombre().invalid()) {
                        @for(error of productoForm.nombre().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <input id="description" pInputText [formField]="productoForm.descripcion" fluid />
                    @if(productoForm.descripcion().touched() && productoForm.descripcion().invalid()) {
                        @for(error of productoForm.descripcion().errors(); track error.kind) {
                            <small class="text-red-500">{{error.message}}</small>
                        }
                    }
                </div>
                <div>
                    <label for="categoria" class="font-semibold">Producto Base(*):</label>
                    <p-select
                        [options]="categoriasOptions"
                        optionLabel="label"
                        placeholder="Seleccionar Categoria" />

                </div>
            </div>

            <div class="p-dialog-footer mt-1 pb-0">
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialogProducto()" />
                <p-button label="Save" type="submit" icon="pi pi-check" [disabled]="productoForm().invalid()" />
            </div>
            </form>
        </ng-template>
    </p-dialog>

    <p-confirmdialog [style]="{ width: '450px' }" />

    <p-toast />
    `,
    providers: [ProductoBaseService, CategoriaService, MessageService, ConfirmationService]
})
export class ListProductoPage implements OnInit {
    private service = inject(ProductoBaseService);
    private categoriaService = inject(CategoriaService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    productos = signal<ProductoBaseOutput[]>([]);
    producto = signal<ProductoBaseOutput>({
        nombre: '',
        descripcion: '',
        categoriaId: 0
    });
    productoDialog: boolean = false;
    productoForm = form(this.producto, (schemaPath) => {
        required(schemaPath.nombre, { message: 'El nombre es requerido.' });
        required(schemaPath.descripcion, { message: 'El descripcion es requerido.' });
        required(schemaPath.categoriaId, { message: 'La categoria es requerido.' });
    });

    categoriasOptions: { label: string, value: number }[] = [];

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Productos' }, { label: 'Listar' }, { label: 'Todo' }];

    constructor() { }

    ngOnInit(): void {
        this.loadData();
    }

    onSubmit(evt: Event): void {
        evt.preventDefault();
    }

    editProducto(producto: ProductoBaseOutput): void {
        this.producto.set({ ...producto });
        this.productoDialog = true;
    }

    showDialogRemoveProducto(producto: ProductoBaseOutput) {
        this.confirmationService.confirm({
            message: 'Estas seguro de eliminar el producto con id: ' + producto.id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteProducto(producto)
        });
    }

    openDialogProducto(): void {
        this.productoDialog = true;
    }

    hideDialogProducto(): void { }

    private deleteProducto(producto: ProductoBaseOutput) {
        console.log('I will remove producto');
    }

    private loadData() {

        this.categoriaService.getAllCategorias()
            .subscribe({
                next: (resp) => {
                    const data = resp.data.content;
                    this.categoriasOptions.push(
                        ...data.map(
                            categoria => ({ label: categoria.nombre, value: categoria.id || 0 })));
                    console.log('Categorias cargadas: ', this.categoriasOptions)
                },
                error: (err) =>
                    this.mostrarMsg('error', 'Error al cargar las categorias: ' + err.error.message)
            });

        this.service.getAllProductoBase()
            .subscribe({
                next: (resp) => this.productos.set(resp.content),
                error: (err) =>
                    this.mostrarMsg('error', 'Error al cargar los datos: ' + err.error.message)


            });
    }

    private mostrarMsg(tipo: string, detalle: string): void {
        this.messageService.add({
            severity: tipo,
            summary: 'Mensaje',
            detail: detalle,
            life: 3500
        });
    }

}
