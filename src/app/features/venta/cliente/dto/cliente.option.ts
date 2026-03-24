
export class ClienteOption {
    id: number;
    nombre: string;

    constructor(id: number,
        nombre: string,
    ) {
        this.id = id;
        this.nombre = nombre;
    }

    public static getInstance(): ClienteOption {
        return new ClienteOption(-1, 'Seleccione Cliente');
    }
}
