import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, RouterOutlet, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';

// import { routes } from './app.routes';

import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AppLayout } from './layout/components/app.layout';
import { DashboardPage } from './features/admin/dasboard/dashboard.page';

@Component({
  standalone: true,
  template: `<p>About works!</p>`
})
export class About { }



@Component({
  standalone: true,
  template: `<p>Settings works!</p>`
})
export class Settings { }

export const routes: Routes = [
  {
    path: '', component: AppLayout,
    children: [
        { path: '', component: DashboardPage },
      { path: 'inventario', loadChildren: () => import('./features/inventario/inventario.routes') },
      { path: 'producto', loadChildren: () => import('./features/producto/producto.routes') },
      { path: 'venta', loadChildren: () => import('./features/venta/venta.routes') }
    ]
  },
  { path: 'about', component: About }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    //provideRouter(routes)
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
  ]
};
