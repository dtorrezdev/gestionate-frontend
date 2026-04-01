
export class UnidadMedidaOption {
    id: number;
    nombre: string;
    esUnidadMinima: boolean;

    constructor(id: number,
        nombre: string,
        esUnidadMinima: boolean
    ) {
        this.id = id;
        this.nombre = nombre;
        this.esUnidadMinima = esUnidadMinima;
    }

    public static getInstance(): UnidadMedidaOption {
        return new UnidadMedidaOption(-1, 'Seleccione Unidad Medida', true);
    }
}
