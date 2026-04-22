import { Component, inject, OnInit } from "@angular/core";
import { CategoriaService } from "../service/categoria.service";


@Component({
    standalone: true,
    template: `
    <div class="card">
        <div class="font-semibold text-xl mb-4">CategoriaPage works!</div>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>`,
    styles: ``,
    providers: [CategoriaService]
})
export class CategoriaPage implements OnInit {

    private categoriaService = inject(CategoriaService);

    ngOnInit(): void {

        this.categoriaService.getAllCategorias()
            .subscribe({
                next: (resp) => {
                    console.log(resp);
                }
            });
    }

}
