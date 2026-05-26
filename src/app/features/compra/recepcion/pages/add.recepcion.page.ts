import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { ProductService } from '../../../producto/presentacion/services/producto.service';
import { VentaService } from '../../../venta/services/venta.service';
import { PresentacionOuput } from '../../../producto/presentacion/dto/presentacion.output';
import { StatusStock } from '../../../../shared/enums/status-stock.enum';
import { ProveedorService } from '../../proveedor';
import { ProveedorOutput } from '../../proveedor/dto/proveedor.output';
import { CompraService } from '../../compra/service/compra.service';
import { RecepcionService } from '../service/recepcion.service';
import { CompraOutput } from '../../solicitud/dto/compra.output';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { StockByProductoOutput } from '../../../inventario/stock/dtos/stock-by-producto.output';
import { StockInput } from '../../../inventario/stock/dtos/stock-input';
import { DatePickerModule } from 'primeng/datepicker';
import { UbicacionStockService } from '../../../inventario/ubicacion-stock/service/ubicacion-stock.service';
import { UbicacionStockOption } from '../../../inventario/ubicacion-stock/dtos/ubicacion-stock.option';
import { UbicacionStockOutput } from '../../../inventario/ubicacion-stock/dtos/ubicacion-stock.outpu';
import { ToastService } from '../../../../core/services/toast.service';


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
        RippleModule,
        InputIconModule,
        IconFieldModule,
        InputTextModule,
        BadgeModule,
        TooltipModule,
        DatePickerModule,
        DatePipe
    ],
    template: `
<div class="card mb-0">
    <div class="font-semibold text-xl mb-4">Nueva Recepcion Compra</div>
    <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
</div>
<form [formGroup]="compraForm" (submit)="submitForm()" class="md:w-1/1">
    <div class="card flex flex-col gap-6 w-full mb-0">
        <div class="font-semibold text-xl">
            Recepcion Compra {{compraForm.get('codigo')?.value}}
        </div>
        <!-- Compras -->
        <div class="flex flex-col md:flex-row gap-6">
            <div class="flex flex-wrap gap-2 w-full">
                <label class="font-semibold" for="compra">Compras: </label>
                <p-select id="compra"
                    formControlName="compraId"
                    [options]="compraOptions"
                    size="large"
                    optionLabel="codigo"
                    placeholder="Seleccione Compras"
                    class="w-full">
                </p-select>
                @if( compraForm.get('compraId')?.invalid && (compraForm.get('compraId')?.touched || compraForm.get('compraId')?.dirty) ) {
                    <small class="text-red">Compra no debe ser vacio.</small>
                }
            </div>
            <div class="flex gap-2 w-full flex-cc">
                <p-button class="mt-2" label="Proveedor" icon="pi pi-user-plus" />
            </div>
        </div>

        <div class="flex flex-col md:flex-row gap-6">
            <div class="flex flex-wrap gap-2 w-full">
                <label class="font-semibold" for="producto">Productos:</label>
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
            </div>
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
                <h5 class="pl-1">Detalle Recepcion</h5>
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
                    Precio Unitario
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
                    [pEditableColumn]="product.precio"
                    pEditableColumnField="precio">
                    <p-cellEditor>
                        <ng-template #input>
                            <p-inputnumber inputId="precio" formControlName="precio" mode="decimal" [minFractionDigits]="2" />
                            @if(product.value.precio <= 0) {
                            <small class="text-red">precio unitario debe ser mayor a 0</small>
                            }
                        </ng-template>
                        <ng-template #output>
                            {{ product.value.precio | currency: 'Bs' }}
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
                    <p-button
                        [id]="index"
                        pTooltip="Ver detalle Stock" tooltipPosition="top"
                        class="mr-2"
                        pRipple
                        [pRowToggler]="product"
                        [rounded]="true"
                        [outlined]="true"
                        severity="info"
                        (onClick)="eventoClick($event, product.value.presentacionId)"
                        [icon]="expanded ? 'pi pi-eye-slash' : 'pi pi-eye'"
                    />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="removeDetalle(index)" />
                </td>
            </tr>
        </ng-template>
        <ng-template #expandedrow let-product let-indexDetalle="rowIndex">
            <tr>
                <td colspan="7">
                    <div class="p-4">
                        <h5>Stock for {{ product.value.nombre }}</h5>
                        <br>
                        <p-table [value]="product.get('stocks').controls"  dataKey="id">
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
                                    <th>
                                        Acciones
                                    </th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-stock let-indexStock="rowIndex" let-editing="editing">
                                <tr [formGroup]="stock">
                                    <td
                                        style="min-width: 3rem"
                                        [pEditableColumn]="stock.get('lote')" pEditableColumnField="lote">
                                        <p-cellEditor>
                                            <ng-template #input>
                                                <input pInputText type="text" inputId="lote" formControlName="lote" />
                                            </ng-template>
                                            <ng-template #output>
                                                {{ stock.value.lote }}
                                            </ng-template>
                                        </p-cellEditor>
                                    </td>
                                    <td
                                        style="min-width: 3rem"
                                        [pEditableColumn]="stock.get('expiracion')" pEditableColumnField="expiracion">
                                        <p-cellEditor>
                                            <ng-template #input>
                                                <p-datepicker  appendTo="body" formControlName="expiracion" dateFormat="dd/mm/yy" />
                                            </ng-template>
                                            <ng-template #output>
                                                {{ stock.value.expiracion | date: 'dd/MM/yyyy' }}
                                            </ng-template>
                                        </p-cellEditor>

                                    </td>
                                    <td
                                        style="min-width: 3rem"
                                        [pEditableColumn]="stock.get('ubicacionStockId')" pEditableColumnField="ubicacionStockId">
                                        <p-cellEditor>
                                            <ng-template #input>
                                                <p-select
                                                    formControlName="ubicacionStockId"
                                                    [options]="ubicacionStockOption"
                                                    optionLabel="nombre"
                                                    placeholder="Seleccione Ubicacion"
                                                     appendTo="body" />
                                            </ng-template>
                                            <ng-template #output>
                                                {{ stock.value.ubicacionStockId.nombre }}
                                            </ng-template>
                                        </p-cellEditor>
                                    </td>

                                    <td
                                        style="min-width: 3rem"
                                        [pEditableColumn]="stock.get('cantidad')" pEditableColumnField="cantidad">
                                        <p-cellEditor>
                                            <ng-template #input>
                                                <p-inputnumber inputId="cantidad" formControlName="cantidad" />
                                            </ng-template>
                                            <ng-template #output>
                                                {{ stock.value.cantidad }}
                                            </ng-template>
                                        </p-cellEditor>
                                    </td>
                                    <td>
                                        <p-button icon="pi pi-save" severity="success" [rounded]="true" [outlined]="true" (click)="addStock(indexDetalle)" />
                                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="removeStock(indexDetalle, indexStock)" />
                                    </td>
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
                <td colspan="7">No hay detalle.</td>
            </tr>
        </ng-template>
    </p-table>

    <div class="card flex flex-col gap-4 mb-0">
        <div class="flex flex-wrap gap-2">
            <p-button label="Guardar" [disabled]="compraForm.invalid" type="submit" />
            <p-button label="Cancelar" severity="secondary" routerLink="/compra" />
        </div>
    </div>

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
    providers: [
        RecepcionService,
        CompraService,
        ProductService,
        ProveedorService,
        UbicacionStockService
    ]
})
export class AddRecepcionPage {
    private recepcionService = inject(RecepcionService);
    private compraService = inject(CompraService);
    private productService = inject(ProductService);
    private proveedorService = inject(ProveedorService);
    private ubicacionStockService = inject(UbicacionStockService);
    private formBuilder = inject(FormBuilder);
    private toastService = inject(ToastService);
    private readonly cdr = inject(ChangeDetectorRef);
    private router = inject(Router);

    public compraForm!: FormGroup;
    public proveedorOptions!: ProveedorOutput[];
    public compraOptions!: CompraOutput[];
    public productoPresentacionOptions!: PresentacionOuput[];

    public ubicacionStockOption!: UbicacionStockOption[];

    // MenuBar BreadcrumbModule
    public breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    public breadcrumbItems = [{ label: 'Compras' }, { label: 'Nueva Recepcion' }];

    constructor() {
        this.buildFormAndInitValues();
    }

    ngOnInit() {
        this.loadDataToCompraForm();
    }

    eventoClick(evt: Event, presentacionId: number) {
        // evt.stopPropagation();
        // evt.stopImmediatePropagation();
        // console.log(`click prod ${presentacionId} evt: `, evt.target);

    }

    submitForm() {
        console.log(this.compraForm);
        if (this.compraForm.valid) {
            this.cargarDatosToCompraForm();
            console.log(JSON.stringify(this.compraForm.value));
            this.saveCompraForm();
            this.toastService.mostrarMsg('success', 'Recepcion Compra Formulario exito');
        } else {
            this.toastService.mostrarMsg('warn', 'Compra Formulario es invalido');
        }
    }

    private cargarDatosToCompraForm() {
        const compraSelected = this.compraForm.get('compraId')?.value;
        if (compraSelected) {
            this.compraForm.get('compraId')?.setValue(compraSelected.id);
        }

        const detalle = this.detalle.controls.map(d => {
            const detalleValue = d.value;
            const stocks = detalleValue.stocks.map((s: any) => {
                return {
                    ubicacionStockId: s.ubicacionStockId ? s.ubicacionStockId.id : null
                } as StockInput;
            });
            return {
                stocks: stocks
            };
        });
        this.compraForm.get('detalle')?.patchValue(detalle);

    }

    private saveCompraForm(): void {
        this.recepcionService.save(this.compraForm.value)
            .subscribe({
                next: (resp) => {
                    console.log(resp);
                    this.toastService.mostrarMsg('success', this.compraForm.get('estado')?.value + ' registrado correctamente');
                    this.navigateToListVentas();
                },
                error: (e) => this.toastService.mostrarMsg(
                    'error', 'Error al guardar venta ' + e.error?.message),
            });
    }

    addStock(index: number) {
        const stocksFormArray = this.detalle.at(index).get('stocks') as FormArray;

        const stocksVacio = {
            cantidad: 1,
            expiracion: null,
            id: 1,
            lote: 'aassd',
            ubicacionStockId: null,
        } as unknown as StockInput;
        stocksFormArray.push(this.crearStock(stocksVacio));
    }

    removeStock(indexDetalle: number, indexStock: number) {
        const stocksFormArray = this.detalle.at(indexDetalle).get('stocks') as FormArray;
        stocksFormArray.removeAt(indexStock);
    }

    addDetalle(presentacionProducto: PresentacionOuput) {
        console.log('addDetalle ', presentacionProducto);

        if (this.esValidoProducto(presentacionProducto)) {
            const stocksVacio = {
                cantidad: 1,
                expiracion: null,
                lote: 'LOTE-000',
                ubicacionStockId: null,
            } as unknown as StockInput;

            const stocksFormArray = this.crearFormArrayStock([stocksVacio]);
            console.log('stocksFormArray', stocksFormArray);

            const newDetalle = this.crearDetalle(presentacionProducto, stocksFormArray);
            newDetalle.valueChanges.subscribe((presentacion) => {
                //const total = presentacion.precio * presentacion.cantidad;
                const total = Math.ceil((presentacion.precio * presentacion.cantidad) * 100) / 100;
                newDetalle.get('subtotal')?.setValue(total, { emitEvent: false });
            });

            console.log('new Detalle with stock ', newDetalle);

            this.detalle.push(newDetalle);
        }
    }

    private crearFormArrayStock(stocks: StockInput[]): FormArray {
        console.log('crearFormArraysStocks ', stocks);
        if (stocks.length == 0) {
            return this.formBuilder.array([]);
        }
        const stocksFormGroup = stocks.map(stock => this.crearStock(stock));

        return this.formBuilder.array(stocksFormGroup);
    }

    private crearStock(stock: StockInput): FormGroup {
        console.log('llego crearStock ', stock);

        return this.formBuilder.group({
            lote: [stock?.lote || ''],
            expiracion: [stock?.expiracion || ''],
            ubicacionStockId: [stock?.ubicacionStockId || ''],
            cantidad: [stock?.cantidad || 0],
        });
    }

    private esValidoProducto(productoPre: PresentacionOuput): boolean {
        if (productoPre.id == 0) return false;
        const findIndexInDetalle = this.findIndexDelProductoEnDetalle(productoPre);
        if (findIndexInDetalle > -1) {
            this.toastService.mostrarMsg('info', 'El producto ' + productoPre.presentacion
                + ' esta en la fila nro ' + (findIndexInDetalle + 1));
            return false;
        }
        return true;
    }

    editPresentacionProducto(index: number, presentacionId: number) {
        const presentacionProd = this.productoPresentacionOptions.find(p => p.id === presentacionId);
        if (!presentacionProd) return;

        const detalle = this.detalle.at(index);

        detalle.patchValue({
            presentacionId: presentacionProd.id,
            productoId: presentacionProd.productoId,
            precio: presentacionProd.precioUnitario,
        });
    }

    removeDetalle(index: number) {
        this.detalle.removeAt(index);
    }

    private buildFormAndInitValues(): void {
        this.compraOptions = [];
        this.productoPresentacionOptions = [
            PresentacionOuput.getInstance()
        ];
        this.ubicacionStockOption = [];
        this.compraForm = this.crearCompraForm();
        // change detection para cambios en Forms
        this.compraForm.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.cdr.markForCheck());
    }

    private crearCompraForm(): FormGroup {
        return this.formBuilder.group({
            compraId: [null, Validators.required],
            codigo: ['RC-1', Validators.required],
            glosa: [''],
            detalle: this.formBuilder.array([]),
            total: [0, [Validators.required, Validators.min(1)]],
        });
    }

    private loadDataToCompraForm(): void {

        this.recepcionService.getLastRecepcion()
            .subscribe(resp => {
                const compras = resp.data.content;

                console.log('ultima venta ', resp);
                if (compras && compras.length) {
                    const codigoVenta = 'RC-' + (compras[0].id + 1);
                    this.compraForm.get('codigo')?.setValue(codigoVenta);
                }
            });

        this.proveedorService.list()
            .subscribe((resp) => {
                const proveedores = resp.data.content;
                this.proveedorOptions = []
                console.log('proveedores ', proveedores);
                this.proveedorOptions = [...proveedores];
            });
        this.compraService.list()
            .subscribe((resp) => {
                const compras = resp.data.content;

                console.log('compras ', compras);
                this.compraOptions = [...compras];
            });

        this.productService.list()
            .subscribe(resp => {
                const prodPresentacion = resp.data.content;
                this.productoPresentacionOptions.push(...prodPresentacion);
            });

        this.ubicacionStockService.list()
            .subscribe((resp) => {
                const data = resp.data.content as UbicacionStockOutput[];
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

    private crearDetalle(presentacionProducto?: PresentacionOuput, stocks?: FormArray): FormGroup {
        console.log('stocks ', stocks);

        return this.formBuilder.group({
            presentacionId: [presentacionProducto?.id || null, Validators.required],
            nombre: [presentacionProducto?.presentacion || ''],
            productoId: [presentacionProducto?.productoId || null, Validators.required],
            precio: [presentacionProducto?.precioUnitario || 0, [Validators.required, Validators.min(1)]],
            cantidad: [1, [Validators.required, Validators.min(1)]],
            subtotal: [presentacionProducto ? presentacionProducto.precioUnitario : 0, [Validators.required, Validators.min(1)]],
            estadoStock: [presentacionProducto?.estadoStock || ''],
            stocks: stocks,
        });
    }

    private findIndexDelProductoEnDetalle(presentacionProducto: PresentacionOuput): number {
        return this.detalle.controls.findIndex(prod =>
            prod.value.presentacionId === presentacionProducto.id &&
            prod.value.productoId === presentacionProducto?.productoId);
    }

    //GETTERs
    get detalle(): FormArray { return this.compraForm.get('detalle') as FormArray; }

    get total(): number {
        const total = this.detalle.controls
            .reduce((acc, d) => acc + d.value.subtotal, 0);
        this.compraForm.patchValue({ total });
        return total;
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

    navigateToListVentas(): void {
        setTimeout(() =>
            this.router.navigate(['/compra/recepcion']), 3000);
    }
}
