
export class ClienteInput {
    ci: string;
    nombre: string;
    celular: string;

    constructor(ci: string, nombre: string, celular: string) {
        this.ci = ci;
        this.nombre = nombre;
        this.celular = celular;
    }

    public static getInstance(): ClienteInput {
        return new ClienteInput('', '', '');
    }
}
