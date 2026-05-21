import { Component, inject, OnInit, signal } from "@angular/core";
import { ProductoBaseService } from "../service/producto.base.service";
import { ProductoBaseOutput } from "../dto/producto.base.output";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ToolbarModule } from "primeng/toolbar";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ConfirmationService, MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { CategoriaService } from "../../categoria/service/categoria.service";
import { SelectModule } from "primeng/select";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CategoriaOutput } from "../../categoria/dto/categoria-output";

@Component({
    imports: [
        BreadcrumbModule,
        ToolbarModule,
        TableModule,
        ButtonModule,
        ToastModule,
        ConfirmDialogModule,
        DialogModule,
        SelectModule,
        ReactiveFormsModule
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
            <form [formGroup]="productoForm" (submit)="onSubmit($event)" action="POST">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <input type="text" pInputText id="name" formControlName="nombre" autofocus fluid />
                    @if(productoForm.get('nombre')?.invalid &&
                        productoForm.get('nombre')?.touched ) {
                        <small class="text-red-500">Nombre no debe ser vacio.</small>
                    }
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <input id="description" pInputText formControlName="descripcion" fluid />
                </div>
                <div>
                    <label for="categoria" class="font-semibold">Producto Base(*):</label>
                    <p-select
                        formControlName="categoriaId"
                        [options]="categoriasOptions"
                        optionLabel="label"
                        placeholder="Seleccionar Categoria" />
                    @if(productoForm.get('categoriaId')?.invalid &&
                        productoForm.get('categoriaId')?.touched ) {
                        <small class="text-red-500">Categoria no debe ser nulo.</small>
                    }
                </div>
            </div>

            <div class="p-dialog-footer mt-1 pb-0">
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialogProducto()" />
                <p-button label="Save" type="submit" icon="pi pi-check" [disabled]="productoForm.invalid" />
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
    private formBuilder = inject(FormBuilder);

    productos = signal<ProductoBaseOutput[]>([]);
    productoDialog: boolean = false;
    productoForm!: FormGroup;

    categoriasOptions: { label: string, value: number }[] = [];

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Productos' }, { label: 'Listar' }, { label: 'Todo' }];

    constructor() { }

    ngOnInit(): void {
        this.loadData();
        this.productoForm = this.formBuilder.group({
            id: [null],
            nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
            descripcion: [null, Validators.maxLength(255)],
            categoriaId: [null, Validators.required],
        });
    }

    onSubmit(evt: Event): void {
        evt.preventDefault();
        const productoId = this.productoForm.get('id')?.value;
        const categoria = this.productoForm.get('categoriaId')?.value;
        this.productoForm.get('categoriaId')?.setValue(categoria.value);
        const productoData: ProductoBaseOutput = this.productoForm.value;
        if (productoId) {
            this.update(productoData, productoId);
        } else {
            this.save(productoData);
        }
        this.productoDialog = false;
    }

    private save(producto: ProductoBaseOutput) {
        console.log('I will save producto');
        this.service.save(producto)
            .subscribe({
                next: (resp) => {
                    console.log('create resp: ', resp);
                    const newProducto = resp.data as ProductoBaseOutput;
                    this.productos.set([newProducto, ...this.productos()]);
                    this.mostrarMsg('success', 'Producto creado correctamente.');
                    this.productoForm.patchValue({
                        id: null,
                        nombre: '',
                        descripcion: '',
                        categoriaId: null
                    });
                },
                error: (err) => {
                    this.mostrarMsg('error',
                        `Producto  + ${err.error ? JSON.stringify(err.error.message) : 'error al crear.'}`);
                }
            });
    }

    private update(producto: ProductoBaseOutput, id: number) {
        console.log('I will update producto');
        this.setUpdateProducto(producto, id);
        this.service.update(producto, id)
            .subscribe({
                next: (resp) => {
                    console.log('update resp: ', resp);

                    this.mostrarMsg('success', 'Categoria actualizado correctamente.');
                    this.productoForm.patchValue({
                        id: null,
                        nombre: '',
                        descripcion: '',
                        categoriaId: null
                    });
                },
                error: (err) => {
                    this.mostrarMsg('error',
                        `Producto ${err.error ? JSON.stringify(err.error.message) : 'error al crear.'}`);
                    this.loadData();
                }
            });
    }

    private setUpdateProducto(producto: ProductoBaseOutput, id: number) {
        this.productos.update(productosArr =>
            productosArr.map(m =>
                m.id === id ? { ...m, ...producto } : m
            )
        );
    }

    editProducto(producto: ProductoBaseOutput): void {
        const categoria = this.categoriasOptions.find(c => c.value === producto.categoriaId);
        this.productoForm.patchValue({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            categoriaId: categoria
        });
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
        this.setDeleteTablaProductos(producto);
        this.service.deleteProducto(producto)
            .subscribe({
                next: () =>
                    this.mostrarMsg('success', 'Producto eliminada correctamente!'),
                error: (e) => {
                    this.mostrarMsg('error', 'Error al eliminar Producto: \n' + e.error?.message);
                }
            });
    }

    private setDeleteTablaProductos(producto: ProductoBaseOutput) {
        const productosActuales = this.productos().filter((val) => producto.id !== val.id);
        this.productos.set(productosActuales);
    }

    private loadData() {
        this.categoriaService.list()
            .subscribe({
                next: (resp) => {
                    const data = resp.data.content as CategoriaOutput[];
                    this.categoriasOptions.push(
                        ...data.map(
                            categoria => ({ label: categoria.nombre, value: categoria.id || 0 })));
                    console.log('Categorias cargadas: ', this.categoriasOptions)
                },
                error: (err: string) =>
                    this.mostrarMsg('error', err)
            });

        this.service.list()
            .subscribe({
                next: (resp) => {
                    console.log('resp: ', resp);
                    this.productos.set(resp.data.content as ProductoBaseOutput[]);
                },
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
