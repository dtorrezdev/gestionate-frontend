import { Routes } from "@angular/router";
import { Cliente, Pago } from "./pages";
import { VentaPage } from "./venta/pages/venta.page";
import { ListVentaPage } from "./venta/pages/list.venta.page";

export default [
    { path: '', component: ListVentaPage },
    { path: 'add', component: VentaPage },
    { path: 'cliente', component: Cliente },
    { path: 'pago', component: Pago },
    { path: '**', redirectTo: '/about' }
] as Routes;
