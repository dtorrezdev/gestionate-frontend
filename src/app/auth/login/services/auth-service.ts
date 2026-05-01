import { inject, Injectable } from '@angular/core';
import { LoginInput } from '../interface/login.input';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoguinOutput } from '../interface/loguin.output';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private http = inject(HttpClient);
    private readonly _apiLoginUrl = 'http://localhost:8080/modulobase/api/v1/autenticacion';

    loginFake(token: string) {
        localStorage.setItem('token', token);
    }

    login(data: LoginInput): Observable<boolean> {
        return this.autenticar(data)
            .pipe(
                map((resp: LoguinOutput) => {
                    localStorage.setItem('token', `Bearer ${resp.token}`);
                    return true;
                })
            )
    }

    logoutFake() {
        localStorage.removeItem('token');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    private autenticar(data: LoginInput): Observable<LoguinOutput> {

        return this.http.post(this._apiLoginUrl, JSON.stringify(data))
            .pipe(
                map((resp: any) => {
                    return {
                        token: resp.token,
                        rol: resp.rol,
                        rolId: resp.rolId,
                        nombre: resp.nombre,
                        id: resp.id
                    };
                })
            );

    }

    getAuthToken(): string {
        return localStorage.getItem('token') || ''
    }
}
