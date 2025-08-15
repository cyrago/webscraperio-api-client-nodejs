import { IWebScraperResponse } from "./interfaces/IWebScraperResponse";
import { IRequestOptions } from "./interfaces/IRequestOptions";
import { IClientOptions } from "./interfaces/IClientOptions";
export declare class HttpClient {
    private readonly token;
    private readonly useBackoffSleep;
    constructor(options: IClientOptions);
    request<TData>(options: IRequestOptions): Promise<IWebScraperResponse<TData>>;
    get<TData>(uri: string): Promise<IWebScraperResponse<TData>>;
    post<TData>(uri: string, data?: string): Promise<IWebScraperResponse<TData>>;
    put<TData>(uri: string, data: string): Promise<IWebScraperResponse<TData>>;
    delete<TData>(uri: string): Promise<IWebScraperResponse<TData>>;
    private regularRequest;
    private dataDownloadRequest;
    private getRequestOptions;
    private allowedAttempts;
}
