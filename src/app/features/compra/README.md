# Estructura del Módulo Compra

## Descripción
El módulo Compra gestiona la administración de proveedores y operaciones relacionadas con compras.

## Estructura

```
compra/
├── proveedor/
│   ├── components/          # Componentes reutilizables del proveedor
│   ├── dto/                 # Data Transfer Objects
│   │   ├── proveedor.input.ts
│   │   └── proveedor.output.ts
│   ├── pages/               # Páginas del módulo
│   │   └── proveedor.page.ts
│   ├── service/             # Servicios
│   │   └── proveedor.service.ts
│   └── index.ts             # Exportaciones públicas
└── compra.routes.ts         # Rutas del módulo Compra
```

## Entidades

### Proveedor
- **id**: number (identificador único)
- **nombre**: string (nombre del proveedor)
- **descripcion**: string (descripción del proveedor)

## Características

- ✅ Listar proveedores
- ✅ Crear nuevo proveedor
- ✅ Editar proveedor existente
- ✅ Eliminar proveedor
- ✅ Tabla paginada con búsqueda
- ✅ Validación de formularios
- ✅ Mensajes de confirmación y notificación

## Rutas Disponibles

- `/compra` - Redirecciona a `/compra/proveedores`
- `/compra/proveedores` - Lista de proveedores

## API Endpoints

Todos los endpoints usan la siguiente base URL:
```
http://localhost:8080/modulobase/api/v1/proveedores
```

- GET `?size=1000&sort=proveedor_id,desc` - Obtener todos los proveedores
- POST - Crear nuevo proveedor
- PUT `/{id}` - Actualizar proveedor
- DELETE `/{id}` - Eliminar proveedor

## Uso

```typescript
import { ProveedorPage, ProveedorService } from './compra/proveedor';

// En tu routing o componente
{
  path: 'compra',
  loadChildren: () => import('./features/compra/compra.routes').then(m => m.compraRoutes)
}
```
