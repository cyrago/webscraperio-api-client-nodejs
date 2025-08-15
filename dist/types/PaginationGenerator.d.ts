import { HttpClient } from "./HttpClient";
import { IRequestOptionsQuery } from "./interfaces/IRequestOptionsQuery";
export declare class PaginationGenerator<TData> {
    total: number;
    array: TData[];
    private page;
    private httpClient;
    private lastPage;
    private perPage;
    private position;
    private readonly uriPath;
    private readonly query;
    constructor(httpClient: HttpClient, uri: string, query?: IRequestOptionsQuery);
    fetchRecords(): AsyncGenerator<TData>;
    getAllRecords(): Promise<TData[]>;
    getPageData(page: number): Promise<TData[]>;
    getLastPage(): number;
}
