import axios from "axios";
import { store } from '../../core/redux/store'
import {
    setTotalRequests,
    setProgress
 } from '../../core/redux/requests/requests.actions'

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

    if (NODE_ENV !== 'production') {
        const { method } = req
        console.log('req',method, req.url)
    }

    store.dispatch(setTotalRequests(totalReq++));
    return req;
});

http.interceptors.response.use(res => {

    if (NODE_ENV !== 'production') {
        const { config, data } = res;
        console.log('res',config.method, config.url, data);
    }

    progress++;
    const progressPercent = totalReq === 0 ? 0 : progress / totalReq;
    const percent = Math.round((progressPercent * 100), 0)
    store.dispatch(setProgress(percent));

    if (totalReq === progress) {
        store.dispatch(setTotalRequests(0));
        store.dispatch(setProgress(0));
        totalReq = 0;
        progress = 0;
    }

    return res;
},
error => {

    const msg = error?.response?.data?.message ?? error?.message;
    console.error('axios interceptors', msg)

});

export default http;