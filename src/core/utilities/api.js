import axios from "axios";
import short from 'short-uuid'
import { store } from '../../core/redux/store'
import {
    setTotalRequests,
    setProgress
 } from '../../core/redux/requests/requests.actions'

 import {
    setErrors
 } from '../../core/redux/errors/errors.actions'

 import { 
    notification
 } from 'antd'

const { dispatch } = store

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

    dispatch(setTotalRequests(totalReq++));
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
    dispatch(setProgress(percent));

    if (totalReq === progress) {

        dispatch(setTotalRequests(0));
        dispatch(setProgress(0));

        totalReq = 0;
        progress = 0;
    }

    //* get errors in store and url
    const { errors: { errorCollection } } = store.getState();
    const resUrl = res.config.url

    //* check if error url already exist if yes remove it from the store
    if (errorCollection.some(({ url }) => url === resUrl)) {
        const newErrors = errorCollection.filter(({ url }) => url !== resUrl)
        dispatch(setErrors(newErrors))

        notification.success({
            message: `Success`,
            description: `'${resUrl}' service successfully connected.`,
            duration: 5,
            key: resUrl
        })
    }
    
    return res;
},
error => {

    //* global error hadlker
    const { errors: { errorCollection } } = store.getState();
    const errUrl = error.config.url;
    const msg = error?.response?.data?.message ?? error?.message;

    if (errorCollection.some(({ url }) => url === errUrl)) {

        const newErrs = [...errorCollection ]
        const index = newErrs.findIndex(({ url }) => url === errUrl);
        newErrs.splice(index, 1, { url: errUrl, message: msg })

        dispatch(setErrors([...newErrs ]))
        
    }  else {
        dispatch(setErrors([...errorCollection, { url: errUrl, message: msg} ]))
    }

    notification.error({
        message: `Error`,
        description: `${msg} @ '${errUrl}' service.`,
        duration: 60,
        key: errUrl
    })

    console.error('axios interceptors', msg)

});

export default http;