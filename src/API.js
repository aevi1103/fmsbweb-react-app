import axios from "axios";

export default axios.create({
    baseURL: "https://localhost:44384/api/",
    headers: {
        'Accept': 'application/json'
    }
});