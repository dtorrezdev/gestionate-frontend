import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BreadcrumbModule } from "primeng/breadcrumb";
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { MarcaService } from "../../marca/service/marca.service";
import { MarcaOutput } from "../../marca/dto/marca.output";
import { MarcaOption } from "../../marca/dto/marca.option";
import { Marca } from "../../marca/pages/marca.page";
import { ProductoBaseService } from "../../base/service/producto.base.service";
import { ProductoBaseOption } from "../../base/dto/producto.base.option";
import { SelectModule } from "primeng/select";
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TextareaModule } from 'primeng/textarea';
import { UnidadMedidaService } from "../../unidad-medida/service/unidad-medida.service";
import { UnidadMedidaOption } from "../../unidad-medida/dto/unidad-medida.option";
import { ProductService } from "../../services/producto.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { InputNumberModule } from "primeng/inputnumber";

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
        ToastModule
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-0">
        <div class="font-bold text-xl mb-4">Add Venta Productos</div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
    </div>
    <form [formGroup]="productoPresentacionForm" (submit)="submit()" class="card">
        <div class="font-bold text-xl mb-4">Formulario Producto Presentacion</div>

            <p-tabs value="0">

                <p-tablist>
                    <p-tab value="0">Presentacion (*)</p-tab>
                    <p-tab value="1">Precios</p-tab>
                    <p-tab value="2" disabled>Existencia</p-tab>
                    <p-tab value="3" disabled>Proveedor</p-tab>
                </p-tablist>

                <p-tabpanels>
                    <p-tabpanel value="0">
                        <div class="card flex flex-col gap-4 margin-lr-4">
                            {{nombreProducto}}
                            <div class="flex flex-wrap gap-6">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="marca" class="font-semibold">Marca:</label>
                                    <p-select
                                    formControlName="marcaId"
                                    [options]="marcaOptions"
                                    optionLabel="nombre"
                                    filter="true"
                                    size="large"
                                    placeholder="Seleccione Marca" />
                                </div>
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <label for="base" class="font-semibold">Producto Base</label>
                                    <p-select
                                    formControlName="productoId"
                                    [options]="productoBaseOption"
                                    optionLabel="nombre"
                                    filter="true"
                                    size="large"
                                    placeholder="Seleccionar Producto Base" />
                                </div>
                            </div>
                        <div class="flex flex-wrap gap-6">
                            <!-- <div class="flex flex-col grow basis-0 gap-2">
                                <label for="base" class="font-semibold">Codigo:</label>
                                <input pInputText id="base" type="text" fluid  />
                            </div> -->
                            <div class="flex flex-col grow basis-0 gap-2">
                                <label for="codigo" class="font-semibold">Presentacion:</label>
                                <input pInputText id="codigo" formControlName="nombre" type="text" />
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-6">
                            <div class="flex flex-col grow basis-0 gap-2">
                                <label for="unidad" class="font-semibold">Unidad Medida:</label>
                                <!-- <input pInputText id="unidad" type="text" /> -->
                                <p-select
                                    formControlName="unidadMedidaId"
                                    [options]="unidadMedidaOption"
                                    optionLabel="nombre"
                                    placeholder="Seleccione Unidad Medida" />
                            </div>
                            <div class="flex flex-col gap-2 flex-cc">
                                <label for="categoria" class="font-semibold">Es unidad Minima:</label>
                                <!-- <input pInputText id="categoria" type="text" /> -->
                                <p-toggleswitch formControlName="esUnidadBase" />
                            </div>
                            <div class="flex flex-col basis-0 gap-2 ">
                                <label for="factor_conver" class="font-semibold">Factor de conversion:</label>
                                <!-- <input pInputText id="factor_conver" formControlName="factorConversion" type="text" /> -->
                                <p-inputnumber formControlName="factorConversion" inputId="factor_conver" />
                            </div>
                        </div>

                            <div class="flex flex-col gap-2">
                                <label for="concepto" class="font-semibold">Concepto:</label>
                                <!-- <input pInputText id="concepto" type="text" /> -->
                                <textarea rows="4" cols="30" formControlName="concepto" pTextarea></textarea>
                            </div>

                        </div>
                    </p-tabpanel>
                    <p-tabpanel value="1">
                        <div class="card flex flex-col gap-4 margin-lr-4">
                            <div class="flex flex-col gap-2">
                                <label for="precio_c" class="font-semibold">Precio Referencia (compra):</label>
                                <!-- <input pInputText id="precio_c" formControlName="precioRef" type="text" /> -->
                                <p-inputnumber formControlName="precioRef" mode="decimal" [minFractionDigits]="2" inputId="precio_c" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="precio_un" class="font-semibold">Precio Unitario:</label>
                                <!-- <input pInputText id="precio_un" formControlName="precioVenta" type="text" fluid  /> -->
                                <p-inputnumber formControlName="precioVenta" mode="decimal" [minFractionDigits]="2" inputId="precio_un" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="precio_m" class="font-semibold">Precio Mayor:</label>
                                <!-- <input pInputText id="precio_m" formControlName="precioXMayor" type="text" /> -->
                                <p-inputnumber formControlName="precioXMayor" mode="decimal" [minFractionDigits]="2" inputId="precio_m" />
                            </div>
                        </div>
                    </p-tabpanel>
                    <p-tabpanel value="2">
                        <div class="card flex flex-col gap-4 margin-lr-4">
                            <div class="flex flex-col gap-2">
                                <label for="lote" class="font-semibold">Lote nro:</label>
                                <input pInputText id="lote" type="text" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="precio_un" class="font-semibold">Fecha Caducidad:</label>
                                <input pInputText id="precio_un" type="text" fluid  />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="cantidad" class="font-semibold">Cantidad:</label>
                                <input pInputText id="cantidad" type="text" />
                            </div>
                        </div>
                    </p-tabpanel>
                    <p-tabpanel value="3">
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
                <p-button label="Guardar" type="submit"/>
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
        @media (max-width: 670px) {
            .margin-lr-4 {
                margin: 0;
                padding: 0.3rem;
            }
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
    `,
    providers: [MarcaService, ProductoBaseService, ProductService, UnidadMedidaService, MessageService]
})
export class AddPresentacionPage implements OnInit {

    private marcaService = inject(MarcaService);
    private productoBaseService = inject(ProductoBaseService);
    private productoPresentacionService = inject(ProductService);
    private unidadMedidaService = inject(UnidadMedidaService);
    private formBuilder = inject(FormBuilder);
    private readonly cdr = inject(ChangeDetectorRef);
    private messageService = inject(MessageService);

    productoPresentacionForm!: FormGroup;

    marcaOptions!: MarcaOption[];

    productoBaseOption!: ProductoBaseOption[];

    unidadMedidaOption!: UnidadMedidaOption[];

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
        console.log('submit', this.productoPresentacionForm.value);
        /*
            productoId: number;
            nombre: string;
            concepto: string;
            descripcion: string;
            unidadMedidaId: number;
            esUnidadBase: boolean;
            factorConversion: number;
            precioRef: number;
            precioVenta: number;
            precioXMayor: number;
            marcaId: number;
        */

        if (!this.productoPresentacionForm.invalid) {
            console.log('Formulario Valido');
            this.messageService.add({
                severity: 'success',
                summary: 'Mensaje',
                detail: 'Producto Formulario es valido',
                life: 3000
            });
            //this.sanatizarProductoPresentacionForm();

            console.log(this.productoPresentacionForm.value);
            // this.productoPresentacionService.savePresentacion(this.productoPresentacionForm.value)
            //     .subscribe({
            //         next(value) {
            //             console.log(value);
            //         },
            //         error(err) {
            //             console.log(err);
            //         },
            //         complete() {
            //             console.log('Complete action');
            //         },
            //     });

        } else {
            console.log('Formulario inValido');
            this.messageService.add({
                severity: 'warn',
                summary: 'Mensaje',
                detail: 'Producto Formulario es invalido',
                life: 3000
            });
        }

    }

    private sanatizarProductoPresentacionForm() {
        const productoBase = this.productoPresentacionForm.get('productoId')?.value;
        const unidadMedida = this.productoPresentacionForm.get('unidadMedidaId')?.value;
        const marca = this.productoPresentacionForm.get('marcaId')?.value;

        this.productoPresentacionForm.get('productoId')?.setValue(productoBase.id);
        this.productoPresentacionForm.get('unidadMedidaId')?.setValue(unidadMedida.id);
        this.productoPresentacionForm.get('marcaId')?.setValue(marca.id);

    }

    private buildFormAndInitValues() {
        this.marcaOptions = [MarcaOption.getInstance()];
        this.productoBaseOption = [ProductoBaseOption.getInstance()];
        this.unidadMedidaOption = [UnidadMedidaOption.getInstance()];

        this.productoPresentacionForm = this.formBuilder.group({

            productoId: [null, Validators.required],
            nombre: ['', Validators.required],
            concepto: [''],
            descripcion: [''],
            unidadMedidaId: [null, Validators.required],
            esUnidadBase: [false], // analizar esUnidadMinima
            factorConversion: [null],
            precioRef: [0, [Validators.required, Validators.min(1)]],
            precioVenta: [0, [Validators.required, Validators.min(1)]],
            precioXMayor: [0, [Validators.required, Validators.min(1)]],
            marcaId: [0, [Validators.required]],
        });

        // change detection para cambios en Forms
        this.productoPresentacionForm.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.cdr.markForCheck());
    }

    private cargarDatosComboBoxs() {
        this.marcaService.getAllMarcas()
            .subscribe((resp) => {
                const data = resp.data.content;
                this.marcaOptions.push(...data.map(marca => new MarcaOption(marca.id, marca.nombre)));
                // console.log("value: ", resp);
            });

        this.productoBaseService.getAllProductoBase()
            .subscribe((resp) => {
                const data = resp.content;
                this.productoBaseOption.push(...data.map(base => new ProductoBaseOption(base.id, base.nombre)));
                // console.log("value: ", resp);
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
    }

}
