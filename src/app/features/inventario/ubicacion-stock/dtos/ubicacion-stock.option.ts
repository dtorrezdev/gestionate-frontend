

export class UbicacionStockOption {
    id: number;
    nombre: string;

    constructor(id: number, nombre: string) {
        this.id = id;
        this.nombre = nombre;
    }

    public static getInstance(): UbicacionStockOption {
        return new UbicacionStockOption(0, 'Seleccione Ubicacion');
    }
}
