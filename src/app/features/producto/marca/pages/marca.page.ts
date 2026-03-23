import { Component } from "@angular/core";
import { MessageService } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { ToolbarModule } from "primeng/toolbar";
import { MarcaService } from "../../services/marca.service";

@Component({
    imports: [
        BreadcrumbModule,
        ToolbarModule,
        ButtonModule,
    ],
    standalone: true,
    template: `
    <div class="card mb-0 pb-1">
        <div class="font-semibold text-xl mb-4">Listar Marcas</div>
        <p-breadcrumb
            [model]="breadcrumbItems"
            [home]="breadcrumbHome">
        </p-breadcrumb>
    </div>
    <p-toolbar styleClass="mb-6 n-border n-border-r">
        <ng-template #start>
            <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2"/>
            <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined/>
        </ng-template>

        <ng-template #end>
            <p-button label="Export" icon="pi pi-upload" severity="secondary"/>
        </ng-template>
    </p-toolbar>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Marca works!</div>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>`,
    styles: `
        .mb-0 {
            margin-bottom: 0;
        }

        .pb-0 {
            padding-bottom: 0;
        }

        .pb-1 {
            padding-bottom: 1rem;
        }

        .n-border {
            border: none;
        }
        .n-border-r {
            border-radius: 0;
        }

        .mt-1 {
            margin-top: 1.5rem;
        }
    `,
    providers: [MarcaService, MessageService]
})
export class Marca {

    // MenuBar BreadcrumbModule
    breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    breadcrumbItems = [{ label: 'Marcas' }, { label: 'Listar' }, { label: 'Todo' }];

    constructor(
        private marcaService: MarcaService,
        private messageService: MessageService,
    ) { }

    ngOnInit() {
        this.loadDemoData();
    }
    loadDemoData() {
        this.marcaService.getAllMarcas()
            .subscribe(items =>
                console.log('items: ', items)

            );


    }
}
