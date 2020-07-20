import { Cache, cacheAdapterEnhancer } from "axios-extensions";

import axios from "axios";

const ONE_HOUR = 1000 * 60 * 60;
const cache = new Cache({ maxAge: ONE_HOUR, max: 100 });

const http = axios.create({
    baseURL: process.env.MIX_YAHOO_FINANCE_URL,
    headers: {
        "Cache-Control": "no-cache",
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "x-rapidapi-key": process.env.MIX_YAHOO_FINANCE_APIK_KEY,
        useQueryString: true
    },
    // cache will be enabled by default
    adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
        defaultCache: cache
    })
});

export default http;
