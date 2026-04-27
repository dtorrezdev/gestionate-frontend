
export interface Sort {
    col: string;
    type: string;
}

export interface Paginacion {

    size: number;
    page: number;
    sort: Sort;

}
