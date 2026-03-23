

export class MarcaOutput {
    id: number;
    nombre: string;
    celular: string;

    constructor(id: number, nombre: string, celular: string) {
        this.id = id;
        this.nombre = nombre;
        this.celular = celular;
    }

    public static getInstance(): MarcaOutput {
        return new MarcaOutput(0, '', '');
    }
}
