import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";

@Component({
    standalone: true,
    template: `<p>Pago works!</p>`
})
export class Pago { }



@Component({
    imports: [RouterModule, ButtonModule],
    standalone: true,
    template: `
    <p>VentaDetalle works!</p>
    <p-button label="Go back" severity="secondary" [routerLink]="'/venta'" />
    `
})
export class VentaDetalle { }

