import { Routes } from "@angular/router";
import { Marca, ProductoBase, UnidadMedida } from "./pages";
import { PresentacionPage } from "./presentacion/pages/presentacion.page";

export default [
    { path: 'producto-base', component: ProductoBase },
    { path: 'presentacion', component: PresentacionPage },
    { path: 'marca', component: Marca },
    { path: 'unidad-medida', component: UnidadMedida },
    { path: '**', redirectTo: '/about' }
] as Routes;
