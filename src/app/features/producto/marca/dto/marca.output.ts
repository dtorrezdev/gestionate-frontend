

export class MarcaOutput {
    id: number;
    nombre: string;
    descripcion: string;

    constructor(id: number, nombre: string, descripcion: string) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public static getInstance(): MarcaOutput {
        return new MarcaOutput(0, '', '');
    }
}
