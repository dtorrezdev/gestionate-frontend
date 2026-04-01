
export class ProductoBaseOption {
    id: number;
    nombre: string;

    constructor(id: number, nombre: string) {
        this.id = id;
        this.nombre = nombre;
    }

    public static getInstance(): ProductoBaseOption {
        return new ProductoBaseOption(0, 'Seleccionar Producto Base');
    }
}
