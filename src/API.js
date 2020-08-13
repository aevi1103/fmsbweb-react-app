import axios from "axios";
const { NODE_ENV, REACT_APP_DEV_API_URL, REACT_APP_API_URL } = process.env;
const url = NODE_ENV === 'production' ? REACT_APP_API_URL : REACT_APP_DEV_API_URL
export default axios.create({
    baseURL: url,
    headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
    }
});