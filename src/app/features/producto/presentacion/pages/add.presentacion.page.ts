import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BreadcrumbModule } from "primeng/breadcrumb";
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from "primeng/inputtext";
import { MarcaService } from "../../marca/service/marca.service";
import { MarcaOption } from "../../marca/dto/marca.option";
import { ProductoBaseService } from "../../base/service/producto.base.service";
import { ProductoBaseOption } from "../../base/dto/producto.base.option";
import { SelectModule } from "primeng/select";
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { TextareaModule } from 'primeng/textarea';
import { UnidadMedidaService } from "../../unidad-medida/service/unidad-medida.service";
import { UnidadMedidaOption } from "../../unidad-medida/dto/unidad-medida.option";
import { ProductService } from "../../services/producto.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { InputNumberModule } from "primeng/inputnumber";
import { TableModule } from "primeng/table";
import { UbicacionStockService } from "../../../inventario/ubicacion-stock/service/ubicacion-stock.service";
import { UbicacionStockOption } from "../../../inventario/ubicacion-stock/dtos/ubicacion-stock.option";
import { MovimientoService } from "../../../inventario/movimiento/service/movimiento.service";
import { catchError, of, switchMap, tap } from "rxjs";
import { DatePipe } from "@angular/common";

@Component({
    imports: [
        ReactiveFormsModule,
        RouterModule,
        BreadcrumbModule,
        TabsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        SelectModule,
        ToggleSwitchModule,
        TextareaModule,
        ToastModule,
        DatePickerModule,
        TableModule,
        DatePipe
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-0">
        <div class="font-bold text-xl mb-4">Add Productos Presentacion</div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
    </div>
    <form [formGroup]="productoPresentacionForm" (submit)="submit()" class="card">
        <div class="font-bold text-xl mb-4">Formulario Producto Presentacion</div>

            <p-tabs value="0">
                <p-tablist>
                    <p-tab value="0">Presentacion (*)</p-tab>
                    <p-tab value="1">Inv. Existencia</p-tab>
                    <p-tab value="2" disabled>Proveedor</p-tab>
                </p-tablist>

                <p-tabpanels>
                    <p-tabpanel value="0">
                        <div class="card flex flex-col gap-4 margin-lr-4">
                            {{nombreProducto}}
                            <div class="flex flex-wrap gap-6">
                                <div class="flex flex-col grow-m basis-0 gap-2">
                                    <label for="marca" class="font-semibold">Marca(*):</label>
                                    <p-select
                                    formControlName="marcaId"
                                    [options]="marcaOptions"
                                    optionLabel="nombre"
                                    filter="true"
                                    size="large"
                                    placeholder="Seleccione Marca" />
                                    @if( productoPresentacionForm.get('marcaId')?.invalid &&
                                        (productoPresentacionForm.get('marcaId')?.touched ||
                                            productoPresentacionForm.get('marcaId')?.dirty)) {
                                        <small class="text-red">Marca no debe ser vacio.</small>
                                    }
                                </div>
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="base" class="font-semibold">Producto Base(*):</label>
                                    <p-select
                                    formControlName="productoId"
                                    [options]="productoBaseOption"
                                    optionLabel="nombre"
                                    filter="true"
                                    size="large"
                                    placeholder="Seleccionar Producto Base" />
                                    @if( productoPresentacionForm.get('productoId')?.invalid &&
                                        (productoPresentacionForm.get('productoId')?.touched ||
                                            productoPresentacionForm.get('productoId')?.dirty)) {
                                        <small class="text-red">Producto no debe ser vacio.</small>
                                    }
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-6">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="codigo" class="font-semibold">Presentacion(*):</label>
                                    <input pInputText id="codigo" formControlName="nombre" type="text" />
                                    @if( productoPresentacionForm.get('nombre')?.invalid &&
                                        (productoPresentacionForm.get('nombre')?.touched ||
                                            productoPresentacionForm.get('nombre')?.dirty)) {
                                        <small class="text-red">Presentacion no debe ser vacio.</small>
                                    }
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-6">
                                <div class="flex flex-col grow-m basis-0 gap-2">
                                    <label for="unidad" class="font-semibold">Unidad Medida de venta(*):</label>
                                    <p-select
                                        formControlName="unidadMedidaId"
                                        [options]="unidadMedidaOption"
                                        optionLabel="nombre"
                                        placeholder="Seleccione Unidad Medida" />
                                    @if( productoPresentacionForm.get('unidadMedidaId')?.invalid &&
                                        (productoPresentacionForm.get('unidadMedidaId')?.touched ||
                                            productoPresentacionForm.get('unidadMedidaId')?.dirty)) {
                                        <small class="text-red">Unidad Medida no debe ser vacio.</small>
                                    }
                                </div>
                                <div class="flex flex-col gap-2 flex-cc">
                                    <label for="categoria" class="font-semibold">Es unidad Minima:</label>
                                    <p-toggleswitch formControlName="esUnidadMinima" />
                                </div>
                                <div class="flex flex-col basis-0 gap-2 ">
                                    <label for="factor_conver" class="font-semibold">Factor de conversion:</label>
                                    <p-inputnumber formControlName="factorConversion" inputId="factor_conver" />
                                </div>

                            </div>
                            <div class="flex flex-wrap gap-6">
                                <div class="flex flex-col grow-s gap-2">
                                    <label for="precio_un" class="font-semibold">Precio Unitario:</label>
                                    <p-inputnumber formControlName="precioUnitario" mode="decimal" [minFractionDigits]="2" inputId="precio_un" />
                                </div>

                                <div class="flex flex-col grow-s gap-2">
                                    <label for="precio_ve" class="font-semibold">Precio Venta(*):</label>
                                    <p-inputnumber formControlName="precioVenta" mode="decimal" [minFractionDigits]="2" inputId="precio_ve" />
                                    @if( productoPresentacionForm.get('precioVenta')?.invalid &&
                                        (productoPresentacionForm.get('precioVenta')?.touched ||
                                            productoPresentacionForm.get('precioVenta')?.dirty)) {
                                        <small class="text-red">Precio Venta no debe ser cero o vacio.</small>
                                    }
                                </div>
                                <div class="flex flex-col grow gap-2">
                                    <label for="cant_existencia" class="font-semibold">Existencia Disponible:</label>
                                    <p-inputnumber mode="decimal" formControlName="cantidadDisponibleStock"
                                        inputId="cant_existencia" (onInput)="onCambioExistenciaDisponibleStock($event.value)" />
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="concepto" class="font-semibold">Principios Activos:</label>
                                <textarea rows="4" cols="30" formControlName="concepto" pTextarea></textarea>
                            </div>

                        </div>
                    </p-tabpanel>
                    <p-tabpanel value="1">
                        <div formGroupName="movimientoInventario" class="card flex flex-col gap-4 margin-lr-4">
                            <div class="flex flex-wrap gap-6">
                                <div class="flex flex-col grow-m basis-0 gap-2">
                                    <label for="marca" class="font-semibold">Ubicacion Stock:</label>
                                    <p-select
                                    formControlName="ubicacionStockId"
                                    [options]="ubicacionStockOption"
                                    optionLabel="nombre"
                                    placeholder="Seleccione Ubicacion" />
                                </div>
                                <div class="flex flex-col grow-xs gap-2">
                                    <label for="stock_minimo" class="font-semibold">Stock minimo:</label>
                                    <p-inputnumber inputId="stock_minimo" (onInput)="onCambioCantidadMinimoStock($event.value)"/>

                                </div>
                                <div class="flex flex-col grow-xs gap-2">
                                    <label for="dia_venc" class="font-semibold">Alarma dia antes Vencimiento:</label>
                                    <p-inputnumber inputId="dia_venc" (onInput)="onCambioDiasAntesExpiracion($event.value)"/>
                                </div>
                                <div class="flex flex-col grow-xs gap-2">
                                    <label for="cantidad_exist" class="font-semibold">Existencia Disponible:</label>
                                    <p-inputnumber formControlName="cantidadDisponibleStock"
                                        inputId="cantidad_exist" (onInput)="onCambioExistenciaDisponibleStock($event.value)"/>
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-6">
                                <div class="flex flex-col grow-s gap-2">
                                    <label for="lote" class="font-semibold">Lote:</label>
                                    <input pInputText id="lote" formControlName="lote" type="text" />
                                </div>
                                <div class="flex flex-col grow-s gap-2">
                                    <label for="precio_un" class="font-semibold">Fecha Vencimiento:</label>
                                    <p-datepicker formControlName="fechaExpiracion" dateFormat="dd/mm/yy" />
                                </div>
                                <div class="flex flex-col grow-s gap-2">
                                    <label for="cantidad" class="font-semibold">Cantidad:</label>
                                    <p-inputnumber inputId="cantidad" formControlName="cantidadStockBase" />
                                </div>
                                <div class="flex flex-col grow-s gap-2 flex-re">
                                    <p-button label="+ add" type="button"
                                        (onClick)="addDetalleMovimiento()"
                                        [disabled]="!esValidoCantidadDisponibleStock()"/>
                                </div>
                            </div>
                            <p-table
                                #dt
                                [value]="detalleMovimiento.controls"
                                [tableStyle]="{ 'min-width': '50rem' }"
                                [rowHover]="true"
                                dataKey="id"
                                [showCurrentPageReport]="true"
                                >
                                <ng-template #header>
                                    <tr>
                                        <th style="min-width: 2rem; text-align: center;">#</th>
                                        <th style="min-width:8rem">
                                            Lote
                                        </th>
                                        <th style="min-width:8rem">
                                            Fecha Vencimiento
                                        </th>
                                        <th style="min-width:5rem">
                                            Cantidad
                                        </th>
                                        <th style="min-width: 8rem"></th>
                                    </tr>
                                </ng-template>
                                <ng-template #body let-stock let-editing="editing" let-index="rowIndex">
                                    <tr
                                        [formGroup]="stock"
                                    >
                                        <td style="min-width: 2rem; text-align: center;">{{ index + 1 }}</td>
                                        <td style="min-width: 8rem">
                                            {{ stock.value.lote }}
                                        </td>
                                        <td
                                            style="min-width: 3rem">
                                            {{ stock.value.fechaExpiracion | date: 'dd/MM/yyyy' }}
                                        </td>
                                        <td
                                            style="min-width: 3rem">
                                            {{ stock.value.cantidadStockBase }}
                                        </td>
                                        <td style="min-width: 4rem;">
                                            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="removeDetalleStock(index)" />
                                        </td>
                                    </tr>
                                </ng-template>

                            </p-table>

                        </div>
                    </p-tabpanel>
                    <p-tabpanel value="2">
                        <div class="card flex flex-col gap-4 margin-lr-4">
                            <div class="flex flex-col gap-2">
                                <label for="lote" class="font-semibold">Proveedor: </label>
                                <input pInputText id="lote" type="text" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="precio_un" class="font-semibold">Prioridad Solicitud:</label>
                                <input pInputText id="precio_un" type="text" fluid  />
                            </div>
                        </div>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>

        <div class="card flex flex-col gap-4 margin-lr-4">
            <div class="flex flex-wrap gap-2">
                <p-button label="Guardar" [disabled]="productoPresentacionForm.invalid" type="submit"/>
                <p-button label="Cancelar" severity="secondary" [routerLink]="'/producto/presentacion'" />
            </div>
        </div>
        <p-toast />
    </form>`,
    styles: `
        .mt-1 {
            margin-bottom: 1.5rem;
        }
        .mb-0 {
            margin-bottom: 0;
        }
        .pb-0 {
            padding-bottom: 0;
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
        .flex-re {
            justify-content: end;
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
        .margin-lr-4 {
            margin: .5rem 4rem;
        }
        .n-border {
            border: none;
        }
        .n-border-r {
            border-radius: 0;
        }
        .tabs-center {
            justify-content: space-evenly
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

        @media (max-width: 670px) {
            .margin-lr-4 {
                margin: 0;
                padding: 0.3rem;
            }
            .grow-xs {
                flex-grow: 1;
            }
            .grow-s {
                flex-grow: 1;
            }
            .grow-m {
                flex-grow: 1;
            }
        }
    `,
    providers: [
        MarcaService,
        ProductoBaseService,
        ProductService,
        UnidadMedidaService,
        MovimientoService,
        MessageService,
        UbicacionStockService
    ]
})
export class AddPresentacionPage implements OnInit {

    private marcaService = inject(MarcaService);
    private productoBaseService = inject(ProductoBaseService);
    private productoPresentacionService = inject(ProductService);
    private movimientoService = inject(MovimientoService);
    private unidadMedidaService = inject(UnidadMedidaService);
    private ubicacionStockService = inject(UbicacionStockService);
    private formBuilder = inject(FormBuilder);
    private readonly cdr = inject(ChangeDetectorRef);
    private messageService = inject(MessageService);
    private router = inject(Router);

    productoPresentacionForm!: FormGroup;

    marcaOptions!: MarcaOption[];

    productoBaseOption!: ProductoBaseOption[];

    unidadMedidaOption!: UnidadMedidaOption[];

    ubicacionStockOption!: UbicacionStockOption[];

    checked: boolean = false;
    nombreProducto = 'Refrianex Dia Sabor a Miel';

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Producto' }, { label: 'New Prsentacion' }];

    constructor() {
        this.buildFormAndInitValues();
    }

    ngOnInit(): void {
        this.cargarDatosComboBoxs();
    }

    submit() {

        if (this.esValidoFormulario()) {

            // LimpiarForm para Enviar a Guardar()
            this.darFormatoToFormForGuardar();

            console.log(this.productoPresentacionForm.value);
            console.log(JSON.stringify(this.productoPresentacionForm.value));
            if (this.tieneDetalleMovimientoForm()) {
                this.savePresentacionConMovimientoInventario();
                console.log('tieneDetalleMovimientoForm guardar todo');
            } else {
                this.saveOnlyPresentacionForm();
                console.log('tieneDetalleMovimientoForm guarda solo producto');
            }
        } else {
            console.log('Formulario inValido');
            this.mostrarMsg('warn', 'Producto Formulario es invalido');
        }
    }

    navigateToListPresentacion(): void {
        setTimeout(() =>
            this.router.navigate(['/producto/presentacion']), 3000);
        ;
    }

    private tieneDetalleMovimientoForm(): boolean {
        if (!this.esValidoCantidadDisponibleStock() ||
            this.esVacioDetalleMovimiento()
        ) {
            return false;
        }
        return true;
    }

    private esValidoFormMovimiento(): boolean {
        const esValid = this.totalCantidadDetalle == this.cantidadDisponibleStock.value;
        if (!esValid) {
            this.mostrarMsg('warn', 'En Inv. Existencia \n Debe ser iguales Existencia Disponible \n y total Cantidad del Detalle.');
        }
        return esValid;
    }

    private savePresentacionConMovimientoInventario() {
        this.productoPresentacionService
            .savePresentacion(this.productoPresentacionForm.value)
            .pipe(
                tap(resp => {
                    this.mostrarMsg('success', `${resp.message} la Presentacion PR-${resp.data.id}`);
                }),
                catchError(err => {
                    this.mostrarMsg('error', err.error?.message || 'Error al crear producto');
                    return of(null);
                }),
                switchMap(resp => {
                    if (!resp) return of(null);

                    this.movimientoInventario.
                        get("presentacionId")?.setValue(resp.data.id);

                    return this.movimientoService.
                        saveMovimiento(this.movimientoInventario.value);
                }),
                catchError(err => {
                    console.error('Error en flujo:', err);
                    this.mostrarMsg('error', err.error?.message || 'Error en movimiento');
                    return of(null);
                })
            ).subscribe(resp => {
                if (resp) {
                    console.log('Finalizo todo bien ', resp);
                    this.mostrarMsg('success', 'Se creo correctamente Producto con inventario.')

                    this.navigateToListPresentacion();
                }
            });

    }

    private saveOnlyPresentacionForm() {
        this.productoPresentacionService.savePresentacion(this.productoPresentacionForm.value)
            .subscribe({
                next: (value) => {
                    console.log(value);
                    this.mostrarMsg('success', `${value.message} la Presentacion PR-${value.data.id}`)
                    this.navigateToListPresentacion();
                },
                error: (err) => {
                    this.mostrarMsg('error', `${err.error?.message} - fallo`)
                    console.log(err);
                },
            });

    }


    private darFormatoToFormForGuardar(): void {
        console.log('darFormatoToFormForGuardar paso');
        const productoBase = this.productoPresentacionForm.get('productoId')?.value;
        const unidadMedida = this.productoPresentacionForm.get('unidadMedidaId')?.value;
        const marca = this.productoPresentacionForm.get('marcaId')?.value;
        const ubicacionStock = this.movimientoInventario.get('ubicacionStockId')?.value;
        console.log('ubicacionStock: ', ubicacionStock);

        this.productoPresentacionForm.get('productoId')?.setValue(productoBase.id);
        this.movimientoInventario.get('productoId')?.setValue(productoBase.id);

        this.movimientoInventario.get('productoId')?.setValue(productoBase.id);
        console.log('ubicacionStockId: ', ubicacionStock?.id);
        // si asignas undefined value in .setValue(undefined) se pierde ese atributo del FORM
        this.movimientoInventario.get('ubicacionStockId')?.setValue(ubicacionStock ? ubicacionStock.id : null);
        this.productoPresentacionForm.get('unidadMedidaId')?.setValue(unidadMedida.id);
        this.productoPresentacionForm.get('marcaId')?.setValue(marca.id);

        // agregando valor por defecto
        if (!this.productoPresentacionForm.get('diasAntesExpiracion')?.value) {
            this.productoPresentacionForm.get('diasAntesExpiracion')?.setValue(1);
        }
        if (!this.cantidadDisponibleStock.value) {
            this.cantidadDisponibleStock.setValue(0);
        }
        if (!this.productoPresentacionForm.get('cantidadMinimoStock')?.value) {
            this.productoPresentacionForm.get('cantidadMinimoStock')?.setValue(1);
        }
        if (!this.productoPresentacionForm.get('precioUnitario')?.value) {
            this.productoPresentacionForm.get('precioUnitario')?.setValue(1);
        }

        this.agregarStockLotePorDefaultSiRequiere();
    }

    private agregarStockLotePorDefaultSiRequiere() {
        console.log('agregarStockLotePorDefaultSiRequiere ');
        if (this.esValidoCantidadDisponibleStock() &&
            this.esVacioDetalleMovimiento()) {
            console.log(" Se va cargar un detalle Lote Stock Por Default");
            const randomNumber = Math.round(Math.random() * 10000);
            console.log(" Se va cargar un detalle Lote Stock Por Default LOTE-" + randomNumber);
            const newDetalle = this.crearDetalleMovimiento("LOTE-" + randomNumber, null, this.cantidadDisponibleStock.value);
            this.detalleMovimiento.push(newDetalle);
            console.log('agregarStockLotePorDefaultSiRequiere agrego ', newDetalle);
            this.movimientoInventario.get('totalCantidadDetalle')?.setValue(this.cantidadDisponibleStock.value);
        }
    }

    private buildFormAndInitValues() {
        this.marcaOptions = [MarcaOption.getInstance()];
        this.productoBaseOption = [ProductoBaseOption.getInstance()];
        this.unidadMedidaOption = [UnidadMedidaOption.getInstance()];
        this.ubicacionStockOption = [UbicacionStockOption.getInstance()];

        this.productoPresentacionForm = this.formBuilder.group({

            productoId: [null, Validators.required],
            nombre: ['', [Validators.required, Validators.maxLength(60)]],
            concepto: [null, Validators.maxLength(255)],
            descripcion: [null, Validators.maxLength(255)],
            unidadMedidaId: [null, Validators.required],
            esUnidadMinima: [true], // analizar esUnidadMinima
            factorConversion: [1],
            precioUnitario: [null],
            precioVenta: [0, [Validators.required, Validators.min(1)]],
            marcaId: [null, [Validators.required]],
            cantidadDisponibleStock: [null],
            cantidadMinimoStock: [1],
            diasAntesExpiracion: [null],
            movimientoInventario: this.formBuilder.group({
                // campo de backup Producto presentacion (se omiten en el backend)
                cantidadDisponibleStock: [null],

                tipoMovimientoId: [1], // llevar a constante
                motivo: ['REGISTRO PRODUCTO'], // llevar a constante
                productoId: [null],
                presentacionId: [null],
                ubicacionStockId: [null],
                // campo para add detalle
                lote: [''],
                fechaExpiracion: [null],
                cantidadStockBase: [null],
                registroSanitario: [null],

                detalleMovimiento: this.formBuilder.array([]),
                totalCantidadDetalle: [0]
            })
        });

        // change detection para cambios en Forms
        this.productoPresentacionForm.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.cdr.markForCheck());
    }

    addDetalleMovimiento() {
        const lote = this.movimientoInventario.get('lote')?.value;
        const fechaExpiracion = this.movimientoInventario.get('fechaExpiracion')?.value;

        const cantidadStockBase = this.movimientoInventario.get('cantidadStockBase')?.value;

        if (this.validarDetalleMovimiento(lote, fechaExpiracion, cantidadStockBase)) {
            const newDetalle = this.crearDetalleMovimiento(lote, fechaExpiracion, cantidadStockBase);
            this.detalleMovimiento.push(newDetalle);
        }
    }

    esValidoCantidadDisponibleStock(): boolean {
        return this.cantidadDisponibleStock.value ||
            this.cantidadDisponibleStock.value > 0;
    }

    private validarDetalleMovimiento(lote: string, fechaExpiracion: Date, cantidad: number): boolean {

        if (!lote || !fechaExpiracion || (!cantidad || cantidad == 0)) { // si es vacio | null | undifiend
            this.mostrarMsg('warn', 'Detalle Stock invalido.');
            return false;
        }

        const findIndexLote = this.detalleMovimiento.controls
            .findIndex(det => det.value.lote === lote);
        if (findIndexLote > 0) {
            this.mostrarMsg('warn', 'Nro Lote ya se encuentra registrado.')
            return false;
        }
        if ((this.totalCantidadDetalle + cantidad) > this.cantidadDisponibleStock.value) {
            this.mostrarMsg('warn', 'La Cantidad Total Detalle debe ser \n igual a Existencia Disponible.')
            return false;
        }
        return true;
    }

    removeDetalleStock(index: number) {
        this.detalleMovimiento.removeAt(index);
    }

    // GETTERS
    get cantidadDisponibleStock(): FormControl {
        return this.productoPresentacionForm.get('cantidadDisponibleStock') as FormControl;
    }

    get movimientoInventario(): FormGroup {
        return this.productoPresentacionForm.get('movimientoInventario') as FormGroup;
    }

    get detalleMovimiento(): FormArray {
        return this.movimientoInventario.get('detalleMovimiento') as FormArray;
    }

    get totalCantidadDetalle(): number {
        const cantidadStock = this.detalleMovimiento.controls
            .reduce((acc, d) => acc + d.value.cantidadStockBase, 0);
        this.productoPresentacionForm.patchValue({
            movimientoInventario: {
                totalCantidadDetalle: cantidadStock
            }
        });
        return cantidadStock;
    }

    // OnChange Input
    onCambioExistenciaDisponibleStock(value: any) {
        this.cantidadDisponibleStock.setValue(value);
        this.movimientoInventario.get('cantidadDisponibleStock')?.setValue(value);
    }

    onCambioCantidadMinimoStock(value: any) {
        this.productoPresentacionForm.get('cantidadMinimoStock')?.setValue(value);
    }

    onCambioDiasAntesExpiracion(value: any) {
        this.productoPresentacionForm.get('diasAntesExpiracion')?.setValue(value);
    }


    private crearDetalleMovimiento(lote: string, fechaExpiracion: Date | null, cantidadStock: number): FormGroup {
        return this.formBuilder.group({
            lote: [lote || '', Validators.required],
            fechaExpiracion: [fechaExpiracion || null],
            cantidadStockBase: [cantidadStock || 0, [Validators.required, Validators.min(1)]],
        });
    }

    private cargarDatosComboBoxs() {
        this.marcaService.getAllMarcas()
            .subscribe((resp) => {
                const data = resp.data.content;
                this.marcaOptions.push(...data.map(marca => new MarcaOption(marca.id, marca.nombre)));
            });

        this.productoBaseService.getAllProductoBase()
            .subscribe((resp) => {
                const data = resp.content;
                this.productoBaseOption.push(...data.map(base => new ProductoBaseOption(base.id, base.nombre)));
            });

        this.unidadMedidaService.getAllUnidadMedida()
            .subscribe((resp) => {
                const data = resp.data.content;
                this.unidadMedidaOption.push(...data.map(
                    base => new UnidadMedidaOption(
                        base.id,
                        `${base.abreviatura}- ${base.nombre}`,
                        base.esUnidadMinima)
                ));
            });

        this.ubicacionStockService.getAllUbicacionStock()
            .subscribe((resp) => {
                const data = resp.data.content;
                this.ubicacionStockOption.push(
                    ...data.map(
                        ubi =>
                            new UbicacionStockOption(ubi.id,
                                `${ubi.seccion}->${ubi.estante}->${ubi.nivel}`
                            )
                    )
                );
            });
    }

    esVacioDetalleMovimiento(): boolean {
        return this.detalleMovimiento.length === 0;
    }

    private mostrarMsg(tipo: string, detalle: string): void {
        this.messageService.add({
            severity: tipo,
            summary: 'Mensaje',
            detail: detalle,
            life: 5000
        });
    }

    private esValidoFormulario(): boolean {
        let isValidoFormMovimiento = true;
        if (this.tieneDetalleMovimientoForm()) {
            isValidoFormMovimiento = this.esValidoFormMovimiento();
        }
        return !this.productoPresentacionForm.invalid && isValidoFormMovimiento;
    }
}
