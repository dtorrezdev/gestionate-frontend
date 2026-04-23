
export interface ProductoBaseOutput {
    id?: number;
    codigo?: string;
    nombre: string;
    descripcion: string;
    categoriaId: number;
    categoria?: string;
}
