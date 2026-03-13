import { Routes } from "@angular/router";
import { Marca, ProductoBase, ProductoPresentacion, UnidadMedida } from "./pages";

export default [
  { path: 'producto-base', component: ProductoBase },
  { path: 'producto-presentacion', component: ProductoPresentacion },
  { path: 'marca', component: Marca },
  { path: 'unidad-medida', component: UnidadMedida },
  { path: '**', redirectTo: '/about' }
] as Routes;
