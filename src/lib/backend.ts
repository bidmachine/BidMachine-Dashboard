import token from "../lib/token"
import axios from "axios"

const config = {
    baseURL: '/api',
    // timeout: 1000,
    responseType: 'json',
    headers: {
        common: {
            'Content-Type': 'application/json'
        }
    }
};

const backend = axios.create(config);

backend.interceptors.request.use(async (config) => {
    let access = token.access.get();
    if (access) config.headers["X-Auth-Token"] = access;
    return config;
})
;

export default backend;
