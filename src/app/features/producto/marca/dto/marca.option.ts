

export class MarcaOption {
    id: number;
    nombre: string;

    constructor(id: number, nombre: string) {
        this.id = id;
        this.nombre = nombre;
    }

    public static getInstance(): MarcaOption {
        return new MarcaOption(0, 'Seleccione Marca');
    }
}
