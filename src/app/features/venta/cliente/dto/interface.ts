export class CommonResponse<T> {
    success: boolean;
    data: T;
    message: string;

    constructor(success: boolean, data: T, message: string) {

        this.success = success;
        this.data = data;
        this.message = message;
    }

}

export class ListResponse<M> {
    content: M[];
    page: Page;

    constructor(content: M[], page: Page) {
        this.content = content;
        this.page = page;

    }

    public static getInstance<T>(): ListResponse<T> {
        return new ListResponse<T>([], Page.getInstance());
    }
}

export class Page {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;

    constructor(number: number, size: number,
        totalElements: number, totalPages: number) {

        this.number = number;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }

    public static getInstance(): Page {
        return new Page(0, 0, 0, 0);
    }
}
