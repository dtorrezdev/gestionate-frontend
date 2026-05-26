import { Component, inject, OnInit, signal } from "@angular/core";
import { ProductService } from "../../../producto/presentacion/services/producto.service";
import { PresentacionOuput } from "../../../producto/presentacion/dto/presentacion.output";
import { Table, TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputIconModule } from "primeng/inputicon";
import { IconFieldModule } from "primeng/iconfield";
import { TagModule } from "primeng/tag";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { StockService } from "../service/stock.service";
import { ProductoStockOutput } from "../dtos/producto-stock.output";
import { map, switchMap} from "rxjs";
import { StockByProductoOutput } from "../dtos/stock-by-producto.output";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { InputTextModule } from "primeng/inputtext";
import { BadgeModule } from "primeng/badge";
import { RippleModule } from "primeng/ripple";
import { StatusStock } from "../../../../shared/enums/status-stock.enum";
import { TooltipModule } from "primeng/tooltip";
import { StorageService } from "../../../../core/services/storage-service";
import { ViewConfig } from "../../../../core/interface/view-config";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ToolbarModule } from "primeng/toolbar";
import { DrawerModule } from "primeng/drawer";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";

@Component({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputIconModule,
        IconFieldModule,
        TagModule,
        InputTextModule,
        InputIconModule,
        BadgeModule,
        RippleModule,
        TooltipModule,
        BreadcrumbModule,
        ToolbarModule,
        DrawerModule,
        CheckboxModule
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-1">
        <div class="font-semibold text-xl mb-4">Listado Stocks Productos</div>
        <p-breadcrumb [model]="breadcrumbItems" [home]="breadcrumbHome"></p-breadcrumb>
    </div>

    <p-toolbar styleClass="mb-6  n-border n-border-r">
        <ng-template #start>
            <p-button label="New Producto" icon="pi pi-plus" severity="secondary" class="mr-2"/>
            <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined />
        </ng-template>

        <ng-template #end>
            <p-button icon="pi pi-arrow-left" (click)="visibleRight = true" [style]="{ marginRight: '0.25em' }" />
            <p-drawer [(visible)]="visibleRight" header="Columnas Visibles" position="right" (onHide)="saveConfigColumns()">
                <!-- <div class="font-semibold text-xl">Columnas</div> -->
                <div class="flex flex-col gap-4">
                        @for(col of viewConfig.columns; track col.field) {
                            <!-- @if(col.field !== '') { -->
                            <div class="flex items-center flex-jc-se">
                                <label [for]="col.field" class="ml-2">{{col.header}}</label>
                                <p-checkbox
                                    [id]="col.field"
                                    [binary]="true"
                                    [(ngModel)]="col.visible" />
                            </div>
                            <!-- } -->
                        }
                    </div>
            </p-drawer>
            <p-button label="Export" icon="pi pi-upload" severity="secondary"/>
        </ng-template>
    </p-toolbar>

    <p-table
        #dt
        [value]="products()"
        [columns]="viewConfig.columns"
        [rows]="10"
        [rowHover]="false"
        [paginator]="true"
        [tableStyle]="{ 'min-width': '65rem' }"
        dataKey="id"
        currentPageReportTemplate="Mostrar {first} a {last} del {totalRecords} productos"
        [showCurrentPageReport]="true"
        [rowsPerPageOptions]="[10, 20, 30]"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="m-0">Stock Productos</h5>
                <p-iconfield>
                    <p-inputicon styleClass="pi pi-search" />
                    <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                </p-iconfield>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
            @for (col of viewConfig.columns; track col.field) {
                @if(col.visible) {
                <th [style]="col.width"
                    [pSortableColumn]="col.field">
                    {{ col.header }}
                    <p-sortIcon [field]="col.field" />
                </th>
                }
            }
            </tr>
        </ng-template>
        <ng-template #body let-product let-expanded="expanded">
            <tr>
            @for (col of viewConfig.columns; track col) {
                @if(col.visible) {
                    @switch (col.field) {
                        @case ('codigo') {
                        <td>PR-{{ product.id }}</td>
                        }
                        @case ('estadoStock') {
                        <td>
                            <p-tag [value]="product.estadoStock"
                                [severity]="getStockStatusClass(product.estadoStock)" />
                        </td>
                        }
                        @case ('cantidadDisponibleStock') {
                        <td>
                            <p-badge [value]="product.cantidadDisponibleStock" [severity]="getStockStatusClass(product.estadoStock)" />
                        </td>
                        }
                        @case('') {
                        <td>
                            @if(product.stocks?.length){
                            <p-button
                                pTooltip="Ver detalle Stock" tooltipPosition="top"
                                class="mr-2"
                                pRipple
                                [pRowToggler]="product"
                                [rounded]="true"
                                [outlined]="true"
                                severity="info"
                                [icon]="expanded ? 'pi pi-eye-slash' : 'pi pi-eye'"
                            />
                            }
                            <p-button icon="pi pi-pencil"
                                pTooltip="Editar Stock" tooltipPosition="top"
                                [rounded]="true"
                                [outlined]="true"
                            />
                        </td>
                        }
                        @default {
                        <td>
                            {{ product[col.field] }}
                        </td>
                        }
                    }
                }
            }
            </tr>
        </ng-template>
        <ng-template #expandedrow let-product>
            <tr>
                <td colspan="9">
                    <div class="p-4">
                        <h5>Stock for {{ product.presentacion }}</h5>
                        <p-table [value]="product.stocks" dataKey="id">
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
                                    <td>{{ stock.expiracion || 'S/N' }}</td>
                                    @if(stock.seccion) {
                                        <td>Seccion: {{ stock.seccion }}->Estante: {{ stock.estante }}->Nivel: {{ stock.nivel }}</td>
                                    }@else {
                                        <td>S/N</td>
                                    }

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
    </p-table>
    `,
    providers: [ProductService, StockService, StorageService]
})
export class ListStockPage implements OnInit {
    private productService = inject(ProductService);
    private stockService = inject(StockService);
    private storageService = inject(StorageService);

    products = signal<ProductoStockOutput[]>([]);

    viewConfig!: ViewConfig;

    visibleRight: boolean = false;

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Inventario' }, { label: 'Productos en Stocks' }, { label: 'Todos' }];

    constructor() { }

    ngOnInit(): void {
        this.loadDataTable();
    }

    private loadDataTable(): void {
        this.stockService.getStocksAll().pipe(
            switchMap((resp: CommonResponse<Record<string, StockByProductoOutput[]>>) => {

                const stockMap = resp.data as Record<string, StockByProductoOutput[]>;
                console.log('stockMap ', stockMap, typeof stockMap);
                return this.productService.list().pipe(
                    map((respProd: CommonResponse<ListResponse<PresentacionOuput>>) => {

                        const productos = respProd.data.content as PresentacionOuput[];
                        console.log("productos ", productos);
                        return productos.map(prod => ({
                            ...prod,
                            stocks: stockMap[String(prod.id)] || []
                        }));
                    })
                );
            })
            ).subscribe(productosConStock => {
                console.log('producto con stock', productosConStock);

                this.products.set(productosConStock);
            });

        this.loadConfigColumns();
    }

    private loadConfigColumns(): void {
        const config =
            this.storageService.getViewConfig<ViewConfig>(
                'tenant-110',
                'user-1',
                'view-stock-producto'
            );

        if (config) {
            this.viewConfig = config;
        } else {
            this.viewConfig = {
                columns: [{ field: 'codigo', header: 'Código', width: 'min-width: 5rem', visible: true },
                { field: 'marca', header: 'Macra', width: 'min-width: 10rem', visible: true },
                { field: 'presentacion', header: 'Nombre', width: 'min-width:16rem', visible: true },
                { field: 'unidadMedida', header: 'En', width: 'min-width: 4rem', visible: true },
                { field: 'diasAntesExpiracion', header: 'Dias Expiracion', width: 'min-width:6rem', visible: false },
                { field: 'cantidadMinimoStock', header: 'Stock Min.', width: 'min-width: 5rem', visible: true },
                { field: 'estadoStock', header: 'Status', width: 'min-width: 5rem', visible: true },
                { field: 'cantidadDisponibleStock', header: 'Stock Disponible', width: 'min-width: 5rem', visible: true },
                { field: '', header: 'Acciones', width: 'min-width: 8rem', visible: true }],
            };
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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

    saveConfigColumns() {
        console.log('saveConfigColumns()');
        console.log('se va guardar configuracion columnas ', this.viewConfig);
        this.storageService.setViewConfig<ViewConfig>(
            'tenant-110',
            'user-1',
            'view-stock-producto',
            this.viewConfig
        );
    }
}
