import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
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

import { ProductService } from "../../../../producto/presentacion/services/producto.service";
import { ClienteService } from '../../../services/cliente.service';
import { ClienteOption } from '../../../cliente/dto/cliente.option';
import { PresentacionOuput } from '../../../../producto/presentacion/dto/presentacion.output';
import { VentaService } from '../../../services/venta.service';
import { StockByProductoOutput } from '../../../../inventario/stock/dtos/stock-by-producto.output';
import { StatusStock } from '../../../../../shared/enums/status-stock.enum';
import { StockService } from '../../../../inventario/stock/service/stock.service';
import { ClienteOutput } from '../../../cliente/dto/cliente.output';

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
    templateUrl: "./add.venta.page.html",
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
    providers: [ProductService, ClienteService, VentaService, StockService, MessageService]
})
export class AddVentaPage implements OnInit {
    private productService = inject(ProductService);
    private clienteService = inject(ClienteService);
    private ventaService = inject(VentaService);
    private stockService = inject(StockService);
    private formBuilder = inject(FormBuilder);
    private messageService = inject(MessageService);
    private readonly cdr = inject(ChangeDetectorRef);
    private router = inject(Router);

    public ventaForm!: FormGroup;
    public clienteOptions!: ClienteOption[];
    public productoPresentacionOptions!: PresentacionOuput[];

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
            this.mostrarMsg('warn','Venta Formulario es invalido');
        }
    }

    private cargarDatosToVentaForm(evt?: SubmitEvent) {
        const estado = evt ? 'VENTA' : 'PREVENTA';
        const clienteSelected = this.ventaForm.get('clienteId')?.value;
        this.ventaForm.get('estado')?.setValue(estado);
        this.ventaForm.get('clienteId')?.setValue(clienteSelected.id);
    }

    private saveVentaForm(): void {
        this.ventaService.save(this.ventaForm.value)
                .subscribe({
                    next: (resp) => {
                        console.log(resp);
                        this.mostrarMsg('success', this.ventaForm.get('estado')?.value + ' registrado correctamente');
                        this.navigateToListVentas();
                    },
                    error: (e) => this.mostrarMsg(
                        'error','Error al guardar venta ' + e.error?.message),
                });
    }

    addDetalle(presentacionProducto: PresentacionOuput) {
        console.log('addDetalle ', presentacionProducto);
        if (this.esValidoProducto(presentacionProducto) ) {
            this.stockService.getStockByProducto(presentacionProducto.id)
                .subscribe({
                    next: (resp) => {
                        console.log('resp', resp);
                        const stocks = resp.data.stocks || [];
                        const newDetalle = this.crearDetalle(presentacionProducto, this.crearFormArrayStock(stocks));
                        newDetalle.valueChanges.subscribe((presentacion) => {
                            const total = presentacion.precio * presentacion.cantidad;
                            newDetalle.get('subtotal')?.setValue(total, { emitEvent: false });
                        });

                        console.log('new Detalle with stock ', newDetalle);

                        this.detalle.push(newDetalle);
                        this.ventaForm.get('hasPay')?.enable();
                    },
                    error: (err) => console.log(err)
                });
        }
    }

    private esValidoProducto(productoPre: PresentacionOuput): boolean {
        if (productoPre.id == 0) return false;
        const findIndexInDetalle = this.findIndexDelProductoEnDetalle(productoPre);
        if(findIndexInDetalle > -1) {
            this.mostrarMsg('info', 'El producto ' + productoPre.nombre
                + ' esta en la fila nro ' + (findIndexInDetalle + 1));
            return false;
        }
        if(productoPre.estadoStock === 'AGOTADO') {
            this.mostrarMsg(
                'warn',
                'El producto ' + productoPre.nombre + ' esta AGOTADO.'
            );
            return false;
        }
        return  true;
    }

    isPreventaDisable() {
        return this.detalle.invalid || this.detalle.length === 0 || this.hasPay;
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
            this.mostrarMsg('info', 'El tipo pago no ingresado.');
            return false;
        }
        const findIndexDetallePago = this.detallePagos.controls
            .findIndex(ele => ele.value.tipo === tipo);
        if (findIndexDetallePago > -1) {
            this.mostrarMsg('info', 'El tipo pago ya esta registrado.');
            return false;
        }
        if (monto == 0 || monto > this.total) {
            this.mostrarMsg('info', 'El monto debe ser mayor a 0, \ny menor igual al total venta.');
            return false;
        }
        if ((this.totalPago + monto) > this.total) {
            this.mostrarMsg('info', 'El monto debe ser igual al total venta.');
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
            precio: presentacionProd.precioVenta,
        });
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
                monto: [0],
                detallePago: this.formBuilder.array([]),
                totalPago: [0, [Validators.required, Validators.min(1)]]
            }),
        });
    }

    private loadDataToVentaForm(): void {
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
            nombre: [presentacionProducto?.nombre || ''],
            productoId: [presentacionProducto?.productoId || null, Validators.required],
            precio: [presentacionProducto?.precioVenta || 0, [Validators.required, Validators.min(1)]],
            cantidad: [1, [Validators.required, Validators.min(1)]],
            subtotal: [presentacionProducto ? presentacionProducto.precioVenta : 0, [Validators.required, Validators.min(1)]],
            stocks: stocks,
            estadoStock: [presentacionProducto?.estadoStock || ''],
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
            this.router.navigate(['/venta']), 3000);
        ;
    }
}
