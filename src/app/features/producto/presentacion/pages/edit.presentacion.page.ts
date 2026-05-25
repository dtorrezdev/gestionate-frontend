import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ProductService } from "../services/producto.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MarcaOption } from "../../marca/dto/marca.option";
import { ProductoBaseOption } from "../../base/dto/producto.base.option";
import { UnidadMedidaOption } from "../../unidad-medida/dto/unidad-medida.option";
import { UbicacionStockOption } from "../../../inventario/ubicacion-stock/dtos/ubicacion-stock.option";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MarcaService } from "../../marca/service/marca.service";
import { ProductoBaseService } from "../../base/service/producto.base.service";
import { UnidadMedidaService } from "../../unidad-medida/service/unidad-medida.service";
import { UbicacionStockService } from "../../../inventario/ubicacion-stock/service/ubicacion-stock.service";
import { MessageService } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { SelectModule } from "primeng/select";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { TextareaModule } from "primeng/textarea";
import { PresentacionOuput } from "../dto/presentacion.output";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { MarcaOutput } from "../../marca/dto/marca.output";
import { UnidadMedidaOuput } from "../../unidad-medida/dto/unidad-medida.output";
import { UbicacionStockOutput } from "../../../inventario/ubicacion-stock/dtos/ubicacion-stock.outpu";
import { ProductoBaseOutput } from "../../base/dto/producto.base.output";


@Component({
    imports: [
        ReactiveFormsModule,
        RouterModule,
        ButtonModule,
        BreadcrumbModule,
        SelectModule,
        InputTextModule,
        InputNumberModule,
        TextareaModule,



    ],
    template: `
        <div class="card mb-0 pb-0">
        <div class="font-bold text-xl mb-4">Edit Producto Presentacion</div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
    </div>
    <form [formGroup]="productoForm" (submit)="submitForm()" class="md:w-1/1">
        <div class="card flex flex-col gap-6 w-full mb-0">
            <div class="font-semibold text-xl">
                Formulario Edit Producto Pr-{{productoForm.get('id')?.value}}
            </div>
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex flex-wrap gap-2 w-full">
                    <label class="font-semibold" for="cliente">Marca(*): </label>
                    <p-select id="cliente"
                        formControlName="marcaId"
                        [options]="marcaOptions"
                        size="large"
                        optionLabel="nombre"
                        placeholder="Seleccione Cliente"
                        class="w-full">
                    </p-select>
                    @if( productoForm.get('marcaId')?.invalid &&
                        (productoForm.get('marcaId')?.touched ||
                        productoForm.get('marcaId')?.dirty)) {
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
                        @if( productoForm.get('productoId')?.invalid &&
                            (productoForm.get('productoId')?.touched ||
                                productoForm.get('productoId')?.dirty)) {
                            <small class="text-red">Producto no debe ser vacio.</small>
                        }
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex flex-col grow basis-0 gap-2">
                    <label for="codigo" class="font-semibold">Presentacion(*):</label>
                    <input pInputText id="codigo" formControlName="nombre" type="text" />
                    @if( productoForm.get('nombre')?.invalid &&
                        (productoForm.get('nombre')?.touched ||
                            productoForm.get('nombre')?.dirty)) {
                        <small class="text-red">Presentacion no debe ser vacio.</small>
                    }
                </div>
                <div class="flex flex-col grow basis-0 gap-2">
                    <label for="imagen" class="font-semibold">Imagen(*):</label>
                    <input pInputText id="imagen" formControlName="imagen" type="text" />
                </div>
            </div>
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex flex-col grow-m basis-0 gap-2">
                    <label for="unidad" class="font-semibold">Unidad Medida de venta(*):</label>
                    <p-select
                        formControlName="unidadMedidaId"
                        [options]="unidadMedidaOption"
                        optionLabel="nombre"
                        placeholder="Seleccione Unidad Medida" />
                    @if( productoForm.get('unidadMedidaId')?.invalid &&
                        (productoForm.get('unidadMedidaId')?.touched ||
                        productoForm.get('unidadMedidaId')?.dirty)) {
                        <small class="text-red">Unidad Medida no debe ser vacio.</small>
                    }
                </div>
                <div class="flex flex-col grow-s gap-2">
                    <label for="precio_un" class="font-semibold">Precio Unitario:</label>
                    <p-inputnumber formControlName="precioUnitario" mode="decimal" [minFractionDigits]="2" inputId="precio_un" />
                </div>

                <div class="flex flex-col grow-s gap-2">
                    <label for="precio_ve" class="font-semibold">Precio Venta(*):</label>
                    <p-inputnumber formControlName="precioVenta" mode="decimal" [minFractionDigits]="2" inputId="precio_ve" />
                    @if( productoForm.get('precioVenta')?.invalid &&
                        (productoForm.get('precioVenta')?.touched ||
                            productoForm.get('precioVenta')?.dirty)) {
                        <small class="text-red">Precio Venta no debe ser cero o vacio.</small>
                    }
                                </div>
            </div>
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex flex-col grow basis-0 gap-2">
                    <label for="concepto" class="font-semibold">Principios Activos:</label>
                    <textarea rows="4" cols="30" formControlName="concepto" pTextarea></textarea>
                </div>
            </div>


        </div>
        <div class="card flex flex-col gap-4 mb-0">
            <div class="flex flex-wrap gap-2">
                <p-button label="Guardar" [disabled]="productoForm.invalid" type="submit" />
                <p-button label="Volver Atras" severity="info" [routerLink]="'/producto/presentacion'" />
            </div>
        </div>
    </form>
    `,
    providers: [
        MarcaService,
        ProductoBaseService,
        ProductService,
        UnidadMedidaService,
        MessageService,
        UbicacionStockService
    ],
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

    `

})
export class EditPresentacionPage implements OnInit {
    private formBuilder = inject(FormBuilder);
    private activatedRoute = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private readonly cdr = inject(ChangeDetectorRef);
    private router = inject(Router);

    private productService = inject(ProductService);
    private marcaService = inject(MarcaService);
    private productoBaseService = inject(ProductoBaseService);
    private unidadMedidaService = inject(UnidadMedidaService);
    private ubicacionStockService = inject(UbicacionStockService);

    productoForm!: FormGroup;

    marcaOptions!: MarcaOption[];
    productoBaseOption!: ProductoBaseOption[];
    unidadMedidaOption!: UnidadMedidaOption[];
    ubicacionStockOption!: UbicacionStockOption[];

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Producto' }, { label: 'Edit Prsentacion' }];


    private editMode: boolean = false;
    private presentacionId!: number;

    constructor() {
        this.buildFormProductoInitValues();
    }

    ngOnInit(): void {
        this.presentacionId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        const url = this.activatedRoute.snapshot.routeConfig?.path;
        this.editMode = url?.startsWith('edit/') || false;
        console.log('editMode ', this.editMode, ' url: ', url);
        this.loadDataToProductoForm(this.presentacionId);
    }

    public submitForm() {
        console.log('submitForm');
        console.log(JSON.stringify(this.productoForm.value));
        if(this.esValidoFormulario()) {
            this.darFormatoToFormForGuardar();
            this.updateProductoPresentacion();
        }

    }

    private updateProductoPresentacion() {
        this.productService.update(this.productoForm.value, this.presentacionId)
            .subscribe({
                next: (resp) => {
                    console.log(resp);
                    this.mostrarMsg('success', resp.message);
                    this.navigateToListPresentacion();
                },
                error: (err) => {
                    this.mostrarMsg('error', err)
                    console.log(err);
                },
            });
    }

    private esValidoFormulario(): boolean {
        return !this.productoForm.invalid;
    }
    private darFormatoToFormForGuardar(): void {
        console.log('darFormatoToFormForGuardar paso');
        const productoBase = this.productoForm.get('productoId')?.value;
        const unidadMedida = this.productoForm.get('unidadMedidaId')?.value;
        const marca = this.productoForm.get('marcaId')?.value;

        // si asignas undefined value in .setValue(undefined) se pierde ese atributo del FORM
        this.productoForm.get('productoId')?.setValue(productoBase.id);
        this.productoForm.get('unidadMedidaId')?.setValue(unidadMedida.id);
        this.productoForm.get('marcaId')?.setValue(marca.id);

        // agregando valor por defecto
        if (!this.productoForm.get('diasAntesExpiracion')?.value) {
            this.productoForm.get('diasAntesExpiracion')?.setValue(1);
        }

        if (!this.productoForm.get('cantidadMinimoStock')?.value) {
            this.productoForm.get('cantidadMinimoStock')?.setValue(1);
        }
        if (!this.productoForm.get('precioUnitario')?.value) {
            this.productoForm.get('precioUnitario')?.setValue(1);
        }
    }

    private buildFormProductoInitValues() {
        this.marcaOptions = [MarcaOption.getInstance()];
        this.productoBaseOption = [ProductoBaseOption.getInstance()];
        this.unidadMedidaOption = [UnidadMedidaOption.getInstance()];
        this.ubicacionStockOption = [UbicacionStockOption.getInstance()];

        this.productoForm = this.formBuilder.group({
            id: [null],
            productoId: [null, Validators.required],
            nombre: ['', [Validators.required, Validators.maxLength(60)]],
            imagen: [null],
            concepto: [null, Validators.maxLength(255)],
            descripcion: [null, Validators.maxLength(255)],
            unidadMedidaId: [null, Validators.required],
            esUnidadMinima: [true], // analizar esUnidadMinima
            precioUnitario: [null],
            precioVenta: [0, [Validators.required, Validators.min(1)]],
            marcaId: [null, [Validators.required]],
            cantidadDisponibleStock: [null],
            cantidadMinimoStock: [1],
            diasAntesExpiracion: [null],
            seControlaStock: [false]
        });
        // change detection para cambios en Forms
        this.productoForm.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.cdr.markForCheck());
    }

    private loadDataToProductoForm(id: number) {

        this.marcaService.list()
            .subscribe((resp: CommonResponse<ListResponse<MarcaOutput>>) => {
                console.log('data getAllMarcas', resp);

                const data = resp.data.content;
                this.marcaOptions.push(...data.map(marca => new MarcaOption(marca.id, marca.nombre)));
            });

        this.productoBaseService.list()
            .subscribe((resp) => {
                console.log('data producto ', resp);
                const data = resp.data.content as ProductoBaseOutput[];
                this.productoBaseOption.push(...data.map(base => new ProductoBaseOption(base.id || 0, base.nombre)));
            });

        this.unidadMedidaService.list()
            .subscribe((resp) => {
                console.log('data getAllUnidadMedida', resp);
                const data = resp.data.content as UnidadMedidaOuput[];
                this.unidadMedidaOption.push(...data.map(
                    base => new UnidadMedidaOption(
                        base.id,
                        `${base.abreviatura}- ${base.nombre}`,
                        base.esUnidadMinima)
                ));
            });

        this.ubicacionStockService.list()
            .subscribe((resp) => {
                console.log('data getAllUbicacionStock', resp);
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

        setTimeout(() => this.getProductoPresentacion(id), 2000);

    }
    private getProductoPresentacion(id: number) {
        this.productService.get(id).subscribe({
            next: (resp) => {
                console.log('data getProdutoPresentacion', resp);
                const data = resp.data;
                this.setValuesProductoForm(data);
            },
            error: (err) => {
                console.error('Error al cargar la presentación del producto', err);
            }
        });
    }

    private setValuesProductoForm(presentacion: PresentacionOuput): void {
        const marca = this.marcaOptions.find(marca => marca.id == presentacion.marcaId);
        const productoBase = this.productoBaseOption.find(producto => producto.id == presentacion.productoId);
        const unidadMedida = this.unidadMedidaOption.find(unidaMedida => unidaMedida.id == presentacion.unidadMedidaId);
        this.productoForm.patchValue({
            id: presentacion.id,
            productoId: productoBase,
            nombre: presentacion.nombre,
            imagen: presentacion.imagen,
            concepto: presentacion.concepto,
            descripcion: presentacion.descripcion,
            unidadMedidaId: unidadMedida,
            esUnidadMinima: presentacion.esUnidadMinima,
            precioUnitario: presentacion.precioUnitario,
            precioVenta: presentacion.precioVenta,
            marcaId: marca,
            cantidadDisponibleStock: presentacion.cantidadDisponibleStock,
            cantidadMinimoStock: presentacion.cantidadMinimoStock,
            diasAntesExpiracion: presentacion.diasAntesExpiracion,
            seControlaStock: presentacion.seControlaStock
        });
    }
    navigateToListPresentacion(): void {
        setTimeout(() =>
            this.router.navigate(['/producto/presentacion']), 3000);
    }

     private mostrarMsg(tipo: string, detalle: string): void {
        this.messageService.add({
            severity: tipo,
            summary: 'Mensaje',
            detail: detalle,
            life: 5000
        });
    }
}
