import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { ProductService } from "../../../producto/services/producto.service";
import { ClienteService } from '../../services/cliente.service';
import { ClienteOption } from '../../cliente/dto/cliente.option';
import { PresentacionOuput } from '../../../producto/presentacion/dto/presentacion.output';
import { VentaService } from '../../services/venta.service';
import { MovimientoService } from '../../../inventario/movimiento/service/movimiento.service';
import { StockByProductoOutput } from '../../../inventario/stock/dtos/stock-by-producto.output';

@Component({
    imports: [
        ReactiveFormsModule,
        RouterModule,
        CommonModule,
        TableModule,
        ButtonModule,
        BreadcrumbModule,
        SelectModule,
        InputNumberModule,
        TagModule,
        ToastModule,
        ToggleSwitchModule,
        RippleModule
    ],
    standalone: true,
    template: `
    <div class="card mb-0">
        <div class="font-semibold text-xl mb-4">Add Venta Productos</div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
    </div>
    <form [formGroup]="ventaForm" (submit)="submitForm($event)" class="md:w-1/1">
    <div class="card flex flex-col gap-6 w-full mb-0">
        <div class="font-semibold text-xl">Orden Venta {{ventaForm.get('codigo')?.value}}</div>
        <div class="flex flex-col md:flex-row gap-6">
            <div class="flex flex-wrap gap-2 w-full">
                <label class="font-semibold" for="cliente">Cliente: </label>
                <p-select id="cliente"
                    formControlName="clienteId"
                    [options]="clienteOptions"
                    size="large"
                    optionLabel="nombre"
                    placeholder="Seleccione Cliente"
                    class="w-full">
                </p-select>
                @if( ventaForm.get('clienteId')?.invalid && (ventaForm.get('clienteId')?.touched || ventaForm.get('clienteId')?.dirty) ) {
                    <small class="text-red">Cliente no debe ser vacio.</small>
                }
            </div>
            <div class="flex gap-2 w-full flex-cc">
                <p-button class="mt-2" label="Cliente" icon="pi pi-user-plus" />
            </div>
        </div>

        <div class="flex flex-col md:flex-row gap-6">
            <div class="flex flex-wrap gap-2 w-full">
                <label class="font-semibold" for="producto">Productos:</label>
                <p-select
                    id="producto"
                    (onChange)="addDetalle($event.value)"
                    [options]="productoPresentacionOptions"
                    optionLabel="presentacion"
                    placeholder="Seleccione Producto" class="w-full">
                    <ng-template #selectedItem let-productoPre>
                    <div class="flex items-center gap-2">
                        <div>{{ productoPre.marca }} - {{ productoPre.presentacion }}</div>
                    </div>
                </ng-template>
                <ng-template let-producto #item>
                    <div class="flex items-center gap-2">
                        <div>{{ producto.marca }} - {{ producto.presentacion }}</div>
                    </div>
                </ng-template>
                </p-select>
                <!-- <small class="text-red">El detalle esta vacio.</small> -->
            </div>
            <div class="flex gap-2 w-full flex-cc">
                <label for="pago">Pagos: </label>
                <p-toggleswitch  formControlName="hasPay" />
            </div>
            <!-- <div class="flex gap-2 w-full">
                <p-button label="Agregar" icon="pi pi-plus" (onClick)="addDetalle()"  />
            </div> -->
        </div>
    </div>

    <p-table
        #dt
        [value]="detalle.controls"
        [tableStyle]="{ 'min-width': '75rem' }"
        [rowHover]="false"
        dataKey="id"
        [expandedRowKeys]="expandedRows"
        (onRowExpand)="onRowExpand($event)"
        (onRowCollapse)="onRowCollapse($event)"
        >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Detalle venta</h5>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th style="min-width: 2rem; text-align: center;">Code</th>
                <th style="min-width:18rem">
                    Producto
                </th>
                <th style="min-width: 8rem">
                    Status
                </th>
                <!-- <th>Image</th> -->
                <th style="min-width: 3rem">
                    Precio
                </th>
                <th style="min-width: 3rem">
                    Cantidad
                </th>
                <th style="min-width: 4rem">
                    Subtotal
                </th>
                <th style="min-width: 8rem"></th>
            </tr>
        </ng-template>
        <ng-template #body let-product let-editing="editing" let-index="rowIndex" let-expanded="expanded">
            <tr
                [formGroup]="product"
            >
                <td style="min-width: 2rem; text-align: center;">P-{{ product.value.presentacionId }}</td>
                <td style="min-width: 18rem">
                    {{ product.value.nombre }}
                </td>
                <td style="min-width: 8rem">
                    <p-tag [value]="statuses.get(getSeverity(product.value))" [severity]="getSeverity(product.value)" />
                </td>
                <td
                    style="min-width: 3rem"
                    [pEditableColumn]="product.precioVenta"
                    pEditableColumnField="precioVenta">
                    <p-cellEditor>
                        <ng-template #input>
                            <p-inputnumber inputId="precioVenta" formControlName="precioVenta" mode="decimal" [minFractionDigits]="2" />
                            @if(product.value.precioVenta <= 0) {
                            <small class="text-red">precio debe ser mayor a 0</small>
                            }
                        </ng-template>
                        <ng-template #output>
                            {{ product.value.precioVenta | currency: 'Bs ' }}
                            @if(product.value.precioVenta <= 0) {
                                <small class="text-red">valor invalido</small>
                            }
                        </ng-template>
                    </p-cellEditor>

                </td>
                <td
                    style="min-width: 3rem"
                    [pEditableColumn]="product.cantidad" pEditableColumnField="cantidad">
                    <p-cellEditor>
                        <ng-template #input>
                            <p-inputnumber inputId="cantidad" formControlName="cantidad" />
                            @if(product.value.cantidad <= 0) {
                            <small class="text-red">cantidad debe ser mayor a 0</small>
                            }
                        </ng-template>
                        <ng-template #output>
                            {{ product.value.cantidad }}
                            @if(product.value.cantidad <= 0) {
                                <small class="text-red">valor invalido</small>
                            }
                        </ng-template>
                    </p-cellEditor>
                </td>

                <td style="min-width: 4rem">{{ product.value.subtotal }}</td>
                <td style="min-width: 8rem;">
                    <p-button
                        [id]="product.presentacionId"
                        type="button"
                        pRipple
                        [pRowToggler]="product"
                        [text]="true"
                        severity="secondary"
                        [rounded]="true"
                        [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="removeDetalle(index)" />
                </td>
            </tr>
        </ng-template>
        <ng-template #expandedrow let-product>
            <tr>
                <td colspan="8">
                    <div class="p-4">
                        <h6>Stocks Disponibles {{ product.value.nombre }}</h6>
                        <p-table [value]="product.value.stocks" dataKey="id">
                            <ng-template #header>
                                <tr>
                                    <th>
                                        <div class="flex items-center gap-2">Lote</div>
                                    </th>
                                    <th>
                                        <div class="flex items-center gap-2">Fech. Vencimiento</div>
                                    </th>
                                    <th>
                                        <div class="flex items-center gap-2">Ubicacion Stock</div>
                                    </th>
                                    <th>
                                        <div class="flex items-center gap-2">Cantidad</div>
                                    </th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-stock>
                                <tr>
                                    <td>{{ stock.lote }}</td>
                                    <td>{{ stock.expiracion }}</td>
                                    <td>{{ stock.seccion }}</td>
                                    <td>{{ stock.cantidad }}</td>
                                </tr>
                            </ng-template>
                            <ng-template #emptymessage>
                                <tr>
                                    <td colspan="6">There are no Stock for this product yet.</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </div>
                </td>
            </tr>
        </ng-template>
        <ng-template #footer>
            <tr class="font-bold">
                <td style="text-align: center;" colspan="6">Total:</td>
                <td colspan="2" style="min-width: 8rem; text-align: left;">
                    {{total}}
                </td>
            </tr>
        </ng-template>
        <ng-template #emptymessage>
            <tr style="text-align: center;">
                <td colspan="7">No hay detalle venta.</td>
            </tr>
        </ng-template>
    </p-table>
    <div
        formGroupName="pagos"
        [className]="hasPay? 'card flex flex-col gap-4 mb-0 active':
            'card flex flex-col gap-4 noactive'">
        <div class="font-semibold text-xl mb-4">Pagos</div>
        <div class="flex flex-col md:flex-row gap-6 mt-1">
            <div class="flex gap-2 w-full">
                <label class="font-semibold" for="metodo">Metodo:</label>
                <p-select
                    id="metodo"
                    formControlName="tipo"
                    [options]="metodoValues"
                    optionLabel="name"
                    placeholder="Seleccione metodo" class="w-full">
                </p-select>
                <!-- <small class="text-red">El detalle esta vacio.</small> -->
            </div>
            <div class="flex gap-2 w-full flex-cc">
                <label for="monto">Monto: </label>
                <p-inputnumber formControlName="monto" mode="decimal" [minFractionDigits]="2" inputId="cantidad" />
            </div>
            <div class="flex gap-2 w-full flex-cc">
                <p-button label="Agregar" icon="pi pi-plus" (onClick)="addDetallePago()" />
            </div>
            <div class="flex gap-2 w-full flex-cc">
                Total Pago: {{ totalPago }}
            </div>

        </div>
        <p-table
            #dt2
            [value]="detallePagos.controls"
            [tableStyle]="{ 'min-width': '30rem' }"
            [rowHover]="true"
            dataKey="id"
            [showCurrentPageReport]="true"
            >
            <ng-template #header>
                <tr>
                    <th style="min-width: 2rem; text-align: center;">#</th>
                    <th style="min-width:8rem">
                        Metodo
                    </th>
                    <th style="min-width:5rem">
                        Monto
                    </th>
                    <th style="min-width: 8rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-pago let-editing="editing" let-index="rowIndex">
                <tr
                    [formGroup]="pago"
                >
                    <td style="min-width: 2rem; text-align: center;">{{ index + 1 }}</td>
                    <td style="min-width: 8rem">
                        {{ pago.value.tipo.name }}
                    </td>
                    <td
                        style="min-width: 3rem"
                        [pEditableColumn]="pago.value.monto" pEditableColumnField="monto">
                        <p-cellEditor>
                            <ng-template #input>
                                <p-inputnumber inputId="monto" formControlName="monto" mode="decimal" [minFractionDigits]="2" />
                                @if(pago.value.monto <= 0) {
                                <small class="text-red">monto debe ser mayor a 0</small>
                                }
                            </ng-template>
                            <ng-template #output>
                                {{ pago.value.monto }}
                                @if(pago.value.monto <= 0) {
                                    <small class="text-red">valor invalido</small>
                                }
                            </ng-template>
                        </p-cellEditor>
                    </td>
                    <td style="min-width: 4rem;">
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="removeDetallePago(index)" />
                    </td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr style="text-align: center;">
                    <td colspan="4">No hay pagos registrados.</td>
                </tr>
            </ng-template>
        </p-table>
    </div>

    <div class="card flex flex-col gap-4 mb-0">
        <div class="flex flex-wrap gap-2">
            <p-button label="Guardar" [disabled]="ventaForm.invalid" type="submit" />
            <p-button label="Preventa" [disabled]="isPreventaDisable()" severity="info" (onClick)="submitForm()" />
            <p-button label="Cancelar" severity="secondary" [routerLink]="'/venta'" />
        </div>
    </div>
     <p-toast />
</form>
    `,
    styles: `
        .mt-1 {
            margin-bottom: 1.5rem;
        }
        .mb-0 {
            margin-bottom: 0;
        }
        .pl-1 {
            padding-left: 1.5rem;
        }
        .flex-cc {
            align-items:center;
        }
        .flex-rc {
            justify-content: center;
        }
        .text-red {
            color: red;
            display: block;
        }
        .active {
            display: block;
        }
        .noactive {
            display: none;
        }
    `,
    providers: [ProductService, ClienteService, VentaService, MovimientoService, MessageService]
})
export class AddVentaPage implements OnInit {
    private productService = inject(ProductService);
    private clienteService = inject(ClienteService);
    private ventaService = inject(VentaService);
    private movimientoService = inject(MovimientoService);
    private formBuilder = inject(FormBuilder);
    private messageService = inject(MessageService);
    private readonly cdr = inject(ChangeDetectorRef);

    public ventaForm!: FormGroup;
    public clienteOptions!: ClienteOption[];
    public productoPresentacionOptions!: PresentacionOuput[];
    public statuses!: Map<string, string>;

    expandedRows: any = {};

    public metodoValues = [
        { name: 'Efectivo', code: 'EF' },
        { name: 'QR/TRANSFERENCIA', code: 'QR_TR' },
        { name: 'TARJETA', code: 'TAR' }
    ];
    public metodo: any = null;

    // MenuBar BreadcrumbModule
    public breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    public breadcrumbItems = [{ label: 'Ventas' }, { label: 'New Venta' }];

    constructor() {
        this.buildFormAndInitValues();
    }

    ngOnInit() {
        this.loadDataToVentaForm();
    }

    submitForm(evt?: SubmitEvent) {
        console.log(this.ventaForm);
        if (this.ventaForm.valid || !this.isPreventaDisable()) {
            this.cargarDatosToVentaForm(evt);
            console.log(JSON.stringify(this.ventaForm.value));
            this.saveVentaForm();
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Mensaje',
                detail: 'Venta Formulario es invalido',
                life: 3000
            });
        }
    }

    private cargarDatosToVentaForm(evt?: SubmitEvent) {
        const estado = evt ? 'VENTA' : 'PREVENTA';
        const clienteSelected = this.ventaForm.get('clienteId')?.value;

        this.ventaForm.get('estado')?.setValue(estado);
        this.ventaForm.get('clienteId')?.setValue(clienteSelected.id);
    }

    private saveVentaForm(): void {
        this.ventaService.saveVenta(this.ventaForm.value)
                .subscribe({
                    next: (resp) => {
                        console.log(resp);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Mensaje',
                            detail: 'Venta registrado correctamente',
                            life: 3000
                        });
                    },
                    error: (e) => {
                        console.error(e);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Mensaje',
                            detail: 'Error al guardar venta ' + e.error?.message,
                            life: 3000
                        });
                    },
                    complete: () => console.info('complete')
                });
    }

    addDetalle(presentacionProducto: PresentacionOuput) {
        console.log('addDetalle ', presentacionProducto);

        if (presentacionProducto.id == 0) return;
        const findIndexInDetalle = this.findIndexDelProductoEnDetalle(presentacionProducto);
        if (findIndexInDetalle < 0) {

            this.movimientoService.getStockByProducto(
                presentacionProducto.productoId, presentacionProducto.id)
                .subscribe({
                    next: (resp) => {
                        console.log('resp', resp);
                        const stocks = resp.data;
                        const newDetalle = this.crearDetalle(presentacionProducto, this.crearFormArrayStock(stocks));
                        newDetalle.valueChanges.subscribe((presentacion) => {
                            const total = presentacion.precioVenta * presentacion.cantidad;
                            newDetalle.get('subtotal')?.setValue(total, { emitEvent: false });
                        });
                        this.mostrarMsg('success', 'Se trajo Stock del producto')

                        console.log('new Detalle with stock ', newDetalle);

                        this.detalle.push(newDetalle);
                        this.ventaForm.get('hasPay')?.enable();
                    },
                    error: (err) => {
                        console.log(err);
                    }
                })


        } else {
            this.mostrarMsg('info', 'El producto ' + presentacionProducto.presentacion
                + ' esta en la fila nro ' + (findIndexInDetalle + 1));
        }
    }

    isPreventaDisable() {
        return this.detalle.invalid || this.detalle.length === 0 || this.hasPay;
    }

    addDetallePago() {
        const tipoPago = this.pagos.get('tipo')?.value;
        const montoPago = this.pagos.get('monto')?.value;
        const findIndexDetallePago = this.detallePagos.controls
            .findIndex(ele => ele.value.tipo.name === tipoPago.name);

        if (findIndexDetallePago < 0) {
            const newDetalle = this.crearDetallePago(tipoPago, montoPago);
            this.detallePagos.push(newDetalle);
        }
    }

    editPresentacionProducto(index: number, presentacionId: number) {
        const presentacionProd = this.productoPresentacionOptions.find(p => p.id === presentacionId);
        if (!presentacionProd) return;

        const detalle = this.detalle.at(index);

        detalle.patchValue({
            presentacionId: presentacionProd.id,
            productoId: presentacionProd.productoId,
            precioVenta: presentacionProd.precioVenta,
        });
    }

    removeDetalle(index: number) {
        this.detalle.removeAt(index);
        if (this.detalle.length === 0) {
            this.ventaForm.get('hasPay')?.setValue(false);
            this.ventaForm.get('hasPay')?.disable();
        }
    }

    removeDetallePago(index: number) {
        this.detallePagos.removeAt(index);
    }

    private buildFormAndInitValues(): void {
        this.clienteOptions = [ClienteOption.getInstance()];
        this.productoPresentacionOptions = [
            PresentacionOuput.getInstance()
        ];
        this.ventaForm = this.crearVentaForm();
        // change detection para cambios en Forms
        this.ventaForm.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.cdr.markForCheck());
    }

    private crearVentaForm(): FormGroup {
        return this.formBuilder.group({
            clienteId: [null, Validators.required],
            codigo: ['V-12', Validators.required],
            glosa: [''],
            estado: [''],
            detalle: this.formBuilder.array([]),
            total: [0, [Validators.required, Validators.min(1)]],
            // Pagos
            hasPay: [{ value: false, disabled: true }, Validators.required],
            pagos: this.formBuilder.group({
                tipo: [''],
                monto: [''],
                detallePago: this.formBuilder.array([]),
                totalPago: [0, [Validators.required, Validators.min(1)]]
            }),
        });
    }

    private loadDataToVentaForm(): void {
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
                const prodPresentacion = resp.data.content;
                this.productoPresentacionOptions.push(...prodPresentacion);
            });
        this.statuses = new Map<string, string>();
        this.statuses.set('success', 'INSTOCK');
        this.statuses.set('warn', 'LOWSTOCK');
        this.statuses.set('danger', 'OUTOFSTOCK');
        this.statuses.set('info', 'S/N');

        this.ventaService.getLastVenta()
            .subscribe(resp => {
                const ventas = resp.data.content;

                console.log('ultima venta ', resp);
                if (ventas && ventas.length) {
                    const codigoVenta = 'V-' + (ventas[0].id + 1);
                    this.ventaForm.get('codigo')?.setValue(codigoVenta);
                }

            });
    }

    private crearDetalle(presentacionProducto?: PresentacionOuput, stocks?: FormArray,): FormGroup {
        return this.formBuilder.group({
            presentacionId: [presentacionProducto?.id || null, Validators.required],
            nombre: [presentacionProducto?.presentacion || ''],
            productoId: [presentacionProducto?.productoId || null, Validators.required],
            precioVenta: [presentacionProducto?.precioVenta || 0, [Validators.required, Validators.min(1)]],
            // Venta siempre realizar en cantidad minima (cantidad base)
            cantidad: [1, [Validators.required, Validators.min(1)]],
            // cantidadBase: [1, [Validators.required, Validators.min(1)]],
            subtotal: [presentacionProducto ? presentacionProducto.precioVenta : 0, [Validators.required, Validators.min(1)]],
            stocks: stocks,
            stockMinimo: [presentacionProducto?.cantidadMinimoStock || 1],
            stockDisponible: [presentacionProducto?.cantidadDisponibleStock || 0]
        });
    }

    private crearFormArrayStock(stocks: StockByProductoOutput[]): FormArray {
        console.log('crearFormArraysStocks ', stocks);
        if (stocks.length == 0) {
            return this.formBuilder.array([]);
        }
        const stocksFormGroup = stocks.map(stock => this.crearStock(stock));
        return this.formBuilder.array(stocksFormGroup);
    }

    private crearStock(stock: StockByProductoOutput): FormGroup {
        return this.formBuilder.group({
            id: [stock?.id || null],
            lote: [stock?.lote || ''],
            expiracion: [stock?.expiracion || ''],
            seccion: [stock?.seccion || ''],
            estante: [stock?.estante || ''],
            nivel: [stock?.nivel || ''],
            cantidad: [stock?.cantidad || 0],
        });
    }

    onRowExpand(event: TableRowExpandEvent) {
        console.log('event: ', event);
        this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data, life: 3000 });
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        console.log('event: ', event);
        this.messageService.add({
            severity: 'success',
            summary: 'Product Collapsed',
            detail: event.data.name,
            life: 3000
        });
    }

    private crearDetallePago(tipo: string, monto: number): FormGroup {
        return this.formBuilder.group({
            tipo: [tipo || '', Validators.required],
            monto: [monto || 0, [Validators.required, Validators.min(1)]],
        });
    }

    private findIndexDelProductoEnDetalle(presentacionProducto: PresentacionOuput): number {
        return this.detalle.controls.findIndex(prod =>
            prod.value.presentacionId === presentacionProducto.id &&
            prod.value.productoId === presentacionProducto?.productoId);
    }

    //GETTERs
    get detalle(): FormArray { return this.ventaForm.get('detalle') as FormArray; }

    get pagos(): FormGroup { return this.ventaForm.get('pagos') as FormGroup; }

    get detallePagos(): FormArray { return this.pagos.get('detallePago') as FormArray; }

    get hasPay(): boolean { return this.ventaForm.get('hasPay')?.value || false; }

    get total(): number {
        const total = this.detalle.controls
            .reduce((acc, d) => acc + d.value.subtotal, 0);
        this.ventaForm.patchValue({ total });
        return total;
    }

    get totalPago(): number {
        const totalPago = this.detallePagos.controls
            .reduce((acc, d) => acc + d.value.monto, 0);
        this.ventaForm.patchValue({
            pagos: {
                totalPago: totalPago
            }
        });
        return totalPago;
    }

    private mostrarMsg(tipo: string, detail: string) {
        this.messageService.add({
            severity: tipo,
            summary: 'Mensaje',
            detail: detail,
            life: 3000
        });
    }

    getSeverity(producto: any) {
        // hace llamada innecesarias desd el Select produccto
        // console.log('getSeverity: ', producto);

        const minimoStock = producto.stockMinimo ? producto.stockMinimo : 0;
        const disponibleStock = producto.stockDisponible ?
            producto.stockDisponible : 0;
        if (disponibleStock > minimoStock) {
            return 'success';
        } else if (disponibleStock == 0) {
            return 'danger';
        } else if (disponibleStock <= minimoStock) {
            return 'warn';
        }
        return 'info';
    }

}
