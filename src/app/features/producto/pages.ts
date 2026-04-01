import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";

@Component({
    standalone: true,
    template: `
    <div class="card">
        <div class="font-semibold text-xl mb-4">ProductoBase works!</div>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>`
})
export class ProductoBase { }

@Component({
    standalone: true,
    template: `
    <div class="card">
        <div class="font-semibold text-xl mb-4">UnidadMedida works!</div>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>`
})
export class UnidadMedida { }

@Component({
    standalone: true,
    template: `<div class="card">
        <div class="font-semibold text-xl mb-4">Categoria works!</div>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>`
})
export class Categoria { }


