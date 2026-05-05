import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MessageService } from 'primeng/api';
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
    <div class="font-semibold text-xl mb-4">Nueva Solicitud Compra</div>
    <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
</div>
<form [formGroup]="compraForm" (submit)="submitForm()" class="md:w-1/1">
    <div class="card flex flex-col gap-6 w-full mb-0">
        <div class="font-semibold text-xl">
            Solicitud Compra {{compraForm.get('codigo')?.value}}
        </div>
        <!-- Proveedor -->
        <div class="flex flex-col md:flex-row gap-6">
            <div class="flex flex-wrap gap-2 w-full">
                <label class="font-semibold" for="proveedor">Proveedor: </label>
                <p-select id="proveedor"
                    formControlName="proveedorId"
                    [options]="proveedorOptions"
                    size="large"
                    optionLabel="nombre"
                    placeholder="Seleccione Proveedor"
                    class="w-full">
                </p-select>
                @if( compraForm.get('proveedorId')?.invalid && (compraForm.get('proveedorId')?.touched || compraForm.get('proveedorId')?.dirty) ) {
                    <small class="text-red">Proveedor no debe ser vacio.</small>
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
        [tableStyle]="{ 'min-width': '75rem' }"
        [rowHover]="false"
        dataKey="id"
        >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Detalle Solicitud</h5>
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
        <ng-template #body let-product let-editing="editing" let-index="rowIndex">
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
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="removeDetalle(index)" />
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
    providers: [CompraService, VentaService, ProductService, ProveedorService, MessageService]
})
export class AddSolicitudPage {
    private service = inject(VentaService);
    private compraService = inject(CompraService);
    private productService = inject(ProductService);
    private proveedorService = inject(ProveedorService);
    private formBuilder = inject(FormBuilder);
    private messageService = inject(MessageService);
    private readonly cdr = inject(ChangeDetectorRef);
    private router = inject(Router);

    public compraForm!: FormGroup;
    public proveedorOptions!: ProveedorOutput[];
    public productoPresentacionOptions!: PresentacionOuput[];

    // MenuBar BreadcrumbModule
    public breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    public breadcrumbItems = [{ label: 'Compras' }, { label: 'Nueva Solicitud' }];

    constructor() {
        this.buildFormAndInitValues();
    }

    ngOnInit() {
        this.loadDataToCompraForm();
    }

    submitForm() {
        console.log(this.compraForm);
        if (this.compraForm.valid) {
            this.cargarDatosToCompraForm();
            console.log(JSON.stringify(this.compraForm.value));
            this.saveCompraForm();
            //this.navigateToListVentas();
            this.mostrarMsg('success', 'Solicitud Compra Formulario exito');
        } else {
            this.mostrarMsg('warn', 'Compra Formulario es invalido');
        }
    }

    private cargarDatosToCompraForm() {
        const proveedorSelected = this.compraForm.get('proveedorId')?.value;
        if(proveedorSelected) {
            this.compraForm.get('proveedorId')?.setValue(proveedorSelected.id);
        }
    }

    private saveCompraForm(): void {
        this.compraService.save(this.compraForm.value)
            .subscribe({
                next: (resp) => {
                    console.log(resp);
                    this.mostrarMsg('success', this.compraForm.get('estado')?.value + ' registrado correctamente');
                    this.navigateToListVentas();
                },
                error: (e) => this.mostrarMsg(
                    'error', 'Error al guardar venta ' + e.error?.message),
            });
    }

    addDetalle(presentacionProducto: PresentacionOuput) {
        console.log('addDetalle ', presentacionProducto);

        if (this.esValidoProducto(presentacionProducto)) {
            const newDetalle = this.crearDetalle(presentacionProducto);
            newDetalle.valueChanges.subscribe((presentacion) => {
                const total = presentacion.precio * presentacion.cantidad;
                newDetalle.get('subtotal')?.setValue(total, { emitEvent: false });
            });

            console.log('new Detalle with stock ', newDetalle);

            this.detalle.push(newDetalle);
        }
    }

    private esValidoProducto(productoPre: PresentacionOuput): boolean {
        if (productoPre.id == 0) return false;
        const findIndexInDetalle = this.findIndexDelProductoEnDetalle(productoPre);
        if (findIndexInDetalle > -1) {
            this.mostrarMsg('info', 'El producto ' + productoPre.presentacion
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
        this.productoPresentacionOptions = [
            PresentacionOuput.getInstance()
        ];
        this.compraForm = this.crearCompraForm();
        // change detection para cambios en Forms
        this.compraForm.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.cdr.markForCheck());
    }

    private crearCompraForm(): FormGroup {
        return this.formBuilder.group({
            proveedorId: [null, Validators.required],
            codigo: ['V-12', Validators.required],
            glosa: [''],
            estado: ['SOLICITUD'],
            detalle: this.formBuilder.array([]),
            total: [0, [Validators.required, Validators.min(1)]],
        });
    }

    private loadDataToCompraForm(): void {

        this.proveedorService.list()
            .subscribe((resp) => {
                const proveedores = resp.data.content;
                this.proveedorOptions = []
                console.log('proveedores ', proveedores);
                this.proveedorOptions = [...proveedores];
            });

        this.productService.list()
            .subscribe(resp => {
                const prodPresentacion = resp.data.content;
                this.productoPresentacionOptions.push(...prodPresentacion);
            });


        this.service.getLastVenta()
            .subscribe(resp => {
                const ventas = resp.data.content;

                console.log('ultima venta ', resp);
                if (ventas && ventas.length) {
                    const codigoVenta = 'V-' + (ventas[0].id + 1);
                    this.compraForm.get('codigo')?.setValue(codigoVenta);
                }

            });
    }

    private crearDetalle(presentacionProducto?: PresentacionOuput): FormGroup {
        return this.formBuilder.group({
            presentacionId: [presentacionProducto?.id || null, Validators.required],
            nombre: [presentacionProducto?.presentacion || ''],
            productoId: [presentacionProducto?.productoId || null, Validators.required],
            precio: [presentacionProducto?.precioUnitario || 0, [Validators.required, Validators.min(1)]],
            cantidad: [1, [Validators.required, Validators.min(1)]],
            subtotal: [presentacionProducto ? presentacionProducto.precioUnitario : 0, [Validators.required, Validators.min(1)]],
            estadoStock: [presentacionProducto?.estadoStock || ''],
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

    private mostrarMsg(tipo: string, detail: string) {
        this.messageService.add({
            severity: tipo,
            summary: 'Mensaje',
            detail: detail,
            life: 3000
        });
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
            this.router.navigate(['/compra/solicitud']), 3000);
        ;
    }
}
