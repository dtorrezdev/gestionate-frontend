import { inject, Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    private messageService = inject(MessageService);

    success(detail: string, summary: string = 'Éxito'): void {
        this.show('success', summary, detail);
    }

    error(detail: string, summary: string = 'Error'): void {
        this.show('error', summary, detail);
    }

    warn(detail: string, summary: string = 'Advertencia'): void {
        this.show('warn', summary, detail);
    }

    info(detail: string, summary: string = 'Información'): void {
        this.show('info', summary, detail);
    }

    private show(
        severity: string,
        summary: string,
        detail: string
    ): void {
        this.messageService.add({
            severity,
            summary,
            detail,
            life: 5000
        });
    }

    public mostrarMsg(tipo: string, detalle: string): void {
        this.show(tipo, 'Mensaje', detalle);
    }
}
