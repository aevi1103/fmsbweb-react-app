const { 
    NODE_ENV,
    REACT_APP_DEV_API_URL,
    REACT_APP_API_URL,
    REACT_APP_BASE_URL,
    REACT_APP_DEV_BASE_URL
} = process.env;

export const baseUrl = NODE_ENV === 'production' ? REACT_APP_BASE_URL : REACT_APP_DEV_BASE_URL;
export const baseApiUrl = NODE_ENV === 'production' ? REACT_APP_API_URL : REACT_APP_DEV_API_URL;

