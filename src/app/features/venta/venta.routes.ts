import { Routes } from "@angular/router";
import { Cliente, Pago } from "./pages";
import { VentaPage } from "./venta/pages/venta.page";

export default [
    { path: '', component: VentaPage },
    { path: 'cliente', component: Cliente },
    { path: 'pago', component: Pago },
    { path: '**', redirectTo: '/about' }
] as Routes;
