import axios from "axios";
import React from 'react'
import { store } from '../../core/redux/store'
import {
    setTotalRequests,
    setProgress
 } from '../../core/redux/requests/requests.actions'
 import { red } from './colors'

 import { setErrors } from '../../core/redux/errors/errors.actions'
 import { notification } from 'antd'
 import { baseApiUrl } from './base-url'

// const { dispatch } = store
const { NODE_ENV } = process.env;

const http = axios.create({
    baseURL: baseApiUrl,
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

    const { dispatch } = store

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

    const { dispatch } = store

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
        description: <b style={{ color: red }} >{`${msg} @ '${errUrl}' service.`}</b> ,
        duration: 0,
        key: errUrl
    })

    console.error('axios interceptors', msg)

});

export default http;