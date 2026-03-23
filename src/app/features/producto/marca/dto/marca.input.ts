export class MarcaInput {
    nombre: string;
    descripcion: string;

    constructor(nombre: string, descripcion: string) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public static getInstance(): MarcaInput {
        return new MarcaInput('', '');
    }
}
