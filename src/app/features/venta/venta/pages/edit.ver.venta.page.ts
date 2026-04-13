import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { ProductService } from "../../../producto/services/producto.service";
import { ClienteService } from "../../services/cliente.service";
import { VentaService } from "../../services/venta.service";
import { MovimientoService } from "../../../inventario/movimiento/service/movimiento.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { SelectModule } from 'primeng/select';
import { CommonModule } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ToggleSwitchModule } from "primeng/toggleswitch";

interface City {
    nombre: string;
    code: string;
}



@Component({
    imports: [
        ReactiveFormsModule,
        RouterModule,
        ButtonModule,
        BreadcrumbModule,
        SelectModule,
        CommonModule,
        ToggleSwitchModule
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-1">
        <div class="font-bold text-xl mb-4">
            {{ (editMode)? 'Editacion de Venta' : 'Mostrar Venta en Detalle' }}
        </div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
    </div>
    <form [formGroup]="ventaForm"  class="card">
        <div class="font-semibold text-xl mb-4">
            {{ (editMode)? 'Editar' : 'Mostrar' }} Orden Venta V-12
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
                <p-select
                    id="producto"
                    [options]="productoPresentacionOptions"
                    optionLabel="presentacion"
                    placeholder="Seleccione Producto" class="w-full">
                    <ng-template #selectedItem let-productoPre>
                        <div class="flex items-center gap-2">
                            <div>{{ productoPre.code }} - {{ productoPre.nombre }}</div>
                        </div>
                    </ng-template>
                    <ng-template let-producto #item>
                        <div class="flex items-center gap-2">
                            <div>{{ producto.code }} - {{ producto.nombre }}</div>
                        </div>
                    </ng-template>
                </p-select>
            </div>
            <div class="flex gap-2 w-full flex-cc">
                <label for="pago">Pagos: </label>
                <p-toggleswitch  formControlName="hasPay" />
            </div>
        </div>

        <p>
            EditVerVentaPage works!
                {{ventaForm.value | json}}
        </p>

        <p-button label="Go back" severity="secondary" [routerLink]="'/venta'" />
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
    `,
    providers: [ProductService, ClienteService, VentaService, MovimientoService, MessageService]
})
export class EditVerVentaPage implements OnInit {
    // Providers
    private productService = inject(ProductService);
    private clienteService = inject(ClienteService);
    private ventaService = inject(VentaService);
    private movimientoService = inject(MovimientoService);
    private activatedRoute = inject(ActivatedRoute);
    private formBuilder = inject(FormBuilder);
    private messageService = inject(MessageService);
    private readonly cdr = inject(ChangeDetectorRef);

    // Field Forms
    public ventaForm!: FormGroup;
    public editMode: boolean = false;

    clienteOptions!: City[];
    public productoPresentacionOptions!: City[];

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Ventas'}, { label: 'Ver/ Editar Venta' }];

    constructor() {
        this.buildFormAndInitValues();
    }

    public ngOnInit(): void {
        const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        const url = this.activatedRoute.snapshot.routeConfig?.path;
        this.editMode =  url?.startsWith('edit/') || false;
        console.log('editMode ', this.editMode , ' url: ', url);
        this.getVenta(id);
        this.loadDataToVentaForm();
    }

    private getVenta(id: number): void {
        console.log("getVenta ", id);
    }

    private buildFormAndInitValues(): void {
        this.ventaForm = this.crearVentaForm();
        // this.ventaForm.valueChanges
        //             .pipe(takeUntilDestroyed())
        //             .subscribe(() => this.cdr.markForCheck());
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

    private loadDataToVentaForm() {
        this.clienteOptions = [
            { nombre: 'New York', code: 'NY' },
            { nombre: 'Rome', code: 'RM' },
            { nombre: 'London', code: 'LDN' },
            { nombre: 'Istanbul', code: 'IST' },
            { nombre: 'Paris', code: 'PRS' }
        ];
        this.productoPresentacionOptions = [
            { nombre: 'New York', code: 'NY' },
            { nombre: 'Rome', code: 'RM' },
            { nombre: 'London', code: 'LDN' },
            { nombre: 'Istanbul', code: 'IST' },
            { nombre: 'Paris', code: 'PRS' }
        ];
    }

    // Getters
    get hasPay(): boolean { return this.ventaForm.get('hasPay')?.value || false; }
}
