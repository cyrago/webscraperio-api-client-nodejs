"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const https_1 = require("https");
const fs = require("fs");
const Sleep_1 = require("./Sleep");
class HttpClient {
    constructor(options) {
        this.token = options.token;
        this.useBackoffSleep = options.useBackoffSleep !== false;
    }
    async request(options) {
        for (let attempt = 1; attempt <= this.allowedAttempts(); attempt++) {
            try {
                if (options.saveTo) {
                    return await this.dataDownloadRequest(options);
                }
                else {
                    return await this.regularRequest(options);
                }
            }
            catch (e) {
                if (!e.response) {
                    throw e;
                }
                const statusCode = e.response.statusCode;
                if (attempt === this.allowedAttempts() || statusCode !== 429) {
                    throw new Error(`Web Scraper API Exception: ${e.responseData}`);
                }
                const retry = e.response.headers["retry-after"];
                if (retry) {
                    await (0, Sleep_1.sleep)((retry * 1000) + 1000);
                }
            }
        }
    }
    async get(uri) {
        return this.request({
            url: uri,
            method: "GET",
        });
    }
    async post(uri, data) {
        return this.request({
            url: uri,
            method: "POST",
            data,
        });
    }
    async put(uri, data) {
        return this.request({
            url: uri,
            method: "PUT",
            data,
        });
    }
    async delete(uri) {
        return this.request({
            url: uri,
            method: "DELETE",
        });
    }
    async regularRequest(options) {
        return new Promise((resolve, reject) => {
            const clientRequest = (0, https_1.request)(this.getRequestOptions(options), (response) => {
                let responseData = "";
                response.on("data", (chunk) => {
                    responseData += chunk;
                });
                response.on("end", () => {
                    const dataObj = JSON.parse(responseData);
                    if (!dataObj.success) {
                        return reject({ response, responseData });
                    }
                    resolve(dataObj);
                });
            });
            if (options.data) {
                clientRequest.write(options.data);
            }
            clientRequest.on("error", (e) => {
                reject(e);
            });
            clientRequest.end();
        });
    }
    async dataDownloadRequest(options) {
        return new Promise((resolve, reject) => {
            let file;
            file = fs.createWriteStream(options.saveTo);
            const clientRequest = (0, https_1.request)(this.getRequestOptions(options), (response) => {
                response
                    .pipe(file)
                    .on("finish", () => {
                    file.close();
                    if (response.statusCode !== 200 && options.saveTo) {
                        const responseData = fs.readFileSync(options.saveTo, "utf8");
                        if (fs.existsSync(options.saveTo)) {
                            fs.unlinkSync(options.saveTo);
                        }
                        return reject({ response, responseData });
                    }
                    resolve(undefined);
                })
                    .on("error", (error) => {
                    file.close();
                    if (fs.existsSync(options.saveTo)) {
                        fs.unlinkSync(options.saveTo);
                    }
                    reject({ response, error });
                });
            });
            clientRequest.on("error", (e) => {
                file.close();
                if (fs.existsSync(options.saveTo)) {
                    fs.unlinkSync(options.saveTo);
                }
                reject(e);
            });
            clientRequest.end();
        });
    }
    getRequestOptions(options) {
        let headers = {
            "Accept": "application/json, text/javascript, */*",
            "User-Agent": "WebScraper.io NodeJS SDK v1.1.0",
        };
        if (options.data) {
            headers = Object.assign(Object.assign({}, headers), { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(options.data) });
        }
        const requestUrl = new URL(`https://api.webscraper.io/api/v1/${options.url}`);
        if (options.query) {
            Object.keys(options.query).forEach((key) => {
                requestUrl.searchParams.append(key, options.query[key]);
            });
        }
        requestUrl.searchParams.append("api_token", this.token);
        const path = requestUrl.pathname + requestUrl.search;
        return {
            hostname: requestUrl.hostname,
            timeout: 600.0,
            path,
            method: options.method,
            headers,
        };
    }
    allowedAttempts() {
        return this.useBackoffSleep ? 3 : 1;
    }
}
exports.HttpClient = HttpClient;
