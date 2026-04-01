# 📋 REFACTOR & MEJORAS - FarmacyBot-UI

**Documento de Mejoras y Recomendaciones para Robustecer el Proyecto**  
**Fecha:** 01/04/2026  
**Versión Angular:** 21.2.0

---

## 🎯 OBJETIVOS PRINCIPALES

1. ✅ Hacer el código más escalable y mantenible
2. ✅ Acelerar el desarrollo de nuevas features
3. ✅ Implementar patrones de componentes reutilizables
4. ✅ Mejorar seguridad (tokens, URLs)
5. ✅ Agregar gestión de errores robusta
6. ✅ Implementar estado global consistente

---

## 🏗️ PARTE 1: MEJORAS DE ARQUITECTURA

### 1.1 PROBLEMA: Token Hardcoded
**Estado Actual:**
```typescript
private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9...';
```

**✅ SOLUCIÓN RECOMENDADA:**

```typescript
// src/app/core/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private tokenSubject = new BehaviorSubject<string | null>(
        localStorage.getItem('authToken')
    );
    
    token$ = this.tokenSubject.asObservable();
    
    constructor(private http: HttpClient) {}
    
    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>('/auth/login', credentials)
            .pipe(
                tap(response => {
                    localStorage.setItem('authToken', response.token);
                    this.tokenSubject.next(response.token);
                })
            );
    }
    
    logout(): void {
        localStorage.removeItem('authToken');
        this.tokenSubject.next(null);
    }
    
    getToken(): string | null {
        return this.tokenSubject.value;
    }
}
```

**Usar en servicios:**
```typescript
@Injectable()
export class VentaService {
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}
    
    getAllVenta(): Observable<CommonResponse<ListResponse<VentaOutput>>> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<CommonResponse<ListResponse<VentaOutput>>>(
            `${this._API}?page=0&size=2000`,
            { headers }
        );
    }
}
```

**Beneficios:** 🔐 Seguro, dinámico, fácil de renovar tokens

---

### 1.2 PROBLEMA: URLs Hardcoded
**Estado Actual:**
```typescript
private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/ventas';
```

**✅ SOLUCIÓN RECOMENDADA:**

```typescript
// src/app/core/config/environment.ts
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/modulobase/api/v1',
    apiTimeout: 30000,
};

// src/app/core/config/environment.prod.ts
export const environment = {
    production: true,
    apiUrl: 'https://api.farmacy.prod/api/v1',
    apiTimeout: 30000,
};
```

**Usar en servicios:**
```typescript
import { environment } from '../config/environment';

@Injectable()
export class VentaService {
    private readonly API = `${environment.apiUrl}/ventas`;
    
    constructor(private http: HttpClient) {}
    
    getAllVenta() {
        return this.http.get<CommonResponse<ListResponse<VentaOutput>>>(
            `${this.API}?page=0&size=2000`
        );
    }
}
```

**Beneficios:** 🌍 Distintos ambientes (dev/prod), fácil de cambiar

---

### 1.3 PROBLEMA: Sin Gestor de Estado Global
**✅ SOLUCIÓN RECOMENDADA: Pattern con Signals**

```typescript
// src/app/core/state/app.state.ts
import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';

export interface AppState {
    isLoading: boolean;
    theme: 'light' | 'dark';
    currentUser: User | null;
    notifications: Notification[];
}

@Injectable({ providedIn: 'root' })
export class AppStateService {
    private state = signal<AppState>({
        isLoading: false,
        theme: 'light',
        currentUser: null,
        notifications: [],
    });
    
    // Getters
    readonly isLoading = computed(() => this.state().isLoading);
    readonly theme = computed(() => this.state().theme);
    readonly currentUser = computed(() => this.state().currentUser);
    readonly notifications = computed(() => this.state().notifications);
    
    // Setters
    setLoading(value: boolean): void {
        this.state.update(s => ({ ...s, isLoading: value }));
    }
    
    setTheme(theme: 'light' | 'dark'): void {
        this.state.update(s => ({ ...s, theme }));
    }
    
    setCurrentUser(user: User | null): void {
        this.state.update(s => ({ ...s, currentUser: user }));
    }
    
    addNotification(notification: Notification): void {
        this.state.update(s => ({
            ...s,
            notifications: [...s.notifications, notification]
        }));
    }
}
```

**Usar en componentes:**
```typescript
@Component({
    selector: 'app-topbar',
    standalone: true,
    template: `
        @if (appState.currentUser()) {
            <span>{{ appState.currentUser()!.name }}</span>
        }
        @if (appState.isLoading()) {
            <p-progressSpinner></p-progressSpinner>
        }
    `
})
export class AppTopbar {
    appState = inject(AppStateService);
}
```

**Beneficios:** ⚡ Reactivo, simple, sin RxJS overhead

---

### 1.4 PROBLEMA: Sin Manejo de Errores Global
**✅ SOLUCIÓN RECOMENDADA: HTTP Interceptor**

```typescript
// src/app/core/http/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private appState: AppStateService
    ) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'Error desconocido';
                
                if (error.error instanceof ErrorEvent) {
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    errorMessage = `Error ${error.status}: ${error.message}`;
                }
                
                // Manejar errores específicos
                switch (error.status) {
                    case 401:
                        this.router.navigate(['/login']);
                        errorMessage = 'Sesión expirada';
                        break;
                    case 403:
                        errorMessage = 'No tienes permisos para esta acción';
                        break;
                    case 404:
                        errorMessage = 'Recurso no encontrado';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor';
                        break;
                }
                
                // Agregar notificación
                this.appState.addNotification({
                    type: 'error',
                    message: errorMessage,
                    duration: 5000
                });
                
                console.error(errorMessage, error);
                return throwError(() => new Error(errorMessage));
            })
        );
    }
}
```

**Registrar en `app.config.ts`:**
```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        // ... otros providers
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ]
};
```

**Beneficios:** 🛡️ Manejo centralizado de errores, experiencia consistente

---

## 🎨 PARTE 2: PATRONES DE COMPONENTES REUTILIZABLES

### 2.1 COMPONENTE CRUD GENÉRICO - TABLA

**Archivo:** `src/app/shared/components/crud-table/crud-table.component.ts`

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

export interface ColumnConfig {
    field: string;
    header: string;
    width?: string;
    sortable?: boolean;
    filterable?: boolean;
    type?: 'text' | 'number' | 'date' | 'currency';
}

export interface CrudAction {
    label: string;
    icon: string;
    action: 'edit' | 'delete' | 'view' | string;
    severity?: 'info' | 'success' | 'warning' | 'danger';
}

@Component({
    selector: 'app-crud-table',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule
    ],
    template: `
        <div class="card">
            <p-table
                #dt
                [value]="data"
                [paginator]="paginator"
                [rows]="rows"
                [loading]="isLoading"
                [lazy]="lazy"
                [totalRecords]="totalRecords"
                [first]="first"
                (onLazyLoad)="onLazyLoad.emit($event)"
                [globalFilterFields]="filterFields"
                responsiveLayout="scroll">
                
                <!-- Header con búsqueda -->
                <ng-template pTemplate="caption">
                    <div class="flex align-items-center justify-content-between">
                        <span class="p-input-icon-left w-full sm:w-auto">
                            <i class="pi pi-search"></i>
                            <input
                                pInputText
                                type="text"
                                (input)="dt.filterGlobal($event, 'contains')"
                                placeholder="Buscar..." />
                        </span>
                    </div>
                </ng-template>
                
                <!-- Headers -->
                <ng-template pTemplate="header">
                    <tr>
                        <th *ngFor="let col of columns" [style.width]="col.width" [pSortableColumn]="col.sortable ? col.field : null">
                            {{ col.header }}
                            <p-sortIcon *ngIf="col.sortable" [field]="col.field"></p-sortIcon>
                        </th>
                        <th style="width: 10rem">Acciones</th>
                    </tr>
                </ng-template>
                
                <!-- Filas -->
                <ng-template pTemplate="body" let-row>
                    <tr>
                        <td *ngFor="let col of columns">
                            <span [innerHTML]="getColumnValue(row, col)"></span>
                        </td>
                        <td>
                            <div class="flex gap-2">
                                <button
                                    *ngFor="let action of actions"
                                    pButton
                                    [icon]="action.icon"
                                    [pTooltip]="action.label"
                                    [severity]="action.severity || 'info'"
                                    class="p-button-rounded p-button-sm"
                                    (click)="onAction.emit({ action: action.action, data: row })">
                                </button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                
                <!-- Empty -->
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td [attr.colspan]="columns.length + 1" class="text-center">
                            No hay datos disponibles
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    styles: [`
        :host ::ng-deep {
            .p-datatable .p-datatable-tbody > tr > td {
                padding: 0.75rem;
            }
        }
    `]
})
export class CrudTableComponent<T> {
    @Input() data: T[] = [];
    @Input() columns: ColumnConfig[] = [];
    @Input() actions: CrudAction[] = [
        { label: 'Editar', icon: 'pi pi-pencil', action: 'edit', severity: 'info' },
        { label: 'Eliminar', icon: 'pi pi-trash', action: 'delete', severity: 'danger' }
    ];
    @Input() isLoading = false;
    @Input() paginator = true;
    @Input() rows = 10;
    @Input() totalRecords = 0;
    @Input() first = 0;
    @Input() lazy = false;
    @Input() filterFields: string[] = [];
    
    @Output() onAction = new EventEmitter<{ action: string; data: T }>();
    @Output() onLazyLoad = new EventEmitter<any>();
    
    getColumnValue(row: any, col: ColumnConfig): string {
        const value = row[col.field];
        
        switch (col.type) {
            case 'currency':
                return new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'USD'
                }).format(value);
            case 'date':
                return new Date(value).toLocaleDateString('es-ES');
            default:
                return value;
        }
    }
}
```

**Uso en cualquier feature:**
```typescript
export class ListVentaPage {
    ventaService = inject(VentaService);
    appState = inject(AppStateService);
    
    ventas$: Observable<CommonResponse<ListResponse<VentaOutput>>> = new Observable();
    
    protected readonly columns: ColumnConfig[] = [
        { field: 'id', header: 'ID', width: '8rem' },
        { field: 'cliente', header: 'Cliente', width: '20rem', filterable: true },
        { field: 'nit', header: 'NIT', width: '15rem' },
        { field: 'total', header: 'Total', width: '12rem', type: 'currency' },
        { field: 'fechaCreacion', header: 'Fecha', width: '15rem', type: 'date' },
        { field: 'estado', header: 'Estado', width: '12rem' }
    ];
    
    ngOnInit() {
        this.appState.setLoading(true);
        this.ventas$ = this.ventaService.getAllVenta().pipe(
            finalize(() => this.appState.setLoading(false))
        );
    }
    
    onTableAction(event: { action: string; data: VentaOutput }) {
        if (event.action === 'edit') {
            this.router.navigate(['/venta/edit', event.data.id]);
        } else if (event.action === 'delete') {
            this.confirmDelete(event.data.id);
        }
    }
}
```

**Beneficios:** ♻️ Reutilizable en todas las features, consistent styling

---

### 2.2 COMPONENTE CRUD GENÉRICO - FORMULARIO

**Archivo:** `src/app/shared/components/crud-form/crud-form.component.ts`

```typescript
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';

export interface FormFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox';
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: { label: string; value: any }[];
    validators?: any[];
}

@Component({
    selector: 'app-crud-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        CalendarModule,
        InputNumberModule
    ],
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="grid">
                <div *ngFor="let field of fields" [ngClass]="getFieldClass(field)">
                    <!-- Text Input -->
                    <div *ngIf="field.type === 'text' || field.type === 'email'" class="field">
                        <label [for]="field.name">{{ field.label }}</label>
                        <input
                            pInputText
                            [id]="field.name"
                            [type]="field.type"
                            [formControlName]="field.name"
                            [placeholder]="field.placeholder || ''"
                            class="w-full" />
                        <small class="p-error" *ngIf="hasError(field.name)">
                            {{ getErrorMessage(field) }}
                        </small>
                    </div>
                    
                    <!-- Number Input -->
                    <div *ngIf="field.type === 'number'" class="field">
                        <label [for]="field.name">{{ field.label }}</label>
                        <p-inputNumber
                            [id]="field.name"
                            [formControlName]="field.name"
                            [placeholder]="field.placeholder || ''"
                            class="w-full">
                        </p-inputNumber>
                    </div>
                    
                    <!-- Date Input -->
                    <div *ngIf="field.type === 'date'" class="field">
                        <label [for]="field.name">{{ field.label }}</label>
                        <p-calendar
                            [id]="field.name"
                            [formControlName]="field.name"
                            dateFormat="dd/mm/yy">
                        </p-calendar>
                    </div>
                    
                    <!-- Textarea -->
                    <div *ngIf="field.type === 'textarea'" class="field">
                        <label [for]="field.name">{{ field.label }}</label>
                        <textarea
                            pInputTextarea
                            [id]="field.name"
                            [formControlName]="field.name"
                            [placeholder]="field.placeholder || ''"
                            rows="4"
                            class="w-full">
                        </textarea>
                    </div>
                    
                    <!-- Select/Dropdown -->
                    <div *ngIf="field.type === 'select'" class="field">
                        <label [for]="field.name">{{ field.label }}</label>
                        <p-dropdown
                            [id]="field.name"
                            [options]="field.options"
                            [formControlName]="field.name"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Seleccione...">
                        </p-dropdown>
                    </div>
                </div>
            </div>
            
            <!-- Buttons -->
            <div class="flex gap-2 justify-content-end mt-4">
                <button pButton type="button" label="Cancelar" severity="secondary" (click)="onCancel.emit()"></button>
                <button pButton type="submit" label="Guardar" [disabled]="form.invalid || isLoading"></button>
            </div>
        </form>
    `,
    styles: [`
        :host ::ng-deep {
            .field {
                margin-bottom: 1.5rem;
            }
            label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
            }
        }
    `]
})
export class CrudFormComponent<T> implements OnInit {
    @Input() fields: FormFieldConfig[] = [];
    @Input() initialData?: T;
    @Input() isLoading = false;
    @Input() form!: FormGroup;
    
    @Output() onSubmit = new EventEmitter<T>();
    @Output() onCancel = new EventEmitter<void>();
    
    ngOnInit() {
        if (this.initialData) {
            this.form.patchValue(this.initialData);
        }
    }
    
    getFieldClass(field: FormFieldConfig): string {
        return 'col-12 md:col-6 lg:col-4';
    }
    
    hasError(fieldName: string): boolean {
        const field = this.form.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }
    
    getErrorMessage(field: FormFieldConfig): string {
        const control = this.form.get(field.name);
        if (!control) return '';
        
        if (control.hasError('required')) {
            return `${field.label} es requerido`;
        }
        if (control.hasError('email')) {
            return 'Email inválido';
        }
        if (control.hasError('min')) {
            return `Mínimo ${control.getError('min').min}`;
        }
        if (control.hasError('max')) {
            return `Máximo ${control.getError('max').max}`;
        }
        
        return 'Error de validación';
    }
    
    onFormSubmit() {
        if (this.form.valid) {
            this.onSubmit.emit(this.form.value);
        }
    }
}
```

**Uso en página de creación:**
```typescript
export class AddVentaPage implements OnInit {
    ventaService = inject(VentaService);
    router = inject(Router);
    appState = inject(AppStateService);
    
    form: FormGroup = new FormGroup({
        cliente: new FormControl('', Validators.required),
        nit: new FormControl('', Validators.required),
        total: new FormControl(0, Validators.required),
        estado: new FormControl('PENDIENTE')
    });
    
    protected readonly fields: FormFieldConfig[] = [
        { name: 'cliente', label: 'Cliente', type: 'text', required: true, placeholder: 'Nombre del cliente' },
        { name: 'nit', label: 'NIT', type: 'text', required: true },
        { name: 'total', label: 'Total', type: 'number', required: true },
        {
            name: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                { label: 'Pendiente', value: 'PENDIENTE' },
                { label: 'Completada', value: 'COMPLETADA' },
                { label: 'Cancelada', value: 'CANCELADA' }
            ]
        }
    ];
    
    onFormSubmit(data: VentaInput) {
        this.appState.setLoading(true);
        this.ventaService.saveVenta(data).subscribe({
            next: () => {
                this.appState.addNotification({
                    type: 'success',
                    message: 'Venta creada exitosamente'
                });
                this.router.navigate(['/venta']);
            },
            error: (err) => {
                console.error(err);
                this.appState.setLoading(false);
            },
            complete: () => this.appState.setLoading(false)
        });
    }
}
```

**Beneficios:** 🎯 Formularios genéricos, validación automática, reutilizable

---

## ⚡ PARTE 3: SCRIPTS PARA ACELERAR DESARROLLO

### 3.1 NPM Scripts Personalizados

**Archivo:** `package.json` - agregar scripts:

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "new:feature": "node scripts/generate-feature.js",
    "new:service": "node scripts/generate-service.js",
    "new:page": "node scripts/generate-page.js"
  }
}
```

### 3.2 Script Generador de Features

**Archivo:** `scripts/generate-feature.js`

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const featureName = process.argv[2];
const featureNameCapital = featureName.charAt(0).toUpperCase() + featureName.slice(1);

if (!featureName) {
    console.error('❌ Error: Proporciona el nombre de la feature');
    console.log('Uso: npm run new:feature nombreFeature');
    process.exit(1);
}

const basePath = path.join(__dirname, `../src/app/features/${featureName}`);
const folders = ['services', 'pages', 'dto'];

// Crear carpetas
folders.forEach(folder => {
    const folderPath = path.join(basePath, folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`📁 Carpeta creada: ${folder}`);
    }
});

// Template: routes
const routesTemplate = `import { Routes } from '@angular/router';
import { List${featureNameCapital}Page } from './pages/list.${featureName}.page';
import { Add${featureNameCapital}Page } from './pages/add.${featureName}.page';

export const ${featureName}Routes: Routes = [
    { path: '', component: List${featureNameCapital}Page },
    { path: 'add', component: Add${featureNameCapital}Page },
    { path: 'edit/:id', component: Add${featureNameCapital}Page }
];
`;

// Template: service
const serviceTemplate = `import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonResponse, ListResponse } from '../../../shared/dto/common.response';
import { ${featureNameCapital}Output } from '../dto/${featureName}.output';
import { ${featureNameCapital}Input } from '../dto/${featureName}.input';
import { environment } from '../../../config/environment';

@Injectable({ providedIn: 'root' })
export class ${featureNameCapital}Service {
    private readonly API = \`\${environment.apiUrl}/${featureName}s\`;

    constructor(private http: HttpClient) {}

    getAll() {
        return this.http.get<CommonResponse<ListResponse<${featureNameCapital}Output>>>(
            \`\${this.API}?page=0&size=2000\`
        );
    }

    getById(id: string) {
        return this.http.get<CommonResponse<${featureNameCapital}Output>>(\`\${this.API}/\${id}\`);
    }

    save(item: ${featureNameCapital}Input) {
        return this.http.post<CommonResponse<${featureNameCapital}Output>>(this.API, item);
    }

    update(id: string, item: ${featureNameCapital}Input) {
        return this.http.put<CommonResponse<${featureNameCapital}Output>>(\`\${this.API}/\${id}\`, item);
    }

    delete(id: string) {
        return this.http.delete<CommonResponse<void>>(\`\${this.API}/\${id}\`);
    }
}
`;

// Template: list page
const listPageTemplate = `import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ${featureNameCapital}Service } from '../services/${featureName}.service';
import { CrudTableComponent, ColumnConfig } from '../../../shared/components/crud-table/crud-table.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
    selector: 'app-list-${featureName}',
    standalone: true,
    imports: [CommonModule, RouterModule, CrudTableComponent, BreadcrumbModule],
    template: \`
        <div class="grid">
            <div class="col-12">
                <p-breadcrumb [model]="breadcrumbs" [home]="home"></p-breadcrumb>
            </div>
            <div class="col-12">
                <button pButton label="Nuevo ${featureNameCapital}" icon="pi pi-plus" routerLink="add"></button>
            </div>
            <div class="col-12">
                <app-crud-table
                    [data]="(data$ | async)?.data"
                    [columns]="columns"
                    [isLoading]="isLoading"
                    (onAction)="onTableAction(\$event)">
                </app-crud-table>
            </div>
        </div>
    \`
})
export class List${featureNameCapital}Page implements OnInit {
    ${featureName}Service = inject(${featureNameCapital}Service);
    isLoading = false;
    data$: any;

    protected readonly columns: ColumnConfig[] = [
        // Agregar columnas aquí
    ];

    breadcrumbs = [{ label: '${featureNameCapital}s' }];
    home = { icon: 'pi pi-home', routerLink: '/' };

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.isLoading = true;
        this.data$ = this.${featureName}Service.getAll();
    }

    onTableAction(event: any) {
        // Implementar lógica de acciones
    }
}
`;

// Template: add page
const addPageTemplate = `import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ${featureNameCapital}Service } from '../services/${featureName}.service';
import { CrudFormComponent, FormFieldConfig } from '../../../shared/components/crud-form/crud-form.component';

@Component({
    selector: 'app-add-${featureName}',
    standalone: true,
    imports: [CommonModule, RouterModule, CrudFormComponent],
    template: \`
        <div class="card">
            <h5>Agregar ${featureNameCapital}</h5>
            <app-crud-form
                [form]="form"
                [fields]="fields"
                [isLoading]="isLoading"
                (onSubmit)="onSubmit(\$event)"
                (onCancel)="onCancel()">
            </app-crud-form>
        </div>
    \`
})
export class Add${featureNameCapital}Page implements OnInit {
    ${featureName}Service = inject(${featureNameCapital}Service);
    router = inject(Router);
    route = inject(ActivatedRoute);
    isLoading = false;
    
    form = new FormGroup({
        // Agregar controles aquí
    });

    protected readonly fields: FormFieldConfig[] = [
        // Agregar campos aquí
    ];

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadData(id);
        }
    }

    loadData(id: string) {
        this.${featureName}Service.getById(id).subscribe(
            response => this.form.patchValue(response.data)
        );
    }

    onSubmit(data: any) {
        this.isLoading = true;
        const id = this.route.snapshot.paramMap.get('id');
        const request = id
            ? this.${featureName}Service.update(id, data)
            : this.${featureName}Service.save(data);

        request.subscribe({
            next: () => this.router.navigate(['/${featureName}']),
            error: (err) => console.error(err),
            complete: () => this.isLoading = false
        });
    }

    onCancel() {
        this.router.navigate(['/${featureName}']);
    }
}
`;

// Template: output DTO
const outputDtoTemplate = `export interface ${featureNameCapital}Output {
    id: string;
    // Agregar propiedades aquí
    fechaCreacion: string;
    fechaActualizacion: string;
}
`;

// Template: input DTO
const inputDtoTemplate = `export interface ${featureNameCapital}Input {
    // Agregar propiedades aquí
}
`;

// Escribir archivos
const files = [
    { path: `${basePath}/${featureName}.routes.ts`, content: routesTemplate },
    { path: `${basePath}/services/${featureName}.service.ts`, content: serviceTemplate },
    { path: `${basePath}/pages/list.${featureName}.page.ts`, content: listPageTemplate },
    { path: `${basePath}/pages/add.${featureName}.page.ts`, content: addPageTemplate },
    { path: `${basePath}/dto/${featureName}.output.ts`, content: outputDtoTemplate },
    { path: `${basePath}/dto/${featureName}.input.ts`, content: inputDtoTemplate }
];

files.forEach(file => {
    if (!fs.existsSync(file.path)) {
        fs.writeFileSync(file.path, file.content);
        console.log(`✅ Archivo creado: ${path.basename(file.path)}`);
    }
});

console.log(`\n🎉 Feature '${featureName}' creada exitosamente en ${basePath}\n`);
console.log('Próximos pasos:');
console.log(`1. Actualiza ${featureName}.routes.ts con las columnas reales`);
console.log(`2. Define los campos en Add${featureNameCapital}Page`);
console.log(`3. Importa la ruta en app.config.ts`);
console.log(`4. Ejecuta: npm run ng serve\n`);
`;

fs.writeFileSync(files[0].path, routesTemplate);
fs.writeFileSync(files[1].path, serviceTemplate);
fs.writeFileSync(files[2].path, listPageTemplate);
fs.writeFileSync(files[3].path, addPageTemplate);
fs.writeFileSync(files[4].path, outputDtoTemplate);
fs.writeFileSync(files[5].path, inputDtoTemplate);

console.log(`✅ Feature '${featureName}' creada exitosamente!`);
```

**Uso:**
```bash
npm run new:feature cliente
# Genera automáticamente toda la estructura de cliente
```

**Beneficios:** ⚡ 1 feature en 2 segundos vs 30 minutos manual

---

## 🛠️ PARTE 4: ESTRUCTURA COMPARTIDA (Shared)

**Nueva carpeta:** `src/app/shared/`

```
src/app/shared/
├── components/
│   ├── crud-table/
│   │   └── crud-table.component.ts
│   ├── crud-form/
│   │   └── crud-form.component.ts
│   ├── notification/
│   │   └── notification.component.ts
│   └── loading-spinner/
│       └── loading-spinner.component.ts
├── directives/
│   ├── loading.directive.ts
│   └── highlight.directive.ts
├── pipes/
│   ├── safe-html.pipe.ts
│   └── format-date.pipe.ts
├── dto/
│   └── common.response.ts
└── utils/
    ├── validators.ts
    └── helpers.ts
```

---

## 📊 PARTE 5: PLAN DE IMPLEMENTACIÓN

### Fase 1: Seguridad y Configuración (2-3 horas)
- [ ] Crear `AuthService` (authentication)
- [ ] Crear `environment.ts` (configuración)
- [ ] Crear `ErrorInterceptor` (manejo de errores)
- [ ] Registrar interceptores en `app.config.ts`

### Fase 2: Estado Global (1-2 horas)
- [ ] Crear `AppStateService` con Signals
- [ ] Integrar con componentes de layout
- [ ] Crear `NotificationComponent`

### Fase 3: Componentes Reutilizables (2-3 horas)
- [ ] Crear `CrudTableComponent`
- [ ] Crear `CrudFormComponent`
- [ ] Documentar en `README.md`

### Fase 4: Automatización (1-2 horas)
- [ ] Crear script `generate-feature.js`
- [ ] Crear script `generate-service.js`
- [ ] Agregar NPM scripts

### Fase 5: Refactorización de Existentes (4-6 horas)
- [ ] Refactorizar `VentaPage` para usar componentes
- [ ] Refactorizar `ProductoPage` para usar componentes
- [ ] Refactorizar `ClientePage` para usar componentes

### Fase 6: Testing y Documentación (2-3 horas)
- [ ] Escribir tests unitarios para servicios
- [ ] Documentar patrones en `PATTERNS.md`
- [ ] Actualizar README

---

## 📈 BENEFICIOS ESPERADOS

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Tiempo/Feature | 30-45 min | 5-10 min | **75-85%** ⬇️ |
| Líneas de código duplicado | 40-50% | 5-10% | **80-90%** ⬇️ |
| Mantenibilidad | Media | Alta | ⬆️⬆️⬆️ |
| Escalabilidad | Media | Alta | ⬆️⬆️⬆️ |
| Seguridad | Baja | Alta | ⬆️⬆️⬆️ |
| Consistencia UI | Media | Alta | ⬆️⬆️⬆️ |

---

## 🚀 QUICK START - PRÓXIMOS PASOS

1. **Hoy**: Implementar `AuthService` + `environment.ts`
2. **Mañana**: Crear `CrudTableComponent` + `CrudFormComponent`
3. **Día 3**: Generar script `generate-feature.js`
4. **Día 4-5**: Refactorizar features existentes

---

## 📚 REFERENCIAS Y RECURSOS

- [Angular Best Practices](https://angular.dev/style-guide)
- [PrimeNG Components](https://primeng.org)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [RxJS Operators](https://rxjs.dev/guide/operators)
- [Tailwind CSS](https://tailwindcss.com)

---

**Documento Actualizado:** 01/04/2026  
**Versión Angular:** 21.2.0  
**Status:** ✅ Listo para implementar
