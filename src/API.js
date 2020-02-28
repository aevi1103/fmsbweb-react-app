import axios from "axios";

// let url = 'https://localhost:44384/api/';
let url = 'http://10.129.224.149:81/api/';

export default axios.create({
    baseURL: url,
    headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
    }
});