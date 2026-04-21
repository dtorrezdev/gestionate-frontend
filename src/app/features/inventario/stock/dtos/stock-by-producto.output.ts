


export interface ListStockOutput {
    stocks: StockByProductoOutput[];
}


export interface StockByProductoOutput {
    cantidad: number;
    estante: string;
    expiracion: Date;
    id:number;
    lote: string;
    nivel: string;
    movimientoProductoId: number;
    seccion: string;
}
