import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ProductService } from "../../../producto/services/producto.service";
import { RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { ClienteOption } from '../../cliente/dto/cliente.option';
import { PresentacionOption } from '../../../producto/presentacion/dto/presentacion.option';
import { PresentacionOuput } from '../../../producto/presentacion/dto/presentacion.output';
import { VentaService } from '../../services/venta.service';
import { VentaInput } from '../dto/venta.input';

@Component({
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        BreadcrumbModule,
        SelectModule,
        InputNumberModule,
        TagModule,
        RouterModule,
        ReactiveFormsModule
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
                <p-inputnumber inputId="cantidad" [(ngModel)]="cantidad" />
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
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" />
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
    `,
    styles: `
        .mb-0 {
            margin-bottom: 0;
        }
        .pl-1 {
            padding-left: 1.5rem;
        }
    `,
    providers: [ProductService, ClienteService, VentaService]
})
export class AddVentaPage implements OnInit {

    private productService = inject(ProductService);
    private clienteService = inject(ClienteService);
    private ventaService = inject(VentaService);
    private formBuilder = inject(FormBuilder);
    // private messageService = inject(MessageService);

    products = signal<PresentacionOuput[]>([]);
    /*
    {
        "total": 100,
        "codigo": "V-122",
        "clienteId": 9,
        "estado": "VENTA",
        "detalle": [
            {
                "presentacionId": 18,
                "productoId": 22,
                "cantidad": 1,
                "cantidadBase": 1,
                "precioUnitario": 1
            }
        ]
    }
    */
    profileForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: [''],
        address: this.formBuilder.group({
            street: [''],
            city: [''],
            state: [''],
            zip: [''],
        }),
        //Define a FormArray control
        aliases: this.formBuilder.array([])
    });

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

    constructor() { }

    ngOnInit() {
        this.loadDemoData();
    }

    private loadDemoData(): void {
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
        // this.ventaService.saveVenta(venta).subscribe(resp => console.log('Response: ', resp))
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
            codigo: 'V-125',
            clienteId: this.clienteSelected.id,
            estado: 'PREVENTA',
            detalle: detalle
        };
        console.log('venta: ', venta);
        this.ventaService.saveVenta(venta).subscribe(resp => {
            console.log('Response: ', resp);
        });

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

}
