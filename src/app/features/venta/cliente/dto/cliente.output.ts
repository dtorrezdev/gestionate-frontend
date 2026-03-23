
export class ClienteOutput {
    id: number;
    ci: string;
    nombre: string;
    celular: string;

    constructor(id: number,
        ci: string,
        nombre: string,
        celular: string,
    ) {
        this.id = id;
        this.ci = ci;
        this.nombre = nombre;
        this.celular = celular;
    }

    public static getInstance(): ClienteOutput {
        return new ClienteOutput(0, '', '', '');
    }
}
