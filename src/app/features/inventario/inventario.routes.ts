import { Routes } from "@angular/router";
import { Otros, Reception, Stock } from "./pages";

export default [
  { path: 'stock', component: Stock },
  { path: 'reception', component: Reception },
  { path: 'otros', component: Otros },
  { path: '**', redirectTo: '/about' }
] as Routes;
