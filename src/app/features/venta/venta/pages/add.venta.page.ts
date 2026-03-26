import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from "../../../producto/services/producto.service";
import { RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { ClienteOption } from '../../cliente/dto/cliente.option';
import { PresentacionOption } from '../../../producto/presentacion/dto/presentacion.option';
import { PresentacionOuput } from '../../../producto/presentacion/dto/presentacion.output';
import { VentaService } from '../../services/venta.service';
import { VentaInput } from '../dto/venta.input';

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
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        BreadcrumbModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        RouterModule
    ],
    standalone: true,
    template: `
    <div class="card mb-0">
        <div class="font-semibold text-xl mb-4">Add Venta Productos</div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
    </div>
    <!-- <div class="md:w-1/1"> -->
    <div class="card flex flex-col gap-6 w-full mb-0">
        <div class="font-semibold text-xl">Orden Venta N-2312</div>
        <div class="flex flex-col md:flex-row gap-6">
            <div class="flex gap-2 w-full">
                <label for="cliente">Cliente: </label>
                <p-select id="cliente"
                    [(ngModel)]="clienteSelected"
                    [options]="clienteOptions"
                    optionLabel="nombre"
                    placeholder="Seleccione Cliente"
                    class="w-full">
                </p-select>
            </div>
            <div class="flex gap-2 w-full">
                <p-button label="Cliente" icon="pi pi-user-plus" />
            </div>
        </div>

        <div class="flex flex-col md:flex-row gap-6">
            <div class="flex flex-wrap gap-2 w-full">
                <label for="state">Productos</label>
                <p-select
                    id="state"
                    [(ngModel)]="productoPresentacionSelected"
                    [options]="productoPresentacionOptions"
                    optionLabel="nombre"
                    placeholder="Seleccione Producto" class="w-full">
                </p-select>
            </div>
            <div class="flex gap-2 w-full">
                <label for="cantidad">cantidad</label>
                <input pInputText id="zip" type="text" [(ngModel)]="cantidad"  />
            </div>
            <div class="flex gap-2 w-full">
                <p-button label="Agregar" icon="pi pi-plus" (onClick)="addDetalle()"  />
            </div>
        </div>
    </div>
    <!-- </div> -->
    <p-table
        #dt
        [value]="products()"
        [rows]="10"
        [columns]="cols"
        [tableStyle]="{ 'min-width': '75rem' }"
        [rowHover]="true"
        dataKey="id"
        [showCurrentPageReport]="true"
        >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Detalle venta</h5>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th style="min-width: 8rem; text-align: center;">Code</th>
                <th pSortableColumn="name" style="min-width:16rem">
                    Nombre
                    <p-sortIcon field="name" />
                </th>
                <!-- <th>Image</th> -->
                <th pSortableColumn="price" style="min-width: 4rem">
                    Price
                    <p-sortIcon field="price" />
                </th>
                <!-- <th pSortableColumn="category" style="min-width:10rem">
                    Category
                    <p-sortIcon field="category" />
                </th> -->
                <!-- <th pSortableColumn="rating" style="min-width: 12rem">
                    Reviews
                    <p-sortIcon field="rating" />
                </th> -->
                <th pSortableColumn="inventoryStatus" style="min-width: 8rem">
                    Status
                    <p-sortIcon field="inventoryStatus" />
                </th>
                <th style="min-width: 8rem"></th>
            </tr>
        </ng-template>
        <ng-template #body let-product>
            <tr>
                <td style="min-width: 8rem; text-align: center;">{{ product.id }}</td>
                <td style="min-width: 16rem">{{ product.nombre }}</td>
                <!-- <td>
                    <img [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + product.image" [alt]="product.name" style="width: 64px" class="rounded" />
                </td> -->
                <td>{{ product.precioVenta | currency: 'Bs ' }}</td>
                <!-- <td>{{ product.category }}</td> -->
                <!-- <td>
                    <p-rating [(ngModel)]="product.rating" [readonly]="true" />
                </td> -->
                <td>
                    <p-tag value="INSTOCK" [severity]="getSeverity('INSTOCK')" />
                </td>
                <td style="min-width: 8rem;">
                    <!-- <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editProduct(product)" /> -->
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteProduct(product)" />
                </td>
            </tr>
        </ng-template>
        <ng-template #emptymessage>
            <tr style="text-align: center;">
                <td colspan="5">No hay detalle venta.</td>
            </tr>
        </ng-template>
    </p-table>

    <div class="card flex flex-col gap-4">
        <div class="flex flex-wrap gap-2">
            <p-button label="Guardar" (onClick)="saveVenta()" />
            <p-button label="Preventa" severity="info" (onClick)="savePreventa()" />
            <p-button label="Cancelar" severity="secondary" [routerLink]="'/venta'" />
        </div>
    </div>

    <!-- <p-dialog [(visible)]="productDialog" [style]="{ width: '450px' }" header="Product Details" [modal]="true">
        <ng-template #content>
            <div class="flex flex-col gap-6">
                <img [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + product.image" [alt]="product.image" class="block m-auto pb-4" *ngIf="product.image" />
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <input type="text" pInputText id="name" [(ngModel)]="product.name" required autofocus fluid />
                    <small class="text-red-500" *ngIf="submitted && !product.name">Name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <textarea id="description" pTextarea [(ngModel)]="product.description" required rows="3" cols="20" fluid></textarea>
                </div>

                <div>
                    <label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>
                    <p-select [(ngModel)]="product.inventoryStatus" inputId="inventoryStatus" [options]="statuses" optionLabel="label" optionValue="label" placeholder="Select a Status" fluid />
                </div>

                <div>
                    <span class="block font-bold mb-4">Category</span>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="flex items-center gap-2 col-span-6">
                            <p-radiobutton id="category1" name="category" value="Accessories" [(ngModel)]="product.category" />
                            <label for="category1">Accessories</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <p-radiobutton id="category2" name="category" value="Clothing" [(ngModel)]="product.category" />
                            <label for="category2">Clothing</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <p-radiobutton id="category3" name="category" value="Electronics" [(ngModel)]="product.category" />
                            <label for="category3">Electronics</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <p-radiobutton id="category4" name="category" value="Fitness" [(ngModel)]="product.category" />
                            <label for="category4">Fitness</label>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Price</label>
                        <p-inputnumber id="price" [(ngModel)]="product.price" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="quantity" class="block font-bold mb-3">Quantity</label>
                        <p-inputnumber id="quantity" [(ngModel)]="product.quantity" fluid />
                    </div>
                </div>
            </div>
        </ng-template>

        <ng-template #footer>
            <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
            <p-button label="Save" icon="pi pi-check" (click)="saveProduct()" />
        </ng-template>
    </p-dialog> -->

    <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    styles: `
        .mb-0 {
            margin-bottom: 0;
        }
        .pl-1 {
            padding-left: 1.5rem;
        }
    `,
    providers: [ProductService, ClienteService, VentaService, MessageService, ConfirmationService]
})
export class AddVentaPage implements OnInit {

    private productService = inject(ProductService);
    private clienteService = inject(ClienteService);
    private ventaService = inject(VentaService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    productDialog: boolean = false;
    products = signal<PresentacionOuput[]>([]);
    product!: PresentacionOuput
    selectedProducts!: PresentacionOuput[] | null;

    submitted: boolean = false;
    statuses!: any[];

    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    // Combo Box Cliente
    clienteSelected: any = null;
    clienteOptions = [
        ClienteOption.getInstance()
    ];

    // Combo Box Producto
    productoPresentacionSelected: any = null;
    productoPresentacionOptions = [
        PresentacionOption.getInstance()
    ];

    cantidad: number = 0;

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Ventas' }, { label: 'New Venta' }];

    constructor(
    ) { }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.clienteService.getAllCliente()
            .subscribe((resp) => {
                const clientes = resp.data.content;
                this.clienteOptions.push(
                    ...clientes.map(cliente =>
                        new ClienteOption(cliente.id,
                            cliente.nombre
                        )
                    )
                )
            });

        this.productService.getAllProdutos()
            .subscribe(resp => {
                console.log(resp.content);
                // this.products.set(resp.content);
                this.productoPresentacionOptions.push(
                    ...resp.content
                );
            });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    addDetalle() {
        console.log('addDetalle ', this.clienteSelected, this.productoPresentacionSelected);
        console.log('addDetalle cantidad: ', this.cantidad);
        this.products.set([...this.products(), this.productoPresentacionSelected]);
    }

    saveVenta() {
        console.log('saveVenta()');

        const detalle = this.products().map(product => {
            return {
                presentacionId: product.id,
                productoId: product.productoId,
                cantidad: 1,
                cantidadBase: 1,
                precioUnitario: product.precioVenta + 1
            }
        })

        const venta: VentaInput = {
            total: 100,
            codigo: 'V-122',
            clienteId: this.clienteSelected.id,
            estado: 'VENTA',
            detalle: detalle
        };
        console.log('venta: ', venta);
        this.ventaService.saveVenta(venta).subscribe(resp => {
            console.log('Response: ', resp);

        })
    }

    savePreventa() {
        console.log('saveVenta()');

        const detalle = this.products().map(product => {
            return {
                presentacionId: product.id,
                productoId: product.productoId,
                cantidad: 1,
                cantidadBase: 1,
                precioUnitario: product.precioVenta + 1
            }
        })

        const venta: VentaInput = {
            total: 100,
            codigo: 'V-124',
            clienteId: this.clienteSelected.id,
            estado: 'PREVENTA',
            detalle: detalle
        };
        console.log('venta: ', venta);
        this.ventaService.saveVenta(venta).subscribe(resp => {
            console.log('Response: ', resp);
        })

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.product = PresentacionOuput.getInstance();

        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: PresentacionOuput) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: PresentacionOuput) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.nombre + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products.set(this.products().filter((val) => val.id !== product.id));
                this.product = PresentacionOuput.getInstance();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    saveProduct() {
        this.submitted = true;
        let _products = this.products();
        if (this.product.nombre?.trim()) {
            if (this.product.id) {
                _products[this.findIndexById(this.product.id)] = this.product;
                this.products.set([..._products]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                // this.product.id = this.createId();
                // this.product.image = 'product-placeholder.svg';
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
                this.products.set([..._products, this.product]);
            }

            this.productDialog = false;
            this.product = PresentacionOuput.getInstance();
        }
    }
}
