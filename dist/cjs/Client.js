"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const HttpClient_1 = require("./HttpClient");
const PaginationGenerator_1 = require("./PaginationGenerator");
class Client {
    constructor(options) {
        this.token = options.token;
        this.httpClient = new HttpClient_1.HttpClient({
            token: this.token,
            useBackoffSleep: options.useBackoffSleep,
        });
    }
    async createSitemap(sitemap) {
        const response = await this.httpClient.post("sitemap", sitemap);
        return response.data;
    }
    async getSitemap(sitemapId) {
        const response = await this.httpClient.get(`sitemap/${sitemapId}`);
        return response.data;
    }
    getSitemaps(tag) {
        return new PaginationGenerator_1.PaginationGenerator(this.httpClient, "sitemaps", tag ? { tag } : undefined);
    }
    async updateSitemap(sitemapId, sitemap) {
        const response = await this.httpClient.put(`sitemap/${sitemapId}`, sitemap);
        return response.data;
    }
    async deleteSitemap(sitemapId) {
        const response = await this.httpClient.delete(`sitemap/${sitemapId}`);
        return response.data;
    }
    async createScrapingJob(scrapingJobConfig) {
        const response = await this.httpClient.post("scraping-job", JSON.stringify(scrapingJobConfig));
        return response.data;
    }
    async getScrapingJob(scrapingJobId) {
        const response = await this.httpClient.get(`scraping-job/${scrapingJobId}`);
        return response.data;
    }
    getScrapingJobs(query) {
        return new PaginationGenerator_1.PaginationGenerator(this.httpClient, "scraping-jobs", query);
    }
    async downloadScrapingJobJSON(scrapingJobId, fileName) {
        await this.httpClient.request({
            method: "GET",
            url: `scraping-job/${scrapingJobId}/json`,
            saveTo: fileName,
        });
    }
    async downloadScrapingJobCSV(scrapingJobId, fileName) {
        await this.httpClient.request({
            method: "GET",
            url: `scraping-job/${scrapingJobId}/csv`,
            saveTo: fileName,
        });
    }
    getProblematicUrls(scrapingJobId) {
        return new PaginationGenerator_1.PaginationGenerator(this.httpClient, `scraping-job/${scrapingJobId}/problematic-urls`);
    }
    async deleteScrapingJob(scrapingJobId) {
        const response = await this.httpClient.delete(`scraping-job/${scrapingJobId}`);
        return response.data;
    }
    async getAccountInfo() {
        const response = await this.httpClient.get("account");
        return response.data;
    }
    async getScrapingJobDataQuality(scrapingJobId) {
        const response = await this.httpClient.get(`scraping-job/${scrapingJobId}/data-quality`);
        return response.data;
    }
    async enableSitemapScheduler(sitemapId, config) {
        const response = await this.httpClient.post(`sitemap/${sitemapId}/enable-scheduler`, JSON.stringify(config));
        return response.data;
    }
    async disableSitemapScheduler(sitemapId) {
        const response = await this.httpClient.post(`sitemap/${sitemapId}/disable-scheduler`);
        return response.data;
    }
    async getSitemapScheduler(sitemapId) {
        const response = await this.httpClient.get(`sitemap/${sitemapId}/scheduler`);
        return response.data;
    }
}
exports.Client = Client;
