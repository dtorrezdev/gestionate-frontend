import { Component, inject, OnInit, signal } from "@angular/core";
import { UnidadMedidaService } from "../service/unidad-medida.service";
import { UnidadMedidaOuput } from "../dto/unidad-medida.output";
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
        <div class="font-semibold text-xl mb-4">ListUnidadMedidaPage works!</div>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>

    <p-table #dt
        [value]="unidadesMedidas()"
        [paginator]="true"
        [rowsPerPageOptions]="[10, 20, 50,100]"
        [rows]="10"
        [tableStyle]="{ 'min-width': '75rem' }"
        [rowHover]="true"
        dataKey="id"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="pl-1">Unidades de Medida registradas</h5>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th style="min-width: 3rem; text-align: center;">Id</th>
                <th pSortableColumn="nombre" style="min-width:8rem">
                    Abreviatura
                    <p-sortIcon field="nombre" />
                </th>
                <th pSortableColumn="descripcion" style="min-width:12rem">
                    Nombre
                    <p-sortIcon field="descripcion" />
                </th>
                <th style="min-width: 4rem"></th>
            </tr>
        </ng-template>
        <ng-template #body let-unidadMedida>
            <tr>
                <td style="min-width: 3rem; text-align: center;">{{ unidadMedida.id }}</td>
                <td style="min-width: 8rem">{{ unidadMedida.abreviatura }}</td>
                <td style="min-width: 12rem">{{ unidadMedida.nombre }}</td>
                <td style="min-width: 4rem">
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" />
                </td>
            </tr>
        </ng-template>
    </p-table>

    `,
    providers: [UnidadMedidaService]
})
export class ListUnidadMedidaPage implements OnInit {

    private unidadMedidaService = inject(UnidadMedidaService);

    unidadesMedidas = signal<UnidadMedidaOuput[]>([]);

    constructor() { }

    ngOnInit(): void {
        this.unidadMedidaService.getAllUnidadMedida()
            .subscribe({
                next: (resp) => {
                    const  data = resp.data.content;
                    console.log('getAllUnidadMedida: ', resp);
                    this.unidadesMedidas.set(data);
                }
            });
    }


}
