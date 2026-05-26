import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { ProductService } from "../../../producto/presentacion/services/producto.service";
import { ClienteService } from "../../services/cliente.service";
import { VentaService } from "../../services/venta.service";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { SelectModule } from 'primeng/select';
import { CommonModule } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from "primeng/table";
import { StatusStock } from "../../../../shared/enums/status-stock.enum";
import { TagModule } from "primeng/tag";
import { InputNumberModule } from "primeng/inputnumber";
import { ClienteOption } from "../../cliente/dto/cliente.option";
import { PresentacionOuput } from "../../../producto/presentacion/dto/presentacion.output";
import { VentaOutput } from "../dto/venta.output";
import { DetalleVenta } from "../dto/venta.input";
import { StockByProductoOutput } from "../../../inventario/stock/dtos/stock-by-producto.output";
import { RippleModule } from "primeng/ripple";
import { PagoOutput } from "../../pago/dto/pago.output";
import { StockService } from "../../../inventario/stock/service/stock.service";
import { ClienteOutput } from "../../cliente/dto/cliente.output";
import { CommonResponse } from "../../cliente/dto/interface";
import { ToastService } from "../../../../core/services/toast.service";


@Component({
    imports: [
        ReactiveFormsModule,
        RouterModule,
        ButtonModule,
        BreadcrumbModule,
        SelectModule,
        CommonModule,
        ToggleSwitchModule,
        TableModule,
        TagModule,
        InputNumberModule,
        RippleModule
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-1">
        <div class="font-bold text-xl mb-4">
            {{ (editMode)? 'Editacion de Venta' : 'Mostrar Venta en Detalle' }}
        </div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
    </div>
    <form [formGroup]="ventaForm" (submit)="submitForm()" class="card">
        <div class="font-semibold text-xl mb-4">
            {{ (editMode)? 'Editar' : 'Mostrar' }} Orden Venta {{ ventaForm.value.codigo}}
        </div>
        <div class="flex flex-wrap gap-6">
            <div class="flex flex-col grow-m basis-0 gap-2">
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
        </div>
        <div class="flex flex-col md:flex-row gap-6">
            <div class="flex flex-wrap gap-2 w-full">
                <label class="font-semibold" for="producto">Productos:</label>
                @if( editMode && estado == 'PREVENTA' ) {
                <p-select
                    id="producto"
                    filter="true"
                    (onChange)="addDetalle($event.value)"
                    [options]="productoPresentacionOptions"
                    optionLabel="presentacion"
                    placeholder="Seleccione Producto" class="w-full">
                    <ng-template #selectedItem let-productoPre>
                        <div class="flex items-center gap-2">
                            <div>{{ productoPre.marca }} - {{ productoPre.presentacion }} - Disponible: {{ productoPre.cantidadDisponibleStock}}</div>
                        </div>
                    </ng-template>
                    <ng-template let-producto #item>
                        <div class="flex items-center gap-2">
                            <div>{{ producto.marca }} - {{ producto.presentacion }} - Disponible: {{producto.cantidadDisponibleStock}}</div>
                        </div>
                    </ng-template>
                </p-select>
                } @else {
                <p-select
                    id="producto"
                    filter="true"
                    [disabled]="isDisableAccion()"
                    [options]="productoPresentacionOptions"
                    optionLabel="presentacion"
                    placeholder="Seleccione Producto" class="w-full">
                    <ng-template #selectedItem let-productoPre>
                        <div class="flex items-center gap-2">
                            <div>{{ productoPre.marca }} - {{ productoPre.presentacion }} - Disponible: {{ productoPre.cantidadDisponibleStock}}</div>
                        </div>
                    </ng-template>
                    <ng-template let-producto #item>
                        <div class="flex items-center gap-2">
                            <div>{{ producto.marca }} - {{ producto.presentacion }} - Disponible: {{producto.cantidadDisponibleStock}}</div>
                        </div>
                    </ng-template>
                </p-select>
                }

            </div>
            <div class="flex gap-2 w-full flex-cc">
                <label for="pago">Pagos: </label>
                <p-toggleswitch  formControlName="hasPay" />
            </div>
        </div>
        <p-table
            #dt
            [value]="detalle.controls"
            [tableStyle]="{ 'min-width': '65rem' }"
            [rowHover]="false"
            dataKey="id"
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
                        <p-tag [value]="product.value.estadoStock" [severity]="getStockStatusClass(product.value.estadoStock)" />
                    </td>
                    <td
                        style="min-width: 3rem"
                        [pEditableColumn]="product.value.precio"
                        pEditableColumnField="precio">
                        <p-cellEditor>
                            <ng-template #input>
                                <p-inputnumber inputId="precio" formControlName="precio" mode="decimal" [minFractionDigits]="2" />
                                @if(product.value.precio <= 0) {
                                <small class="text-red">precio debe ser mayor a 0</small>
                                }
                            </ng-template>
                            <ng-template #output>
                                {{ product.value.precio | currency: 'Bs ' }}
                                @if(product.value.precio <= 0) {
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
                        @if(product.value.seControlaStock) {
                        <p-button
                            [id]="product.value.presentacionId"
                            type="button"
                            pRipple
                            [pRowToggler]="product.value"
                            [text]="true"
                            severity="secondary"
                            [rounded]="true"
                            [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
                        />
                        }
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" [disabled]="isDisableAccion()" (click)="removeDetalle(index)" />
                    </td>
                </tr>

            </ng-template>
            <ng-template #expandedrow let-product>
                @if(product.value.seControlaStock) {
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
                }
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
        @if(hasPay) {
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
                    <p-inputnumber formControlName="monto" mode="decimal" [minFractionDigits]="2" inputId="monto" />
                </div>
                <div class="flex gap-2 w-full flex-cc">
                    <p-button label="Agregar" icon="pi pi-plus" [disabled]="isDisableAccion()" (onClick)="addDetallePago()" />
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
                            {{ pago.value.tipo }}
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
                            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" [disabled]="isDisableAccion()" (click)="removeDetallePago(index)" />
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
        }
        <div class="card flex flex-col gap-4 mb-0">
        <div class="flex flex-wrap gap-2">
            @if( editMode && estado == 'PREVENTA') {
            <p-button label="Guardar" [disabled]="ventaForm.invalid" type="submit" />
            }
            <p-button label="Volver Atras" severity="info" [routerLink]="'/venta'" />
        </div>
    </div>



    </form>
    `,
    styles: `
        .flex-cc {
            align-items:center;
        }
        .grow-xs {
            flex-grow: 0.1;
        }
        .grow-s {
            flex-grow: 0.33;
        }
        .grow-m {
            flex-grow: 0.5;
        }
        .text-red {
            color: red;
            display: block;
        }
    `,
    providers: [ProductService, ClienteService, VentaService, StockService]
})
export class EditVerVentaPage implements OnInit {
    // Providers
    private productService = inject(ProductService);
    private clienteService = inject(ClienteService);
    private ventaService = inject(VentaService);
    private stockService = inject(StockService);
    private activatedRoute = inject(ActivatedRoute);
    private formBuilder = inject(FormBuilder);
    private toastService = inject(ToastService);
    private readonly cdr = inject(ChangeDetectorRef);
    private router = inject(Router);

    // Field Forms
    public ventaForm!: FormGroup;
    public editMode: boolean = false;
    public id!: number;

    clienteOptions!: ClienteOption[];
    public productoPresentacionOptions!: PresentacionOuput[];

    //PAGO
    public metodoValues = [
        { name: 'Efectivo', code: 'EF' },
        { name: 'QR/TRANSFERENCIA', code: 'QR_TR' },
        { name: 'TARJETA', code: 'TAR' }
    ];
    public metodo: any = null;

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Ventas'}, { label: 'Ver/ Editar Venta' }];

    constructor() {
        this.buildFormAndInitValues();
    }

    public ngOnInit(): void {
        this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        const url = this.activatedRoute.snapshot.routeConfig?.path;
        this.editMode =  url?.startsWith('edit/') || false;
        //console.log('editMode ', this.editMode , ' url: ', url);
        this.loadDataToVentaForm(this.id);
    }

    submitForm() {
        console.log(this.ventaForm);
        console.log(JSON.stringify(this.ventaForm.value));
        if (this.ventaForm.valid) {
            this.cargarDatosToVentaForm();
            console.log(JSON.stringify(this.ventaForm.value));
            this.saveVentaForm();
        } else {
            this.toastService.mostrarMsg('warn', 'Venta Formulario es invalido');
        }
    }

    private cargarDatosToVentaForm() {
        const clienteSelected = this.ventaForm.get('clienteId')?.value;
        this.ventaForm.get('estado')?.setValue('VENTA');
        this.ventaForm.get('clienteId')?.setValue(clienteSelected.id);
    }

    private saveVentaForm(): void {
        this.ventaService.update(this.ventaForm.value, this.id)
            .subscribe({
                next: (resp) => {
                    console.log(resp);
                    this.toastService.mostrarMsg('success', this.ventaForm.get('estado')?.value + ' registrado correctamente');
                    this.navigateToListVentas();
                },
                error: (e) => this.toastService.mostrarMsg(
                    'error', 'Error al guardar venta ' + e.error?.message),
            });
    }
    isDisableAccion() {
        return !this.editMode || this.estado == 'VENTA';
    }

    navigateToListVentas(): void {
        setTimeout(() =>
            this.router.navigate(['/venta']), 3000);
        ;
    }

    private getVenta(id: number): void {
        this.ventaService.get(id).subscribe({
            next: (resp: CommonResponse<VentaOutput>) => {
                console.log(resp);

                this.setValuesVentaForm(resp.data);
            },
            error: (err: any) => console.error(err)
        });
    }

    private buildFormAndInitValues(): void {
        this.clienteOptions = [ClienteOption.getInstance()];
        this.productoPresentacionOptions = [
            PresentacionOuput.getInstance()
        ];
        this.ventaForm = this.crearVentaForm();
        this.ventaForm.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.cdr.markForCheck());
        // this.ventaForm.statusChanges.subscribe(() => {
        //     this.cdr.markForCheck();
        // });
        this.detallePagos.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.cdr.markForCheck());
    }

    private setValuesVentaForm(venta: VentaOutput) {
        const cliente = this.clienteOptions.find(cliente => cliente.id === venta.clienteId);
        const pagos = venta.pagos || [];
        this.ventaForm.patchValue({
            id: venta.id,
            clienteId: cliente,
            codigo: venta.codigo,
            glosa: venta.glosa,
            estado: venta.estado,
            total: venta.total,
            hasPay: pagos.length > 0,
        });
        this.setValuesVentaDetalle(venta.detalle || []);
        this.setValuesVentaPagos(pagos);
    }

    private setValuesVentaDetalle(detalles: DetalleVenta[]) {

        detalles.forEach(prod => {
            const producto = this.productoPresentacionOptions
                .find(ele => ele.id == prod.presentacionId) || PresentacionOuput.getInstance();

            producto.precioVenta = prod.precio;
            console.log('setValuesVentaDetalle detalle', prod);
            console.log('setValuesVentaDetalle producto', producto);
            this.addDetalle(producto, prod.cantidad);
        });
    }

    private setValuesVentaPagos(pagos: PagoOutput[]) {
        pagos.forEach(pago => {
            const newDetallePago = this.crearDetallePago(pago.tipoPago, pago.total);
            this.detallePagos.push(newDetallePago);
        });
    }

    addDetallePago() {
        const tipoPago = this.pagos.get('tipo')?.value?.name;
        const montoPago = this.pagos.get('monto')?.value;
        if (this.esValidoDetallePago(tipoPago, montoPago)) {
            const newDetalle = this.crearDetallePago(tipoPago, montoPago);
            this.detallePagos.push(newDetalle);
        }
    }

    private esValidoDetallePago(tipo: string, monto: number) {
        if (tipo == '' || !tipo) {
            this.toastService.mostrarMsg('info', 'El tipo pago no ingresado.');
            return false;
        }
        const findIndexDetallePago = this.detallePagos.controls
            .findIndex(ele => ele.value.tipo === tipo);
        if (findIndexDetallePago > -1) {
            this.toastService.mostrarMsg('info', 'El tipo pago ya esta registrado.');
            return false;
        }
        if (monto == 0 || monto > this.total) {
            this.toastService.mostrarMsg('info', 'El monto debe ser mayor a 0, \ny menor igual al total venta.');
            return false;
        }
        // console.log((this.totalPago + monto), typeof (this.totalPago + monto));

        if ((this.totalPago + monto) > this.total) {
            this.toastService.mostrarMsg('info', 'El monto debe ser igual al total venta.');
            return false;
        }
        return true;
    }

    private crearDetallePago(tipo: string, monto: number): FormGroup {
        return this.formBuilder.group({
            tipo: [tipo || '', Validators.required],
            monto: [monto || 0, [Validators.required, Validators.min(1)]],
        });
    }

    private crearVentaForm(): FormGroup {
        return this.formBuilder.group({
            id: [null, Validators.required],
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
                monto: [0],
                detallePago: this.formBuilder.array([]),
                totalPago: [0, [Validators.required, Validators.min(1)]]
            }),
        });
    }

    addDetalle(presentacionProducto: PresentacionOuput, cantidad?: number) {

        // if (this.esValidoProducto(presentacionProducto)) {
        this.stockService.getStockByProducto(presentacionProducto.id)
            .subscribe({
                next: (resp) => {
                    const stocks = resp.data.stocks || [];
                    const newDetalle = this.crearDetalle(presentacionProducto, this.crearFormArrayStock(stocks), cantidad);
                    newDetalle.valueChanges.subscribe((presentacion) => {
                        console.log("add detalle ", presentacion);
                        // const total = presentacion.precio * presentacion.cantidad;
                        const total = Math.ceil((presentacion.precio * presentacion.cantidad) * 100) / 100;
                        newDetalle.get('subtotal')?.setValue(total, { emitEvent: false });
                    });
                    console.log('new Detalle with stock ');
                    this.detalle.push(newDetalle);
                    this.ventaForm.get('hasPay')?.enable();
                },
                error: (err) => console.error(err)
            });
        // }
    }

    private esValidoProducto(productoPre: PresentacionOuput): boolean {
        if (!this.editMode) return true;
        console.log('se valida producto');

        if (productoPre && productoPre.id == 0) return false;
        const findIndexInDetalle = this.findIndexDelProductoEnDetalle(productoPre);
        if (findIndexInDetalle > -1) {
            this.toastService.mostrarMsg('info', 'El producto ' + productoPre.presentacion
                + ' esta en la fila nro ' + (findIndexInDetalle + 1));
            return false;
        }
        if (productoPre.estadoStock === 'AGOTADO') {
            this.toastService.mostrarMsg(
                'warn',
                'El producto ' + productoPre.presentacion + ' esta AGOTADO.'
            );
            return false;
        }
        return true;
    }

    private crearDetalle(presentacionProducto?: PresentacionOuput, stocks?: FormArray, cantidad: number = 1): FormGroup {
        console.log('** presentacion', presentacionProducto);

        const subtotal = (presentacionProducto?.precioVenta || 0) * cantidad;
        return this.formBuilder.group({
            presentacionId: [presentacionProducto?.id || null, Validators.required],
            nombre: [presentacionProducto?.presentacion || ''],
            productoId: [presentacionProducto?.productoId || null, Validators.required],
            precio: [presentacionProducto?.precioVenta || 0, [Validators.required, Validators.min(1)]],
            // Venta siempre realizar en cantidad minima (cantidad base)
            cantidad: [cantidad, [Validators.required, Validators.min(1)]],
            subtotal: [subtotal, [Validators.required, Validators.min(1)]],
            stocks: stocks,
            estadoStock: [presentacionProducto?.estadoStock || ''],
            seControlaStock: [presentacionProducto?.seControlaStock || false],
        });
    }

    private crearFormArrayStock(stocks: StockByProductoOutput[]): FormArray {
        //console.log('crearFormArraysStocks ', stocks);
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

    private findIndexDelProductoEnDetalle(presentacionProducto: PresentacionOuput): number {
        return this.detalle.controls.findIndex(prod =>
            prod.value.presentacionId === presentacionProducto.id &&
            prod.value.productoId === presentacionProducto?.productoId);
    }

    private loadDataToVentaForm(ventaId: number) {

        this.clienteService.list()
            .subscribe((resp) => {
                const clientes = resp.data.content as ClienteOutput[];
                this.clienteOptions.push(
                    ...clientes.map(cliente =>
                        new ClienteOption(cliente.id,
                            cliente.nombre
                        )
                    )
                )
            });

        this.productService.list()
            .subscribe(resp => {
                const prodPresentacion = resp.data.content;
                this.productoPresentacionOptions.push(...prodPresentacion);
            });
        setTimeout(() => { this.getVenta(ventaId) }, 500);
    }

    removeDetalle(index: number) {
        this.detalle.removeAt(index);
        if (this.detalle.length === 0) {
            // se deshabilita los pagos (no hay detalles productos)
            this.ventaForm.get('hasPay')?.setValue(false);
            this.ventaForm.get('hasPay')?.disable();
        }
    }

    removeDetallePago(index: number) {
        this.detallePagos.removeAt(index);
    }

    // Getters
    get hasPay(): boolean { return this.ventaForm.get('hasPay')?.value || false; }
    get detalle(): FormArray { return this.ventaForm.get('detalle') as FormArray; }
    get estado(): string { return this.ventaForm.get('estado')?.value || ''; }



    get total(): number {
        const total = this.detalle.controls
            .reduce((acc, d) => acc + d.value.subtotal, 0);
        this.ventaForm.patchValue({ total });
        return total;
    }

    get pagos(): FormGroup { return this.ventaForm.get('pagos') as FormGroup; }
    get detallePagos(): FormArray { return this.pagos.get('detallePago') as FormArray; }

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

    getStockStatusClass(estadoStock: StatusStock) {
        switch (estadoStock) {
            case StatusStock.HAY_STOCK:
                return 'success';
            case StatusStock.POCO_STOCK:
                return 'warn';
            case StatusStock.AGOTADO:
                return 'danger';
            default:
                return 'info';
        }
    }
}
