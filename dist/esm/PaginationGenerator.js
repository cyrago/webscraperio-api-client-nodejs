var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
export class PaginationGenerator {
    constructor(httpClient, uri, query) {
        this.total = 1;
        this.array = [];
        this.page = 0;
        this.lastPage = 1;
        this.position = 0;
        this.httpClient = httpClient;
        this.uriPath = uri;
        this.query = query;
    }
    fetchRecords() {
        return __asyncGenerator(this, arguments, function* fetchRecords_1() {
            while (this.position + 100 * (this.page - 1) !== this.total) {
                if (this.position === 100 || this.position === 0) {
                    this.page++;
                    yield __await(this.getPageData(this.page));
                    if (this.total <= 0) {
                        break;
                    }
                    this.position = 0;
                }
                yield yield __await(this.array[this.position++]);
            }
        });
    }
    async getAllRecords() {
        var _a, e_1, _b, _c;
        const allRecords = [];
        try {
            for (var _d = true, _e = __asyncValues(await this.fetchRecords()), _f; _f = await _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const record = _c;
                allRecords.push(record);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return allRecords;
    }
    async getPageData(page) {
        if (this.array.length && page === this.page) {
            return this.array;
        }
        this.page = page;
        const response = await this.httpClient.request({
            method: "GET",
            url: this.uriPath,
            query: Object.assign({ page: this.page }, this.query),
        });
        this.lastPage = response.last_page;
        this.total = response.total;
        this.perPage = response.per_page;
        this.array = response.data;
        return response.data;
    }
    getLastPage() {
        return this.lastPage;
    }
}
