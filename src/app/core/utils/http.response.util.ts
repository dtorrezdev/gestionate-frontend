// import { AuthService } from '@app/core/auth/login/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// clase para traducir errores HTTP → mensajes amigables
export class HttpResponseUtil {

    public static handleErrorGeneric(response: HttpErrorResponse): Observable<never> {
        console.error('HttpResponseUtil [HTTP ERROR]:', response);

        const message = HttpResponseUtil.resolveErrorMessage(response);

        return throwError(() => message);
    }


    public static resolveErrorMessage(response: HttpErrorResponse): string {

        // Error de red o servidor
        if (response.status === 0 || response.status >= 500) {
            return 'Error en la conexión con el servidor. Comuníquese con el administrador.';
        }

        switch (response.status) {

            case 400:
                return `${response.error?.message ?? 'Solicitud inválida.'}`;

            case 401:
                let responseMsg = 'Sesión expirada. Token inválido.'
                if (response.error) {
                    responseMsg = `${response.error.error}: ${response.error.message}`
                }
                console.log('responseMsg ', responseMsg);

                // emitir evento global o interceptor
                return responseMsg;

            case 403:
                return HttpResponseUtil.buildForbiddenMessage(response);

            case 404:
                return 'Recurso no encontrado.';

            case 409:
                let responseMsg2 = 'Conflicto: Dato ya existe o hay un conflicto de datos.'
                if (response.error) {
                    console.log('error: ', response.error);

                    let parts = response.error.details.split("\n");
                    console.log('part: ', parts[0]);
                    console.log('part: ', parts[1]);

                    const error = parts[0].replace("ERROR:", "").trim();
                    const detail = parts[1].replace("Detail:", "").trim();

                    responseMsg2 = `${response.error.message} \n ${detail}: ${error}`;
                }
                //console.log('responseMsg ', responseMsg2);
                return responseMsg2;

            default:
                return HttpResponseUtil.resolveGenericError(response);
        }
    }

    private static buildForbiddenMessage(response: HttpErrorResponse): string {
        let resource = 'recurso';

        if (response.url) {
            const cleanUrl = response.url.split('?')[0];
            const parts = cleanUrl.split('/');
            resource = parts[parts.length - 1] || resource;
        }

        return `No tiene acceso al recurso ${resource.toUpperCase()}.`;
    }

    private static resolveGenericError(response: HttpErrorResponse): string {

        // Timeout
        if (response.message?.includes('Timeout')) {
            return `Error: ${response.message}`;
        }

        // Backend validation errors
        if (response.error?.errores?.length) {
            return response.error.errores.join('. ');
        }

        return 'Ocurrió un error inesperado.';
    }
}
