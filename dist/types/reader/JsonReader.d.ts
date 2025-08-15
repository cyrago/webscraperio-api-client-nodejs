export declare class JsonReader {
    private readonly rl;
    constructor(filePath: string);
    fetchRows<T>(): AsyncGenerator<T>;
    toArray<T>(): Promise<T[]>;
}
