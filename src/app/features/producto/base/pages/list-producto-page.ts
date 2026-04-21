import { Component, inject, OnInit, signal } from "@angular/core";
import { ProductoBaseService } from "../service/producto.base.service";
import { ProductoBaseOutput } from "../dto/producto.base.output";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ToolbarModule } from "primeng/toolbar";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";


@Component({
    imports: [
        BreadcrumbModule,
        ToolbarModule,
        TableModule,
        ButtonModule
    ],
    standalone: true,
    template: `
    <div class="card">
        <div class="font-semibold text-xl mb-4">ListProductoPage works!</div>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>
    <p-table #dt
        [value]="productos()"
        [paginator]="true"
        [rowsPerPageOptions]="[10, 20, 50,100]"
        [rows]="10"
        [tableStyle]="{ 'min-width': '75rem' }"
        [rowHover]="true"
        dataKey="id"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Productos Base registrados</h5>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th style="min-width: 3rem; text-align: center;">ID</th>
                <th pSortableColumn="nombre" style="min-width:8rem">
                    Codigo
                    <p-sortIcon field="nombre" />
                </th>

                <th pSortableColumn="descripcion" style="min-width:12rem">
                    Nombre
                    <p-sortIcon field="descripcion" />
                </th>
                <th pSortableColumn="descripcion" style="min-width:12rem">
                    Categoria
                    <p-sortIcon field="descripcion" />
                </th>
                <th pSortableColumn="descripcion" style="min-width:12rem">
                    Descripcion
                    <p-sortIcon field="descripcion" />
                </th>
                <th style="min-width: 4rem"></th>
            </tr>
        </ng-template>
        <ng-template #body let-ubi>
            <tr>
                <td style="min-width: 3rem; text-align: center;">{{ ubi.id }}</td>
                <td style="min-width: 8rem">{{ ubi.codigo }}</td>
                <td style="min-width: 12rem">{{ ubi.nombre }}</td>
                <td style="min-width: 12rem">{{ ubi.categoriaId }}</td>
                <td style="min-width: 12rem">{{ ubi.descripcion }}</td>
                <td style="min-width: 4rem">
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" />
                </td>
            </tr>
        </ng-template>
    </p-table>
    `,
    providers: [ProductoBaseService]
})
export class ListProductoPage implements OnInit {

    private productoService = inject(ProductoBaseService);

    productos = signal<ProductoBaseOutput[]>([]);

    constructor() { }

    ngOnInit(): void {
        this.productoService.getAllProductoBase()
            .subscribe({
                next: (resp) => {
                    console.log(resp);
                    this.productos.set(resp.content);
                }
            });
    }

}
