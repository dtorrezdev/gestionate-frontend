import { Injectable } from "@angular/core";


@Injectable({ providedIn: 'root' })
export class StorageService {

    private buildKey(
        tenantId: string,
        userId: string,
        view: string
    ): string {

        return [
            tenantId,
            userId,
            view
        ].join(':');

    }

    setViewConfig<T>(
        tenantId: string,
        userId: string,
        view: string,
        data: T
    ): void {

        const key = this.buildKey(
            tenantId,
            userId,
            view
        );

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );
    }

    getViewConfig<T>(
        tenantId: string,
        userId: string,
        view: string
    ): T | null {

        const key = this.buildKey(
            tenantId,
            userId,
            view
        );

        const raw = localStorage.getItem(key);

        if (!raw) {
            return null;
        }

        try {
            return JSON.parse(raw) as T;
        } catch (error) {
            console.error('Storage parse error', error);
            return null;
        }
    }

    // =========================================
    // REMOVE
    // =========================================

    removeViewConfig(
        tenantId: string,
        userId: string,
        view: string
    ): void {

        const key = this.buildKey(
            tenantId,
            userId,
            view
        );

        localStorage.removeItem(key);
    }

    clearTenant(
        tenantId: string
    ): void {

        Object.keys(localStorage)
            .filter(key => key.startsWith(`app:${tenantId}:`))
            .forEach(key => localStorage.removeItem(key));

    }

}
