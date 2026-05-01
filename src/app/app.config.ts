import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, RouterOutlet, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';

// import { routes } from './app.routes';

import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { requestInterceptor } from './core/interceptors/request.interceptor';

@Component({
    standalone: true,
    template: `<p>About works!</p>`
})
export class About { }


export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./auth/login/pages/login.page').then(m => m.LoginPage),
        canActivate: [guestGuard]
    },
    {
        path: '', loadComponent: () => import('./layout/components/app.layout').then(m => m.AppLayout),
        canActivate: [authGuard],
        children: [
            // { path: '', component: LoginPage },
            {
                path: 'dashboard', loadComponent: () =>
                    import('./features/admin/dasboard/dashboard.page').then(m => m.DashboardPage)
            },
            { path: 'inventario', loadChildren: () => import('./features/inventario/inventario.routes') },
            { path: 'producto', loadChildren: () => import('./features/producto/producto.routes') },
            { path: 'venta', loadChildren: () => import('./features/venta/venta.routes') },
            { path: 'compra', loadChildren: () => import('./features/compra/compra.routes') },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            }
        ]
    },
    { path: 'about', component: About },
    {
        path: '**',
        redirectTo: 'login'
    }

];

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideHttpClient(withInterceptors([requestInterceptor])),
        provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
    ]
};
