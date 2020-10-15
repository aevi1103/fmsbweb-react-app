import axios from "axios";

const { 
    NODE_ENV,
    REACT_APP_DEV_API_URL,
    REACT_APP_API_URL
} = process.env;

const url = NODE_ENV === 'production' ? REACT_APP_API_URL : REACT_APP_DEV_API_URL;

const http = axios.create({
    baseURL: url,
    headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
    }
});

let totalReq = 0, progress = 0;

http.interceptors.request.use(req => {

    if (url !== 'production') {
        console.log(`Request:`, {
            req
        })
    }
    
    totalReq++;
    // Important: request interceptors **must** return the request.
    return req;
});

http.interceptors.response.use(res => {

    if (url !== 'production') {
        console.log('Response:', res);
    }
    
    progress++
    console.log(progress)
    console.log(`${(progress / totalReq) * 100}%`)

    if (totalReq === progress) {
        totalReq = 0;
        progress = 0;
    }

    // Important: response interceptors **must** return the response.
    return res;
});

export default http;