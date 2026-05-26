import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
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
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ViewConfig } from '../../../../../core/interface/view-config';
import { StorageService } from '../../../../../core/services/storage-service';
import { DrawerModule } from 'primeng/drawer';
import { CheckboxModule } from 'primeng/checkbox';
import { VentaOutput } from '../../dto/venta.output';
import { ToastService } from '../../../../../core/services/toast.service';

(pdfMake as any).vfs = pdfFonts.vfs;

@Component({
    imports: [
        ReactiveFormsModule,
        RouterModule,
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        BreadcrumbModule,
        SelectModule,
        InputNumberModule,
        TagModule,
        ToastModule,
        ToggleSwitchModule,
        RippleModule,
        DrawerModule,
        CheckboxModule
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
    providers: [ProductService, ClienteService, VentaService, StockService, StorageService]
})
export class AddVentaPage implements OnInit {
    private productService = inject(ProductService);
    private clienteService = inject(ClienteService);
    private ventaService = inject(VentaService);
    private stockService = inject(StockService);
    private storageService = inject(StorageService);
    private formBuilder = inject(FormBuilder);
    private toastService = inject(ToastService);
    private readonly cdr = inject(ChangeDetectorRef);

    private router = inject(Router);

    public ventaForm!: FormGroup;
    public clienteOptions!: ClienteOption[];
    public productoPresentacionOptions!: PresentacionOuput[];

    viewConfig!: ViewConfig;

    visibleRight: boolean = false;

    columnasSpan: number = 5;

    public metodoValues = [
        { name: 'EFECTIVO', code: 'EF' },
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
            this.toastService.mostrarMsg('warn', 'Venta Formulario es invalido');
        }
    }

    private cargarDatosToVentaForm(evt?: SubmitEvent) {
        const estado = evt ? 'VENTA' : 'PREVENTA';
        const clienteSelected = this.ventaForm.get('clienteId')?.value;
        this.ventaForm.get('estado')?.setValue(estado);
        this.ventaForm.get('clienteId')?.setValue(clienteSelected.id);
        this.ventaForm.get('cliente')?.setValue(clienteSelected.nombre);
    }

    private saveVentaForm(): void {
        this.ventaService.save(this.ventaForm.value)
                .subscribe({
                    next: (resp) => {
                        console.log(resp);
                        this.toastService.mostrarMsg('success', this.ventaForm.get('estado')?.value + ' registrado correctamente');
                        this.ventaForm.get('id')?.setValue(resp.data.id);
                        this.exportPdf(this.ventaForm.value as VentaOutput);
                        this.navigateToListVentas();
                    },
                    error: (err) => this.toastService.mostrarMsg('error', err),
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
                            //const total = presentacion.precio * presentacion.cantidad;
                            const total = Math.ceil((presentacion.precio * presentacion.cantidad) * 100) / 100;
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
            this.toastService.mostrarMsg('info', 'El producto ' + productoPre.presentacion
                + ' esta en la fila nro ' + (findIndexInDetalle + 1));
            return false;
        }
        if(productoPre.estadoStock === 'AGOTADO') {
            this.toastService.mostrarMsg(
                'warn',
                'El producto ' + productoPre.presentacion + ' esta AGOTADO.'
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
        if ((this.totalPago + monto) > this.total) {
            this.toastService.mostrarMsg('info', 'El monto debe ser igual al total venta.');
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
            id: [null],
            clienteId: [null, Validators.required],
            codigo: ['V-1', Validators.required],
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
        this.loadConfigColumns();
    }
    private loadConfigColumns(): void {
        const config =
            this.storageService.getViewConfig<ViewConfig>(
                'tenant-110',
                'user-1',
                'view-venta-add'
            );

        if (config) {
            this.viewConfig = config;
        } else {
            this.viewConfig = {
                columns: [{ field: 'code', header: 'Código', width: 'min-width: 2rem', visible: true },
                { field: 'producto', header: 'Producto', width: 'min-width: 18rem', visible: true },
                { field: 'estadoStock', header: 'Status', width: 'min-width:8rem', visible: true },
                { field: 'precioVenta', header: 'Precio', width: 'min-width: 4rem', visible: true },
                { field: 'cantidad', header: 'Cantidad', width: 'min-width:4rem', visible: true },
                { field: 'subtotal', header: 'Subtotal', width: 'min-width: 4rem', visible: true },
                { field: '', header: 'Acciones', width: 'min-width: 8rem', visible: true }],
            };
        }
    }

    private crearDetalle(presentacionProducto?: PresentacionOuput, stocks?: FormArray,): FormGroup {
        return this.formBuilder.group({
            presentacionId: [presentacionProducto?.id || null, Validators.required],
            nombre: [presentacionProducto?.presentacion || ''],
            productoId: [presentacionProducto?.productoId || null, Validators.required],
            precio: [presentacionProducto?.precioVenta || 0, [Validators.required, Validators.min(1)]],
            cantidad: [1, [Validators.required, Validators.min(1)]],
            subtotal: [presentacionProducto ? presentacionProducto.precioVenta : 0, [Validators.required, Validators.min(1)]],
            stocks: stocks,
            estadoStock: [presentacionProducto?.estadoStock || ''],
            seControlaStock: [presentacionProducto?.seControlaStock || false]
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

    exportPdf(venta: VentaOutput) {
        const docDefinition: any = {
            pageSize: { width: 226.77, height: 'auto' }, // 80mm -> 226.77 70mm -> 215.43
            pageMargins: [10, 10, 10, 10],
            content: [
                { text: 'NOTA DE VENTA', style: 'titulo', alignment: 'center' },
                { text: 'PASTORAL SOCIAL CARITAS BENI', style: 'titulo', alignment: 'center' },
                { text: 'FARMACIA CARITAS', style: 'titulo', alignment: 'center' },
                { text: 'Av. Rogaguado Esq. Isiboro s/n', alignment: 'center', fontSize: 8 },
                { text: 'Celular: 72810976', alignment: 'center', fontSize: 8 },
                { text: 'Trinidad - Bolivia', alignment: 'center', fontSize: 8 },
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 205, y2: 0, lineWidth: 0.8 }] },
                { text: '\n' },
                { text: `Fecha de compra: ${venta.fechaRegistro}`, fontSize: 8 },
                { text: `Cliente: ${venta.cliente}`, fontSize: 8 },
                { text: `Nro Venta: ${venta.id}`, fontSize: 8 },
                { text: 'Detalle de venta', style: 'subtitulo' },
                {
                    layout: {
                        hLineWidth: function (i: any, node: any) {
                            // Línea superior del header (i === 1)
                            if (i === 1) return 0.5;

                            // No dibujar línea después de la última fila
                            if (i === node.table.body.length) return 0;

                            // Para las filas de detalle
                            return 0.5;
                        },
                        vLineWidth: function () {
                            return 0; // Sin líneas verticales
                        },
                        hLineColor: function () {
                            return '#ccc'; // Color suave
                        }
                    },
                    table: {
                        widths: ['50%', '10%', '20%', '20%'],
                        body: [
                            [
                                { text: 'Producto', style: 'tableHeader', fontSize: 8 },
                                { text: 'Cantidad', style: 'tableHeader', fontSize: 8 },
                                { text: 'Precio', style: 'tableHeader', alignment: 'right', fontSize: 8 },
                                { text: 'Total', style: 'tableHeader', alignment: 'right', fontSize: 8 }
                            ],
                            ...(venta.detalle || []).map(item => [
                                { text: item.productoId, fontSize: 8 },
                                { text: item.cantidad, fontSize: 8 },
                                { text: item.precio.toFixed(2), alignment: 'right', fontSize: 8 },
                                { text: item.subtotal.toFixed(2), alignment: 'right', fontSize: 8 }
                            ])
                        ]
                    }
                },
                // Línea divisoria antes del total
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 205, y2: 0, lineWidth: 0.5 }] },
                // Fila total general
                {
                    layout: 'noBorders',
                    table: {
                        widths: ['*', 'auto'],
                        body: [
                            [
                                { text: 'SUB TOTAL BS.', bold: true, fontSize: 9 },
                                { text: venta.total.toFixed(2), bold: true, fontSize: 9, alignment: 'right' }
                            ],
                            [
                                { text: 'DESCUENTO BS.', bold: true, fontSize: 9 },
                                { text: (0).toFixed(2), bold: true, fontSize: 9, alignment: 'right' }
                            ],
                            [
                                { text: 'TOTAL BS.', bold: true, fontSize: 9 },
                                { text: venta.total.toFixed(2), bold: true, fontSize: 9, alignment: 'right' }
                            ]
                        ]
                    }
                },
                { text: '\n' },
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 205, y2: 0, lineWidth: 0.5 }] },
                { text: 'NO VALIDO PARA CRÉDITO FISCAL', style: 'subtitulo', alignment: 'center' },
                { text: '\nGracias por su preferencia!', alignment: 'center', fontSize: 8 },
            ],
            styles: {
                titulo: {
                    fontSize: 12,
                    bold: true
                },
                subtitulo: {
                    fontSize: 9,
                    bold: true,
                    margin: [0, 5, 0, 2]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 9,
                    alignment: 'center'
                }
            }
        };
        pdfMake.createPdf(docDefinition).download('invoice.pdf');
        /*
        Revisar esta codigo
        https://stackblitz.com/edit/ng-pdfmake-invoice-generator-dwsxa2?file=package.json
        https://stackblitz.com/edit/export-pdf-angular?file=package.json
        https://stackblitz.com/edit/angular-pdfmake-example-ntk7up?file=src%2Fapp%2Fapp.component.ts
        https://dev.to/ankitprajapati/angular-export-to-pdf-using-pdfmake-client-side-pdf-generation-1jlk

        */
    }

    saveConfigColumns() {
        console.log('saveConfigColumns()');
        console.log('se va guardar configuracion columnas ', this.viewConfig);
        this.storageService.setViewConfig<ViewConfig>(
            'tenant-110',
            'user-1',
            'view-venta-add',
            this.viewConfig
        );
        this.columnasSpan = this.viewConfig.columns.filter(col => col.visible).length - 2;
    }

}
