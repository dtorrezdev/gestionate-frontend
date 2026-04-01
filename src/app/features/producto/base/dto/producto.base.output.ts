
export class ProductoBaseOutput {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;

    constructor(id: number,
        codigo: string,
        nombre: string,
        descripcion: string,
    ) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public static getInstance(): ProductoBaseOutput {
        return new ProductoBaseOutput(0, '', '', '');
    }
}
