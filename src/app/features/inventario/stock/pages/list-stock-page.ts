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
import { MessageService } from "primeng/api";
import { RippleModule } from "primeng/ripple";
import { ToastModule } from "primeng/toast";
import { StatusStock } from "../../../../shared/enums/status-stock.enum";
import { TooltipModule } from "primeng/tooltip";

@Component({
    imports: [
        CommonModule,
        RouterModule,
        TableModule,
        ButtonModule,
        InputIconModule,
        IconFieldModule,
        TagModule,
        InputTextModule,
        InputIconModule,
        BadgeModule,
        RippleModule,
        ToastModule,
        TooltipModule
    ],
    standalone: true,
    template: `
    <div class="card">
        <div class="font-semibold text-xl mb-4">List Stock works!</div>
    </div>
    <p-table
        #dt
        [value]="products()"
        [rows]="10"
        [rowHover]="false"
        [paginator]="true"
        [tableStyle]="{ 'min-width': '65rem' }"
        dataKey="id"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        [showCurrentPageReport]="true"
        [rowsPerPageOptions]="[10, 20, 30]"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="m-0">Manage Products</h5>
                <p-iconfield>
                    <p-inputicon styleClass="pi pi-search" />
                    <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                </p-iconfield>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th style="min-width: 3rem">Code</th>
                <th pSortableColumn="productoId" style="min-width: 7rem">
                    Marca
                    <p-sortIcon field="productoId" />
                </th>
                <th pSortableColumn="marcaId" style="min-width:14rem">
                    Nombre
                    <p-sortIcon field="marcaId" />
                </th>
                <!-- <th>Image</th> -->
                <th pSortableColumn="unidadMedidaId" style="min-width: 5rem">
                    U. Medida
                    <p-sortIcon field="unidadMedidaId" />
                </th>
                <th pSortableColumn="marcaId" style="min-width: 5rem">
                    Dias Expiracion
                    <p-sortIcon field="marcaId" />
                </th>
                <th pSortableColumn="nombre" style="min-width:5rem">
                    Stock Min.
                    <p-sortIcon field="nombre" />
                </th>
                <th pSortableColumn="stock" style="min-width: 5rem">
                    Status
                    <p-sortIcon field="stock" />
                </th>
                <th pSortableColumn="precioVenta" style="min-width: 7rem">
                    Stock Disponible
                </th>
                <th style="min-width: 4rem"></th>
            </tr>
        </ng-template>
        <ng-template #body let-product let-expanded="expanded">
            <tr>
                <td>PR-{{ product.id }}</td>
                <td>{{ product.marca }}</td>
                <td>{{ product.presentacion }}</td>
                <!-- <td>
                    <img [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + product.image" [alt]="product.name" style="width: 64px" class="rounded" />
                </td> -->
                <td>{{ product.unidadMedidaShort }}</td>
                <td>{{ product.diasAntesExpiracion }}</td>
                <td>{{ product.cantidadMinimoStock }}</td>
                <td>
                    <p-tag [value]="product.estadoStock" [severity]="getStockStatusClass(product.estadoStock)" />
                </td>
                <td>
                     <p-badge [value]="product.cantidadDisponibleStock" [severity]="getStockStatusClass(product.estadoStock)" />
                </td>
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
    providers: [ProductService, StockService]
})
export class ListStockPage implements OnInit {
    private productService = inject(ProductService);
    private stockService = inject(StockService);
    // private messageService = inject(MessageService);
    products = signal<ProductoStockOutput[]>([]);

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
}
