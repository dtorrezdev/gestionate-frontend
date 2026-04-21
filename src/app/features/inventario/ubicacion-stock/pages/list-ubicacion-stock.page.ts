import { Component, inject, OnInit, signal } from "@angular/core";
import { UbicacionStockService } from "../service/ubicacion-stock.service";
import { UbicacionStockOutput } from "../dtos/ubicacion-stock.outpu";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ToolbarModule } from "primeng/toolbar";
import { BreadcrumbModule } from "primeng/breadcrumb";


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
        <div class="font-semibold text-xl mb-4">List Ubicacion Stock works!</div>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>

    <p-table #dt
        [value]="ubicacionStock()"
        [paginator]="true"
        [rowsPerPageOptions]="[10, 20, 50,100]"
        [rows]="10"
        [tableStyle]="{ 'min-width': '75rem' }"
        [rowHover]="true"
        dataKey="id"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Ubicacion Stock registradas</h5>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th style="min-width: 3rem; text-align: center;">Id</th>
                <th pSortableColumn="nombre" style="min-width:8rem">
                    Seccion
                    <p-sortIcon field="nombre" />
                </th>

                <th pSortableColumn="descripcion" style="min-width:12rem">
                    Estante
                    <p-sortIcon field="descripcion" />
                </th>
                <th pSortableColumn="descripcion" style="min-width:12rem">
                    Nivel
                    <p-sortIcon field="descripcion" />
                </th>
                <th style="min-width: 4rem"></th>
            </tr>
        </ng-template>
        <ng-template #body let-ubi>
            <tr>
                <td style="min-width: 3rem; text-align: center;">{{ ubi.id }}</td>
                <td style="min-width: 8rem">{{ ubi.seccion }}</td>
                <td style="min-width: 12rem">{{ ubi.estante }}</td>
                <td style="min-width: 12rem">{{ ubi.nivel }}</td>
                <td style="min-width: 4rem">
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" />
                </td>
            </tr>
        </ng-template>
    </p-table>
    `,
    providers: [UbicacionStockService]
})
export class ListUbicacionStockPage implements OnInit {

    private ubicacionStockService = inject(UbicacionStockService);

    ubicacionStock = signal<UbicacionStockOutput[]>([]); //

    constructor() { }

    ngOnInit() {
        this.ubicacionStockService.getAllUbicacionStock()
            .subscribe({
                next: (resp) => {
                    const items = resp.data.content;
                    console.log('Ubicacion Stock:', resp);
                    this.ubicacionStock.set(items);
                }
            });
    }
}
