import { Routes } from "@angular/router";
import { Pago } from "./pages";
import { AddVentaPage } from "./venta/pages/add.venta.page";
import { ListVentaPage } from "./venta/pages/list.venta.page";
import { ClientePage } from "./cliente/pages/cliente.page";

export default [
    { path: '', component: ListVentaPage },
    { path: 'add', component: AddVentaPage },
    { path: 'cliente', component: ClientePage },
    { path: 'pago', component: Pago },
    { path: '**', redirectTo: '/about' }
] as Routes;
