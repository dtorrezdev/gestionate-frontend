import { Observable } from "rxjs";
import { Paginacion } from "./paginacion";
import { ListResponse } from "../../features/venta/cliente/dto/interface";


export interface IService<I,O> {
    list(param?: I, page?: Paginacion): Observable<any>;
    get(id: number): Observable<any>;
    save(data: I): Observable<any>;
    update(data: I, id: number): Observable<any>;
    delete(id: number): Observable<any>;
}
